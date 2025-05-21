const canvas = document.getElementById('gameCanvas')
const c = canvas.getContext('2d')
canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './img/background.png'
})

const shop = new Sprite({
  position: {
    x: 600,
    y: 128
  },
  imageSrc: './img/shop.png',
  scale: 2.75,
  framesMax: 6
})

const player = new Fighter({
  position: {
    x: 0,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: 0,
    y: 0
  },
  imageSrc: './img/samuraiMack/Idle.png',
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157
  },
  sprites: {
    idle: {
      imageSrc: './img/samuraiMack/Idle.png',
      framesMax: 8
    },
    run: {
      imageSrc: './img/samuraiMack/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/samuraiMack/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './img/samuraiMack/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './img/samuraiMack/Attack1.png',
      framesMax: 6
    },
    attack3: {
      imageSrc: './img/samuraiMack/Attack3.png',
      framesMax: 8
    },
    takeHit: {
      imageSrc: './img/samuraiMack/Take Hit - white silhouette.png',
      framesMax: 4
    },
    death: {
      imageSrc: './img/samuraiMack/Death.png',
      framesMax: 6
    }
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50
    },
    width: 160,
    height: 50
  }
})

const enemy = new Fighter({
  position: {
    x: 400,
    y: 100
  },
  velocity: {
    x: 0,
    y: 0
  },
  color: 'blue',
  offset: {
    x: -50,
    y: 0
  },
  imageSrc: './img/kenji/Idle.png',
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 167
  },
  sprites: {
    idle: {
      imageSrc: './img/kenji/Idle.png',
      framesMax: 4
    },
    run: {
      imageSrc: './img/kenji/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/kenji/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './img/kenji/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './img/kenji/Attack1.png',
      framesMax: 4
    },
    attack3: {
      imageSrc: './img/kenji/Attack3.png',
      framesMax: 4
    },
    takeHit: {
      imageSrc: './img/kenji/Take hit.png',
      framesMax: 3
    },
    death: {
      imageSrc: './img/kenji/Death.png',
      framesMax: 7
    }
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50
    },
    width: 170,
    height: 50
  }
})

console.log(player)

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  }
}

decreaseTimer()

let gamePaused = false

function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId)
  document.getElementById('displayText').style.display = 'flex'
  document.getElementById('restartBtn').style.display = 'none'

  let winnerText = ''
  if (player.health === enemy.health) {
    winnerText = 'Tie'
  } else if (player.health > enemy.health) {
    winnerText = 'Player 1 wins'
  } else {
    winnerText = 'Player 2 wins'
  }

  // Countdown di 5 secondi
  let countdown = 5
  document.getElementById('displayText').innerHTML = `${winnerText}<br>Restart in ${countdown}...`
  const countdownInterval = setInterval(() => {
    countdown--
    document.getElementById('displayText').innerHTML = `${winnerText}<br>Restart in ${countdown}...`
    if (countdown === 0) {
      clearInterval(countdownInterval)
      gamePaused = true
      document.getElementById('restartBtn').style.display = 'block'
      document.getElementById('displayText').innerHTML = winnerText
    }
  }, 1000)
}

// Quando il timer arriva a 0:
if (timer === 0) {
  determineWinner({ player, enemy, timerId })
}

function animate() {
  if (gamePaused) return // Blocca tutto se il gioco è in pausa

  window.requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  background.update()
  shop.update()
  c.fillStyle = 'rgba(255, 255, 255, 0.15)'
  c.fillRect(0, 0, canvas.width, canvas.height)

  // --- Barra ricarica blast ---
  drawBlastBars()

  player.update()
  enemy.update()

  player.velocity.x = 0
  enemy.velocity.x = 0

  // player movement
  if (keys.a.pressed && player.lastKey === 'a') {
    if (player.position.x > 0) { // Limite sinistro
      player.velocity.x = -5
      player.switchSprite('run')
    }
  } else if (keys.d.pressed && player.lastKey === 'd') {
    if (player.position.x + player.width < canvas.width) { // Limite destro
      player.velocity.x = 5
      player.switchSprite('run')
    }
  } else {
    player.switchSprite('idle')
  }

  // jumping
  if (player.velocity.y < 0) {
    player.switchSprite('jump')
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall')
  }

  // Enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    if (enemy.position.x > 0) { // Limite sinistro
      enemy.velocity.x = -5
      enemy.switchSprite('run')
    }
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    if (enemy.position.x + enemy.width < canvas.width) { // Limite destro
      enemy.velocity.x = 5
      enemy.switchSprite('run')
    }
  } else {
    enemy.switchSprite('idle')
  }

  // jumping
  if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump')
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall')
  }

  // detect for collision & enemy gets hit
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy
    }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    enemy.takeHit()
    player.isAttacking = false

    gsap.to('#enemyHealth', {
      width: enemy.health + '%'
    })
  }

  // if player misses
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false
  }

  // this is where our player gets hit
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    player.takeHit()
    enemy.isAttacking = false

    gsap.to('#playerHealth', {
      width: player.health + '%'
    })
  }

  // if player misses
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false
  }

  // Collisione proiettili player -> enemy
  player.projectiles.forEach((projectile) => {
    if (
      projectile.active &&
      projectile.position.x + projectile.size > enemy.position.x &&
      projectile.position.x < enemy.position.x + enemy.width &&
      projectile.position.y + projectile.size > enemy.position.y &&
      projectile.position.y < enemy.position.y + enemy.height
    ) {
      enemy.takeHit(30) // 30 punti danno per il blast
      projectile.active = false
      gsap.to('#enemyHealth', {
        width: enemy.health + '%'
      })
    }
  })

  // Collisione proiettili enemy -> player
  enemy.projectiles.forEach((projectile) => {
    if (
      projectile.active &&
      projectile.position.x + projectile.size > player.position.x &&
      projectile.position.x < player.position.x + player.width &&
      projectile.position.y + projectile.size > player.position.y &&
      projectile.position.y < player.position.y + player.height
    ) {
      player.takeHit(30) // 30 punti danno per il blast
      projectile.active = false
      gsap.to('#playerHealth', {
        width: player.health + '%'
      })
    }
  })

  // end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId })
  }
}

animate()

window.addEventListener('keydown', (event) => {
  if (!player.dead) {
    switch (event.key) {
      case 'd':
        keys.d.pressed = true
        player.lastKey = 'd'
        break
      case 'a':
        keys.a.pressed = true
        player.lastKey = 'a'
        break
      case 'w':
        if (player.velocity.y === 0) player.velocity.y = -20
        break
      case ' ': // SPAZIO per attacco normale player 1
        player.attack()
        break
      case 'Shift': // Blast player 1
        player.blast()
        break
    }
  }

  if (!enemy.dead) {
    switch (event.key) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = true
        enemy.lastKey = 'ArrowRight'
        break
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        enemy.lastKey = 'ArrowLeft'
        break
      case 'ArrowUp':
        if (enemy.velocity.y === 0) enemy.velocity.y = -20
        break
      case 'ArrowDown': // FRECCIA IN BASSO per attacco normale player 2
        enemy.attack()
        break
      case '.': // Blast player 2
        enemy.blast()
        break
    }
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break
  }
})

function drawBlastBars() {
  // Parametri barra player
  const barWidth = 200
  const barHeight = 8
  const barX = 50
  const barY = 62 // Sotto la barra della vita player

  // Parametri barra enemy
  const barWidthEnemy = 200
  const barHeightEnemy = 8
  const barXEnemy = canvas.width - barWidth - 50
  const barYEnemy = 62 // Sotto la barra della vita enemy

  // Calcolo percentuale ricarica
  const now = Date.now()
  const playerElapsed = Math.min(now - player.lastBlast, player.blastCooldown)
  const playerPercent = playerElapsed / player.blastCooldown

  const enemyElapsed = Math.min(now - enemy.lastBlast, enemy.blastCooldown)
  const enemyPercent = enemyElapsed / enemy.blastCooldown

  // Player blast bar
  c.save()
  c.globalAlpha = 0.85
  c.fillStyle = "#222"
  c.fillRect(barX, barY, barWidth, barHeight)
  c.fillStyle = "#facc15"
  c.fillRect(barX, barY, barWidth * playerPercent, barHeight)
  c.strokeStyle = "#fff"
  c.lineWidth = 2
  c.strokeRect(barX, barY, barWidth, barHeight)
  c.restore()

  // Enemy blast bar
  c.save()
  c.globalAlpha = 0.85
  c.fillStyle = "#222"
  c.fillRect(barXEnemy, barYEnemy, barWidthEnemy, barHeightEnemy)
  c.fillStyle = "#facc15"
  c.fillRect(barXEnemy, barYEnemy, barWidthEnemy * enemyPercent, barHeightEnemy)
  c.strokeStyle = "#fff"
  c.lineWidth = 2
  c.strokeRect(barXEnemy, barYEnemy, barWidthEnemy, barHeightEnemy)
  c.restore()
}

document.getElementById('restartBtn').onclick = function() {
  window.location.reload()
}
