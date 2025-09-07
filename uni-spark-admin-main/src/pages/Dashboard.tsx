import { useState, useEffect } from "react";
import { Users, UserCheck, BookOpen, TrendingUp, Loader2 } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiService, DashboardStats } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch dashboard stats from API
  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getDashboardStats();
      setStats(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch dashboard stats";
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
    fetchStats();
  }, []);

  const statsData = stats ? [
    {
      title: "Total Students",
      value: stats.totalStudents.toLocaleString(),
      change: "+12.5%", // This would come from historical data
      changeType: "positive" as const,
      icon: Users,
    },
    {
      title: "Active Professors",
      value: stats.activeProfessors.toLocaleString(),
      change: "+3.2%", // This would come from historical data
      changeType: "positive" as const,
      icon: UserCheck,
    },
    {
      title: "Courses",
      value: stats.totalCourses.toLocaleString(),
      change: "+5.1%", // This would come from historical data
      changeType: "positive" as const,
      icon: BookOpen,
    },
    {
      title: "Enrollment Rate",
      value: `${stats.enrollmentRate}%`,
      change: "+2.3%", // This would come from historical data
      changeType: "positive" as const,
      icon: TrendingUp,
    },
  ] : [];

  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here's an overview of your university system.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="shadow-material">
              <CardContent className="p-6">
                <div className="flex items-center justify-center h-24">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : error ? (
          <div className="col-span-full flex items-center justify-center py-8">
            <div className="text-center">
              <p className="text-destructive mb-2">Failed to load dashboard stats</p>
              <button 
                onClick={fetchStats} 
                className="text-sm text-primary hover:underline"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          statsData.map((stat) => (
            <StatsCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              changeType={stat.changeType}
              icon={stat.icon}
            />
          ))
        )}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-material">
          <CardHeader>
            <CardTitle>Recent Enrollments</CardTitle>
            <CardDescription>New student registrations this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Sarah Johnson", course: "Computer Science", date: "2 hours ago" },
                { name: "Michael Chen", course: "Mathematics", date: "4 hours ago" },
                { name: "Emily Davis", course: "Psychology", date: "6 hours ago" },
                { name: "David Wilson", course: "Engineering", date: "1 day ago" },
              ].map((enrollment, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium text-foreground">{enrollment.name}</p>
                    <p className="text-sm text-muted-foreground">{enrollment.course}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{enrollment.date}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-material">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current system health and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { service: "Student Portal", status: "Operational", uptime: "99.9%" },
                { service: "Grade System", status: "Operational", uptime: "99.8%" },
                { service: "Library System", status: "Maintenance", uptime: "97.2%" },
                { service: "Course Registration", status: "Operational", uptime: "99.9%" },
              ].map((service, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      service.status === "Operational" ? "bg-success" : "bg-warning"
                    }`} />
                    <span className="font-medium text-foreground">{service.service}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{service.uptime}</p>
                    <p className="text-xs text-muted-foreground">{service.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}