import { sha256 } from 'js-sha256';

// Encryption key management
const getEncryptionKey = () => {
  const key = localStorage.getItem('encryptionKey');
  if (!key) {
    const newKey = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('encryptionKey', newKey);
    return newKey;
  }
  return key;
};

// File encryption (simplified for demo)
export const encryptFile = async (file: File): Promise<Blob> => {
  // In a real app, you would use proper encryption
  return file;
};

// File decryption (simplified for demo)
export const decryptFile = async (encryptedBlob: Blob): Promise<Blob> => {
  // In a real app, you would use proper decryption
  return encryptedBlob;
};

// 2FA setup (simplified for demo)
export const setup2FA = async (userId: string): Promise<string> => {
  // In a real app, you would generate a proper QR code
  return `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="white"/><text x="100" y="100" text-anchor="middle" fill="black">QR Code</text></svg>')}`;
};

// Verify 2FA token (simplified for demo)
export const verify2FAToken = (token: string, secret: string): boolean => {
  // In a real app, you would use proper TOTP verification
  return token.length === 6;
};

// WebAuthn registration (simplified for demo)
export const startWebAuthnRegistration = async () => {
  try {
    // In a real app, you would implement proper WebAuthn
    console.log('WebAuthn registration would be implemented here');
    return true;
  } catch (error) {
    console.error('WebAuthn registration failed:', error);
    return false;
  }
};

// Password strength checker (simplified for demo)
export const checkPasswordStrength = (password: string): {
  score: number;
  feedback: {
    warning: string;
    suggestions: string[];
  };
} => {
  let score = 0;
  const suggestions: string[] = [];
  
  if (password.length >= 8) score++;
  else suggestions.push('Use at least 8 characters');
  
  if (/[A-Z]/.test(password)) score++;
  else suggestions.push('Add uppercase letters');
  
  if (/[a-z]/.test(password)) score++;
  else suggestions.push('Add lowercase letters');
  
  if (/[0-9]/.test(password)) score++;
  else suggestions.push('Add numbers');
  
  if (/[^A-Za-z0-9]/.test(password)) score++;
  else suggestions.push('Add special characters');
  
  return {
    score,
    feedback: {
      warning: score < 3 ? 'Weak password' : '',
      suggestions
    }
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
        ip: '127.0.0.1' // Simplified for demo
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