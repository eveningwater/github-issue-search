import { createMemo, Show } from 'solid-js'
import { SearchState } from '../types'
import IssueCard from './IssueCard'
import { AlertCircle, Loader2, Search } from 'lucide-solid'

interface SearchResultsProps {
  state: SearchState
  onLoadMore: () => void
}

const SearchResults = (props: SearchResultsProps) => {
  const hasResults = createMemo(() => props.state.results.length > 0)
  const showLoadMore = createMemo(() => 
    hasResults() && props.state.hasMore && !props.state.loading
  )


  return (
    <div class="w-full max-w-6xl mx-auto px-4">
      <Show when={props.state.query && !props.state.loading && !props.state.error}>
        <div class="mb-6 text-center">
          <h2 class="text-2xl font-bold text-gray-800 mb-2">
            搜索结果
          </h2>
          <p class="text-gray-600">
            找到 <span class="text-orange-500 font-semibold">{props.state.totalCount.toLocaleString()}</span> 个相关 Issue
            {props.state.results.length < props.state.totalCount && (
              <span class="text-gray-500">
                （显示前 {props.state.results.length} 个）
              </span>
            )}
          </p>
        </div>
      </Show>

      <Show when={props.state.loading && props.state.results.length === 0}>
        <div class="flex flex-col items-center justify-center py-20">
          <Loader2 class="w-12 h-12 text-orange-500 animate-spin mb-4" />
          <p class="text-lg text-gray-600">正在搜索...</p>
        </div>
      </Show>

      <Show when={props.state.error}>
        <div class="flex flex-col items-center justify-center py-20">
          <AlertCircle class="w-12 h-12 text-red-500 mb-4" />
          <p class="text-lg text-red-500 mb-2">搜索失败</p>
          <p class="text-gray-500 text-center max-w-md">
            {props.state.error}
          </p>
        </div>
      </Show>

      <Show when={props.state.query && !hasResults() && !props.state.loading && !props.state.error}>
        <div class="flex flex-col items-center justify-center py-20">
          <Search class="w-12 h-12 text-gray-400 mb-4" />
          <p class="text-lg text-gray-600 mb-2">未找到相关结果</p>
          <p class="text-gray-500 text-center max-w-md">
            尝试使用不同的关键词或检查拼写
          </p>
        </div>
      </Show>

      <Show when={hasResults()}>
        <div class="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {props.state.results.map((issue, index) => (
            <div class="fade-in-up">
              <IssueCard issue={issue} index={index} />
            </div>
          ))}
        </div>

        <Show when={showLoadMore()}>
          <div class="flex justify-center mt-8">
            <button
              onClick={props.onLoadMore}
              class="px-8 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 hover:shadow-md"
            >
              加载更多
            </button>
          </div>
        </Show>

        <Show when={props.state.loading && props.state.results.length > 0}>
          <div class="flex justify-center mt-8">
            <div class="flex items-center space-x-2 text-gray-500">
              <Loader2 class="w-5 h-5 animate-spin" />
              <span>加载更多结果...</span>
            </div>
          </div>
        </Show>
      </Show>
    </div>
  )
}

export default SearchResults
