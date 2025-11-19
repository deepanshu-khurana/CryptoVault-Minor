from rest_framework import generics, parsers, viewsets, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
from django.db import models
from django.http import HttpResponse, Http404
from .serializers import UserRegistrationSerializer, VaultFileSerializer
from .models import VaultFile
from .utils import (
    generate_fernet_key,
    encrypt_fernet_key_with_aes,
    decrypt_fernet_key_with_aes,
    encrypt_file,
    decrypt_file
)
import hashlib
import os
import tempfile

User = get_user_model()


# File upload/list API for authenticated users, secured with JWT Authentication
class FileUploadView(generics.ListCreateAPIView):
    serializer_class = VaultFileSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]
    
    def get_queryset(self):
        """Filter to show only files owned by the logged-in user (personal vault)"""
        return VaultFile.objects.filter(
            user=self.request.user,
            receiving_user__isnull=True
        ).order_by('-uploaded_at')

    def perform_create(self, serializer):
        uploaded_file = self.request.FILES.get('uploaded_file')
        receiving_user_id = self.request.data.get('receiving_user')
        receiving_username = self.request.data.get('receiving_username')
        aes_key = self.request.data.get('aes_key', '')
        
        # If username is provided, look up the user
        receiving_user = None
        if receiving_username:
            try:
                receiving_user = User.objects.get(username=receiving_username)
                receiving_user_id = receiving_user.id
            except User.DoesNotExist:
                pass  # receiving_user will remain None
        elif receiving_user_id:
            try:
                receiving_user = User.objects.get(id=receiving_user_id)
            except User.DoesNotExist:
                receiving_user = None
                receiving_user_id = None
        
        # Save instance first to get file path
        instance = serializer.save(
            user=self.request.user,
            file_name=uploaded_file.name if uploaded_file else "",
            receiving_user=receiving_user,
            aes_key=aes_key
        )
        
        # Encrypt file if AES key is provided
        if uploaded_file and instance.uploaded_file and aes_key:
            try:
                file_path = instance.uploaded_file.path
                
                # Generate Fernet key
                fernet_key = generate_fernet_key()
                    
                
                # Encrypt the file
                encrypted_data = encrypt_file(file_path, fernet_key)
                
                # Encrypt the Fernet key with AES key
                encrypted_fernet_key = encrypt_fernet_key_with_aes(fernet_key, aes_key)
                
                # Save encrypted file (overwrite original)
                with open(file_path, 'wb') as f:
                    f.write(encrypted_data)
                
                # Save encrypted Fernet key
                instance.encrypted_fernet_key = encrypted_fernet_key
                
                # Calculate hash of encrypted file
                with open(file_path, 'rb') as f:
                    hash_val = hashlib.sha256(f.read()).hexdigest()
                instance.blockchain_hash = hash_val
                instance.save()
            except Exception as e:
                print(f"Encryption/hash calculation failed: {e}")
                # If encryption fails, still calculate hash of original file
                try:
                    file_path = instance.uploaded_file.path
                    with open(file_path, 'rb') as f:
                        hash_val = hashlib.sha256(f.read()).hexdigest()
                    instance.blockchain_hash = hash_val
                    instance.save()
                except Exception as e2:
                    print(f"Hash calculation failed: {e2}")
        elif uploaded_file and instance.uploaded_file:
            # No encryption, just calculate hash
            try:
                file_path = instance.uploaded_file.path
                with open(file_path, 'rb') as f:
                    hash_val = hashlib.sha256(f.read()).hexdigest()
                instance.blockchain_hash = hash_val
                instance.save()
            except Exception as e:
                print(f"Hash calculation failed: {e}")


# ViewSet for router-based file APIs (router URL: /files/)
@method_decorator(csrf_exempt, name='dispatch')
class SecureFileViewSet(viewsets.ModelViewSet):
    serializer_class = VaultFileSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Filter files to show only:
        - Files owned by the logged-in user (user=self.request.user)
        - Files received by the logged-in user (receiving_user=self.request.user)
        """
        user = self.request.user
        return VaultFile.objects.filter(
            models.Q(user=user) | models.Q(receiving_user=user)
        ).order_by('-uploaded_at')
    
    def get_queryset_for_vault(self):
        """Get only files owned by user (not shared files)"""
        return VaultFile.objects.filter(
            user=self.request.user,
            receiving_user__isnull=True
        ).order_by('-uploaded_at')
    
    def get_queryset_for_shared(self):
        """Get only files received by user"""
        return VaultFile.objects.filter(
            receiving_user=self.request.user
        ).order_by('-uploaded_at')

    def perform_create(self, serializer):
        receiving_user_id = self.request.data.get('receiving_user')
        receiving_username = self.request.data.get('receiving_username')
        aes_key = self.request.data.get('aes_key', '')
        
        # If username is provided, look up the user
        receiving_user = None
        if receiving_username:
            try:
                receiving_user = User.objects.get(username=receiving_username)
                receiving_user_id = receiving_user.id
            except User.DoesNotExist:
                pass  # receiving_user will remain None
        elif receiving_user_id:
            try:
                receiving_user = User.objects.get(id=receiving_user_id)
            except User.DoesNotExist:
                receiving_user = None
                receiving_user_id = None
        
        # Save instance first to get file path
        instance = serializer.save(
            user=self.request.user,
            file_name=self.request.FILES['uploaded_file'].name if 'uploaded_file' in self.request.FILES else "",
            receiving_user=receiving_user,
            aes_key=aes_key
        )
        
        # Encrypt file if AES key is provided
        if 'uploaded_file' in self.request.FILES and instance.uploaded_file and aes_key:
            try:
                file_path = instance.uploaded_file.path
                
                # Generate Fernet key
                fernet_key = generate_fernet_key()
                
                # Encrypt the file
                encrypted_data = encrypt_file(file_path, fernet_key)
                
                # Encrypt the Fernet key with AES key
                encrypted_fernet_key = encrypt_fernet_key_with_aes(fernet_key, aes_key)
                
                # Save encrypted file (overwrite original)
                with open(file_path, 'wb') as f:
                    f.write(encrypted_data)
                
                # Save encrypted Fernet key
                instance.encrypted_fernet_key = encrypted_fernet_key
                
                # Calculate hash of encrypted file
                with open(file_path, 'rb') as f:
                    hash_val = hashlib.sha256(f.read()).hexdigest()
                instance.blockchain_hash = hash_val
                instance.save()
            except Exception as e:
                print(f"Encryption/hash calculation failed: {e}")
                # If encryption fails, still calculate hash of original file
                try:
                    file_path = instance.uploaded_file.path
                    with open(file_path, 'rb') as f:
                        hash_val = hashlib.sha256(f.read()).hexdigest()
                    instance.blockchain_hash = hash_val
                    instance.save()
                except Exception as e2:
                    print(f"Hash calculation failed: {e2}")
        elif 'uploaded_file' in self.request.FILES and instance.uploaded_file:
            # No encryption, just calculate hash
            try:
                file_path = instance.uploaded_file.path
                with open(file_path, 'rb') as f:
                    hash_val = hashlib.sha256(f.read()).hexdigest()
                instance.blockchain_hash = hash_val
                instance.save()
            except Exception as e:
                print(f"Hash calculation failed: {e}")

    def perform_update(self, serializer):
        instance = serializer.save()
        try:
            file_path = instance.uploaded_file.path
            with open(file_path, 'rb') as f:
                hash_val = hashlib.sha256(f.read()).hexdigest()
            instance.blockchain_hash = hash_val
            instance.save()
        except Exception as e:
            print(f"Hash calculation failed (update): {e}")
    
    def vault_files(self, request, *args, **kwargs):
        """Get only files owned by user (personal vault files)"""
        queryset = self.get_queryset_for_vault()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    def shared_files(self, request, *args, **kwargs):
        """Get only files received by user (shared files)"""
        queryset = self.get_queryset_for_shared()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    def received_files(self, request, *args, **kwargs):
        """Get files received by user (alias for shared_files)"""
        queryset = self.get_queryset_for_shared()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def decrypt_and_download(self, request, pk=None):
        """
        Decrypt and download a file.
        Requires 'decryption_key' (AES key) in request body.
        """
        try:
            file_instance = self.get_object()
            
            # Verify user has access to this file
            if file_instance.user != request.user and file_instance.receiving_user != request.user:
                return Response(
                    {'error': 'You do not have permission to access this file.'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Get decryption key from request
            decryption_key = request.data.get('decryption_key')
            if not decryption_key:
                return Response(
                    {'error': 'Decryption key is required.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Verify AES key matches
            if file_instance.aes_key != decryption_key:
                return Response(
                    {'error': 'Invalid decryption key.'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            # Check if file is encrypted
            if not file_instance.encrypted_fernet_key:
                return Response(
                    {'error': 'File is not encrypted.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Decrypt Fernet key
            try:
                fernet_key = decrypt_fernet_key_with_aes(
                    file_instance.encrypted_fernet_key,
                    decryption_key
                )
            except Exception as e:
                return Response(
                    {'error': 'Failed to decrypt Fernet key. Invalid decryption key.'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            # Read encrypted file
            file_path = file_instance.uploaded_file.path
            with open(file_path, 'rb') as f:
                encrypted_data = f.read()
            
            # Decrypt file
            try:
                decrypted_data = decrypt_file(encrypted_data, fernet_key)
            except Exception as e:
                return Response(
                    {'error': 'Failed to decrypt file.'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            # Return decrypted file as response
            response = HttpResponse(decrypted_data, content_type='application/octet-stream')
            response['Content-Disposition'] = f'attachment; filename="{file_instance.file_name}"'
            return response
            
        except VaultFile.DoesNotExist:
            return Response(
                {'error': 'File not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# Token authentication endpoint (optional - if you use DRF Token auth separately)
# You can remove this if you fully switch to JWT
class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'username': user.username
        })


# User registration endpoint
class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]