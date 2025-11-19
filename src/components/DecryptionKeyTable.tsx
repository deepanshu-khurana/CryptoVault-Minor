import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface FileKey {
  id: number;
  file_name: string;
  aes_key: string;
}

interface DecryptionKeyTableProps {
  files: FileKey[];
}

export const DecryptionKeyTable: React.FC<DecryptionKeyTableProps> = ({ files }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [revealedKeys, setRevealedKeys] = useState<Set<number>>(new Set());
  const { username } = useAuth();

  const handleUnlock = async () => {
    if (!username) {
      alert('Username not available. Please log in again.');
      return;
    }
    
    // Verify password by attempting to login
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, password: password }),
      });

      if (response.ok) {
        setIsUnlocked(true);
        setShowPasswordDialog(false);
        setPassword('');
      } else {
        alert('Incorrect password. Please try again.');
        setPassword('');
      }
    } catch (error) {
      console.error('Password verification failed:', error);
      alert('Failed to verify password. Please try again.');
    }
  };

  const handleRevealKey = (fileId: number) => {
    if (!isUnlocked) {
      setShowPasswordDialog(true);
      return;
    }
    
    const newRevealed = new Set(revealedKeys);
    if (newRevealed.has(fileId)) {
      newRevealed.delete(fileId);
    } else {
      newRevealed.add(fileId);
    }
    setRevealedKeys(newRevealed);
  };

  if (files.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No files with decryption keys available.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Decryption Keys
        </h3>
        {!isUnlocked && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPasswordDialog(true)}
          >
            Unlock Table
          </Button>
        )}
        {isUnlocked && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsUnlocked(false);
              setRevealedKeys(new Set());
            }}
          >
            Lock Table
          </Button>
        )}
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File Name</TableHead>
              <TableHead>Decryption Key</TableHead>
              <TableHead className="w-[100px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((file) => (
              <TableRow key={file.id}>
                <TableCell className="font-medium">{file.file_name}</TableCell>
                <TableCell>
                  {revealedKeys.has(file.id) ? (
                    <code className="px-2 py-1 bg-muted rounded text-sm">
                      {file.aes_key}
                    </code>
                  ) : (
                    <span className="text-muted-foreground">••••••••</span>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRevealKey(file.id)}
                    disabled={!isUnlocked}
                  >
                    {revealedKeys.has(file.id) ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-1" />
                        Hide
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-1" />
                        Reveal
                      </>
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Your Password</DialogTitle>
            <DialogDescription>
              Please enter your login password to access the decryption keys table.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="table-password">Password</Label>
            <Input
              id="table-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleUnlock();
                }
              }}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUnlock} disabled={!password}>
              Unlock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

