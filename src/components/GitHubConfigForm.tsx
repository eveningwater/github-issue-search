import { createSignal, Show } from 'solid-js'
import { Github, Check, X } from 'lucide-solid'
import ewMessage from 'ew-message'

export interface GitHubConfigFormProps {
  onConfig: (clientId: string, clientSecret: string) => void
  onCancel: () => void
}

const GitHubConfigForm = (props: GitHubConfigFormProps) => {
  const [clientId, setClientId] = createSignal('')
  const [clientSecret, setClientSecret] = createSignal('')
  const [showSecret, setShowSecret] = createSignal(false)
  const [isValidating, setIsValidating] = createSignal(false)

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    
    if (!clientId().trim() || !clientSecret().trim()) {
      ewMessage.warning('请填写完整的 GitHub OAuth 配置信息')
      return
    }

    setIsValidating(true)
    
    // 简单验证格式
    if (!clientId().match(/^[a-zA-Z0-9_]+$/)) {
      ewMessage.warning('Client ID 格式不正确')
      setIsValidating(false)
      return
    }

    if (!clientSecret().match(/^[a-zA-Z0-9_]+$/)) {
      ewMessage.warning('Client Secret 格式不正确')
      setIsValidating(false)
      return
    }

    // 模拟验证延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    props.onConfig(clientId(), clientSecret())
    setIsValidating(false)
  }

  return (
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-md shadow-xl">
        <div class="flex items-center space-x-3 mb-6">
          <div class="p-2 bg-orange-500/20 rounded-lg">
            <Github class="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-800">GitHub OAuth 配置</h2>
            <p class="text-sm text-gray-600">配置您的 GitHub OAuth 应用凭据</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Client ID
            </label>
            <input
              type="text"
              value={clientId()}
              onInput={(e) => setClientId(e.currentTarget.value)}
              placeholder="输入您的 GitHub Client ID"
              class="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 hover:border-gray-300 transition-all duration-300 input-shadow"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Client Secret
            </label>
            <div class="relative">
              <input
                type={showSecret() ? 'text' : 'password'}
                value={clientSecret()}
                onInput={(e) => setClientSecret(e.currentTarget.value)}
                placeholder="输入您的 GitHub Client Secret"
                class="w-full px-4 py-3 pr-12 bg-white border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 hover:border-gray-300 transition-all duration-300 input-shadow"
              />
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret())}
                class="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-all duration-200"
                title={showSecret() ? '隐藏密码' : '显示密码'}
              >
                {showSecret() ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div class="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
            <h3 class="text-sm font-medium text-orange-600 mb-2">如何获取凭据？</h3>
            <ol class="text-xs text-gray-600 space-y-1">
              <li>1. 访问 <a href="https://github.com/settings/developers" target="_blank" class="text-orange-500 hover:underline">GitHub Developer Settings</a></li>
              <li>2. 点击 "OAuth Apps" → "New OAuth App"</li>
              <li>3. 填写应用信息：</li>
              <li class="ml-4">• Application name: GitHub Issue Search</li>
              <li class="ml-4">• Homepage URL: {window.location.origin}</li>
              <li class="ml-4">• Authorization callback URL: {window.location.origin}/auth/callback</li>
              <li>4. 创建后复制 Client ID 和 Client Secret</li>
            </ol>
          </div>

          <div class="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={props.onCancel}
              class="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <X class="w-4 h-4" />
              <span>取消</span>
            </button>
            <button
              type="submit"
              disabled={isValidating()}
              class="flex-1 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Show when={isValidating()} fallback={<Check class="w-4 h-4" />}>
                <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </Show>
              <span>{isValidating() ? '验证中...' : '确认配置'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default GitHubConfigForm
