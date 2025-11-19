import { Shield, Lock, CheckCircle } from "lucide-react";

interface SecurityBadgeProps {
  type: "encryption" | "verified" | "protected";
  label: string;
  className?: string;
}

export const SecurityBadge = ({ type, label, className = "" }: SecurityBadgeProps) => {
  const configs = {
    encryption: {
      icon: Lock,
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20"
    },
    verified: {
      icon: CheckCircle,
      color: "text-security-green",
      bgColor: "bg-security-green/10",
      borderColor: "border-security-green/20"
    },
    protected: {
      icon: Shield,
      color: "text-security-amber",
      bgColor: "bg-security-amber/10",
      borderColor: "border-security-amber/20"
    }
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className={`
      inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg border
      ${config.bgColor} ${config.borderColor} ${className}
    `}>
      <Icon className={`h-4 w-4 ${config.color}`} />
      <span className={`text-sm font-medium ${config.color}`}>
        {label}
      </span>
    </div>
  );
};

export default SecurityBadge;