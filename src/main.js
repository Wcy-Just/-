import './style.css'
import {
  CONFIG,
  gameState,
  keys,
  resetGame,
  setState,
  setAnimationId
} from './game.js'
import { render } from './renderer.js'
import { update } from './logic.js'

// 获取 DOM 元素
const canvas = document.getElementById('gameCanvas')
const ctx = canvas.getContext('2d')
const startScreen = document.getElementById('startScreen')
const gameOverScreen = document.getElementById('gameOverScreen')
const hud = document.getElementById('hud')
const startBtn = document.getElementById('startBtn')
const restartBtn = document.getElementById('restartBtn')
const scoreDisplay = document.getElementById('score')
const livesDisplay = document.getElementById('lives')
const finalScoreDisplay = document.getElementById('finalScore')

// 初始化 Canvas 尺寸
canvas.width = CONFIG.CANVAS_WIDTH
canvas.height = CONFIG.CANVAS_HEIGHT

/**
 * 更新分数显示
 */
function updateScoreDisplay() {
  scoreDisplay.textContent = gameState.score
}

/**
 * 更新生命值显示
 */
function updateLivesDisplay() {
  const lives = Math.max(0, Math.min(gameState.lives, CONFIG.MAX_LIVES))
  livesDisplay.textContent = '❤'.repeat(lives) + '🖤'.repeat(Math.max(0, CONFIG.MAX_LIVES - lives))
}

/**
 * 游戏结束处理
 */
function handleGameOver() {
  setState('gameover')
  finalScoreDisplay.textContent = gameState.score
  gameOverScreen.classList.remove('hidden')
  hud.classList.add('hidden')
  if (gameState.animationId) {
    cancelAnimationFrame(gameState.animationId)
  }
}

/**
 * 游戏主循环
 */
function gameLoop() {
  if (gameState.state !== 'playing') return
  
  // 更新游戏逻辑
  update(updateScoreDisplay, updateLivesDisplay, handleGameOver)
  
  // 渲染游戏画面
  render(ctx)
  
  // 继续下一帧
  const id = requestAnimationFrame(gameLoop)
  setAnimationId(id)
}

/**
 * 开始游戏
 */
function startGame() {
  resetGame()
  setState('playing')
  
  updateScoreDisplay()
  updateLivesDisplay()
  
  startScreen.classList.add('hidden')
  gameOverScreen.classList.add('hidden')
  hud.classList.remove('hidden')
  
  gameLoop()
}

// 键盘事件监听
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') keys.left = true
  if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') keys.right = true
  if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') keys.up = true
  if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') keys.down = true
  if (e.key === ' ') {
    e.preventDefault()
    keys.space = true
  }
})

document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') keys.left = false
  if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') keys.right = false
  if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') keys.up = false
  if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') keys.down = false
  if (e.key === ' ') keys.space = false
})

// 按钮事件监听
startBtn.addEventListener('click', startGame)
restartBtn.addEventListener('click', startGame)

// 初始渲染背景
ctx.fillStyle = '#1e1e1e'
ctx.fillRect(0, 0, canvas.width, canvas.height)
