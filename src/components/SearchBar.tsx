import { createSignal, createEffect } from 'solid-js'
import { Search, X, Loader2 } from 'lucide-solid'

interface SearchBarProps {
  onSearch: (query: string) => void
  loading: boolean
  placeholder?: string
}

const SearchBar = (props: SearchBarProps) => {
  const [query, setQuery] = createSignal('')
  const [isFocused, setIsFocused] = createSignal(false)

  let searchTimeout: ReturnType<typeof setTimeout> | undefined

  createEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }
    
    if (query().trim()) {
      searchTimeout = setTimeout(() => {
        props.onSearch(query())
      }, 500) // 防抖延迟
    }
  })

  const handleSubmit = (e: Event) => {
    e.preventDefault()
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }
    props.onSearch(query())
  }

  const handleClear = () => {
    setQuery('')
    props.onSearch('')
  }

  return (
    <div class="w-full max-w-4xl mx-auto px-4">
      <form onSubmit={handleSubmit} class="relative">
        <div 
          class={`relative transition-all duration-300 ${
            isFocused() ? 'transform scale-105' : ''
          }`}
        >
          <div class="absolute flex items-center pointer-events-none" style="left: 4px; top: 19px;z-index: 10;">
            <Search 
              class={`w-6 h-6 transition-colors duration-300 ${
                isFocused() ? 'text-orange-500' : 'text-gray-400'
              }`} 
            />
          </div>
          
          <input
            type="text"
            value={query()}
            onInput={(e) => setQuery(e.currentTarget.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={props.placeholder || '搜索 GitHub Issues...'}
            class="w-full pl-12 pr-12 py-4 text-lg bg-white border-2 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 hover:border-gray-300 transition-all duration-300 input-shadow"
          />
          
          <div class="absolute pr-3 flex items-center" style="top: 9px; right: 4px;">
            {props.loading && (
              <Loader2 class="w-5 h-5 text-orange-500 animate-spin" />
            )}
            {query() && !props.loading && (
              <button
                type="button"
                onClick={handleClear}
                class="p-1.5 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-105 group"
                title="清空搜索"
              >
                <X class="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
              </button>
            )}
          </div>
        </div>
        
        {/* 搜索提示 */}
        <div class="mt-4 text-center">
          <p class="text-sm text-gray-500">
            尝试搜索: <span class="text-orange-500">bug</span>, <span class="text-orange-500">feature</span>, <span class="text-orange-500">help wanted</span>
          </p>
        </div>
      </form>
    </div>
  )
}

export default SearchBar
