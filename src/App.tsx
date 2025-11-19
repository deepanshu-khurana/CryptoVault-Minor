import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// Cleaned up the import list
import { Routes, Route } from "react-router-dom"; 
import { AuthProvider } from "./context/AuthContext"; 

import Index from "./pages/Index";
import Vault from "./pages/Vault";
import Share from "./pages/Share";
import Audit from "./pages/Audit";
import Download from "./pages/Download";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup"; 

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <Toaster />
            <Sonner />
            
            {/* AuthProvider wraps the content that requires the user state */}
            <AuthProvider> 
                {/* Routes are the children of BrowserRouter (which is correctly in main.tsx) */}
                <Routes>
                    {/* 1. Root path. Index will redirect to /login if not authenticated. */}
                    <Route path="/" element={<Index />} />
                    
                    {/* 2. Authentication Routes (Public) */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    
                    {/* 3. Main Application Routes */}
                    <Route path="/vault" element={<Vault />} />
                    <Route path="/share" element={<Share />} />
                    <Route path="/audit" element={<Audit />} />
                    <Route path="/download" element={<Download />} />
                    
                    {/* 4. Catch-all for 404s */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </AuthProvider>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;