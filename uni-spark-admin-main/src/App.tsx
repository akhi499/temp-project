import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import Dashboard from "./pages/Dashboard";
import Professors from "./pages/Professors";
import Students from "./pages/Students";
import ProfessorProfile from "./pages/ProfessorProfile";
import ProfessorPublications from "./pages/ProfessorPublications";
import ProfessorAcademic from "./pages/ProfessorAcademic";
import ProfessorEdit from "./pages/ProfessorEdit";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              <AppHeader />
              <main className="flex-1 overflow-auto">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/professors" element={<Professors />} />
                  <Route path="/students" element={<Students />} />
                  {/* Professor detail pages */}
                  <Route path="/professors/:id/profile" element={<ProfessorProfile />} />
                  <Route path="/professors/:id/publications" element={<ProfessorPublications />} />
                  <Route path="/professors/:id/academic" element={<ProfessorAcademic />} />
                  <Route path="/professors/:id/edit" element={<ProfessorEdit />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
