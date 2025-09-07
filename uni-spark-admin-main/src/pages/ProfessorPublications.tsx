import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Calendar, Filter, Search, Loader2, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { apiService, Professor, Publication } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function ProfessorPublications() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
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
      setPublications(data.publications);
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

  const filteredPublications = publications.filter((publication) => {
    const matchesSearch = 
      publication.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      publication.venue_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = 
      typeFilter === "all" || publication.publication_type === typeFilter;

    const matchesDateFrom = 
      !dateFrom || new Date(publication.publication_date) >= dateFrom;

    const matchesDateTo = 
      !dateTo || new Date(publication.publication_date) <= dateTo;

    return matchesSearch && matchesType && matchesDateFrom && matchesDateTo;
  });

  if (loading) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading publications...</p>
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
            <p className="text-destructive mb-4">Failed to load publications</p>
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
        <h1 className="text-3xl font-bold text-foreground">Publications</h1>
        <p className="text-muted-foreground mt-2">
          Research publications by {professor.name}
        </p>
      </div>

      {/* Stats Card */}
      <Card className="shadow-material">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Publication Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold">{publications.length}</div>
              <p className="text-sm text-muted-foreground">Total Publications</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {publications.filter(p => p.publication_type === 'Journal').length}
              </div>
              <p className="text-sm text-muted-foreground">Journal Articles</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {publications.filter(p => p.publication_type === 'Conference').length}
              </div>
              <p className="text-sm text-muted-foreground">Conference Papers</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="shadow-material">
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter</CardTitle>
          <CardDescription>Find publications by title, venue, type, or date range</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search publications..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Journal">Journal</SelectItem>
                <SelectItem value="Conference">Conference</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[140px] justify-start text-left font-normal",
                      !dateFrom && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "MMM dd") : "From"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[140px] justify-start text-left font-normal",
                      !dateTo && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "MMM dd") : "To"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Publications List */}
      <Card className="shadow-material">
        <CardHeader>
          <CardTitle className="text-lg">Publications List</CardTitle>
          <CardDescription>
            {filteredPublications.length} publications found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredPublications.length > 0 ? (
            <div className="space-y-6">
              {filteredPublications.map((publication, index) => (
                <div key={index} className="border-l-4 border-primary pl-6 py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{publication.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          {publication.venue_name}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(publication.publication_date), "MMMM dd, yyyy")}
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant={publication.publication_type === 'Journal' ? 'default' : 'secondary'}
                      className="ml-4"
                    >
                      {publication.publication_type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No publications found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
