import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Lock, Mail, Shield, User, FileText } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";
import { Header } from "@/components/Header";

// Define the API Error Response structure
interface ErrorResponse {
    detail?: string;
    username?: string[];
    email?: string[];
    password?: string[];
    
}

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [signupError, setSignupError] = useState<string | null>(null);

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        acceptTerms: false,
    });

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSignupError(null);

        if (formData.password !== formData.confirmPassword) {
            setSignupError("Passwords do not match!");
            return;
        }
        if (!formData.acceptTerms) {
            setSignupError("You must accept the terms and conditions.");
            return;
        }
        
        setIsLoading(true);
        const SIGNUP_API_URL = 'http://127.0.0.1:8000/api/v1/auth/register/';
        
        const registrationData = {
            username: formData.email, 
            email: formData.email,
            password: formData.password,
        };

        try {
            const response = await fetch(SIGNUP_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registrationData),
            });

            const responseBody = await response.json();

            if (!response.ok) {
                // --- API FAILURE PATH (e.g., 400 Bad Request) ---
                const errorData: ErrorResponse = responseBody;
                
                // Construct error message from API response
                const errorMessage = errorData.username?.[0] 
                                     || errorData.email?.[0] 
                                     || errorData.password?.[0] 
                                     || errorData.detail 
                                     || "Registration failed. Please check your details.";
                
                throw new Error(errorMessage);
            }

            // 🔑 SUCCESS: User created. Redirect to login page.
            alert("✅ Account created successfully! Please sign in.");
            navigate('/login'); 

        } catch (err: unknown) { 
            // 🔑 FIX: Handle unknown error type safely and set message
            let message = 'Error connecting to the server. Please ensure the backend is running.';
            
            if (err instanceof Error) {
                message = err.message;
            } else if (typeof err === 'object' && err !== null && 'message' in err) {
                 message = (err as { message: string }).message;
            }

            console.error("Signup Error:", err);
            setSignupError(message);
        } finally {
            setIsLoading(false); // Always turn off loading state
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
            <div className="absolute top-16 right-20 w-14 h-14 opacity-20">
                <FileText className="w-full h-full text-primary animate-float" />
            </div>
            <div className="absolute top-1/3 left-16 w-10 h-10 opacity-20">
                <Lock className="w-full h-full text-primary animate-float-delayed" />
            </div>
            <div className="absolute bottom-20 right-20 w-18 h-18 opacity-20">
                {/* Placeholder div */}
            </div>

            {/* Main content */}
            <div className="flex-1 flex items-center justify-center p-4 relative z-10">
                <Card className="w-full max-w-md glass shadow-elegant animate-slide-in">
                    <CardHeader className="text-center space-y-2">
                        <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4 glow animate-pulse-glow">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                            Create Account
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Join our secure file sharing platform
                        </CardDescription>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            {signupError && ( // Display API error message here
                                <p className="text-sm font-medium text-red-500 bg-red-50 p-2 rounded-md border border-red-200">
                                    {signupError}
                                </p>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium">
                                    Full Name
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                        className="pl-10 transition-smooth focus:shadow-elegant"
                                        required
                                    />
                                </div>
                            </div>

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
                                        value={formData.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
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
                                        placeholder="Create a strong password"
                                        value={formData.password}
                                        onChange={(e) => handleInputChange("password", e.target.value)}
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

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                                    Confirm Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm your password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                                        className="pl-10 pr-10 transition-smooth focus:shadow-elegant"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-smooth"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="terms"
                                    checked={formData.acceptTerms}
                                    onCheckedChange={(checked) => handleInputChange("acceptTerms", checked as boolean)}
                                />
                                <Label htmlFor="terms" className="text-sm text-muted-foreground">
                                    I agree to the{" "}
                                    <Link to="/terms" className="text-primary hover:text-primary-glow transition-smooth">
                                        Terms of Service
                                    </Link>{" "}
                                    and{" "}
                                    <Link to="/privacy" className="text-primary hover:text-primary-glow transition-smooth">
                                        Privacy Policy
                                    </Link>
                                </Label>
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
                                        <span>Creating Account...</span>
                                    </div>
                                ) : (
                                    "Create Account"
                                )}
                            </Button>

                            <div className="text-center text-sm text-muted-foreground">
                                Already have an account?{" "}
                                <Link to="/login" className="text-primary hover:text-primary-glow font-medium transition-smooth">
                                    Sign in here
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

export default Signup;