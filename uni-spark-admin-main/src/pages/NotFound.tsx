import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { GraduationCap, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md text-center shadow-material">
        <CardContent className="pt-8 pb-6">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/10 rounded-full">
              <GraduationCap className="h-12 w-12 text-primary" />
            </div>
          </div>
          
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-xl font-semibold text-foreground mb-2">Page Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The page you're looking for doesn't exist in the university system.
          </p>
          
          <Button asChild className="bg-primary hover:bg-primary-hover w-full">
            <a href="/" className="flex items-center justify-center gap-2">
              <Home className="h-4 w-4" />
              Return to Dashboard
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
