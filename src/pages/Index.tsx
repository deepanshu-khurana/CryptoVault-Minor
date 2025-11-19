import { Shield, Lock, FileText, BarChart3, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { UploadZone } from "@/components/UploadZone";
import { FeatureCard } from "@/components/FeatureCard";
import { SecurityBadge } from "@/components/SecurityBadge";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
  
const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          {/* Security Badge */}
          <div className="flex justify-center mb-8">
            <SecurityBadge type="protected" label="Military-Grade Security" />
          </div>

          {/* Hero Content */}
          <div className="space-y-8 mb-12">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Secure File Sharing with{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Blockchain Trust
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Share confidential files with AES-128 encryption, RSA key exchange, and blockchain verification. 
              Every file is encrypted locally before upload and verified through immutable blockchain records.
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="flex items-center space-x-2 text-security-green">
              <Shield className="h-5 w-5" />
              <span className="font-medium">AES-128 Encryption</span>
            </div>
            <div className="flex items-center space-x-2 text-security-green">
              <Lock className="h-5 w-5" />
              <span className="font-medium">RSA Key Exchange</span>
            </div>
            <div className="flex items-center space-x-2 text-security-green">
              <BarChart3 className="h-5 w-5" />
              <span className="font-medium">Blockchain Verified</span>
            </div>
          </div>

          {/* Upload Zone */}
          <UploadZone />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-vault-bg">
        <div className="max-w-7xl mx-auto ">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Complete Security <span className="text-primary">Workflow</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Every step of our process is designed with security-first principles and cryptographic best practices.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Lock}
              title="Encrypt Files"
              description="Local AES-128 encryption before any data leaves your device"
              features={[
                "Military-grade AES-128 encryption",
                "RSA public key cryptography",
                "Local encryption - no plain data transmission",
                "SHA-256 integrity verification"
              ]}
              action={{
                label: "Start Encrypting",
                href: "/vault"
              }}
              gradient={true}
            />

            <FeatureCard
              icon={Shield}
              title="Manage Vaults"
              description="Organize encrypted files in secure, hierarchical vaults"
              features={[
                "Secure folder organization",
                "Access control management",
                "Encrypted metadata storage",
                "Team collaboration tools"
              ]}
              action={{
                label: "Open Vault",
                href: "/vault"
              }}
            />

            <FeatureCard
              icon={BarChart3}
              title="Blockchain Audit"
              description="Immutable audit trail with blockchain verification"
              features={[
                "Immutable transaction ledger",
                "File integrity verification",
                "Cryptographic proof of authenticity",
                "Compliance audit trails"
              ]}
              action={{
                label: "View Audit Log",
                href: "/audit"
              }}
            />

            <FeatureCard
              icon={FileText}
              title="Web Interface"
              description="Secure web-based storage with encrypted file management"
              features={[
                "Encrypted cloud storage",
                "Pre-signed URL access",
                "Browser-based encryption",
                "Real-time file sync"
              ]}
              action={{
                label: "Access Files",
                href: "/vault"
              }}
            />

            <FeatureCard
              icon={Users}
              title="Secure Sharing"
              description="Share files with recipients using cryptographic verification"
              features={[
                "Recipient public key encryption",
                "Secure link generation",
                "QR code sharing options",
                "Access expiration controls"
              ]}
              action={{
                label: "Share Files",
                href: "/share"
              }}
            />

          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
};

export default Index;
