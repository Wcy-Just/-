// 游戏配置常量
export const CONFIG = {
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,
  PLAYER_SPEED: 5,
  BULLET_SPEED: 8,
  SHOOT_DELAY: 200,
  INVINCIBLE_TIME: 2000,
  ENEMY_SPAWN_RATE: 0.02,
  INITIAL_LIVES: 3
}

// 游戏状态
export let gameState = {
  state: 'start', // 'start', 'playing', 'gameover'
  score: 0,
  lives: CONFIG.INITIAL_LIVES,
  animationId: null
}

// 键盘状态
export const keys = {
  left: false,
  right: false,
  up: false,
  down: false,
  space: false
}

// 玩家对象
export const player = {
  x: CONFIG.CANVAS_WIDTH / 2,
  y: 500,
  width: 50,
  height: 40,
  color: '#007acc',
  lastShot: 0,
  invincible: false,
  invincibleTime: 0
}

// 游戏对象数组
let _bullets = []
let _enemies = []
let _particles = []

export const bullets = {
  get value() { return _bullets },
  set value(newVal) { _bullets = newVal }
}

export const enemies = {
  get value() { return _enemies },
  set value(newVal) { _enemies = newVal }
}

export const particles = {
  get value() { return _particles },
  set value(newVal) { _particles = newVal }
}

// 武器和敌人类型
export const bulletTypes = ['{', '}', ';', '(', ')', '[', ']']

export const enemyTypes = [
  { emoji: '🐛', color: '#ff6b6b', speed: 2, health: 1, points: 10 },
  { emoji: '🐞', color: '#ffd93d', speed: 1.5, health: 2, points: 20 },
  { emoji: '🕷️', color: '#9b59b6', speed: 3, health: 1, points: 15 },
  { emoji: '🦟', color: '#e74c3c', speed: 4, health: 1, points: 25 }
]

// 重置游戏状态函数
export function resetGame() {
  gameState.score = 0
  gameState.lives = CONFIG.INITIAL_LIVES
  player.x = CONFIG.CANVAS_WIDTH / 2
  player.y = 500
  player.invincible = false
  bullets.value = []
  enemies.value = []
  particles.value = []
}

// 更新游戏状态
export function setState(newState) {
  gameState.state = newState
}

export function setScore(newScore) {
  gameState.score = newScore
}

export function setLives(newLives) {
  gameState.lives = newLives
}

export function setAnimationId(id) {
  gameState.animationId = id
}
