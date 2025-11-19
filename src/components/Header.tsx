import { Menu, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import cryptovaultLogo from "@/assets/cryptovault-logo.png";
import { useAuth } from "../context/AuthContext";

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, username, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-vault-bg border-b border-vault-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img src={cryptovaultLogo} alt="CryptoVault" className="h-8 w-8 rounded-lg" />
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold bg-gradient-crypto bg-clip-text text-transparent">
                CryptoVault
              </span>
            </div>
          </Link>

          {/* Navigation - Only show when authenticated */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                to="/vault" 
                className={`text-foreground hover:text-primary transition-smooth ${location.pathname === '/vault' ? 'text-primary' : ''}`}
              >
                Vault
              </Link>
              <Link 
                to="/share" 
                className={`text-foreground hover:text-primary transition-smooth ${location.pathname === '/share' ? 'text-primary' : ''}`}
              >
                Share
              </Link>
              <Link 
                to="/audit" 
                className={`text-foreground hover:text-primary transition-smooth ${location.pathname === '/audit' ? 'text-primary' : ''}`}
              >
                Audit
              </Link>
              <Link 
                to="/download" 
                className={`text-foreground hover:text-primary transition-smooth ${location.pathname === '/download' ? 'text-primary' : ''}`}
              >
                Download
              </Link>
            </nav>
          )}

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span className="text-foreground">{username}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button variant="default" size="sm" className="bg-gradient-crypto" asChild>
                  <Link to="/signup">Get Started</Link>
                </Button>
              </>
            )}
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;