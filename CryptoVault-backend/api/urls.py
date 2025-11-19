from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SecureFileViewSet, FileUploadView, CustomAuthToken, UserRegistrationView

# For router-based viewset handling
router = DefaultRouter(trailing_slash=True)  # Changed to True for action endpoints
router.register(r'files', SecureFileViewSet, basename='securefile')

# List/Create view from ViewSet (for uploadfiles/)
upload_list_view = SecureFileViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

urlpatterns = [
    # Auth endpoints (from your first file, preserved naming)
    path('auth/', include('users.urls')),

    # File upload and listing
    path('uploadfiles/', upload_list_view, name='file-upload-list'),
    
    # Custom action endpoints for filtering files
    path('files/vault_files/', SecureFileViewSet.as_view({'get': 'vault_files'}), name='vault-files'),
    path('files/shared_files/', SecureFileViewSet.as_view({'get': 'shared_files'}), name='shared-files'),
    path('files/received_files/', SecureFileViewSet.as_view({'get': 'received_files'}), name='received-files'),
    
    path('', include(router.urls)),  # DRF router patterns for /files/...

    # File detail view (retrieve, update, delete)
    path('uploadfiles/<int:pk>/', SecureFileViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'delete': 'destroy'
    }), name='file-detail'),
]