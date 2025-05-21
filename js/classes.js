class Sprite {
    constructor({
      position,
      imageSrc,
      scale = 1,
      framesMax = 1,
      offset = { x: 0, y: 0 }
    }) {
      this.position = position
      this.width = 50
      this.height = 150
      this.image = new Image()
      this.image.src = imageSrc
      this.scale = scale
      this.framesMax = framesMax
      this.framesCurrent = 0
      this.framesElapsed = 0
      this.framesHold = 5
      this.offset = offset
    }
  
    draw() {
      c.drawImage(
        this.image,
        this.framesCurrent * (this.image.width / this.framesMax),
        0,
        this.image.width / this.framesMax,
        this.image.height,
        this.position.x - this.offset.x,
        this.position.y - this.offset.y,
        (this.image.width / this.framesMax) * this.scale,
        this.image.height * this.scale
      )
    }
  
    animateFrames() {
      this.framesElapsed++
  
      if (this.framesElapsed % this.framesHold === 0) {
        if (this.framesCurrent < this.framesMax - 1) {
          this.framesCurrent++
        } else {
          this.framesCurrent = 0
        }
      }
    }
  
    update() {
      this.draw()
      this.animateFrames()
    }
  }
  
  class Fighter extends Sprite {
    constructor({
      position,
      velocity,
      color = 'red',
      imageSrc,
      scale = 1,
      framesMax = 1,
      offset = { x: 0, y: 0 },
      sprites,
      attackBox = { offset: {}, width: undefined, height: undefined }
    }) {
      super({
        position,
        imageSrc,
        scale,
        framesMax,
        offset
      })
  
      this.velocity = velocity
      this.width = 50
      this.height = 150
      this.lastKey
      this.attackBox = {
        position: {
          x: this.position.x,
          y: this.position.y
        },
        offset: attackBox.offset,
        width: attackBox.width,
        height: attackBox.height
      }
      this.color = color
      this.isAttacking
      this.health = 100
      this.framesCurrent = 0
      this.framesElapsed = 0
      this.framesHold = 5
      this.sprites = sprites
      this.dead = false
      this.projectiles = []
      this.blastCooldown = 3000 // 3 secondi in millisecondi
      this.lastBlast = 0
  
      for (const sprite in this.sprites) {
        sprites[sprite].image = new Image()
        sprites[sprite].image.src = sprites[sprite].imageSrc
      }
    }
  
    update() {
      this.draw()
      if (!this.dead) this.animateFrames()
  
      // attack boxes
      this.attackBox.position.x = this.position.x + this.attackBox.offset.x
      this.attackBox.position.y = this.position.y + this.attackBox.offset.y
  
      // Aggiorna e disegna i proiettili
      this.projectiles = this.projectiles.filter(p => p.active)
      this.projectiles.forEach(p => p.update())
  
      this.position.x += this.velocity.x
      this.position.y += this.velocity.y
  
      // gravity function
      if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
        this.velocity.y = 0
        this.position.y = 330
      } else this.velocity.y += gravity
    }
  
    attack() {
      if (this.dead) return
      this.isAttacking = true
      this.switchSprite('attack1') // Mostra animazione attack1
    }

    blast() {
      if (this.dead) return

      const now = Date.now()
      if (now - this.lastBlast < this.blastCooldown) return

      this.lastBlast = now
      this.switchSprite('attack3')

      const direction = this.color === 'blue' ? -1 : 1
      const offsetX = direction === 1 ? this.width : -50

      // Passa le sprite di attack3 al proiettile
      this.projectiles.push(
        new Projectile({
          position: {
            x: this.position.x + offsetX,
            y: this.position.y + this.height / 2 - 25
          },
          velocity: {
            x: 10 * direction,
            y: 0
          },
          color: 'yellow',
          size: 50,
          sprites: this.sprites.attack3 // <-- aggiungi questa riga
        })
      )
    }
  
    takeHit(damage = 20) {
      this.health -= damage

      if (this.health <= 0) {
        this.switchSprite('death')
      } else this.switchSprite('takeHit')
    }
  
    switchSprite(sprite) {
      if (this.image === this.sprites.death.image) {
        if (this.framesCurrent === this.sprites.death.framesMax - 1)
          this.dead = true
        return
      }
  
      // overriding all other animations with the attack animation
      if (
        this.image === this.sprites.attack1.image &&
        this.framesCurrent < this.sprites.attack1.framesMax - 1
      )
        return
  
      // override when fighter gets hit
      if (
        this.image === this.sprites.takeHit.image &&
        this.framesCurrent < this.sprites.takeHit.framesMax - 1
      )
        return
  
      switch (sprite) {
        case 'idle':
          if (this.image !== this.sprites.idle.image) {
            this.image = this.sprites.idle.image
            this.framesMax = this.sprites.idle.framesMax
            this.framesCurrent = 0
          }
          break
        case 'run':
          if (this.image !== this.sprites.run.image) {
            this.image = this.sprites.run.image
            this.framesMax = this.sprites.run.framesMax
            this.framesCurrent = 0
          }
          break
        case 'jump':
          if (this.image !== this.sprites.jump.image) {
            this.image = this.sprites.jump.image
            this.framesMax = this.sprites.jump.framesMax
            this.framesCurrent = 0
          }
          break
  
        case 'fall':
          if (this.image !== this.sprites.fall.image) {
            this.image = this.sprites.fall.image
            this.framesMax = this.sprites.fall.framesMax
            this.framesCurrent = 0
          }
          break
  
        case 'attack1':
          if (this.image !== this.sprites.attack1.image) {
            this.image = this.sprites.attack1.image
            this.framesMax = this.sprites.attack1.framesMax
            this.framesCurrent = 0
          }
          break
  
        case 'takeHit':
          if (this.image !== this.sprites.takeHit.image) {
            this.image = this.sprites.takeHit.image
            this.framesMax = this.sprites.takeHit.framesMax
            this.framesCurrent = 0
          }
          break
  
        case 'death':
          if (this.image !== this.sprites.death.image) {
            this.image = this.sprites.death.image
            this.framesMax = this.sprites.death.framesMax
            this.framesCurrent = 0
          }
          break
      }
    }
  }
  
  class Projectile {
    constructor({ position, velocity, color = 'yellow', size = 50, sprites }) {
      this.position = { ...position }
      this.velocity = velocity
      this.size = size
      this.color = color
      this.active = true

      // Sprite animazione
      this.sprites = sprites
      if (sprites) {
        this.image = new Image()
        this.image.src = sprites.imageSrc
        this.framesMax = sprites.framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
      }
    }
  
    draw() {
      if (this.sprites) {
        // Disegna il frame corrente dell'animazione attack3
        c.drawImage(
          this.image,
          (this.image.width / this.framesMax) * this.framesCurrent,
          0,
          this.image.width / this.framesMax,
          this.image.height,
          this.position.x,
          this.position.y,
          this.size,
          this.size
        )
      } else {
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, this.size, this.size)
      }
    }
  
    update() {
      this.position.x += this.velocity.x
      this.position.y += this.velocity.y

      if (this.sprites) {
        this.framesElapsed++
        if (this.framesElapsed % this.framesHold === 0) {
          this.framesCurrent = (this.framesCurrent + 1) % this.framesMax
        }
      }

      this.draw()
      // Disattiva il proiettile se esce dallo schermo
      if (this.position.x > canvas.width || this.position.x < 0) {
        this.active = false
      }
    }
  }
