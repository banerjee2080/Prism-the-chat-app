import nacl from "tweetnacl";
import util from "tweetnacl-util";

export const generateKeyPair = () => {
  const keyPair = nacl.box.keyPair();
  return {
    publicKey: util.encodeBase64(keyPair.publicKey),
    secretKey: util.encodeBase64(keyPair.secretKey),
  };
};

export const verifySecretKey = (secretKey, publicKey) => {
  try {
    const decodedSecretKey = util.decodeBase64(secretKey);
    const keyPair = nacl.box.keyPair.fromSecretKey(decodedSecretKey);
    const derivedPublicKey = util.encodeBase64(keyPair.publicKey);
    return derivedPublicKey === publicKey;
  } catch (error) {
    return false;
  }
};

export const encryptText = (text, otherPersonPublicKey, mySecretKey) => {
  if (!text) return { encryptedText: "", nonce: "" };

  const decodedReceiverPublicKey = util.decodeBase64(otherPersonPublicKey);
  const decodedMySecretKey = util.decodeBase64(mySecretKey);
  const messageUint8 = util.decodeUTF8(text);

  const nonceUint8 = nacl.randomBytes(nacl.box.nonceLength);

  const encrypted = nacl.box(
    messageUint8,
    nonceUint8,
    decodedReceiverPublicKey,
    decodedMySecretKey,
  );

  return {
    encryptedText: util.encodeBase64(encrypted),
    nonce: util.encodeBase64(nonceUint8),
  };
};

export const decryptText = (
  encryptedText,
  nonce,
  otherPersonPublicKey,
  mySecretKey,
) => {
  if (!encryptedText || !nonce || !otherPersonPublicKey || !mySecretKey)
    return "";

  const decodedEncryptedText = util.decodeBase64(encryptedText);
  const decodedNonce = util.decodeBase64(nonce);
  const decodedOtherPersonPublicKey = util.decodeBase64(otherPersonPublicKey);
  const decodedMySecretKey = util.decodeBase64(mySecretKey);

  const decrypted = nacl.box.open(
    decodedEncryptedText,
    decodedNonce,
    decodedOtherPersonPublicKey,
    decodedMySecretKey,
  );

  if (!decrypted) {
    console.error("Could not decrypt message");
    return "[Encrypted Message]";
  }

  return util.encodeUTF8(decrypted);
};
