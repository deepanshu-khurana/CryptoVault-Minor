import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  action: {
    label: string;
    href: string;
  };
  gradient?: boolean;
}

export const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  features, 
  action, 
  gradient = false 
}: FeatureCardProps) => {
  return (
    <div
      className={`
        p-8 rounded-xl border transition-all duration-300 hover:scale-105 hover:shadow-2xl
        ${gradient 
          ? 'bg-gradient-primary text-primary-foreground border-primary'  // reduced opacity here
          : 'bg-card border-vault-border hover:border-primary/30'
        }
      `}
    >
      <div className="space-y-6">
        {/* Icon & Title */}
        <div className="space-y-4">
          <div className={`
            w-14 h-14 rounded-lg flex items-center justify-center
            ${gradient ? 'bg-primary-foreground/10' : 'bg-primary/10'}
          `}>
            <Icon className={`h-7 w-7 ${gradient ? 'text-primary-foreground' : 'text-primary'}`} />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className={`text-sm ${gradient ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
              {description}
            </p>
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className={`text-sm flex items-start space-x-2 ${gradient ? 'text-foreground/90' : 'text-foreground/90'}`}>
              <span className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${gradient ? 'bg-foreground/60' : 'bg-primary'}`} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* Action */}
        <Button 
          variant={gradient ? "secondary" : "default"} 
          className={`w-full ${gradient 
            ? 'bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground border-primary-foreground/20' 
            : 'bg-gradient-primary'
          }`}
          asChild
        >
          <a href={action.href}>
            {action.label}
          </a>
        </Button>
      </div>
    </div>
  );
};
