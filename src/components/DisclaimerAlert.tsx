import { createSignal, Show } from 'solid-js'
import { AlertTriangle, X, Shield } from 'lucide-solid'

const DisclaimerAlert = () => {
  const hasSeenDisclaimer = typeof window !== 'undefined' ? localStorage.getItem('github-issue-search-disclaimer-seen') : null
  const [showAlert, setShowAlert] = createSignal(hasSeenDisclaimer !== 'true')
  const [dontShowAgain, setDontShowAgain] = createSignal(false)

  const handleClose = (e?: Event) => {
    e?.preventDefault()
    e?.stopPropagation()
    
    
    if (dontShowAgain()) {
      localStorage.setItem('github-issue-search-disclaimer-seen', 'true')
    }
    
    setShowAlert(false)
  }

  const handleBackdropClick = (e: Event) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  const handleDontShowAgain = (e: Event) => {
    setDontShowAgain((e.target as HTMLInputElement).checked)
  }

  
  return (
    <Show when={showAlert()}>
      <div 
        class="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-999 p-4"
        onClick={handleBackdropClick}
      >
        <div 
          class="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-lg shadow-2xl transform transition-all duration-300 scale-100"
          onClick={(e) => e.stopPropagation()}
        >
          <div class="flex items-start space-x-4">
            <div class="flex-shrink-0">
              <div class="p-2 bg-orange-100 rounded-lg">
                <Shield class="w-6 h-6 text-orange-500" />
              </div>
            </div>
            
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-lg font-semibold text-gray-800">使用声明</h3>
                <button
                  onClick={handleClose}
                  class="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  type="button"
                >
                  <X class="w-5 h-5 text-gray-400" />
                </button>
              </div>
              
              <div class="space-y-3">
                <div class="flex items-start space-x-2">
                  <AlertTriangle class="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <p class="text-sm text-gray-600 leading-relaxed">
                    <strong>声明：</strong>本网站数据均来源于官方 GitHub 接口，仅供查找学习，请勿用于其它用途。
                  </p>
                </div>
                
                <div class="flex items-start space-x-2">
                  <AlertTriangle class="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <p class="text-sm text-gray-600 leading-relaxed">
                    <strong>重要提醒：</strong>请不要搜索乱七八糟的数据，违者自负。
                  </p>
                </div>
                
                <div class="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-4">
                  <p class="text-xs text-orange-700">
                    💡 请遵守 GitHub 服务条款，合理使用 API 资源，共同维护良好的开源生态。
                  </p>
                </div>
              </div>
              
              <div class="flex items-center justify-between mt-6">
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dontShowAgain()}
                    onInput={handleDontShowAgain}
                    class="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                  />
                  <span class="text-sm text-gray-600">不再显示此提示</span>
                </label>
                
                <button
                  onClick={handleClose}
                  class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  type="button"
                >
                  我知道了
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Show>
  )
}

export default DisclaimerAlert
