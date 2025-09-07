import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Plus, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { apiService, Professor, ProfessorFilters } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function Professors() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch professors from API
  const fetchProfessors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters: ProfessorFilters = {
        search: searchTerm || undefined,
        department: departmentFilter !== "all" ? departmentFilter : undefined,
        start_date: dateFrom ? format(dateFrom, "yyyy-MM-dd") : undefined,
        end_date: dateTo ? format(dateTo, "yyyy-MM-dd") : undefined,
      };

      const data = await apiService.getProfessors(filters);
      setProfessors(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch professors";
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

  // Initial fetch
  useEffect(() => {
    fetchProfessors();
  }, []);

  // Refetch when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProfessors();
    }, 500); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchTerm, departmentFilter, dateFrom, dateTo]);

  const filteredProfessors = professors.filter((professor) => {
    const matchesSearch = 
      professor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professor.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = 
      departmentFilter === "all" || professor.department === departmentFilter;

    return matchesSearch && matchesDepartment;
  });

  // Get unique departments for filter dropdown
  const departments = Array.from(new Set(professors.map(p => p.department))).sort();

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Professors</h1>
          <p className="text-muted-foreground mt-2">
            Manage faculty members and their information
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary-hover">
            <Plus className="h-4 w-4 mr-2" />
            Add Professor
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="shadow-material">
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter</CardTitle>
          <CardDescription>Find professors by name, email, department, or date range</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search professors..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
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
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "MMM dd") : "From"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
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
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "MMM dd") : "To"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
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

      {/* Professors Table */}
      <Card className="shadow-material">
        <CardHeader>
          <CardTitle className="text-lg">Faculty Directory</CardTitle>
          <CardDescription>
            {loading ? "Loading..." : `${filteredProfessors.length} professors found`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading professors...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <p className="text-destructive mb-2">Failed to load professors</p>
                <Button onClick={fetchProfessors} variant="outline">
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Publications</TableHead>
                  <TableHead>Academic Background</TableHead>
                  <TableHead>Employee Code</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProfessors.map((professor) => (
                  <TableRow key={professor.employee_code} className="hover:bg-muted/50 transition-material">
                    <TableCell>
                      <div>
                        <div className="font-medium text-foreground">{professor.name}</div>
                        <div className="text-sm text-muted-foreground">{professor.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{professor.department}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{professor.publications.length} publications</div>
                        {professor.publications.length > 0 && (
                          <div className="text-muted-foreground">
                            Latest: {format(new Date(professor.publications[0].publication_date), "MMM yyyy")}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{professor.academics.length} degrees</div>
                        {professor.academics.length > 0 && (
                          <div className="text-muted-foreground">
                            {professor.academics[0].degree_type} from {professor.academics[0].university}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {professor.employee_code}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <Filter className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigate(`/professors/${professor.employee_code}/profile`)}>
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/professors/${professor.employee_code}/edit`)}>
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate(`/professors/${professor.employee_code}/publications`)}>
                          View Publications
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/professors/${professor.employee_code}/academic`)}>
                          View Academic Background
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}