import { createEffect, onCleanup, onMount } from 'solid-js'
import * as THREE from 'three'

const ThreeBackground = () => {
  let containerRef: HTMLDivElement | undefined
  let scene: THREE.Scene
  let camera: THREE.PerspectiveCamera
  let renderer: THREE.WebGLRenderer
  let particles: THREE.Points
  let animationId: number

  onMount(() => {
    if (!containerRef) return

    // 创建场景
    scene = new THREE.Scene()

    // 创建相机
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.z = 5

    // 创建渲染器
    renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.appendChild(renderer.domElement)

    // 创建粒子系统
    createParticleSystem()

    // 开始动画循环
    animate()

    // 监听窗口大小变化
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    onCleanup(() => {
      window.removeEventListener('resize', handleResize)
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
      if (renderer) {
        renderer.dispose()
      }
    })
  })

  const createParticleSystem = () => {
    const particleCount = 2000
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      // 位置
      positions[i3] = (Math.random() - 0.5) * 20
      positions[i3 + 1] = (Math.random() - 0.5) * 20
      positions[i3 + 2] = (Math.random() - 0.5) * 20

      // 颜色 - 渐变蓝色调
      const color = new THREE.Color()
      color.setHSL(0.6 + Math.random() * 0.2, 0.8, 0.5 + Math.random() * 0.3)
      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b

      // 大小
      sizes[i] = Math.random() * 3 + 1
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const material = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    })

    particles = new THREE.Points(geometry, material)
    scene.add(particles)
  }

  const animate = () => {
    animationId = requestAnimationFrame(animate)

    if (particles) {
      // 旋转粒子系统
      particles.rotation.x += 0.0005
      particles.rotation.y += 0.001

      // 更新粒子位置
      const positions = particles.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += 0.001 // 向下移动
        if (positions[i + 1] > 10) {
          positions[i + 1] = -10
        }
      }
      particles.geometry.attributes.position.needsUpdate = true
    }

    renderer.render(scene, camera)
  }

  return (
    <div 
      ref={containerRef} 
      class="fixed inset-0 -z-10"
      style="pointer-events: none;"
    />
  )
}

export default ThreeBackground
