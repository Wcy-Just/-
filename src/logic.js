import {
  CONFIG,
  keys,
  player,
  bullets,
  enemies,
  particles,
  bulletTypes,
  enemyTypes,
  gameState,
  setAnimationId,
  setLives
} from './game.js'

/**
 * 更新玩家状态
 */
export function updatePlayer() {
  // 移动控制
  if (keys.left && player.x > 30) player.x -= CONFIG.PLAYER_SPEED
  if (keys.right && player.x < CONFIG.CANVAS_WIDTH - 30) player.x += CONFIG.PLAYER_SPEED
  if (keys.up && player.y > 80) player.y -= CONFIG.PLAYER_SPEED
  if (keys.down && player.y < CONFIG.CANVAS_HEIGHT - 30) player.y += CONFIG.PLAYER_SPEED
  
  // 射击控制
  if (keys.space && Date.now() - player.lastShot > CONFIG.SHOOT_DELAY) {
    bullets.value.push({
      x: player.x,
      y: player.y - 25,
      char: bulletTypes[Math.floor(Math.random() * bulletTypes.length)],
      speed: CONFIG.BULLET_SPEED
    })
    player.lastShot = Date.now()
  }
  
  // 无敌时间检查
  if (player.invincible && Date.now() > player.invincibleTime) {
    player.invincible = false
  }
}

/**
 * 更新子弹位置
 */
export function updateBullets() {
  bullets.value = bullets.value.filter(b => {
    b.y -= b.speed
    return b.y > -20
  })
}

/**
 * 更新敌人位置并生成新敌人
 */
export function updateEnemies() {
  // 随机生成敌人
  if (Math.random() < CONFIG.ENEMY_SPAWN_RATE) {
    const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)]
    enemies.value.push({
      x: Math.random() * (CONFIG.CANVAS_WIDTH - 60) + 30,
      y: -40,
      ...type
    })
  }
  
  // 移动敌人
  enemies.value = enemies.value.filter(e => {
    e.y += e.speed
    return e.y < CONFIG.CANVAS_HEIGHT + 50
  })
}

/**
 * 更新粒子效果
 */
export function updateParticles() {
  particles.value = particles.value.filter(p => {
    p.x += p.vx
    p.y += p.vy
    p.life -= 0.02
    return p.life > 0
  })
}

/**
 * 创建爆炸粒子效果
 * @param {number} x - X 坐标
 * @param {number} y - Y 坐标
 * @param {string} color - 粒子颜色
 */
export function createExplosion(x, y, color) {
  for (let i = 0; i < 15; i++) {
    particles.value.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8,
      size: Math.random() * 6 + 2,
      color: color,
      life: 1
    })
  }
}

/**
 * 碰撞检测
 * @param {Function} updateScore - 更新分数回调
 * @param {Function} updateLives - 更新生命回调
 * @param {Function} gameOver - 游戏结束回调
 */
export function checkCollisions(updateScore, updateLives, gameOver) {
  // 子弹与敌人碰撞
  bullets.value = bullets.value.filter(bullet => {
    let hit = false
    enemies.value = enemies.value.filter(enemy => {
      const dist = Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y)
      if (dist < 30) {
        enemy.health--
        hit = true
        if (enemy.health <= 0) {
          gameState.score += enemy.points
          updateScore()
          createExplosion(enemy.x, enemy.y, enemy.color)
          return false
        }
      }
      return true
    })
    return !hit
  })
  
  // 玩家与敌人碰撞
  if (!player.invincible) {
    enemies.value = enemies.value.filter(enemy => {
      const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)
      if (dist < 40) {
        gameState.lives--
        updateLives()
        createExplosion(enemy.x, enemy.y, '#ff0000')
        player.invincible = true
        player.invincibleTime = Date.now() + CONFIG.INVINCIBLE_TIME
        if (gameState.lives <= 0) {
          gameOver()
        }
        return false
      }
      return true
    })
  }
}

/**
 * 统一更新入口
 * @param {Function} updateScore - 更新分数回调
 * @param {Function} updateLives - 更新生命回调
 * @param {Function} gameOver - 游戏结束回调
 */
export function update(updateScore, updateLives, gameOver) {
  updatePlayer()
  updateBullets()
  updateEnemies()
  updateParticles()
  checkCollisions(updateScore, updateLives, gameOver)
}
