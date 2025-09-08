import { createSignal, Show } from 'solid-js'
import { User, LogOut, Settings, Github, Star, Users, Calendar } from 'lucide-solid'
import { GitHubUser } from '../types'

interface UserProfileProps {
  user: GitHubUser
  onLogout: () => void
}

const UserProfile = (props: UserProfileProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = createSignal(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return '刚刚'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}分钟前`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}小时前`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}天前`
    return formatDate(dateString)
  }

  return (
    <div class="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen())}
        class="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
      >
        <img
          src={props.user.avatar_url}
          alt={props.user.login}
          class="w-8 h-8 rounded-full border-2 border-white/20"
        />
        <div class="hidden md:block text-left">
          <div class="text-sm font-medium text-white">{props.user.name || props.user.login}</div>
          <div class="text-xs text-gray-400">@{props.user.login}</div>
        </div>
      </button>

      <Show when={isDropdownOpen()}>
        <div class="absolute right-0 mt-2 w-80 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl z-50">
          <div class="p-6">
            {/* 用户信息头部 */}
            <div class="flex items-center space-x-4 mb-4">
              <img
                src={props.user.avatar_url}
                alt={props.user.login}
                class="w-16 h-16 rounded-full border-2 border-white/20"
              />
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-white">{props.user.name || props.user.login}</h3>
                <p class="text-sm text-gray-400">@{props.user.login}</p>
                <Show when={props.user.bio}>
                  <p class="text-sm text-gray-300 mt-1">{props.user.bio}</p>
                </Show>
              </div>
            </div>

            {/* 统计信息 */}
            <div class="grid grid-cols-3 gap-4 mb-4">
              <div class="text-center">
                <div class="text-lg font-semibold text-white">{props.user.public_repos}</div>
                <div class="text-xs text-gray-400">仓库</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-semibold text-white">{props.user.followers}</div>
                <div class="text-xs text-gray-400">关注者</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-semibold text-white">{props.user.following}</div>
                <div class="text-xs text-gray-400">关注中</div>
              </div>
            </div>

            {/* 加入时间 */}
            <div class="flex items-center space-x-2 text-sm text-gray-400 mb-4">
              <Calendar class="w-4 h-4" />
              <span>加入于 {formatDate(props.user.created_at)}</span>
            </div>

            {/* 操作按钮 */}
            <div class="space-y-2">
              <a
                href={props.user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-600 hover:text-orange-500 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                <Github class="w-4 h-4" />
                <span>查看 GitHub 主页</span>
              </a>
              
              <button
                onClick={props.onLogout}
                class="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors duration-200"
              >
                <LogOut class="w-4 h-4" />
                <span>退出登录</span>
              </button>
            </div>
          </div>
        </div>
      </Show>
    </div>
  )
}

export default UserProfile
