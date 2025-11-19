import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut } from "lucide-react";

const Footer = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <footer className="relative border-t border-vault-border py-12 px-4">
      <div className="absolute inset-0 bg-gradient-primary opacity-30"></div>
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4 text-center justify-items-center">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Ready to Secure Your Files?
          </h2>
          <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
            CryptoVault is your all-in-one secure platform. Encrypt and decrypt files, store them safely, and share resources.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Contact</h3>
          <p>📧 <a href="mailto:9923103240@mail.jiit.ac.in" className="text-primary hover:text-primary-glow">9923103240@mail.jiit.ac.in</a></p>
          <p>📞 +91-9990260297</p>
          <p className="text-sm text-muted-foreground mt-4">
            👤 Founders: Mudit Rastogi, Samradhi Kaushal, Deepanshu Khurana
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Account</h3>
          {isAuthenticated ? (
            <Button 
              className="bg-gradient-primary flex items-center space-x-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          ) : (
            <Button className="bg-gradient-primary" asChild>
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;