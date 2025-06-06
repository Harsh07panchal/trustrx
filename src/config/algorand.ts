import algosdk from 'algosdk';

// Algorand testnet configuration
// Replace with your Algorand configuration
const algodToken = import.meta.env.VITE_ALGORAND_API_KEY || '';
const algodServer = import.meta.env.VITE_ALGORAND_SERVER || 'https://testnet-algorand.api.purestake.io/ps2';
const algodPort = '';

// Initialize the Algod client
export const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

// Function to store a hash on the Algorand blockchain
export const storeHashOnBlockchain = async (hash: string, userAddress: string, privateKey: string) => {
  try {
    // Get parameters for the transaction
    const params = await algodClient.getTransactionParams().do();
    
    // Create a note with the hash
    const note = new Uint8Array(Buffer.from(hash));
    
    // Create and sign the transaction
    const txn = algosdk.makePaymentTxnWithSuggestedParams(
      userAddress,
      userAddress, // sending to self
      0, // 0 Algos
      undefined,
      note,
      params
    );
    
    const signedTxn = txn.signTxn(algosdk.mnemonicToSecretKey(privateKey).sk);
    
    // Submit the transaction
    const txId = await algodClient.sendRawTransaction(signedTxn).do();
    
    return {
      success: true,
      transactionId: txId.txId
    };
  } catch (error) {
    console.error('Error storing hash on blockchain:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Function to verify a hash on the Algorand blockchain
export const verifyHashOnBlockchain = async (transactionId: string, expectedHash: string) => {
  try {
    // Get the transaction information
    const transaction = await algodClient.pendingTransactionInformation(transactionId).do();
    
    // Decode the note (which contains the hash)
    const noteBase64 = transaction.txn.note;
    const noteBuffer = Buffer.from(noteBase64, 'base64');
    const storedHash = noteBuffer.toString();
    
    // Verify the hash
    return {
      success: true,
      verified: storedHash === expectedHash,
      timestamp: new Date(transaction.round_time * 1000).toISOString()
    };
  } catch (error) {
    console.error('Error verifying hash on blockchain:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};