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

const player = new Player()
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

function animate() {
    // Game loop that updates and redraws the game
    requestAnimationFrame(animate)
    c.fillRect(0,0, canvas.width, canvas.height)
    player.update()

    if (keys.a.pressed && player.position.x >= 0) {
        player.velocity.x = -5
        player.rotation = -.15
    }  else if  (keys.d.pressed && player.position.x +player.width <=canvas.width){
        player.velocity.x = 5
    } else {
        player.velocity.x = 0
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