import { useState, useEffect } from "react";
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
import { apiService, Student } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function Students() {
  const [searchTerm, setSearchTerm] = useState("");
  const [branchFilter, setBranchFilter] = useState("all");
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch students from API
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getStudents();
      setStudents(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch students";
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
    fetchStudents();
  }, []);

  const filteredStudents = students.filter((student) => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.roll_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.branch_code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBranch = 
      branchFilter === "all" || student.branch_code === branchFilter;

    return matchesSearch && matchesBranch;
  });

  // Get unique branches for filter dropdown
  const branches = Array.from(new Set(students.map(s => s.branch_code))).sort();

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Students</h1>
          <p className="text-muted-foreground mt-2">
            Manage student records and enrollment information
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary-hover">
            <Plus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="shadow-material">
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter</CardTitle>
          <CardDescription>Find students by name, email, roll number, or branch</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={branchFilter} onValueChange={setBranchFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                {branches.map((branch) => (
                  <SelectItem key={branch} value={branch}>
                    {branch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card className="shadow-material">
        <CardHeader>
          <CardTitle className="text-lg">Student Directory</CardTitle>
          <CardDescription>
            {loading ? "Loading..." : `${filteredStudents.length} students found`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading students...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <p className="text-destructive mb-2">Failed to load students</p>
                <Button onClick={fetchStudents} variant="outline">
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Roll Number</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.roll_number} className="hover:bg-muted/50 transition-material">
                    <TableCell>
                      <div className="font-medium text-foreground">{student.name}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{student.roll_number}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{student.branch_code}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {student.email}
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
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Edit Details</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>View Academic Record</DropdownMenuItem>
                          <DropdownMenuItem>View Enrollments</DropdownMenuItem>
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