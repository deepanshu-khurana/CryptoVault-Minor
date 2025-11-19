from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
import os

User = get_user_model()

def get_upload_path(instance, filename):
    """
    Determine upload path based on whether file is shared or personal.
    Shared files go to sharedfiles/, personal files go to secure_vault_files/.
    Note: receiving_user might not be set yet when file is saved, so we check both
    the receiving_user object and receiving_user_id attribute.
    """
    # Check if receiving_user is set (for shared files)
    if hasattr(instance, 'receiving_user') and instance.receiving_user:
        return f'sharedfiles/{filename}'
    # Also check receiving_user_id in case it's set but not the object yet
    if hasattr(instance, 'receiving_user_id') and instance.receiving_user_id:
        return f'sharedfiles/{filename}'
    # Default to personal vault files
    return f'secure_vault_files/{filename}'

class VaultFile(models.Model):
    """
    Model to store uploaded files along with user association and blockchain hash for verification.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='uploaded_files')
    # File storage path - uses get_upload_path to determine location
    uploaded_file = models.FileField(upload_to=get_upload_path)
    file_name = models.CharField(max_length=255)
    blockchain_hash = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text="Cryptographic hash for blockchain verification."
    )
    receiving_user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name='received_files',
        null=True,
        blank=True,
        help_text="User who will receive this file (for shared files)"
    )
    uploaded_at = models.DateTimeField(default=timezone.now)
    # Encryption fields
    aes_key = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text="AES key used to encrypt the Fernet key"
    )
    encrypted_fernet_key = models.TextField(
        blank=True,
        null=True,
        help_text="Fernet key encrypted with AES key (base64 encoded)"
    )

    def __str__(self):
        return self.file_name

    def delete(self, *args, **kwargs):
        if self.uploaded_file and os.path.isfile(self.uploaded_file.path):
            os.remove(self.uploaded_file.path)
        super().delete(*args, **kwargs)