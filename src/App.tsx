import { createEffect, onMount } from 'solid-js'
import ThreeBackground from './components/ThreeBackground'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import SearchResults from './components/SearchResults'
import Footer from './components/Footer'
import AuthStatus from './components/AuthStatus'
import DisclaimerAlert from './components/DisclaimerAlert'
import { useSearch } from './hooks/useSearch'
import { useAuth } from './hooks/useAuth'

const App = () => {
  const { state, search, loadMore } = useSearch()
  const { handleCallback } = useAuth()

  onMount(() => {
    // 处理OAuth回调
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const state = urlParams.get('state')
    
    if (code && state) {
      handleCallback(code, state)
      // 清理URL参数
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  })

  createEffect(() => {
    // 添加页面加载动画
    document.body.style.opacity = '0'
    setTimeout(() => {
      document.body.style.transition = 'opacity 0.5s ease-in-out'
      document.body.style.opacity = '1'
    }, 100)
  })

  return (
    <div class="min-h-screen relative">
      {/* Three.js 背景 */}
      <ThreeBackground />
      
      {/* 使用声明提示 */}
      <DisclaimerAlert />
      
      {/* 头部 */}
      <Header />
      
      {/* 主要内容 */}
      <main class="relative z-10 pt-24 pb-8">
        {/* 英雄区域 */}
        <section class="text-center py-20 px-4">
          <div class="max-w-4xl mx-auto">
            <h1 class="text-4xl md:text-5xl font-bold text-gray-800 mb-6 fade-in-up">
              探索
              <span class="text-orange-500">
                GitHub
              </span>
              <br />
              的无限可能
            </h1>
            <p class="text-lg text-gray-600 mb-12 fade-in-up" style="animation-delay: 0.2s;">
              发现开源项目中的 Issues 和 Pull Requests，让协作变得更加高效
            </p>
            
            {/* 搜索栏 */}
            <div class="fade-in-up" style="animation-delay: 0.4s;">
              <SearchBar 
                onSearch={search}
                loading={state().loading}
                placeholder="搜索 Issues，例如：bug、feature、help wanted..."
              />
            </div>
          </div>
        </section>

        {/* 搜索结果 */}
        <section class="py-12">
          <SearchResults 
            state={state()}
            onLoadMore={loadMore}
          />
        </section>
      </main>

      {/* 页脚 */}
      <Footer />

      {/* 认证状态指示器 */}
      <AuthStatus />

      {/* 滚动到顶部按钮 */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        class="fixed bottom-8 right-8 p-3 bg-orange-500 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 z-50"
        style="opacity: 0; transform: translateY(20px);"
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '1'
          e.currentTarget.style.transform = 'translateY(0) scale(1.05)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '0.8'
          e.currentTarget.style.transform = 'translateY(0) scale(1)'
        }}
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  )
}

export default App
