import { Shield, AlertTriangle, CheckCircle, Clock, Cloud } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  type: "encryption" | "blockchain" | "sync" | "status";
  status: string;
  variant?: "default" | "destructive" | "outline" | "secondary";
}

const StatusBadge = ({ type, status, variant = "secondary" }: StatusBadgeProps) => {
  const getIcon = () => {
    switch (type) {
      case "encryption":
        return <Shield className="h-3 w-3" />;
      case "blockchain":
        return status === "verified" ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />;
      case "sync":
        return <Cloud className="h-3 w-3" />;
      default:
        return <AlertTriangle className="h-3 w-3" />;
    }
  };

  const getVariant = (): "default" | "destructive" | "outline" | "secondary" => {
    if (status === "verified" || status === "synced" || status.includes("AES")) return "default";
    if (status === "pending" || status === "syncing") return "secondary";
    if (status === "failed" || status === "error") return "destructive";
    return variant as "default" | "destructive" | "outline" | "secondary";
  };

  return (
    <Badge 
      variant={getVariant()}
      className={`flex items-center space-x-1 text-xs font-medium transition-all duration-300 ${
        getVariant() === "default" 
          ? "bg-gradient-primary text-primary-foreground shadow-glow border-primary/50" 
          : ""
      }`}
    >
      {getIcon()}
      <span>{status}</span>
    </Badge>
  );
};

export default StatusBadge;