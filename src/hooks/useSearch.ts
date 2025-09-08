import { createSignal } from 'solid-js'
import { githubAPI } from '../services/githubApi'
import { SearchState, SearchParams, GitHubIssue } from '../types'

export const useSearch = () => {
  const [state, setState] = createSignal<SearchState>({
    query: '',
    results: [],
    loading: false,
    error: null,
    totalCount: 0,
    currentPage: 1,
    hasMore: false
  })

  const search = async (query: string, page = 1) => {
    if (!query.trim()) {
      setState(prev => ({
        ...prev,
        query: '',
        results: [],
        error: null,
        totalCount: 0,
        currentPage: 1,
        hasMore: false
      }))
      return
    }

    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      query
    }))

    try {
      const params: SearchParams = {
        query: `is:issue ${query}`,
        sort: 'created',
        order: 'desc',
        per_page: 30,
        page
      }

      const response = await githubAPI.searchIssues(params)
      
      // 处理 API 返回的数据，添加缺失的 repository 信息
      const processedItems: GitHubIssue[] = response.items.map(item => ({
        ...item,
        repository: {
          name: item.repository_url.split('/repos/')[1]?.split('/')[1] || 'Unknown',
          full_name: item.repository_url.split('/repos/')[1] || 'Unknown',
          html_url: item.repository_url
        }
      }))
      
      setState(prev => ({
        ...prev,
        loading: false,
        results: page === 1 ? processedItems : [...prev.results, ...processedItems],
        totalCount: response.total_count,
        currentPage: page,
        hasMore: response.items.length === 30 && prev.results.length + response.items.length < response.total_count,
        error: null
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : '搜索失败',
        results: page === 1 ? [] : prev.results,
        hasMore: false
      }))
    }
  }

  const loadMore = () => {
    const currentState = state()
    if (currentState.hasMore && !currentState.loading) {
      search(currentState.query, currentState.currentPage + 1)
    }
  }

  const clearResults = () => {
    setState(prev => ({
      ...prev,
      query: '',
      results: [],
      error: null,
      totalCount: 0,
      currentPage: 1,
      hasMore: false
    }))
  }

  return {
    state,
    search,
    loadMore,
    clearResults
  }
}
