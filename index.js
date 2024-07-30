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

        this.radius = 4
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
    constructor({position}) {
        // Initialize invader properties
        this.velocity = {
            x: 3,
            y: 0
        }

        

        // Load invader image
        const image = new Image()
        image.src = './img/invader.png'
        image.onload = () => {
            const scale = 0.08
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
            this.position = {
                x: position.x,
                y: position.y
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

    update({velocity}) {
        // Update the invader's position and draw the spaceship
        if (this.image) {
            this.draw()
        this.position.x += velocity.x
        this.position.y += velocity.y
        }
    }
}

class Grid {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }

        this.velocity = {
            x: 3,
            y: 0
        }

        this.invaders = []

        const columns = Math.floor(Math.random() * 10 + 5)
        const rows = Math.floor(Math.random() * 5 + 2)

        this.width = columns * 50

        for (let x = 0; x < columns; x++) {

        for (let y = 0; y < rows; y++) {   
            this.invaders.push(new Invader({position: {
                x: x * 50,
                y: y * 30
            }}))
        }
    }
        console.log(this.invaders)
    }

    update() {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        this.velocity.y = 0

        if (this.position.x +this.width >= canvas.width || this.position.x <= 0) {
            this.velocity.x = -this.velocity.x
            this.velocity.y = 30
        }
    }

}

const player = new Player()
const projectiles = []
const grids = []
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

let frames = 0
let randomInterval = Math.floor((Math.random() * 500) + 500)

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

    grids.forEach((grid) => {
        grid.update()
        grid.invaders.forEach((invader, i) => {
            invader.update({velocity: grid.velocity})

            projectiles.forEach((projectile, j) => {
                if(projectile.position.y - projectile.radius <= invader.position.y + invader.height && 
                    projectile.position.x + projectile.radius >=
                    invader.position.x && 
                    projectile.position.x - projectile.radius <=
                    invader.position.x + invader.width && 
                    projectile.position.y + projectile.radius >= 
                    invader.position.y
                ) {

                    setTimeout(()=>{
                        const invaderFound = grid.invaders.find(
                            (invader2) => invader2 === invader
                        )
                        const projectileFound = projectiles.find(projectile2 => projectile2 === projectile)

                        // remove invader and projectile
                        if (invaderFound && projectileFound) {
                            grid.invaders.splice(i,1)
                            projectiles.splice(j, 1)

                            if (grid.invaders.lenght > 0) {
                                const firstInvader = grid.invaders[0]
                                const lastInvader = grid.invaders[grid.invaders.length - 1]

                                grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width
                                grid.position.x = firstInvader.position.x
                            }  
                        }    
                    }, 0)
                }
            })    
        })
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

    //console.log(frames)
    // spawning enemies
    if (frames % randomInterval  === 0) {
        grids.push(new Grid())
        randomInterval = Math.floor((Math.random() * 500) + 500)
        frames = 0
        console.log(randomInterval)
    }

    frames++
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