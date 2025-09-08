import { createSignal, createEffect } from 'solid-js'
import { githubAuth } from '../services/githubAuth'
import { AuthState, GitHubUser } from '../types'

export const useAuth = () => {
  const [state, setState] = createSignal<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false,
    error: null
  })

  createEffect(() => {
    // 初始化时检查是否已登录
    const initAuth = async () => {
      if (githubAuth.isAuthenticated()) {
        setState(prev => ({ ...prev, loading: true }))
        
        try {
          const user = await githubAuth.getUserInfo()
          setState({
            isAuthenticated: true,
            user,
            token: githubAuth.getToken(),
            loading: false,
            error: null
          })
        } catch (error) {
          setState({
            isAuthenticated: false,
            user: null,
            token: null,
            loading: false,
            error: error instanceof Error ? error.message : 'Authentication failed'
          })
        }
      }
    }

    initAuth()
  })

  const login = () => {
    try {
      const authUrl = githubAuth.getAuthUrl()
      window.location.href = authUrl
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'GitHub OAuth 未配置'
      }))
    }
  }

  const mockLogin = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const result = await githubAuth.mockLogin()
      
      if (result.success) {
        const user = githubAuth.getUser()
        setState({
          isAuthenticated: true,
          user,
          token: githubAuth.getToken(),
          loading: false,
          error: null
        })
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: result.error || 'Login failed'
        }))
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Login failed'
      }))
    }
  }

  const handleCallback = async (code: string, state: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const result = await githubAuth.handleCallback(code, state)
      
      if (result.success) {
        const user = githubAuth.getUser()
        setState({
          isAuthenticated: true,
          user,
          token: githubAuth.getToken(),
          loading: false,
          error: null
        })
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: result.error || 'Authentication failed'
        }))
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Authentication failed'
      }))
    }
  }

  const logout = () => {
    githubAuth.logout()
    setState({
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false,
      error: null
    })
  }

  const configureGitHub = (clientId: string, clientSecret: string) => {
    githubAuth.setCredentials(clientId, clientSecret)
    setState(prev => ({ ...prev, error: null }))
  }

  const isGitHubConfigured = () => {
    return githubAuth.isConfigured()
  }

  return {
    state,
    login,
    mockLogin,
    handleCallback,
    logout,
    configureGitHub,
    isGitHubConfigured
  }
}
