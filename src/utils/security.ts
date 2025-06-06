import CryptoJS from 'crypto-js';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import { startAuthentication } from '@simplewebauthn/browser';

// Encryption key management
const getEncryptionKey = () => {
  const key = localStorage.getItem('encryptionKey');
  if (!key) {
    const newKey = CryptoJS.lib.WordArray.random(256/8).toString();
    localStorage.setItem('encryptionKey', newKey);
    return newKey;
  }
  return key;
};

// File encryption
export const encryptFile = async (file: File): Promise<Blob> => {
  const key = getEncryptionKey();
  const arrayBuffer = await file.arrayBuffer();
  const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
  const encrypted = CryptoJS.AES.encrypt(wordArray, key).toString();
  return new Blob([encrypted], { type: 'application/encrypted' });
};

// File decryption
export const decryptFile = async (encryptedBlob: Blob): Promise<Blob> => {
  const key = getEncryptionKey();
  const encrypted = await encryptedBlob.text();
  const decrypted = CryptoJS.AES.decrypt(encrypted, key);
  const typedArray = convertWordArrayToUint8Array(decrypted);
  return new Blob([typedArray], { type: 'application/octet-stream' });
};

// Helper function to convert CryptoJS WordArray to Uint8Array
const convertWordArrayToUint8Array = (wordArray: CryptoJS.lib.WordArray): Uint8Array => {
  const arrayOfWords = wordArray.words;
  const length = wordArray.sigBytes;
  const uint8Array = new Uint8Array(length);
  let i = 0;
  for (let word of arrayOfWords) {
    uint8Array[i++] = (word >> 24) & 0xff;
    if (i < length) uint8Array[i++] = (word >> 16) & 0xff;
    if (i < length) uint8Array[i++] = (word >> 8) & 0xff;
    if (i < length) uint8Array[i++] = word & 0xff;
  }
  return uint8Array;
};

// 2FA setup
export const setup2FA = async (userId: string): Promise<string> => {
  const secret = authenticator.generateSecret();
  const otpauth = authenticator.keyuri(userId, 'TrustRx', secret);
  const qrCode = await QRCode.toDataURL(otpauth);
  return qrCode;
};

// Verify 2FA token
export const verify2FAToken = (token: string, secret: string): boolean => {
  return authenticator.verify({ token, secret });
};

// WebAuthn registration
export const startWebAuthnRegistration = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/security`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'webauthn_register_options'
      })
    });

    const options = await response.json();
    const credential = await startAuthentication(options);
    
    // Send credential to server for verification
    await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/security`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'webauthn_register_verify',
        credential
      })
    });

    return true;
  } catch (error) {
    console.error('WebAuthn registration failed:', error);
    return false;
  }
};

// Password strength checker
export const checkPasswordStrength = (password: string): {
  score: number;
  feedback: {
    warning: string;
    suggestions: string[];
  };
} => {
  const result = zxcvbn(password);
  return {
    score: result.score,
    feedback: result.feedback
  };
};

// Rate limiting check
export const checkRateLimit = async (userId: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/security`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'check_rate_limit',
        userId,
        ip: await fetch('https://api.ipify.org?format=json').then(r => r.json()).then(data => data.ip)
      })
    });

    if (!response.ok) {
      throw new Error('Rate limit exceeded');
    }

    return true;
  } catch (error) {
    console.error('Rate limit check failed:', error);
    return false;
  }
};