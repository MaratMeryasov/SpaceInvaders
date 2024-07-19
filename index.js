// This file contains the main game logic and functionality.
// It includes the Player class, key event listeners, and the game loop.
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

class Player {
    // Player class represents the player's spaceship.
    // It handles drawing, updating, and movement of the spaceship.
    constructor() {
        // Initialize player properties
        this.velocity = {
            x: 0,
            y: 0
        }

        this.rotation = 0

        // Load spaceship image
        const image = new Image()
        image.src = './img/spaceship.png'
        image.onload = () => {
            const scale = 0.09
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height  - this.height - 20
            }
        }
    }

    draw() {
        // Draw the player's spaceship using the loaded image
        // c.fillStyle = 'red'
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)

        c.save()
        c.translate(
            player.position.x + player.width / 2, 
            player.position.y + player.height / 2
        )
        c.rotate(this.rotation)
        c.translate(
            -player.position.x - player.width / 2, 
            -player.position.y - player.height / 2
        )
        
        c.drawImage(
            this.image, 
            this.position.x, 
            this.position.y, 
            this.width, 
            this.height
        )
        c.restore()
    }

    update() {
        // Update the player's position and draw the spaceship
        if (this.image) {
            this.draw()
        this.position.x += this.velocity.x
        }
    }
}

class Projectile {
    constructor({position, velocity}) {
        this.position = position
        this.velocity = velocity

        this.radius = 3
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'red'
        c.fill()
        c.closePath()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Invader {
    // Invader class represents the invader's spaceship.
    // It handles drawing, updating, and movement of the invader.
    constructor() {
        // Initialize invader properties
        this.velocity = {
            x: 0,
            y: 0
        }

        

        // Load invader image
        const image = new Image()
        image.src = './img/invader.png'
        image.onload = () => {
            const scale = 0.09
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height  / 2
            }
        }
    }

    draw() {
        // Draw the invader's spaceship using the loaded image
        // c.fillStyle = 'red'
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)

       
        
        c.drawImage(
            this.image, 
            this.position.x, 
            this.position.y, 
            this.width, 
            this.height
        )
    }

    update() {
        // Update the invader's position and draw the spaceship
        if (this.image) {
            this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        }
    }
}


const player = new Player()
const projectiles = []
const invader = new Invader()
const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    space: {
        pressed: false
    },
}

/**
 * The main game loop that updates and redraws the game.
 * It uses the `requestAnimationFrame` method to create a smooth animation.
 * The function clears the canvas, updates the player, invader, and projectiles,
 * and handles player movement based on key press events.
 */
function animate() {
    // Request the next animation frame
    requestAnimationFrame(animate)

    // Clear the canvas with black color
    c.fillStyle = 'black'
    c.fillRect(0,0, canvas.width, canvas.height)

    // Update and draw the invader
    invader.update()

    // Update and draw the player
    player.update()

    // Update and draw each projectile
    projectiles.forEach((projectile, index) => {
        // Remove projectiles that have reached the top of the canvas
        if (projectile.position.y + projectile.radius <= 0) {
            setTimeout(() =>{
                projectiles.splice(index, 1)
            }, 0)  
        } else {
            projectile.update()
        }   
    })

    // Handle player movement based on key press events
    if (keys.a.pressed && player.position.x >= 0) {
        player.velocity.x = -5
        player.rotation = -0.15
    }  else if  (keys.d.pressed && player.position.x +player.width <=canvas.width){
        player.velocity.x = 5
        player.rotation = 0.15
    } else {
        player.velocity.x = 0
        player.rotation = 0
    }
}
animate()

addEventListener('keydown', ({key}) => {
    // Handle keydown events for player movement
    switch (key) {
        case 'a':
            console.log('left')
            keys.a.pressed = true
            break
            case 'd':
                console.log('right')
                keys.d.pressed = true
                break  
                case ' ':
                    console.log('space')
                    projectiles.push(new Projectile({
                        position: {
                           x: player.position.x + player.width / 2,
                           y: player.position.y
                        },
                        velocity: {
                            x: 0,
                            y: -15
                        }
                    }))
                    keys.space.pressed = true
                    break        
    }
})

addEventListener('keyup', ({key}) => {
    // Handle keyup events to stop player movement
    switch (key) {
        case 'a':
            console.log('left')
            keys.a.pressed = false
            break
            case 'd':
                console.log('right')
                keys.d.pressed = false
                break  
                case ' ':
                    console.log('space')
                    keys.space.pressed = false
                    break        
    }
})