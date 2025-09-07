// API service layer for connecting to Django backend
const API_BASE_URL = 'http://127.0.0.1:8000/api';

export interface Professor {
  employee_code: string;
  name: string;
  email: string;
  department: string;
  academics: Academic[];
  publications: Publication[];
}

export interface Academic {
  degree_type: string;
  university: string;
  year: number;
}

export interface Publication {
  title: string;
  publication_type: string;
  publication_date: string;
  venue_name: string;
}

export interface Student {
  roll_number: string;
  name: string;
  email: string;
  branch_code: string;
}

export interface ProfessorFilters {
  start_date?: string;
  end_date?: string;
  department?: string;
  search?: string;
}

export interface DashboardStats {
  totalStudents: number;
  activeProfessors: number;
  totalCourses: number;
  enrollmentRate: number;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Professor endpoints
  async getProfessors(filters?: ProfessorFilters): Promise<Professor[]> {
    const params = new URLSearchParams();
    
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    if (filters?.department && filters.department !== 'all') {
      params.append('department', filters.department);
    }

    const queryString = params.toString();
    const endpoint = `/professors/${queryString ? `?${queryString}` : ''}`;
    
    return this.request<Professor[]>(endpoint);
  }

  async getProfessor(id: string): Promise<Professor> {
    return this.request<Professor>(`/professors/${id}/`);
  }

  // Student endpoints
  async getStudents(): Promise<Student[]> {
    return this.request<Student[]>('/students/');
  }

  async getStudent(id: string): Promise<Student> {
    return this.request<Student>(`/students/${id}/`);
  }

  // Dashboard stats (we'll calculate these from the data)
  async getDashboardStats(): Promise<DashboardStats> {
    const [students, professors] = await Promise.all([
      this.getStudents(),
      this.getProfessors()
    ]);

    // Calculate stats from the data
    const totalStudents = students.length;
    const activeProfessors = professors.length;
    
    // For now, we'll use placeholder values for courses and enrollment rate
    // In a real app, you'd have separate endpoints for these
    const totalCourses = 124; // This would come from a courses endpoint
    const enrollmentRate = 94.2; // This would be calculated from enrollment data

    return {
      totalStudents,
      activeProfessors,
      totalCourses,
      enrollmentRate
    };
  }
}

export const apiService = new ApiService();