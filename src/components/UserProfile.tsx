import { User, HardDrive, Hash } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface UserProfileProps {
    username: string; // This is the user's ID/email passed from VaultDashboard
}

const UserProfile: React.FC<UserProfileProps> = ({ username }) => {
    // Note: In a real app, storage data (storageUsed, storageTotal) should also be fetched
    // from your Django API and passed as props or fetched inside this component.
    const storageUsed = 2.4;
    const storageTotal = 100;
    const storagePercentage = (storageUsed / storageTotal) * 100;

    return (
        <Card className="bg-gradient-cyber border-border/50 p-6 shadow-card">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
                        <User className="h-8 w-8 text-primary-foreground" />
                    </div>
                    
                    <div className="space-y-1">
                        {/* 🔑 FIX: Display the dynamic username/ID prominently in the h2 tag */}
                        <h2 className="text-2xl font-bold text-foreground">{username}</h2> 
                        
                        {/* 🔑 FIX: The secondary line remains static as the placeholder blockchain address */}
                        <div className="flex items-center space-x-2 text-muted-foreground">
                            <Hash className="h-4 w-4" />
                            {/* This displays the static blockchain address/random string */}
                            <span className="text-sm font-mono">0x742d...8a9f</span>
                        </div>
                    </div>
                </div>

                <div className="text-right space-y-2">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                        <HardDrive className="h-4 w-4" />
                        <span className="text-sm">Storage Usage</span>
                    </div>
                    
                    <div className="space-y-2 min-w-[200px]">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{storageUsed} GB used</span>
                            <span className="text-muted-foreground">{storageTotal} GB total</span>
                        </div>
                        <Progress 
                            value={storagePercentage} 
                            className="h-2 bg-muted/50"
                        />
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default UserProfile;