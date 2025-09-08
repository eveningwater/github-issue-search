import { createSignal, createEffect, Show } from 'solid-js'
import { CheckCircle, AlertCircle, Info } from 'lucide-solid'
import { useAuth } from '../hooks/useAuth'

const AuthStatus = () => {
  const { state: authState } = useAuth()
  const [showStatus, setShowStatus] = createSignal(false)

  createEffect(() => {
    if (authState().isAuthenticated) {
      setShowStatus(true)
      // 3秒后自动隐藏
      setTimeout(() => setShowStatus(false), 3000)
    }
  })

  return (
    <Show when={showStatus()}>
      <div class="fixed top-20 right-4 z-50 animate-fade-in">
        <div class="flex items-center space-x-3 px-4 py-3 bg-green-500/20 backdrop-blur-md border border-green-400/30 rounded-lg shadow-lg">
          <CheckCircle class="w-5 h-5 text-green-400" />
          <div>
            <div class="text-sm font-medium text-white">登录成功</div>
            <div class="text-xs text-green-300">
              欢迎回来，{authState().user?.name || authState().user?.login}！
            </div>
          </div>
        </div>
      </div>
    </Show>
  )
}

export default AuthStatus
