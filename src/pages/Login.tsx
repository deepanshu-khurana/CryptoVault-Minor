import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Lock, Mail, Shield } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";
import { Header } from "@/components/Header";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

// Define the type for the successful API response
interface LoginResponse {
    access: string;
    refresh: string;
    username: string; 
}

// Define the type for the API error response
interface ErrorResponse {
    detail?: string; 
    username?: string[]; 
    email?: string[];   
    password?: string[]; 
  // Allows for generic errors
}

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState<string | null>(null);

    const navigate = useNavigate();
    const { login } = useAuth(); 

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setLoginError(null);
        
        const loginData = { username: email, password: password };
        const LOGIN_API_URL = 'http://127.0.0.1:8000/api/v1/auth/login/';

        try {
            const response = await fetch(LOGIN_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
            });

            // 🔑 FIX 1: Read the response body ONCE, regardless of the status
            const responseBody = await response.json(); 

            if (!response.ok) {
                // --- ERROR PATH (e.g., 401 Unauthorized) ---
                const errorData: ErrorResponse = responseBody; 
                
                // Construct error message from Django's response structure
                const errorMessage = errorData.detail 
                                     || errorData.username?.[0] 
                                     || errorData.email?.[0]
                                     || 'Invalid email or password.'; 

                throw new Error(errorMessage);
            }

            // --- SUCCESS PATH (HTTP 200 OK) ---
            const data: LoginResponse = responseBody as LoginResponse;
            
            // Store tokens and username globally via Context
            login(data.username || email, data.access, data.refresh); 

            // Navigate to the vault dashboard upon success
            navigate('/vault'); 

        } catch (err: unknown) { 
            // Handle network errors (e.g., failed to connect) or thrown API errors
            let message = 'An unknown error occurred. Check server connection.';
            if (err instanceof Error) {
                message = err.message;
            } else if (typeof err === 'object' && err !== null && 'message' in err) {
                 message = (err as { message: string }).message;
            }
            
            console.error("Login Error:", err);
            setLoginError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <Header />
            <div className="min-h-screen flex bg-gradient-secondary relative overflow-hidden">
                {/* Background */}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
                    style={{ backgroundImage: `url(${heroBackground})` }}
                />
                
                {/* Floating decorative elements */}
                <div className="absolute top-20 left-20 w-16 h-16 opacity-20">
                    <Shield className="w-full h-full text-primary animate-float" />
                </div>
                <div className="absolute top-40 right-32 w-12 h-12 opacity-20">
                    <Lock className="w-full h-full text-primary animate-float-delayed" />
                </div>
                <div className="absolute bottom-32 left-32 w-20 h-20 opacity-20">
                    {/* Placeholder div */}
                </div>

                {/* Main content */}
                <div className="flex-1 flex items-center justify-center p-4 relative z-10">
                    <Card className="w-full max-w-md glass shadow-elegant animate-slide-in">
                        <CardHeader className="text-center space-y-2">
                            <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4 glow">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                                Secure Login
                            </CardTitle>
                            <CardDescription className="text-muted-foreground">
                                Access your encrypted files securely
                            </CardDescription>
                        </CardHeader>

                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-4">
                                {loginError && (
                                    <p className="text-sm font-medium text-red-500 bg-red-50 p-2 rounded-md border border-red-200">
                                        {loginError}
                                    </p>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium">
                                        Email Address
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-10 transition-smooth focus:shadow-elegant"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-medium">
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pl-10 pr-10 transition-smooth focus:shadow-elegant"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-smooth"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <Link to="/forgot-password" className="text-primary hover:text-primary-glow transition-smooth">
                                        Forgot password?
                                    </Link>
                                </div>
                            </CardContent>

                            <CardFooter className="flex flex-col space-y-4">
                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-primary hover:shadow-elegant transition-smooth relative overflow-hidden"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center space-x-2">
                                            <div className="loading-dots">
                                                <div style={{ "--delay": "0ms" } as React.CSSProperties}></div>
                                                <div style={{ "--delay": "150ms" } as React.CSSProperties}></div>
                                                <div style={{ "--delay": "300ms" } as React.CSSProperties}></div>
                                            </div>
                                            <span>Authenticating...</span>
                                        </div>
                                    ) : (
                                        "Sign In"
                                    )}
                                </Button>

                                <div className="text-center text-sm text-muted-foreground">
                                    Don't have an account?{" "}
                                    <Link to="/signup" className="text-primary hover:text-primary-glow font-medium transition-smooth">
                                        Create one here
                                    </Link>
                                </div>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Login;