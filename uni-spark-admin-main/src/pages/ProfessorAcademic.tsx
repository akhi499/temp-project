import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Award, GraduationCap, Calendar, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiService, Professor, Academic } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function ProfessorAcademic() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [academics, setAcademics] = useState<Academic[]>([]);
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
      setAcademics(data.academics);
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

  const getDegreeIcon = (degreeType: string) => {
    switch (degreeType) {
      case 'PHD':
        return <Award className="h-6 w-6 text-purple-600" />;
      case 'PG':
        return <GraduationCap className="h-6 w-6 text-blue-600" />;
      case 'UG':
        return <GraduationCap className="h-6 w-6 text-green-600" />;
      default:
        return <Award className="h-6 w-6 text-gray-600" />;
    }
  };

  const getDegreeColor = (degreeType: string) => {
    switch (degreeType) {
      case 'PHD':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'PG':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'UG':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDegreeLabel = (degreeType: string) => {
    switch (degreeType) {
      case 'PHD':
        return 'Doctor of Philosophy';
      case 'PG':
        return 'Postgraduate';
      case 'UG':
        return 'Undergraduate';
      default:
        return degreeType;
    }
  };

  if (loading) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading academic background...</p>
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
            <p className="text-destructive mb-4">Failed to load academic background</p>
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

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Academic Background</h1>
        <p className="text-muted-foreground mt-2">
          Educational qualifications of {professor.name}
        </p>
      </div>

      {/* Stats Card */}
      <Card className="shadow-material">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Academic Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{academics.length}</div>
              <p className="text-sm text-muted-foreground">Total Degrees</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {academics.filter(a => a.degree_type === 'PHD').length}
              </div>
              <p className="text-sm text-muted-foreground">PhD Degrees</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {academics.filter(a => a.degree_type === 'PG').length}
              </div>
              <p className="text-sm text-muted-foreground">Postgraduate</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {academics.filter(a => a.degree_type === 'UG').length}
              </div>
              <p className="text-sm text-muted-foreground">Undergraduate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Academic Timeline */}
      <Card className="shadow-material">
        <CardHeader>
          <CardTitle className="text-lg">Educational Timeline</CardTitle>
          <CardDescription>
            Academic qualifications in chronological order
          </CardDescription>
        </CardHeader>
        <CardContent>
          {academics.length > 0 ? (
            <div className="space-y-6">
              {academics
                .sort((a, b) => b.year - a.year) // Sort by year descending (most recent first)
                .map((academic, index) => (
                <div key={index} className="relative">
                  {/* Timeline line */}
                  {index < academics.length - 1 && (
                    <div className="absolute left-6 top-12 w-0.5 h-16 bg-border"></div>
                  )}
                  
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-background border-2 border-border flex items-center justify-center">
                      {getDegreeIcon(academic.degree_type)}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {getDegreeLabel(academic.degree_type)}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-2">
                            {academic.university}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {academic.year}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              University
                            </div>
                          </div>
                        </div>
                        <Badge 
                          className={`${getDegreeColor(academic.degree_type)} border`}
                        >
                          {academic.degree_type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No academic background information available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Card */}
      {academics.length > 0 && (
        <Card className="shadow-material">
          <CardHeader>
            <CardTitle className="text-lg">Academic Summary</CardTitle>
            <CardDescription>
              Overview of educational achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-2">Highest Degree</h4>
                <p className="text-sm text-muted-foreground">
                  {academics.length > 0 
                    ? getDegreeLabel(academics.sort((a, b) => {
                        const order = { 'PHD': 3, 'PG': 2, 'UG': 1 };
                        return (order[b.degree_type as keyof typeof order] || 0) - (order[a.degree_type as keyof typeof order] || 0);
                      })[0].degree_type)
                    : 'Not available'
                  }
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Years of Education</h4>
                <p className="text-sm text-muted-foreground">
                  {academics.length > 0 
                    ? `${Math.min(...academics.map(a => a.year))} - ${Math.max(...academics.map(a => a.year))}`
                    : 'Not available'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
