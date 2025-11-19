import { useState } from "react";
import { File, Calendar, HardDrive, Eye, Trash2, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import StatusBadge from "./StatusBadge";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface FileData {
  id: string;
  name: string;
  uploadDate: string;
  encryptionType: string;
  blockchainStatus: string;
  syncStatus: string;
  size: string;
  aes_key?: string;
  encrypted_fernet_key?: string;
}

interface FileCardProps {
  file: FileData;
  onDelete?: (fileId: string) => void;
}

const FileCard = ({ file, onDelete }: FileCardProps) => {
  const [showDecryptDialog, setShowDecryptDialog] = useState(false);
  const [decryptionKey, setDecryptionKey] = useState("");
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { accessToken } = useAuth();
  const { toast } = useToast();

  const handleView = () => {
    // Check if file is encrypted
    if (file.encrypted_fernet_key) {
      setShowDecryptDialog(true);
    } else {
      // If not encrypted, just download/view normally
      handleDownload();
    }
  };

  const handleDownload = async (decryptKey?: string) => {
    try {
      setIsDecrypting(true);
      const fileId = file.id;
      const API_URL = `http://127.0.0.1:8000/api/v1/files/${fileId}/decrypt_and_download/`;

      if (file.encrypted_fernet_key && decryptKey) {
        // Decrypt and download
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ decryption_key: decryptKey }),
        });

        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = file.name;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          toast({
            title: "Success",
            description: "File decrypted and downloaded successfully!",
          });
          setShowDecryptDialog(false);
          setDecryptionKey("");
        } else {
          const error = await response.json();
          toast({
            title: "Error",
            description: error.error || "Failed to decrypt file.",
            variant: "destructive",
          });
        }
      } else {
        // Regular download (not encrypted)
        const response = await fetch(`http://127.0.0.1:8000/api/v1/files/${fileId}/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          if (data.uploaded_file) {
            window.open(data.uploaded_file, '_blank');
          }
        }
      }
    } catch (error) {
      console.error("Error downloading file:", error);
      toast({
        title: "Error",
        description: "Failed to download file.",
        variant: "destructive",
      });
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const fileId = file.id;
      const response = await fetch(`http://127.0.0.1:8000/api/v1/files/${fileId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "File deleted successfully!",
        });
        if (onDelete) {
          onDelete(file.id);
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to delete file.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      toast({
        title: "Error",
        description: "Failed to delete file.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };
  return (
    <Card className=" bg-card/90 backdrop-blur-md 
  border border-border/50 
  rounded-2xl p-4 
  shadow-lg hover:shadow-glow 
  hover:ring-1 hover:ring-primary/50 
  transition-all duration-300 group">
      <div className="space-y-4">
        {/* File Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/50 group-hover:bg-gradient-primary group-hover:shadow-glow transition-all duration-300">
              <File className="h-5 w-5 text-muted-foreground group-hover:text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground truncate max-w-[200px]" title={file.name}>
                {file.name}
              </h3>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                <Calendar className="h-3 w-3" />
                <span>{file.uploadDate}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <HardDrive className="h-3 w-3" />
            <span>{file.size}</span>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-2">
          <StatusBadge type="encryption" status={file.encryptionType} />
          <StatusBadge type="blockchain" status={file.blockchainStatus} />
          <StatusBadge type="sync" status={file.syncStatus} />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 pt-2">
          <Button 
            size="sm" 
            variant="ghost" 
            className="flex-1 hover:bg-primary/20 hover:text-primary transition-all duration-300"
            onClick={handleView}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            className="hover:bg-destructive/20 hover:text-destructive transition-all duration-300"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Decryption Dialog */}
      <Dialog open={showDecryptDialog} onOpenChange={setShowDecryptDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Enter Decryption Key
            </DialogTitle>
            <DialogDescription>
              Please enter the decryption key (AES key) to view this encrypted file.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="decryption-key">Decryption Key</Label>
            <Input
              id="decryption-key"
              type="password"
              placeholder="Enter decryption key"
              value={decryptionKey}
              onChange={(e) => setDecryptionKey(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && decryptionKey) {
                  handleDownload(decryptionKey);
                }
              }}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowDecryptDialog(false);
              setDecryptionKey("");
            }}>
              Cancel
            </Button>
            <Button 
              onClick={() => handleDownload(decryptionKey)} 
              disabled={!decryptionKey || isDecrypting}
            >
              {isDecrypting ? "Decrypting..." : "Decrypt & View"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the file "{file.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default FileCard;