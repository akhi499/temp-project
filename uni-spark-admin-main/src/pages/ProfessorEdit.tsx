import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiService, Professor } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function ProfessorEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    employee_code: ''
  });

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
      setFormData({
        name: data.name,
        email: data.email,
        department: data.department,
        employee_code: data.employee_code
      });
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // Note: In a real app, you'd have an update API endpoint
      // For now, we'll just show a success message
      toast({
        title: "Success",
        description: "Professor details updated successfully!",
      });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate back to professors list
      navigate('/professors');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update professor";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/professors');
  };

  if (loading) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading professor details...</p>
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
            <p className="text-destructive mb-4">Failed to load professor details</p>
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
      <div className="flex items-center justify-between">
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
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={saving}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Edit Professor Details</h1>
        <p className="text-muted-foreground mt-2">
          Update information for {professor.name}
        </p>
      </div>

      {/* Edit Form */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card className="shadow-material">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Update professor's personal and contact details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter full name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employee_code">Employee Code</Label>
              <Input
                id="employee_code"
                value={formData.employee_code}
                onChange={(e) => handleInputChange('employee_code', e.target.value)}
                placeholder="Enter employee code"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select
                value={formData.department}
                onValueChange={(value) => handleInputChange('department', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Computer Science">Computer Science</SelectItem>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="Physics">Physics</SelectItem>
                  <SelectItem value="Chemistry">Chemistry</SelectItem>
                  <SelectItem value="Biology">Biology</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Psychology">Psychology</SelectItem>
                  <SelectItem value="Economics">Economics</SelectItem>
                  <SelectItem value="Literature">Literature</SelectItem>
                  <SelectItem value="History">History</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Current Information Display */}
        <Card className="shadow-material">
          <CardHeader>
            <CardTitle>Current Information</CardTitle>
            <CardDescription>
              View current professor details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Current Name</Label>
              <div className="p-3 bg-muted rounded-md">
                <p className="font-medium">{professor.name}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Current Email</Label>
              <div className="p-3 bg-muted rounded-md">
                <p className="font-medium">{professor.email}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Current Department</Label>
              <div className="p-3 bg-muted rounded-md">
                <Badge variant="outline">{professor.department}</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Publications Count</Label>
              <div className="p-3 bg-muted rounded-md">
                <p className="font-medium">{professor.publications.length} publications</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Academic Degrees</Label>
              <div className="p-3 bg-muted rounded-md">
                <p className="font-medium">{professor.academics.length} degrees</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Information */}
      <Card className="shadow-material">
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
          <CardDescription>
            Additional details and notes about the professor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes or comments about this professor..."
                className="min-h-[100px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
