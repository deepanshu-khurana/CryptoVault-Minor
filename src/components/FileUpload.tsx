import { useState, useCallback, useRef } from "react";
import { Upload, X, CloudUpload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SecurityBadge } from "./SecurityBadge";

export const FileUpload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Drag handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      console.log("Dropped file:", file);
    }
  }, []);

  // File input handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      console.log("Selected file:", file);
    }
  };

  // Deselect file
  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // reset input
    }
  };

  // Upload handler (mock for now)
  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    console.log("Uploading file to cloud:", selectedFile);

    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false);
      alert(`✅ File "${selectedFile.name}" uploaded to cloud successfully!`);
      setSelectedFile(null);
    }, 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300
          ${
            isDragging
              ? "border-primary bg-primary/5 scale-102"
              : "border-vault-border bg-vault-surface hover:border-primary/50"
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-6">
          {/* Upload Icon */}
          <div className="flex justify-center">
            <div
              className={`
                p-6 rounded-full border transition-all duration-300
                ${
                  isDragging
                    ? "bg-gradient-primary border-primary"
                    : "bg-vault-bg border-vault-border"
                }
              `}
            >
              <Upload
                className={`h-8 w-8 ${
                  isDragging ? "text-primary-foreground" : "text-primary"
                }`}
              />
            </div>
          </div>

          {/* File Selection */}
          <div>
            <h3 className="text-xl font-semibold mb-2">
              Drop files to upload
            </h3>
            <p className="text-muted-foreground mb-4">
              Or click to select files from your device
            </p>
            <Button
              variant="outline"
              size="lg"
              onClick={() => fileInputRef.current?.click()}
            >
              Choose Files
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Security Badges */}
          <div className="flex flex-wrap justify-center gap-3">
            <SecurityBadge type="encryption" label="AES-256 Encryption" />
            <SecurityBadge type="protected" label="Blockchain Verified" />
            <SecurityBadge type="verified" label="AWS S3 Secured" />
          </div>
        </div>

        {/* File Preview */}
        {selectedFile && (
          <div className="mt-6 p-4 border rounded-lg bg-vault-bg text-left space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Selected File:</p>
                <p className="text-sm text-muted-foreground">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  Size: {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <button
                onClick={removeFile}
                className="ml-4 text-red-500 hover:text-red-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Upload Button */}
            <Button
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full flex items-center justify-center gap-2"
            >
              <CloudUpload className="h-4 w-4" />
              {isUploading ? "Uploading..." : "Upload to Cloud"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;