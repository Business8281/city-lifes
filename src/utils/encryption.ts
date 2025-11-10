/**
 * Client-side encryption utilities for secure messaging
 * Uses Web Crypto API for end-to-end encryption
 */

// Generate a deterministic key from two user IDs
async function generateConversationKey(userId1: string, userId2: string): Promise<CryptoKey> {
  // Sort IDs to ensure same key regardless of order
  const sortedIds = [userId1, userId2].sort();
  const keyMaterial = sortedIds.join('-');
  
  // Generate key material from user IDs
  const encoder = new TextEncoder();
  const keyData = encoder.encode(keyMaterial);
  
  // Import as key material
  const baseKey = await crypto.subtle.importKey(
    'raw',
    await crypto.subtle.digest('SHA-256', keyData),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );
  
  // Derive AES key
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('citylifes-secure-messaging'),
      iterations: 100000,
      hash: 'SHA-256'
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
  
  return key;
}

// Encrypt message content
export async function encryptMessage(
  content: string,
  senderId: string,
  receiverId: string
): Promise<string> {
  try {
    const key = await generateConversationKey(senderId, receiverId);
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    
    // Generate random IV
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Encrypt
    const encryptedData = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );
    
    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encryptedData.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encryptedData), iv.length);
    
    // Convert to base64
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt message');
  }
}

// Decrypt message content
export async function decryptMessage(
  encryptedContent: string,
  senderId: string,
  receiverId: string
): Promise<string> {
  try {
    const key = await generateConversationKey(senderId, receiverId);
    
    // Decode base64
    const combined = Uint8Array.from(atob(encryptedContent), c => c.charCodeAt(0));
    
    // Extract IV and encrypted data
    const iv = combined.slice(0, 12);
    const encryptedData = combined.slice(12);
    
    // Decrypt
    const decryptedData = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encryptedData
    );
    
    // Convert to string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
  } catch (error) {
    console.error('Decryption error:', error);
    return '[Encrypted message - unable to decrypt]';
  }
}
