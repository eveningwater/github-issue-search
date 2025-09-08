export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
  created_at: string;
  updated_at: string;
  html_url: string;
  repository_url: string;
  user: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
  repository: {
    name: string;
    full_name: string;
    html_url: string;
  };
  labels: Array<{
    name: string;
    color: string;
  }>;
  assignee?: {
    login: string;
    avatar_url: string;
  };
  comments: number;
  pull_request?: {
    html_url: string;
  };
}

export interface GitHubIssueRaw {
  id: number;
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
  created_at: string;
  updated_at: string;
  html_url: string;
  repository_url: string;
  user: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
  labels: Array<{
    name: string;
    color: string;
  }>;
  assignee?: {
    login: string;
    avatar_url: string;
  };
  comments: number;
  pull_request?: {
    html_url: string;
  };
}

export interface SearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubIssueRaw[];
}

export interface SearchParams {
  query: string;
  sort?: 'created' | 'updated' | 'comments';
  order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface SearchState {
  query: string;
  results: GitHubIssue[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  hasMore: boolean;
}

export interface GitHubUser {
  id: number;
  login: string;
  name: string;
  email: string;
  avatar_url: string;
  html_url: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: GitHubUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}
