import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import Header from "./Header";
import UserProfile from "./UserProfile";
import { UploadZone } from "./UploadZone";
import FileCard from "./FileCard";
import { DecryptionKeyTable } from "./DecryptionKeyTable";
import Footer from "./Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from '../context/AuthContext'; // <-- Import the Auth hook

// File data structure for FileCard component
interface FileCardData {
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

// API response structure
interface ApiFileData {
    id: number;
    uploaded_file: string;
    file_name: string;
    uploaded_at: string;
    blockchain_hash: string;
    aes_key?: string;
    encrypted_fernet_key?: string;
}

const VaultDashboard = () => {
    // 1. Get dynamic user state from context
    const { isAuthenticated, accessToken, username } = useAuth(); 
    console.log("VaultDashboard Retrieved Username:", username);
    const [files, setFiles] = useState<FileCardData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const navigate = useNavigate();

    // Placeholder API endpoint for fetching the user's files
    // NOTE: This endpoint needs to be created in your Django backend!
    const API_URL = 'http://127.0.0.1:8000/api/v1/files/'; 

    const fetchFiles = useCallback(async () => {
        if (!accessToken) {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            // Fetch only personal vault files (not shared files)
            // Try with trailing slash first, fallback without
            const endpoint = `${API_URL}vault_files/`;
            console.log("Fetching from endpoint:", endpoint);
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // CRITICAL: Send the Access Token for authentication
                    'Authorization': `Bearer ${accessToken}`, 
                },
            });

            if (response.status === 401) {
                 // Handle token expiration/unauthorized access
                throw new Error('Unauthorized or session expired.');
            }
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error("API Error:", response.status, errorText);
                throw new Error(`Failed to fetch files: ${response.status}`);
            }
            
            // Get data from API
            const data: ApiFileData[] = await response.json();
            console.log("Fetched files from API:", data);
            
            // Format files for FileCard component
            const formattedFiles: FileCardData[] = (Array.isArray(data) ? data : []).map((file) => ({
                id: file.id.toString(),
                name: file.file_name || 'Unknown',
                uploadDate: new Date(file.uploaded_at).toLocaleDateString(),
                encryptionType: file.encrypted_fernet_key ? 'AES-256' : 'None',
                blockchainStatus: file.blockchain_hash ? 'Verified' : 'Pending',
                syncStatus: 'Synced',
                size: 'N/A',
                aes_key: file.aes_key,
                encrypted_fernet_key: file.encrypted_fernet_key,
            }));
            
            console.log("Formatted files:", formattedFiles);
            setFiles(formattedFiles);
        } catch (error) {
            console.error("Error fetching vault data:", error);
            setFiles([]); // Set empty array on error
            // Optionally log out the user if the token is completely invalid
            // logout(); 
        } finally {
            setIsLoading(false);
        }
    }, [accessToken, API_URL]);

    const handleFileDelete = useCallback((fileId: string) => {
        setFiles(prevFiles => prevFiles.filter(f => f.id !== fileId));
    }, []);

    useEffect(() => {
        // --- AUTHENTICATION GUARD ---
        if (!isAuthenticated) {
            // If the user is not logged in, redirect them to the login page
            navigate('/login'); 
            return;
        }

        fetchFiles();
    }, [isAuthenticated, accessToken, navigate, fetchFiles]); // Dependencies: Re-run when auth state changes

    // Listen for file upload success to refresh the list
    useEffect(() => {
        const handleFileUploaded = () => {
            console.log("File uploaded, refreshing file list...");
            fetchFiles();
        };

        // Listen for custom event from UploadZone
        window.addEventListener('fileUploaded', handleFileUploaded);
        
        return () => {
            window.removeEventListener('fileUploaded', handleFileUploaded);
        };
    }, [fetchFiles]);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading Vault...</div>;
    }

    // Fallback if somehow authenticated but no username
    const displayUsername = username || 'User'; 

    return (
        <div className="min-h-screen bg-background bg-cover bg-center">
            <Header />
            
            <main className="container mx-auto px-6 py-8 space-y-8">
                {/* 1. User Profile Section: Pass the dynamic username */}
                <UserProfile username={displayUsername} /> 

                {/* Upload Section */}
                <section className="space-y-10">
                    <div>
                        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                            Upload Files
                            <div className="ml-2 h-px flex-1 bg-gradient-primary opacity-90" />
                        </h2>
                        <UploadZone apiEndpoint="http://127.0.0.1:8000/api/v1/uploadfiles/" />
                    </div>
                </section> 	

                {/* 2. Files Grid Section */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-foreground flex items-center">
                            {/* DYNAMIC USERNAME DISPLAY */}
                            {displayUsername}'s Vault 
                            <span className="ml-3 text-sm text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                                {files.length} files
                            </span>
                            <div className="ml-4 h-px flex-1 bg-gradient-primary opacity-30" />
                        </h2>
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => fetchFiles()}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Refreshing...' : 'Refresh'}
                        </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
                        {files.map((file) => (
                            <FileCard key={file.id} file={file} onDelete={handleFileDelete} />
                        ))}
                        
                        {files.length === 0 && <p className="text-muted-foreground">No files found.</p>}
                    </div>
                </section>

                {/* Decryption Key Table Section */}
                <section className="mt-12">
                    <div className="bg-vault-surface p-6 rounded-xl border border-vault-border">
                        <DecryptionKeyTable 
                            files={files
                                .filter(f => f.aes_key && f.encrypted_fernet_key)
                                .map(f => ({
                                    id: parseInt(f.id),
                                    file_name: f.name,
                                    aes_key: f.aes_key || '',
                                }))} 
                        />
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default VaultDashboard;