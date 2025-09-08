import { createSignal, createEffect, Show } from 'solid-js'
import { Github, Star, Zap } from 'lucide-solid'
import UserProfile from './UserProfile'
import LoginButton from './LoginButton'
import { useAuth } from '../hooks/useAuth'

const Header = () => {
  const [isScrolled, setIsScrolled] = createSignal(false)
  const { state: authState, login, mockLogin, logout, configureGitHub, isGitHubConfigured } = useAuth()

  createEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  })

  return (
    <header 
      class={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled() 
          ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="p-2 bg-orange-500 rounded-lg">
              <Github class="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-800">GitHub Issue 搜索</h1>
              <p class="text-sm text-gray-600">发现和探索开源项目</p>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <div class="hidden md:flex items-center space-x-6 text-sm text-gray-600">
              <div class="flex items-center space-x-1">
                <Zap class="w-4 h-4 text-yellow-500" />
                <span>实时搜索</span>
              </div>
              <div class="flex items-center space-x-1">
                <Star class="w-4 h-4 text-orange-500" />
                <span>精选项目</span>
              </div>
              <Show when={authState().isAuthenticated}>
                <div class="flex items-center space-x-1">
                  <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span class="text-green-600">已认证</span>
                </div>
              </Show>
            </div>

            <Show 
              when={authState().isAuthenticated && authState().user} 
              fallback={
                <LoginButton 
                  onLogin={login}
                  onMockLogin={mockLogin}
                  onConfigureGitHub={configureGitHub}
                  isGitHubConfigured={isGitHubConfigured()}
                  loading={authState().loading}
                />
              }
            >
              <UserProfile 
                user={authState().user!} 
                onLogout={logout}
              />
            </Show>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
