import { createSignal, Show } from 'solid-js'
import { Github, LogIn, Loader2, User, Settings } from 'lucide-solid'
import GitHubConfigForm from './GitHubConfigForm'

interface LoginButtonProps {
  onLogin: () => void
  onMockLogin: () => void
  onConfigureGitHub: (clientId: string, clientSecret: string) => void
  isGitHubConfigured: boolean
  loading: boolean
}

const LoginButton = (props: LoginButtonProps) => {
  const [showOptions, setShowOptions] = createSignal(false)
  const [showConfigForm, setShowConfigForm] = createSignal(false)

  return (
    <div class="relative">
      <button
        onClick={() => setShowOptions(!showOptions())}
        disabled={props.loading}
        class="flex items-center space-x-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Show when={props.loading} fallback={<LogIn class="w-4 h-4" />}>
          <Loader2 class="w-4 h-4 animate-spin" />
        </Show>
        <span>登录</span>
      </button>

      <Show when={showOptions()}>
        <div class="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div class="p-4">
            <h3 class="text-sm font-semibold text-gray-800 mb-3">选择登录方式</h3>
            
            <div class="space-y-2">
              <button
                onClick={() => {
                  if (props.isGitHubConfigured) {
                    props.onLogin()
                    setShowOptions(false)
                  } else {
                    setShowConfigForm(true)
                    setShowOptions(false)
                  }
                }}
                disabled={props.loading}
                class="flex items-center space-x-3 w-full px-3 py-2 text-sm text-gray-800 hover:bg-gray-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                <Github class="w-4 h-4" />
                <div class="text-left">
                  <div class="font-medium">GitHub 登录</div>
                  <div class="text-xs text-gray-500">
                    {props.isGitHubConfigured ? '使用 GitHub 账户登录' : '需要先配置 GitHub OAuth'}
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  props.onMockLogin()
                  setShowOptions(false)
                }}
                disabled={props.loading}
                class="flex items-center space-x-3 w-full px-3 py-2 text-sm text-gray-800 hover:bg-gray-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                <User class="w-4 h-4" />
                <div class="text-left">
                  <div class="font-medium">演示登录</div>
                  <div class="text-xs text-gray-500">使用演示账户（开发模式）</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowConfigForm(true)
                  setShowOptions(false)
                }}
                class="flex items-center space-x-3 w-full px-3 py-2 text-sm text-gray-800 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                <Settings class="w-4 h-4" />
                <div class="text-left">
                  <div class="font-medium">配置 GitHub</div>
                  <div class="text-xs text-gray-500">设置 OAuth 凭据</div>
                </div>
              </button>
            </div>

            <div class="mt-3 pt-3 border-t border-gray-200">
              <p class="text-xs text-gray-500 text-center">
                登录后可享受更高的 API 限制
              </p>
            </div>
          </div>
        </div>
      </Show>

      <Show when={showConfigForm()}>
        <GitHubConfigForm
          onConfig={(clientId, clientSecret) => {
            props.onConfigureGitHub(clientId, clientSecret)
            setShowConfigForm(false)
          }}
          onCancel={() => setShowConfigForm(false)}
        />
      </Show>
    </div>
  )
}

export default LoginButton
