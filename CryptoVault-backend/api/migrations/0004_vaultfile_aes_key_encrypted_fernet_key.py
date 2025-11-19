# Generated migration for adding encryption fields

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_vaultfile_delete_encryptedfile'),
    ]

    operations = [
        migrations.AddField(
            model_name='vaultfile',
            name='aes_key',
            field=models.CharField(blank=True, help_text='AES key used to encrypt the Fernet key', max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='vaultfile',
            name='encrypted_fernet_key',
            field=models.TextField(blank=True, help_text='Fernet key encrypted with AES key (base64 encoded)', null=True),
        ),
    ]

