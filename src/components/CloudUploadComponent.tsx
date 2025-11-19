import { useState, useEffect, useRef, useCallback } from "react";
import { Upload, X, CloudUpload, Info, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SecurityBadge } from "./SecurityBadge";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// ✅ Hardcode your AWS credentials here
const AWS_REGION = ""; 
const AWS_BUCKET_NAME = ""; 
const AWS_ACCESS_KEY_ID = "";
const AWS_SECRET_ACCESS_KEY = "";

// Function to build S3 file URL
const buildS3ObjectUrl = (bucket, region, key) => {
  const sanitizedKey = key.replace(/^\/+/, "");
  const encodedKey = sanitizedKey
    .split("/")
    .filter((segment) => segment.length > 0)
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  if (!region || region === "us-east-1") {
    return `https://${bucket}.s3.amazonaws.com/${encodedKey}`;
  }

  return `https://${bucket}.s3.${region}.amazonaws.com/${encodedKey}`;
};

const badgeStyles = {
  checking: "text-amber-500 border-amber-500/60 bg-amber-500/10",
  connected: "text-emerald-500 border-emerald-500/60 bg-emerald-500/10",
  error: "text-red-500 border-red-500/60 bg-red-500/10",
};

const badgeIcon = {
  checking: <Info className="h-4 w-4" />,
  connected: <CheckCircle2 className="h-4 w-4" />,
  error: <AlertCircle className="h-4 w-4" />,
};

export const CloudUploadComponent = () => {
  const [backendStatus, setBackendStatus] = useState("checking");
  const [file, setFile] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const fileInputRef = useRef(null);

  // ✅ Check that all credentials are provided
  useEffect(() => {
    if (!AWS_REGION || !AWS_BUCKET_NAME || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
      setBackendStatus("error");
      console.warn("Missing AWS credentials — please fill in the placeholders above.");
    } else {
      setBackendStatus("connected");
    }
  }, []);

  const resetFileInput = useCallback(() => {
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleFileSelection = useCallback((selectedFile) => {
    setFile(selectedFile);
    setUploadStatus(null);
  }, []);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0] ?? null;
    handleFileSelection(selectedFile);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    setIsDragActive(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragActive(false);

    const droppedFile = event.dataTransfer.files?.[0] ?? null;
    handleFileSelection(droppedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus({ type: "error", message: "Please select a file first!" });
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);

    try {
      const s3Client = new S3Client({
        region: AWS_REGION,
        credentials: {
          accessKeyId: AWS_ACCESS_KEY_ID,
          secretAccessKey: AWS_SECRET_ACCESS_KEY,
        },
      });

      const objectKey =file.name;

      await s3Client.send(
        new PutObjectCommand({
          Bucket: AWS_BUCKET_NAME,
          Key: objectKey,
          Body: file,
          ContentType: file.type || "application/octet-stream",
        })
      );

      const fileUrl = buildS3ObjectUrl(AWS_BUCKET_NAME, AWS_REGION, objectKey);

      setUploadStatus({
        type: "success",
        message: "✅ File uploaded successfully!",
        fileUrl,
      });
      setFile(null);
      resetFileInput();
    } catch (error) {
      console.error("S3 upload failed:", error);
      setUploadStatus({
        type: "error",
        message: `❌ ${error.message}`,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
          Upload to Cloud Vault
          <div className="h-px w-16 bg-gradient-primary opacity-80" />
        </h3>
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium ${badgeStyles[backendStatus]}`}
        >
          {badgeIcon[backendStatus]}
          {backendStatus === "connected" && "Configuration ready"}
          {backendStatus === "checking" && "Checking configuration..."}
          {backendStatus === "error" && "Configuration required"}
        </span>
      </div>

      {backendStatus === "error" && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 text-red-600 p-4 text-sm">
          <p className="font-medium mb-1">⚠️ Missing AWS credentials!</p>
          <p className="text-xs">Please fill in the placeholder values in the code above.</p>
        </div>
      )}

      <div
        className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
          isDragActive
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-vault-border bg-vault-surface hover:border-primary/50"
        }`}
        onDragEnter={handleDragOver}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-6">
          <div className="flex justify-center">
            <div
              className={`p-6 rounded-full border transition-all duration-300 ${
                isDragActive ? "bg-gradient-primary border-primary" : "bg-vault-bg border-vault-border"
              }`}
            >
              <Upload className={`h-8 w-8 ${isDragActive ? "text-primary-foreground" : "text-primary"}`} />
            </div>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-2">Drop files to upload</h4>
            <p className="text-muted-foreground mb-4">
              Or click to browse and upload directly to your AWS S3 bucket.
            </p>
            <Button variant="outline" size="lg" onClick={() => fileInputRef.current?.click()}>
              Choose File
            </Button>
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <SecurityBadge type="encryption" label="AES-256 Encryption" />
            <SecurityBadge type="protected" label="Blockchain Verified" />
            <SecurityBadge type="verified" label="AWS S3 Secured" />
          </div>
        </div>

        {file && (
          <div className="mt-6 p-4 border rounded-lg bg-vault-bg text-left space-y-4">
            <div className="flex flex-wrap justify-between gap-4 items-start">
              <div>
                <p className="font-medium">Selected file</p>
                <p className="text-sm text-muted-foreground break-all">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type || "Unknown type"}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleFileSelection(null)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <Button
              onClick={handleUpload}
              disabled={isUploading || backendStatus !== "connected"}
              className="w-full flex items-center justify-center gap-2"
            >
              <CloudUpload className="h-4 w-4" />
              {isUploading ? "Uploading..." : "Upload to Cloud"}
            </Button>
          </div>
        )}
      </div>

      {uploadStatus && (
        <div
          className={`border rounded-xl p-4 ${
            uploadStatus.type === "success"
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600"
              : "border-red-500/40 bg-red-500/10 text-red-600"
          }`}
        >
          <p className="font-semibold">{uploadStatus.message}</p>
          {uploadStatus.type === "success" && uploadStatus.fileUrl && (
            <p className="text-sm mt-2 break-all">
              File URL:{" "}
              <a
                href={uploadStatus.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-emerald-700"
              >
                {uploadStatus.fileUrl}
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CloudUploadComponent;