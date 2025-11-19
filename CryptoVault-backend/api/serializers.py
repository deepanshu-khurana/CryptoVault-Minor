from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from os.path import basename
from .models import VaultFile

class VaultFileSerializer(serializers.ModelSerializer):
    # Full file URL for download/view
    uploaded_file = serializers.FileField()
    # Display only the filename
    file_name = serializers.SerializerMethodField()
    # Optional: Show the user's primary key if needed
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    # Receiving user (can be set during creation)
    receiving_user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        required=False,
        allow_null=True
    )

    def get_file_name(self, obj):
        return basename(obj.uploaded_file.name)
    
    def create(self, validated_data):
        # Extract receiving_user if present (it's passed from perform_create)
        receiving_user = validated_data.pop('receiving_user', None)
        # Create instance without saving first
        instance = VaultFile(**validated_data)
        # Set receiving_user_id as attribute BEFORE saving (so upload_to can access it)
        if receiving_user:
            instance.receiving_user_id = receiving_user.id
            instance.receiving_user = receiving_user
        # Now save the instance (file will be saved with receiving_user_id set)
        # This ensures upload_to function can check receiving_user_id
        instance.save()
        return instance
    
    class Meta:
        model = VaultFile
        # Includes id, uploaded_file (actual file), file_name, uploaded_at, user, blockchain_hash, receiving_user, aes_key, encrypted_fernet_key
        fields = ['id', 'uploaded_file', 'file_name', 'uploaded_at', 'blockchain_hash', 'user', 'receiving_user', 'aes_key', 'encrypted_fernet_key']
        read_only_fields = ('uploaded_at', 'user', 'encrypted_fernet_key')

# No changes to your UserRegistrationSerializer, as instructed
class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {
            'email': {'required': True},
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        user = User.objects.create(**validated_data)
        return user