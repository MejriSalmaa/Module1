import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import JobOffers from "./pages/JobOffers";
import TalentProfiles from "./pages/TalentProfiles";
import TalentRequests from "./pages/TalentRequests";
import Assessments from "./pages/Assessments";
import Pipeline from "./pages/Pipeline";
import TalentProfile from "./pages/TalentProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/jobs" element={<JobOffers />} />
            <Route path="/talents" element={<TalentProfiles />} />
            <Route path="/requests" element={<TalentRequests />} />
            <Route path="/assessments" element={<Assessments />} />
            <Route path="/pipeline" element={<Pipeline />} />
            <Route path="/profile" element={<TalentProfile />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
