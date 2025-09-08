import { createMemo } from 'solid-js'
import { Calendar, MessageCircle, User, ExternalLink, GitBranch } from 'lucide-solid'
import { GitHubIssue } from '../types'

interface IssueCardProps {
  issue: GitHubIssue
  index: number
}

const IssueCard = (props: IssueCardProps) => {
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

  const isPullRequest = createMemo(() => !!props.issue.pull_request)

  const getStateColor = () => {
    if (isPullRequest()) return 'bg-purple-500'
    return props.issue.state === 'open' ? 'bg-green-500' : 'bg-red-500'
  }

  const getStateText = () => {
    if (isPullRequest()) return 'PR'
    return props.issue.state === 'open' ? 'Open' : 'Closed'
  }

  return (
    <div 
      class="group bg-white border border-gray-200 rounded-lg p-6 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 hover:transform hover:scale-102 hover:shadow-md"
      style={`animation-delay: ${props.index * 0.1}s;`}
    >
      <div class="flex items-start justify-between mb-4">
        <div class="flex-1 min-w-0">
          <div class="flex items-center space-x-3 mb-2">
            <span class={`px-2 py-1 text-xs font-medium text-white rounded-full ${getStateColor()}`}>
              {getStateText()}
            </span>
            {isPullRequest() && (
              <span class="flex items-center text-xs text-purple-600">
                <GitBranch class="w-3 h-3 mr-1" />
                Pull Request
              </span>
            )}
          </div>
          
          <h3 class="text-lg font-semibold text-gray-800 group-hover:text-orange-600 transition-colors duration-200 line-clamp-2">
            <a 
              href={props.issue.html_url} 
              target="_blank" 
              rel="noopener noreferrer"
              class="text-gray-800 hover:text-orange-600 hover:underline transition-colors duration-200"
            >
              {props.issue.title}
            </a>
          </h3>
        </div>
        
        <a
          href={props.issue.html_url}
          target="_blank"
          rel="noopener noreferrer"
          class="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 opacity-0 group-hover:opacity-100"
        >
          <ExternalLink class="w-4 h-4 text-gray-400" />
        </a>
      </div>

      {props.issue.body && (
        <p class="text-gray-600 text-sm mb-4 line-clamp-3">
          {props.issue.body.replace(/[#*`]/g, '').substring(0, 200)}
          {props.issue.body.length > 200 && '...'}
        </p>
      )}

      <div class="flex items-center justify-between text-sm text-gray-500">
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-1">
            <User class="w-4 h-4" />
            <a 
              href={props.issue.user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-700 hover:text-orange-500 transition-colors duration-200"
            >
              {props.issue.user.login}
            </a>
          </div>
          
          <div class="flex items-center space-x-1">
            <Calendar class="w-4 h-4" />
            <span title={formatDate(props.issue.created_at)}>
              {getTimeAgo(props.issue.created_at)}
            </span>
          </div>
          
          {props.issue.comments > 0 && (
            <div class="flex items-center space-x-1">
              <MessageCircle class="w-4 h-4" />
              <span>{props.issue.comments}</span>
            </div>
          )}
        </div>
        
        <div class="text-xs text-gray-400">
          {props.issue.repository.full_name}
        </div>
      </div>

      {props.issue.labels.length > 0 && (
        <div class="mt-4 flex flex-wrap gap-2">
          {props.issue.labels.slice(0, 5).map((label) => (
            <span
              class="px-2 py-1 text-xs font-medium rounded-full"
              style={`background-color: #${label.color}15; color: #${label.color}; border: 1px solid #${label.color}30;`}
            >
              {label.name}
            </span>
          ))}
          {props.issue.labels.length > 5 && (
            <span class="px-2 py-1 text-xs text-gray-500">
              +{props.issue.labels.length - 5} more
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default IssueCard
