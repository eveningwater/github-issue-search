import { SearchResponse, SearchParams } from '../types'
import { githubAuth } from './githubAuth'

const GITHUB_API_BASE = 'https://api.github.com'

export class GitHubAPI {
  private static instance: GitHubAPI
  private rateLimitRemaining = 60
  private rateLimitReset = 0

  static getInstance(): GitHubAPI {
    if (!GitHubAPI.instance) {
      GitHubAPI.instance = new GitHubAPI()
    }
    return GitHubAPI.instance
  }

  private async makeRequest<T>(url: string): Promise<T> {
    try {
      const headers: Record<string, string> = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GitHub-Issue-Search-App'
      }

      // 如果用户已登录，添加认证头
      const token = githubAuth.getToken()
      if (token) {
        headers['Authorization'] = `token ${token}`
      }

      const response = await fetch(url, { headers })

      // 更新速率限制信息
      this.rateLimitRemaining = parseInt(response.headers.get('X-RateLimit-Remaining') || '0')
      this.rateLimitReset = parseInt(response.headers.get('X-RateLimit-Reset') || '0')

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('API 速率限制已超出，请稍后再试')
        }
        if (response.status === 422) {
          throw new Error('搜索查询无效')
        }
        throw new Error(`请求失败: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('网络请求失败')
    }
  }

  async searchIssues(params: SearchParams): Promise<SearchResponse> {
    const searchParams = new URLSearchParams({
      q: params.query,
      sort: params.sort || 'created',
      order: params.order || 'desc',
      per_page: (params.per_page || 30).toString(),
      page: (params.page || 1).toString()
    })

    const url = `${GITHUB_API_BASE}/search/issues?${searchParams}`
    return this.makeRequest<SearchResponse>(url)
  }

  getRateLimitInfo() {
    return {
      remaining: this.rateLimitRemaining,
      reset: this.rateLimitReset
    }
  }

  isRateLimited(): boolean {
    return this.rateLimitRemaining <= 0
  }

  getTimeUntilReset(): number {
    const now = Math.floor(Date.now() / 1000)
    return Math.max(0, this.rateLimitReset - now)
  }
}

export const githubAPI = GitHubAPI.getInstance()
