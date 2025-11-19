from pymongo import MongoClient
import gridfs
import os
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.backends import default_backend
import base64

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DB_NAME = os.getenv("DB_NAME", "filesDB")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
fs = gridfs.GridFS(db)


def generate_fernet_key():
    """Generate a new Fernet key."""
    return Fernet.generate_key()


def derive_aes_key_from_password(password: str, salt: bytes = None) -> bytes:
    """
    Derive an AES key from a password using PBKDF2.
    If salt is None, generates a new salt.
    Returns (key, salt) tuple.
    """
    if salt is None:
        salt = os.urandom(16)
    
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
        backend=default_backend()
    )
    key = base64.urlsafe_b64encode(kdf.derive(password.encode()))
    return key, salt


def encrypt_fernet_key_with_aes(fernet_key: bytes, aes_key: str) -> str:
    """
    Encrypt a Fernet key using an AES key (password-derived).
    Returns base64-encoded encrypted Fernet key.
    """
    # Derive AES key from password
    derived_key, salt = derive_aes_key_from_password(aes_key)
    
    # Use Fernet to encrypt the Fernet key (Fernet uses AES-128)
    fernet_encryptor = Fernet(derived_key)
    encrypted_key = fernet_encryptor.encrypt(fernet_key)
    
    # Combine salt and encrypted key, then base64 encode
    combined = salt + encrypted_key
    return base64.b64encode(combined).decode('utf-8')


def decrypt_fernet_key_with_aes(encrypted_fernet_key: str, aes_key: str) -> bytes:
    """
    Decrypt a Fernet key using an AES key (password).
    Returns the decrypted Fernet key.
    """
    # Decode from base64
    combined = base64.b64decode(encrypted_fernet_key.encode('utf-8'))
    
    # Extract salt (first 16 bytes) and encrypted key
    salt = combined[:16]
    encrypted_key = combined[16:]
    
    # Derive AES key from password using the same salt
    derived_key, _ = derive_aes_key_from_password(aes_key, salt)
    
    # Decrypt the Fernet key
    fernet_decryptor = Fernet(derived_key)
    return fernet_decryptor.decrypt(encrypted_key)


def encrypt_file(file_path: str, fernet_key: bytes) -> bytes:
    """
    Encrypt a file using a Fernet key.
    Returns the encrypted file content as bytes.
    """
    fernet = Fernet(fernet_key)
    
    with open(file_path, 'rb') as f:
        file_data = f.read()
    
    encrypted_data = fernet.encrypt(file_data)
    return encrypted_data


def decrypt_file(encrypted_data: bytes, fernet_key: bytes) -> bytes:
    """
    Decrypt file data using a Fernet key.
    Returns the decrypted file content as bytes.
    """
    fernet = Fernet(fernet_key)
    decrypted_data = fernet.decrypt(encrypted_data)
    return decrypted_data
