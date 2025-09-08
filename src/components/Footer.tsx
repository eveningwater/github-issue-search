import { Github, Heart, ExternalLink } from 'lucide-solid'

const Footer = () => {
  return (
    <footer class="bg-gray-50 border-t border-gray-200 mt-20">
      <div class="max-w-7xl mx-auto px-4 py-12">
        <div class="grid md:grid-cols-4 gap-8">
          <div class="md:col-span-2">
            <div class="flex items-center space-x-3 mb-4">
              <div class="p-2 bg-orange-500 rounded-lg">
                <Github class="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-800">GitHub Issue 搜索</h3>
                <p class="text-sm text-gray-600">探索开源世界的无限可能</p>
              </div>
            </div>
            <p class="text-gray-600 text-sm leading-relaxed max-w-md">
              一个强大的工具，帮助开发者快速发现和探索 GitHub 上的 Issues 和 Pull Requests。
              通过实时搜索和简洁的界面，让开源协作变得更加高效。
            </p>
          </div>

          <div>
            <h4 class="text-gray-800 font-semibold mb-4">功能特性</h4>
            <ul class="space-y-2 text-sm text-gray-600">
              <li>实时搜索</li>
              <li>高级过滤</li>
              <li>响应式设计</li>
              <li>简洁界面</li>
              <li>护眼配色</li>
            </ul>
          </div>

          <div>
            <h4 class="text-gray-800 font-semibold mb-4">技术栈</h4>
            <ul class="space-y-2 text-sm text-gray-600">
              <li>Solid.js</li>
              <li>TypeScript</li>
              <li>Vite</li>
              <li>Three.js</li>
              <li>GitHub API</li>
            </ul>
          </div>
        </div>

        <div class="border-t border-gray-200 mt-8 pt-8">
          <div class="flex flex-col md:flex-row items-center justify-between">
            <div class="flex items-center space-x-1 text-sm text-gray-500 mb-4 md:mb-0">
              <span>Made with</span>
              <Heart class="w-4 h-4 text-red-500" />
              <span>using Solid.js & Three.js</span>
            </div>

            <div class="flex items-center space-x-6">
              <a
                href="https://github.com/eveningwater/github-issue-search/"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-800 transition-colors duration-200"
              >
                <Github class="w-4 h-4" />
                <span>GitHub</span>
                <ExternalLink class="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
