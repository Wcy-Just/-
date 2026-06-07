import { CONFIG, player, bullets, enemies, particles, packages } from './game.js'

/**
 * 绘制网格背景
 * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
 */
export function drawGrid(ctx) {
  ctx.strokeStyle = 'rgba(0, 122, 204, 0.1)'
  ctx.lineWidth = 1
  for (let x = 0; x <= CONFIG.CANVAS_WIDTH; x += 40) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, CONFIG.CANVAS_HEIGHT)
    ctx.stroke()
  }
  for (let y = 0; y <= CONFIG.CANVAS_HEIGHT; y += 40) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(CONFIG.CANVAS_WIDTH, y)
    ctx.stroke()
  }
}

/**
 * 绘制 VS Code 编辑器风格的玩家
 * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
 */
export function drawPlayer(ctx) {
  if (player.invincible && Math.floor(Date.now() / 100) % 2 === 0) {
    return
  }
  
  ctx.save()
  
  // VS Code 窗口主体
  ctx.fillStyle = '#1e1e1e'
  ctx.fillRect(player.x - 30, player.y - 25, 60, 45)
  
  // 标题栏
  ctx.fillStyle = '#2d2d2d'
  ctx.fillRect(player.x - 30, player.y - 25, 60, 12)
  
  // 窗口按钮
  ctx.fillStyle = '#ff5f56'
  ctx.beginPath()
  ctx.arc(player.x - 22, player.y - 19, 3, 0, Math.PI * 2)
  ctx.fill()
  
  ctx.fillStyle = '#ffbd2e'
  ctx.beginPath()
  ctx.arc(player.x - 12, player.y - 19, 3, 0, Math.PI * 2)
  ctx.fill()
  
  ctx.fillStyle = '#27ca3f'
  ctx.beginPath()
  ctx.arc(player.x - 2, player.y - 19, 3, 0, Math.PI * 2)
  ctx.fill()
  
  // VS Code 图标
  ctx.font = '16px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#007acc'
  ctx.fillText('< >', player.x + 15, player.y - 19)
  
  // 编辑器边框
  ctx.strokeStyle = '#007acc'
  ctx.lineWidth = 3
  ctx.strokeRect(player.x - 30, player.y - 25, 60, 45)
  
  // 代码文本
  ctx.font = '8px Courier New'
  ctx.fillStyle = '#d4d4d4'
  ctx.textAlign = 'left'
  ctx.fillText('function ', player.x - 25, player.y - 5)
  ctx.fillStyle = '#4ec9b0'
  ctx.fillText('game', player.x + 2, player.y - 5)
  ctx.fillStyle = '#d4d4d4'
  ctx.fillText('()', player.x + 28, player.y - 5)
  
  ctx.fillStyle = '#d4d4d4'
  ctx.fillText('  shoot();', player.x - 25, player.y + 5)
  
  // 引擎火焰
  ctx.fillStyle = '#ff6b35'
  ctx.beginPath()
  ctx.moveTo(player.x - 15, player.y + 20)
  ctx.lineTo(player.x, player.y + 35 + Math.random() * 10)
  ctx.lineTo(player.x + 15, player.y + 20)
  ctx.closePath()
  ctx.fill()
  
  ctx.restore()
}

/**
 * 绘制子弹
 * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
 */
export function drawBullets(ctx) {
  bullets.value.forEach(bullet => {
    ctx.font = '20px Courier New'
    ctx.textAlign = 'center'
    ctx.fillStyle = '#4ec9b0'
    ctx.fillText(bullet.char, bullet.x, bullet.y)
  })
}

/**
 * 绘制敌人（编程语言关键词）
 * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
 */
export function drawEnemies(ctx) {
  enemies.value.forEach(enemy => {
    let alpha = 1
    
    // 隐身效果
    if (enemy.special === 'invisible') {
      const progress = enemy.y / CONFIG.CANVAS_HEIGHT
      if (progress < enemy.invisibleUntil) {
        alpha = 0.2 + (progress / enemy.invisibleUntil) * 0.3
      }
    }
    
    // 敌人背景
    ctx.fillStyle = enemy.color
    ctx.globalAlpha = alpha * 0.3
    ctx.fillRect(enemy.x - 35, enemy.y - 15, 70, 30)
    
    // 敌人文字
    ctx.globalAlpha = alpha
    ctx.font = 'bold 18px Courier New'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = enemy.color
    ctx.strokeStyle = '#1e1e1e'
    ctx.lineWidth = 3
    ctx.strokeText(enemy.text, enemy.x, enemy.y)
    ctx.fillText(enemy.text, enemy.x, enemy.y)
  })
  ctx.globalAlpha = 1
}

/**
 * 绘制 Packages
 * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
 */
export function drawPackages(ctx) {
  packages.value.forEach(pkg => {
    // 包背景
    ctx.fillStyle = pkg.color
    ctx.globalAlpha = 0.6
    ctx.fillRect(pkg.x - 25, pkg.y - 12, 50, 24)
    
    // 发光效果
    ctx.strokeStyle = pkg.color
    ctx.lineWidth = 2
    ctx.strokeRect(pkg.x - 28, pkg.y - 15, 56, 30)
    
    // 文字
    ctx.globalAlpha = 1
    ctx.font = 'bold 14px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#ffffff'
    ctx.fillText(pkg.text, pkg.x, pkg.y)
  })
}

/**
 * 绘制子编辑器（Vite 效果）
 * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
 */
export function drawSubEditors(ctx) {
  if (!player.hasVite) return
  
  player.subEditors.forEach((sub, index) => {
    const offset = index === 0 ? -50 : 50
    
    // 子编辑器主体
    ctx.save()
    ctx.globalAlpha = 0.7
    ctx.fillStyle = '#1e1e1e'
    ctx.fillRect(sub.x - 20, sub.y - 18, 40, 32)
    
    // 标题栏
    ctx.fillStyle = '#2d2d2d'
    ctx.fillRect(sub.x - 20, sub.y - 18, 40, 8)
    
    // Vite 标识
    ctx.font = '10px Arial'
    ctx.fillStyle = '#646cff'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('V', sub.x + 10, sub.y - 14)
    
    // 边框
    ctx.strokeStyle = '#646cff'
    ctx.lineWidth = 2
    ctx.strokeRect(sub.x - 20, sub.y - 18, 40, 32)
    
    ctx.restore()
  })
}

/**
 * 绘制粒子爆炸效果
 * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
 */
export function drawParticles(ctx) {
  particles.value.forEach(p => {
    ctx.globalAlpha = p.life
    ctx.fillStyle = p.color
    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size)
  })
  ctx.globalAlpha = 1
}

/**
 * 清空画布
 * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
 */
export function clearCanvas(ctx) {
  ctx.fillStyle = '#1e1e1e'
  ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT)
}

/**
 * 统一渲染入口
 * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
 */
export function render(ctx) {
  clearCanvas(ctx)
  drawGrid(ctx)
  drawParticles(ctx)
  drawBullets(ctx)
  drawEnemies(ctx)
  drawPackages(ctx)
  drawSubEditors(ctx)
  drawPlayer(ctx)
}
