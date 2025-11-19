import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, User, Inbox } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UploadZone } from '@/components/UploadZone';
import FileCard from '@/components/FileCard';
import { DecryptionKeyTable } from '@/components/DecryptionKeyTable';
import { useAuth } from '@/context/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import heroBg from '@/assets/sharebg.jpg';

interface ReceivedFile {
  id: number;
  uploaded_file: string;
  file_name: string;
  uploaded_at: string;
  blockchain_hash: string;
  aes_key?: string;
  encrypted_fernet_key?: string;
  encryptionType?: string;
  blockchainStatus?: string;
  syncStatus?: string;
  size?: string;
  uploadDate?: string;
}

const FileSharing = () => {
  const { isAuthenticated, accessToken } = useAuth();
  const [transferMethod, setTransferMethod] = useState<'sentinel' | null>(null);
  const [showReceivingUserDialog, setShowReceivingUserDialog] = useState(false);
  const [receivingUsername, setReceivingUsername] = useState('');
  const [receivedFiles, setReceivedFiles] = useState<ReceivedFile[]>([]);
  const [loadingReceived, setLoadingReceived] = useState(true);
  const { toast } = useToast();

  const handleSelectMethod = (method: 'sentinel') => {
    setTransferMethod(method);
    // Show receiving user dialog when method is selected
    setShowReceivingUserDialog(true);
    toast({
      title: "Sentinel Transfer Selected",
      description: "Secure cloud-based transfer with verification.",
    });
  };

  // Fetch received files
  useEffect(() => {
    if (!isAuthenticated || !accessToken) return;

    const fetchReceivedFiles = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/files/received_files/', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const formattedFiles = (Array.isArray(data) ? data : []).map((file: any) => ({
            id: file.id,
            uploaded_file: file.uploaded_file,
            file_name: file.file_name,
            uploaded_at: file.uploaded_at,
            blockchain_hash: file.blockchain_hash,
            aes_key: file.aes_key,
            encrypted_fernet_key: file.encrypted_fernet_key,
            encryptionType: file.encrypted_fernet_key ? 'AES-256' : 'None',
            blockchainStatus: file.blockchain_hash ? 'Verified' : 'Pending',
            syncStatus: 'Synced',
            size: 'N/A',
            uploadDate: new Date(file.uploaded_at).toLocaleDateString(),
          }));
          setReceivedFiles(formattedFiles);
        }
      } catch (error) {
        console.error('Error fetching received files:', error);
      } finally {
        setLoadingReceived(false);
      }
    };

    fetchReceivedFiles();
  }, [isAuthenticated, accessToken]);

  const handleReceivingUserSubmit = () => {
    if (!receivingUsername.trim()) {
      toast({
        title: "Error",
        description: "Please enter a username for the receiving user.",
        variant: "destructive",
      });
      return;
    }

    // Close dialog - username will be sent to backend which will look it up
    setShowReceivingUserDialog(false);
    toast({
      title: "Receiving User Set",
      description: `File will be shared with ${receivingUsername}`,
    });
  };

  const handleCancelReceivingUser = () => {
    setShowReceivingUserDialog(false);
    setReceivingUsername('');
    setTransferMethod(null);
  };

  const handleFileDelete = useCallback((fileId: string) => {
    setReceivedFiles(prevFiles => prevFiles.filter(f => f.id.toString() !== fileId));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="relative h-[60vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Share Files Your Way
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Send files securely using fast or cloud-based methods.
          </p>
        </div>
      </div>

      {/* Transfer Method Selection */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex justify-center mb-8">
          <Button
            variant="sentinel"
            size="lg"
            onClick={() => handleSelectMethod('sentinel')}
            className={`
              h-auto p-6 flex-col space-y-3 relative transition-all duration-300
              ${transferMethod === 'sentinel' ? 'scale-105 shadow-[0_0_25px_2px_rgba(0,255,222,0.5)]' : ''}
            `}
          >
            <Shield className="h-8 w-8" />
            <div className="space-y-1 text-center">
              <div className="font-bold text-lg">Sentinel Method</div>
              <div className="text-sm opacity-90">Secure cloud-based transfer with verification</div>
            </div>
          </Button>
        </div>


        {/* Upload Zone – only visible if method is selected and receiving user is set */}
        {transferMethod && !showReceivingUserDialog && (
          <div className="mt-8">
            {receivingUsername && (
              <div className="mb-4 p-4 bg-vault-surface border border-vault-border rounded-lg">
                <div className="flex items-center space-x-2 text-sm">
                  <User className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Sharing with:</span>
                  <span className="font-semibold text-foreground">{receivingUsername}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setReceivingUsername('');
                      setShowReceivingUserDialog(true);
                    }}
                    className="ml-auto"
                  >
                    Change
                  </Button>
                </div>
              </div>
            )}
            <UploadZone receivingUsername={receivingUsername} apiEndpoint="http://127.0.0.1:8000/api/v1/uploadfiles/" />
          </div>
        )}
      </div>

      {/* Received Files Section */}
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
            <Inbox className="h-8 w-8 text-primary" />
            Received Files
          </h2>
          <p className="text-muted-foreground">
            Files that have been shared with you
          </p>
        </div>

        {loadingReceived ? (
          <p className="text-center text-muted-foreground">Loading received files...</p>
        ) : receivedFiles.length === 0 ? (
          <p className="text-center text-muted-foreground">No files have been received yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {receivedFiles.map((file) => (
              <FileCard 
                key={file.id} 
                file={{
                  id: file.id.toString(),
                  name: file.file_name,
                  uploadDate: file.uploadDate || new Date(file.uploaded_at).toLocaleDateString(),
                  encryptionType: file.encryptionType || 'AES-256',
                  blockchainStatus: file.blockchainStatus || (file.blockchain_hash ? 'Verified' : 'Pending'),
                  syncStatus: file.syncStatus || 'Synced',
                  size: file.size || 'N/A',
                  aes_key: file.aes_key,
                  encrypted_fernet_key: file.encrypted_fernet_key,
                }}
                onDelete={handleFileDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Decryption Key Table Section */}
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="bg-vault-surface p-6 rounded-xl border border-vault-border">
          <DecryptionKeyTable 
            files={receivedFiles
              .filter(f => f.aes_key && f.encrypted_fernet_key)
              .map(f => ({
                id: f.id,
                file_name: f.file_name,
                aes_key: f.aes_key || '',
              }))} 
          />
        </div>
      </div>

      {/* Receiving User Dialog */}
      <Dialog open={showReceivingUserDialog} onOpenChange={setShowReceivingUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Receiving User</DialogTitle>
            <DialogDescription>
              Please enter the username of the user who will receive this file.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="receiving-username">Username</Label>
            <Input
              id="receiving-username"
              placeholder="Enter username"
              value={receivingUsername}
              onChange={(e) => setReceivingUsername(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleReceivingUserSubmit();
                }
              }}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelReceivingUser}>
              Cancel
            </Button>
            <Button onClick={handleReceivingUserSubmit} disabled={!receivingUsername.trim()}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default FileSharing;