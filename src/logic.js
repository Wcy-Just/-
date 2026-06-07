import {
  CONFIG,
  keys,
  player,
  bullets,
  enemies,
  particles,
  packages,
  bulletTypes,
  enemyTypes,
  packageTypes,
  gameState,
  setAnimationId,
  setLives
} from './game.js'

/**
 * 更新玩家状态
 */
export function updatePlayer() {
  // 移动控制
  if (keys.left && player.x > 40) player.x -= CONFIG.PLAYER_SPEED
  if (keys.right && player.x < CONFIG.CANVAS_WIDTH - 40) player.x += CONFIG.PLAYER_SPEED
  if (keys.up && player.y > 80) player.y -= CONFIG.PLAYER_SPEED
  if (keys.down && player.y < CONFIG.CANVAS_HEIGHT - 40) player.y += CONFIG.PLAYER_SPEED
  
  // 射击控制
  if (keys.space && Date.now() - player.lastShot > CONFIG.SHOOT_DELAY) {
    // 玩家射击
    bullets.value.push({
      x: player.x,
      y: player.y - 25,
      char: bulletTypes[Math.floor(Math.random() * bulletTypes.length)],
      speed: CONFIG.BULLET_SPEED
    })
    
    // 子编辑器也射击（如果有）
    if (player.hasVite) {
      player.subEditors.forEach((sub, index) => {
        bullets.value.push({
          x: sub.x,
          y: sub.y - 20,
          char: index === 0 ? 'vite' : 'build',
          speed: CONFIG.BULLET_SPEED
        })
      })
    }
    
    player.lastShot = Date.now()
  }
  
  // 无敌时间检查
  if (player.invincible && Date.now() > player.invincibleTime) {
    player.invincible = false
  }
  
  // Vite 效果检查
  if (player.hasVite && Date.now() > player.viteEndTime) {
    player.hasVite = false
    player.subEditors = []
  }
  
  // 更新子编辑器位置
  if (player.hasVite) {
    player.subEditors = [
      { x: player.x - 50, y: player.y },
      { x: player.x + 50, y: player.y }
    ]
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
export function updateEnemies(updateLives) {
  // 随机生成敌人
  if (Math.random() < CONFIG.ENEMY_SPAWN_RATE) {
    const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)]
    enemies.value.push({
      x: Math.random() * (CONFIG.CANVAS_WIDTH - 60) + 30,
      y: -40,
      ...type
    })
  }
  
  // 移动敌人并检查逃脱
  enemies.value = enemies.value.filter(e => {
    e.y += e.speed
    
    // 敌人逃脱
    if (e.y > CONFIG.CANVAS_HEIGHT + 30) {
      // 只有 NullPointerException 逃脱才扣血！
      if (e.text === 'NullPointerException') {
        gameState.lives = Math.max(0, gameState.lives - 1)
        updateLives()
      }
      return false
    }
    return true
  })
}

/**
 * 更新 Packages
 */
export function updatePackages() {
  // 随机生成包
  if (Math.random() < CONFIG.PACKAGE_SPAWN_RATE) {
    const type = packageTypes[Math.floor(Math.random() * packageTypes.length)]
    packages.value.push({
      x: Math.random() * (CONFIG.CANVAS_WIDTH - 60) + 30,
      y: -30,
      ...type
    })
  }
  
  // 移动包
  packages.value = packages.value.filter(pkg => {
    pkg.y += 1.5
    return pkg.y < CONFIG.CANVAS_HEIGHT + 30
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
      if (dist < 35) {
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
      if (dist < 45) {
        gameState.lives = Math.max(0, gameState.lives - 1)
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
  
  // 玩家与包碰撞
  packages.value = packages.value.filter(pkg => {
    const dist = Math.hypot(player.x - pkg.x, player.y - pkg.y)
    if (dist < 40) {
      applyPackageEffect(pkg, updateLives)
      createExplosion(pkg.x, pkg.y, pkg.color)
      return false
    }
    return true
  })
  
  // 子编辑器与敌人碰撞（如果有）
  if (player.hasVite) {
    player.subEditors.forEach(sub => {
      enemies.value = enemies.value.filter(enemy => {
        const dist = Math.hypot(sub.x - enemy.x, sub.y - enemy.y)
        if (dist < 35) {
          enemy.health--
          if (enemy.health <= 0) {
            gameState.score += enemy.points
            updateScore()
            createExplosion(enemy.x, enemy.y, enemy.color)
            return false
          }
        }
        return true
      })
    })
  }
}

/**
 * 应用包效果
 * @param {Object} pkg - 包对象
 * @param {Function} updateLives - 更新生命回调
 */
function applyPackageEffect(pkg, updateLives) {
  switch (pkg.effect) {
    case 'vite':
      player.hasVite = true
      player.viteEndTime = Date.now() + pkg.duration
      break
      
    case 'eslint':
      // 清除所有敌人
      enemies.value.forEach(enemy => {
        gameState.score += enemy.points
        createExplosion(enemy.x, enemy.y, enemy.color)
      })
      enemies.value = []
      break
      
    case 'git':
      if (gameState.lives < CONFIG.MAX_LIVES) {
        gameState.lives = Math.min(CONFIG.MAX_LIVES, gameState.lives + 1)
        updateLives()
      }
      break
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
  updateEnemies(updateLives)
  updatePackages()
  updateParticles()
  checkCollisions(updateScore, updateLives, gameOver)
}
