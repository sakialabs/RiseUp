// User and Authentication Types
export interface User {
  id: number;
  email: string;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  bio?: string;
  location?: string;
  causes: string[];
  profile_type: ProfileType;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
  profile: Profile;
}

// Profile Types
export type ProfileType = 'INDIVIDUAL' | 'GROUP';

export interface Profile {
  id: number;
  name: string;
  bio?: string;
  location?: string;
  profile_type: ProfileType;
  causes: string[];
  user: {
    id: number;
    email: string;
  };
  created_at: string;
  updated_at?: string;
}

export interface ProfileUpdateRequest {
  name?: string;
  bio?: string | null;
  location?: string | null;
  causes?: string[];
}

// Event Types
export interface Event {
  id: number;
  title: string;
  description: string;
  event_date: string;
  location: string;
  latitude?: number;
  longitude?: number;
  tags: string[];
  creator_id: number;
  attendee_count: number;
  created_at: string;
  updated_at: string;
}

export interface EventCreateRequest {
  title: string;
  description: string;
  event_date: string;
  location: string;
  latitude?: number;
  longitude?: number;
  tags: string[];
}

// Post Types
export interface Post {
  id: number;
  text: string;
  image_url?: string;
  author: {
    id: number;
    name: string;
    profile_type: ProfileType;
  };
  created_at: string;
  updated_at?: string;
}

export interface PostCreateRequest {
  text: string;
  image_url?: string;
}

// Reaction Types
export type ReactionType = 'SOLIDARITY' | 'CARE' | 'RESPECT' | 'GRATITUDE';
export type TargetType = 'EVENT' | 'POST';

export interface Reaction {
  id: number;
  user_id: number;
  target_type: TargetType;
  target_id: number;
  reaction_type: ReactionType;
  created_at: string;
}

export interface ReactionCreateRequest {
  target_type: TargetType;
  target_id: number;
  reaction_type: ReactionType;
}

export interface ReactionCount {
  reaction_type: ReactionType;
  count: number;
  user_reacted: boolean;
}

// Feed Types
export type FeedItemType = 'event' | 'post';

export interface FeedItem {
  id: number;
  type: FeedItemType;
  author: {
    id: number;
    name: string;
    profile_type: ProfileType;
  };
  // Event fields
  title?: string;
  description?: string;
  event_date?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  tags?: string[];
  attendee_count?: number;
  // Post fields
  content?: string;
  text?: string;
  image_url?: string;
  // Common fields
  created_at: string;
  reactions: ReactionCount[];
}

// Attendance Types
export interface Attendance {
  id: number;
  user_id: number;
  event_id: number;
  created_at: string;
}

export interface AttendanceResponse {
  event_id: number;
  attendance_count: number;
  user_attending: boolean;
  attendees?: {
    id: number;
    name: string;
    profile_type: ProfileType;
  }[];
}

// Cause Types
export type CauseType =
  | 'HOUSING_JUSTICE'
  | 'LABOR_RIGHTS'
  | 'ENVIRONMENTAL_JUSTICE'
  | 'RACIAL_JUSTICE'
  | 'ECONOMIC_JUSTICE'
  | 'EDUCATION_EQUITY'
  | 'HEALTHCARE_ACCESS'
  | 'IMMIGRANT_RIGHTS'
  | 'MUTUAL_AID'
  | 'COMMUNITY_DEFENSE'
  | 'DISABILITY_JUSTICE'
  | 'INDIGENOUS_RIGHTS'
  | 'CLIMATE_JUSTICE'
  | 'WORKERS_RIGHTS'
  | 'EDUCATION_ACCESS'
  | 'HEALTHCARE_FOR_ALL'
  | 'LGBTQ_RIGHTS'
  | 'FOOD_SECURITY';

// API Response Types
export interface ApiError {
  detail: string;
  status_code?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// Component Props Types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  children: React.ReactNode;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'bordered' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface AvatarProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  src?: string;
  className?: string;
}

// Utility Types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type AsyncData<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

// Form Types
export interface FormField<T = string> {
  value: T;
  error?: string;
  touched?: boolean;
}

export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}

// Theme Types
export type ThemeMode = 'light' | 'dark';

export interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
}

// Navigation Types
export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  active?: boolean;
}

// Map Types
export interface MapCoordinates {
  latitude: number;
  longitude: number;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface MapEvent extends Event {
  latitude: number;
  longitude: number;
}

// Unionized Types
export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'gig';
export type UnionStatus = 'unionized' | 'union-friendly' | 'not-listed';

export interface FairWorkPosting {
  id: number;
  title: string;
  organization: string;
  location: string;
  wage_min?: number;
  wage_max?: number;
  wage_text: string;
  employment_type: EmploymentType;
  union_status: UnionStatus;
  description: string;
  worker_notes?: string;
  application_url?: string;
  posted_date: string;
  created_at: string;
  updated_at: string;
}

export interface FairWorkPostingCreateRequest {
  title: string;
  organization: string;
  location: string;
  wage_min?: number;
  wage_max?: number;
  wage_text: string;
  employment_type: EmploymentType;
  union_status: UnionStatus;
  description: string;
  worker_notes?: string;
  application_url?: string;
}
