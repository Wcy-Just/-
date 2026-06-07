import { CONFIG, player, bullets, enemies, particles } from './game.js'

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
 * 绘制玩家飞船
 * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
 */
export function drawPlayer(ctx) {
  if (player.invincible && Math.floor(Date.now() / 100) % 2 === 0) {
    return
  }
  
  ctx.save()
  
  // 飞船主体
  ctx.fillStyle = player.color
  ctx.beginPath()
  ctx.moveTo(player.x, player.y - 20)
  ctx.lineTo(player.x - 25, player.y + 20)
  ctx.lineTo(player.x + 25, player.y + 20)
  ctx.closePath()
  ctx.fill()
  
  // 飞船边框
  ctx.strokeStyle = '#66d9ef'
  ctx.lineWidth = 3
  ctx.stroke()
  
  // 驾驶舱
  ctx.fillStyle = '#1e1e1e'
  ctx.beginPath()
  ctx.arc(player.x, player.y, 8, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#4ec9b0'
  ctx.beginPath()
  ctx.arc(player.x, player.y, 5, 0, Math.PI * 2)
  ctx.fill()
  
  // 引擎火焰
  ctx.fillStyle = '#ff6b35'
  ctx.beginPath()
  ctx.moveTo(player.x - 10, player.y + 20)
  ctx.lineTo(player.x, player.y + 35 + Math.random() * 10)
  ctx.lineTo(player.x + 10, player.y + 20)
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
 * 绘制敌人
 * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
 */
export function drawEnemies(ctx) {
  enemies.value.forEach(enemy => {
    ctx.font = '36px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(enemy.emoji, enemy.x, enemy.y)
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
  drawPlayer(ctx)
}
