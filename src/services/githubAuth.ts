import { GitHubUser } from '../types'

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID || 'your_github_client_id'
const GITHUB_CLIENT_SECRET = import.meta.env.VITE_GITHUB_CLIENT_SECRET || 'your_github_client_secret'
const GITHUB_REDIRECT_URI = `${import.meta.env.VITE_APP_URL || window.location.origin}/auth/callback`
const GITHUB_SCOPE = 'user:email,repo'

export class GitHubAuth {
  private static instance: GitHubAuth
  private token: string | null = null
  private user: GitHubUser | null = null
  private clientId: string | null = null
  private clientSecret: string | null = null

  static getInstance(): GitHubAuth {
    if (!GitHubAuth.instance) {
      GitHubAuth.instance = new GitHubAuth()
    }
    return GitHubAuth.instance
  }

  constructor() {
    // 从localStorage恢复token
    this.token = localStorage.getItem('github_token')
    this.user = this.getStoredUser()
    // 使用环境变量作为默认值
    this.clientId = GITHUB_CLIENT_ID !== 'your_github_client_id' ? GITHUB_CLIENT_ID : null
    this.clientSecret = GITHUB_CLIENT_SECRET !== 'your_github_client_secret' ? GITHUB_CLIENT_SECRET : null
  }

  private getStoredUser(): GitHubUser | null {
    const stored = localStorage.getItem('github_user')
    return stored ? JSON.parse(stored) : null
  }

  private storeUser(user: GitHubUser) {
    localStorage.setItem('github_user', JSON.stringify(user))
    this.user = user
  }

  private storeToken(token: string) {
    localStorage.setItem('github_token', token)
    this.token = token
  }

  private clearStorage() {
    localStorage.removeItem('github_token')
    localStorage.removeItem('github_user')
    this.token = null
    this.user = null
  }

  setCredentials(clientId: string, clientSecret: string) {
    this.clientId = clientId
    this.clientSecret = clientSecret
  }

  isConfigured(): boolean {
    return !!(this.clientId && this.clientSecret)
  }

  getAuthUrl(): string {
    if (!this.isConfigured()) {
      throw new Error('GitHub OAuth 未配置，请先设置 Client ID 和 Client Secret')
    }

    const params = new URLSearchParams({
      client_id: this.clientId!,
      redirect_uri: GITHUB_REDIRECT_URI,
      scope: GITHUB_SCOPE,
      state: this.generateState()
    })
    
    return `https://github.com/login/oauth/authorize?${params}`
  }

  private generateState(): string {
    const state = Math.random().toString(36).substring(2, 15)
    sessionStorage.setItem('github_oauth_state', state)
    return state
  }

  private validateState(state: string): boolean {
    const storedState = sessionStorage.getItem('github_oauth_state')
    sessionStorage.removeItem('github_oauth_state')
    return state === storedState
  }

  async handleCallback(code: string, state: string): Promise<{ success: boolean; error?: string }> {
    if (!this.validateState(state)) {
      return { success: false, error: 'Invalid state parameter' }
    }

    try {
      // 获取访问令牌
      const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          client_id: this.clientId!,
          client_secret: this.clientSecret!,
          code,
          redirect_uri: GITHUB_REDIRECT_URI
        })
      })

      const tokenData = await tokenResponse.json()
      
      if (tokenData.error) {
        return { success: false, error: tokenData.error_description || 'Failed to get access token' }
      }

      this.storeToken(tokenData.access_token)

      // 获取用户信息
      const userResponse = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${tokenData.access_token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      })

      if (!userResponse.ok) {
        throw new Error('Failed to get user info')
      }

      const userData = await userResponse.json()
      this.storeUser(userData)

      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Authentication failed' 
      }
    }
  }

  async getUserInfo(): Promise<GitHubUser | null> {
    if (!this.token || this.user) {
      return this.user
    }

    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${this.token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to get user info')
      }

      const userData = await response.json()
      this.storeUser(userData)
      return userData
    } catch (error) {
      console.error('Failed to get user info:', error)
      return null
    }
  }

  isAuthenticated(): boolean {
    return !!this.token
  }

  getToken(): string | null {
    return this.token
  }

  getUser(): GitHubUser | null {
    return this.user
  }

  logout(): void {
    this.clearStorage()
  }

  // 用于开发环境的模拟登录
  async mockLogin(): Promise<{ success: boolean; error?: string }> {
    try {
      // 模拟用户数据
      const mockUser: GitHubUser = {
        id: 12345,
        login: 'demo-user',
        name: 'Demo User',
        email: 'demo@example.com',
        avatar_url: 'https://avatars.githubusercontent.com/u/12345?v=4',
        html_url: 'https://github.com/demo-user',
        bio: 'This is a demo user for testing',
        public_repos: 42,
        followers: 100,
        following: 50,
        created_at: '2020-01-01T00:00:00Z'
      }

      this.storeUser(mockUser)
      this.storeToken('mock_token_for_demo')

      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Mock login failed' 
      }
    }
  }
}

export const githubAuth = GitHubAuth.getInstance()
