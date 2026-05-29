const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Cache buster - change this number to force reload
const CACHE_VERSION = "v2";
console.log("🔄 API.TS LOADED", CACHE_VERSION);

// ──────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────

export interface CourseItem {
  id: number;
  title: string;
  code: string;
  level: string;
  description: string;
  duration: string;
}

export interface EnrolledCourse {
  id: number;
  title: string;
  code: string;
  description: string;
  duration: string;
  progress: number;
  status: "not_started" | "in_progress" | "completed";
  completed_modules: number;
  total_modules: number;
  current_module?: string;
}

export interface ModuleItem {
  id: number;
  title: string;
  order: number;
  status: "locked" | "active" | "completed";
  learning_state?: string;
  score?: number;
}

export interface CourseDetail {
  id: number;
  title: string;
  code: string;
  level: string;
  description: string;
  duration: string;
  progress: number;
  total_modules: number;
  completed_modules: number;
  modules: ModuleItem[];
}

export interface ModuleData {
  id: number;
  title: string;
  order: number;
  course_id: number;
  content: { title: string; body: string };
  current_level: string;
  available_levels: string[];
  has_quiz: boolean;
  progress: {
    time_spent: number;
    access_count: number;
    is_completed: boolean;
  };
}

export interface QuizData {
  quiz_id: number;
  title: string;
  questions: Array<{
    id: number;
    text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
  }>;
}

export interface QuizResult {
  score: number;
  total: number;
  percentage: number;
  learning_state: string;
  next_level: string;
  message: string;
  ai_used: boolean;
  review: Array<{
    question_id: number;
    text: string;
    your_answer: string;
    correct: string;
    is_correct: boolean;
    explanation: string;
  }>;
}

export interface StudentProgress {
  summary: {
    total_courses: number;
    modules_completed: number;
    avg_score: number;
    hours_studied: number;
    total_quizzes: number;
  };
  learning_states: {
    proficient: number;
    needs_practice: number;
    struggling: number;
  };
  courses_progress: Array<{
    course_id: number;
    course_code: string;
    course_title: string;
    progress: number;
    status: string;
    completed_modules: number;
    total_modules: number;
    avg_score: number;
  }>;
}

export interface RecentActivity {
  activities: Array<{
    id: number;
    module_title: string;
    course_title: string;
    score: number;
    attempted_at: string;
    learning_state: string;
  }>;
}

// ──────────────────────────────────────────────────────
// API Calls
// ──────────────────────────────────────────────────────

export const authApi = {
  login: async (email: string, password: string) => {
    console.log("🔑 authApi.login called with:", { email, password });
    
    const payload = { email, password };
    console.log("📦 Payload:", JSON.stringify(payload));
    
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    
    console.log("📡 Response status:", response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Login error:", errorData);
      throw new Error("Login failed");
    }
    
    const data = await response.json();
    console.log("✅ Login success:", data);
    return data;
  },

  register: async (data: {
    full_name: string;
    email: string;
    password: string;
    role: string;
    matric_number?: string;
  }) => {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Registration failed");
    return response.json();
  },

  me: async (token: string) => {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch user");
    return response.json();
  },
};

export const coursesApi = {
  getAll: async (token: string): Promise<CourseItem[]> => {
    const response = await fetch(`${API_URL}/api/courses`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch courses");
    return response.json();
  },

  getEnrolled: async (token: string): Promise<EnrolledCourse[]> => {
    const response = await fetch(`${API_URL}/api/courses/enrolled`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch enrolled courses");
    return response.json();
  },

  getDetail: async (courseId: number, token: string): Promise<CourseDetail> => {
    const response = await fetch(`${API_URL}/api/courses/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch course detail");
    return response.json();
  },

  enroll: async (courseId: number, token: string) => {
    const response = await fetch(`${API_URL}/api/courses/${courseId}/enroll`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to enroll");
    return response.json();
  },
};

export const modulesApi = {
  get: async (moduleId: number, token: string): Promise<ModuleData> => {
    const response = await fetch(`${API_URL}/api/modules/${moduleId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch module");
    return response.json();
  },

  getContentByLevel: async (
    moduleId: number,
    level: string,
    token: string
  ): Promise<{ title: string; body: string }> => {
    const response = await fetch(
      `${API_URL}/api/modules/${moduleId}/content/${level}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!response.ok) throw new Error("Failed to fetch content");
    return response.json();
  },

  trackTime: async (moduleId: number, seconds: number, token: string) => {
    const response = await fetch(`${API_URL}/api/modules/${moduleId}/track-time`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ seconds }),
    });
    if (!response.ok) throw new Error("Failed to track time");
    return response.json();
  },
};

export const quizzesApi = {
  get: async (moduleId: number, token: string): Promise<QuizData> => {
    const response = await fetch(`${API_URL}/api/quizzes/${moduleId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch quiz");
    return response.json();
  },

  submit: async (
    moduleId: number,
    answers: Record<string, string>,
    token: string
  ): Promise<QuizResult> => {
    const response = await fetch(`${API_URL}/api/quizzes/${moduleId}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(answers),
    });
    if (!response.ok) throw new Error("Failed to submit quiz");
    return response.json();
  },
};

export const progressApi = {
  getStudentProgress: async (token: string): Promise<StudentProgress> => {
    const response = await fetch(`${API_URL}/api/progress/student`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch progress");
    return response.json();
  },

  getRecentActivity: async (token: string): Promise<RecentActivity> => {
    const response = await fetch(`${API_URL}/api/progress/student/activity`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch activity");
    return response.json();
  },
};

export const analyticsApi = {
  getOverview: async (token: string) => {
    const response = await fetch(`${API_URL}/api/analytics/overview`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch overview");
    return response.json();
  },

  getStudents: async (token: string) => {
    const response = await fetch(`${API_URL}/api/analytics/students`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch students");
    return response.json();
  },

  getCourseAnalytics: async (courseId: number, token: string) => {
    const response = await fetch(`${API_URL}/api/analytics/courses/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch course analytics");
    return response.json();
  },
};

export const aiApi = {
  predict: async (data: {
    module_id: number;
    time_spent: number;
    access_count: number;
    score: number;
  }, token: string) => {
    const response = await fetch(`${API_URL}/api/ai/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to predict");
    return response.json();
  },

  getRecommendation: async (moduleId: number, token: string) => {
    const response = await fetch(`${API_URL}/api/ai/recommendation/${moduleId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch recommendation");
    return response.json();
  },
};