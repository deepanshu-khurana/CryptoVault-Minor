import React, { useState, useEffect } from "react";
import { Link as LinkIcon, Lock, FileText, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { useAuth } from "../context/AuthContext";

interface FileLog {
  id: number;
  uploaded_file: string;
  file_name: string;
  uploaded_at: string;
  blockchain_hash: string;
  user?: number;
  receiving_user?: number | null;
}

const Audit = () => {
  const { isAuthenticated, accessToken } = useAuth();

  const [vaultFiles, setVaultFiles] = useState<FileLog[]>([]);
  const [sharedFiles, setSharedFiles] = useState<FileLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  // Wait for auth to initialize from localStorage
  useEffect(() => {
    // AuthContext initializes from localStorage in a useEffect
    // We need to wait for it to complete before checking authentication
    const timer = setTimeout(() => {
      setAuthChecked(true);
      if (!isAuthenticated) {
        setLoading(false);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  useEffect(() => {
    if (!authChecked || !isAuthenticated) {
      return;
    }
    
    console.log("Audit Access Token:", accessToken);
    const fetchLogs = async () => {
      try {
        const baseUrl = "http://127.0.0.1:8000/api/v1/files";
        const headers = {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        };

        // Fetch vault files (personal files)
        const vaultResponse = await fetch(`${baseUrl}/vault_files/`, { headers });
        if (vaultResponse.ok) {
          const vaultData = await vaultResponse.json();
          setVaultFiles(Array.isArray(vaultData) ? vaultData : []);
        }

        // Fetch shared files (received files)
        const sharedResponse = await fetch(`${baseUrl}/shared_files/`, { headers });
        if (sharedResponse.ok) {
          const sharedData = await sharedResponse.json();
          setSharedFiles(Array.isArray(sharedData) ? sharedData : []);
        }
      } catch (error) {
        console.error("❌ Fatal Error during fetch or JSON parse:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [isAuthenticated, accessToken, authChecked]);

  // Show loading while checking auth
  if (!authChecked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Header />
        <p className="text-xl text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Show login required message
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="text-center space-y-6 max-w-md">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-vault-surface border border-vault-border">
                <LogIn className="h-12 w-12 text-muted-foreground" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">Authentication Required</h2>
              <p className="text-xl text-muted-foreground">
                You must be logged in to view the audit page.
              </p>
            </div>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              <LogIn className="h-5 w-5 mr-2" />
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Blockchain{" "}
            <span className="bg-gradient-crypto bg-clip-text text-transparent">
              Audit Trail
            </span>
          </h1>
          <p className="text-muted-foreground">
            Immutable records of all file operations and transactions
          </p>
        </div>

        {/* Saved to Vault Section */}
        <div className="bg-vault-surface p-8 rounded-xl border border-vault-border mb-8">
          <h2 className="text-2xl font-bold mb-6 text-foreground">
            Saved to Vault
          </h2>
          {loading ? (
            <p className="text-center text-muted-foreground">
              Loading Secure Ledger...
            </p>
          ) : vaultFiles.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No files have been saved to your vault yet.
            </p>
          ) : (
            <div className="space-y-6">
              {vaultFiles.map((log) => (
                <div key={log.id} className="p-4 border rounded-lg shadow-sm">
                  <div className="flex items-center space-x-3 text-lg font-semibold text-primary mb-2">
                    <FileText className="h-5 w-5" />
                    <span>Record ID: {log.id}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-400 mb-1">
                    <LinkIcon className="h-4 w-4" />
                    <a
                      href={log.uploaded_file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-white transition-colors truncate max-w-lg"
                    >
                      {log.file_name}
                    </a>
                  </div>

                  <div className="text-xs text-security-green flex items-center space-x-2">
                    <Lock className="h-4 w-4" />
                    <span className="font-mono">
                      Hash: {log.blockchain_hash || "N/A (Update Hash)"}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground pt-1">
                    Uploaded: {new Date(log.uploaded_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Shared Files Section */}
        <div className="bg-vault-surface p-8 rounded-xl border border-vault-border">
          <h2 className="text-2xl font-bold mb-6 text-foreground">
            Shared Files
          </h2>
          {loading ? (
            <p className="text-center text-muted-foreground">
              Loading Shared Files...
            </p>
          ) : sharedFiles.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No shared files have been received yet.
            </p>
          ) : (
            <div className="space-y-6">
              {sharedFiles.map((log) => (
                <div key={log.id} className="p-4 border rounded-lg shadow-sm">
                  <div className="flex items-center space-x-3 text-lg font-semibold text-primary mb-2">
                    <FileText className="h-5 w-5" />
                    <span>Record ID: {log.id}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-400 mb-1">
                    <LinkIcon className="h-4 w-4" />
                    <a
                      href={log.uploaded_file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-white transition-colors truncate max-w-lg"
                    >
                      {log.file_name}
                    </a>
                  </div>

                  <div className="text-xs text-security-green flex items-center space-x-2">
                    <Lock className="h-4 w-4" />
                    <span className="font-mono">
                      Hash: {log.blockchain_hash || "N/A (Update Hash)"}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground pt-1">
                    Received: {new Date(log.uploaded_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Audit;