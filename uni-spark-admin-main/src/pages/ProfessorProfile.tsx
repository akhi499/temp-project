import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Building, Calendar, Award, BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { apiService, Professor } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function ProfessorProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchProfessor();
    }
  }, [id]);

  const fetchProfessor = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getProfessor(id!);
      setProfessor(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch professor";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading professor profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !professor) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-destructive mb-4">Failed to load professor profile</p>
            <Button onClick={fetchProfessor} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/professors')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Professors
        </Button>
      </div>

      {/* Profile Header */}
      <Card className="shadow-material">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{professor.name}</CardTitle>
              <CardDescription className="text-lg mt-2">
                {professor.department} • Employee Code: {professor.employee_code}
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-sm">
              {professor.department}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {professor.email}
            </div>
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              {professor.department}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-material">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Publications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{professor.publications.length}</div>
            <p className="text-xs text-muted-foreground">
              Research publications
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-material">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Academic Degrees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{professor.academics.length}</div>
            <p className="text-xs text-muted-foreground">
              Educational qualifications
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-material">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Experience
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {professor.academics.length > 0 
                ? new Date().getFullYear() - Math.min(...professor.academics.map(a => a.year))
                : 'N/A'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Years in academia
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Publications and Academic Background */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Publications */}
        <Card className="shadow-material">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Recent Publications
            </CardTitle>
            <CardDescription>
              Latest research publications
            </CardDescription>
          </CardHeader>
          <CardContent>
            {professor.publications.length > 0 ? (
              <div className="space-y-4">
                {professor.publications.slice(0, 3).map((publication, index) => (
                  <div key={index} className="border-l-2 border-primary pl-4">
                    <h4 className="font-medium text-sm">{publication.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {publication.publication_type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(publication.publication_date), "MMM yyyy")}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {publication.venue_name}
                    </p>
                  </div>
                ))}
                {professor.publications.length > 3 && (
                  <p className="text-sm text-muted-foreground">
                    +{professor.publications.length - 3} more publications
                  </p>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No publications found</p>
            )}
          </CardContent>
        </Card>

        {/* Academic Background */}
        <Card className="shadow-material">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Academic Background
            </CardTitle>
            <CardDescription>
              Educational qualifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            {professor.academics.length > 0 ? (
              <div className="space-y-4">
                {professor.academics.map((academic, index) => (
                  <div key={index} className="border-l-2 border-primary pl-4">
                    <h4 className="font-medium text-sm">
                      {academic.degree_type} Degree
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {academic.university}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Graduated: {academic.year}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No academic background found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
