const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const scaledCanvas = {
    width: canvas.width / 4,
    height: canvas.height / 4
}

const tileSize = 16
const tilesPerRow = 36

const floorCollisions2D = []
for (let i = 0; i < floorCollisions.length; i += tilesPerRow) {
    floorCollisions2D.push(floorCollisions.slice(i, i + tilesPerRow))
}

const collisionBlocks = []
floorCollisions2D.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if (symbol === 202) {
            collisionBlocks.push(
                new CollisionBlock({
                    position: {
                        x: x * tileSize,
                        y: y * tileSize,
                    },
                })
            )
        }
    })
})




const platformCollisions2D = []
for (let i = 0; i < platformCollisions.length; i += tilesPerRow) {
    platformCollisions2D.push(platformCollisions.slice(i, i + tilesPerRow))
}

const platformCollisionBlocks = []
platformCollisions2D.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if (symbol === 202) {
            platformCollisionBlocks.push(
                new CollisionBlock({
                    position: {
                        x: x * tileSize,
                        y: y * tileSize,
                    },
                    height: 4,
                })
            )
        }
    })
})

const worldWidth = (floorCollisions2D[0]?.length || 0) * tileSize

const gravity = 0.1



const player = new Player({
    position: {
    x: 100,
    y: 300,
},
    collisionBlocks,
    platformCollisionBlocks,
    imageSrc: './img/warrior/Idle.png',
    frameRate: 8,
    worldWidth,
    animations: {
        Idle: {
            imageSrc: './img/warrior/Idle.png',
            frameRate: 8,
            frameBuffer: 3,
        },
        Run: {
            imageSrc: './img/warrior/Run.png',
            frameRate: 8,
            frameBuffer: 5,
        },
        Jump: {
            imageSrc: './img/warrior/Jump.png',
            frameRate: 2,
            frameBuffer: 3,
        },
        Fall: {
            imageSrc: './img/warrior/Fall.png',
            frameRate: 2,
            frameBuffer: 3,
        },
        FallLeft: {
            imageSrc: './img/warrior/FallLeft.png',
            frameRate: 2,
            frameBuffer: 3,
        },
        RunLeft: {
            imageSrc: './img/warrior/RunLeft.png',
            frameRate: 8,
            frameBuffer: 5,
        },
        IdleLeft: {
            imageSrc: './img/warrior/IdleLeft.png',
            frameRate: 8,
            frameBuffer: 3,
        },
        JumpLeft: {
            imageSrc: './img/warrior/JumpLeft.png',
            frameRate: 2,
            frameBuffer: 3,
        },

    }
})

const keys = {
    d: {
        pressed: false
    },
    a: {
        pressed: false
    }
}

const background = new Sprite({
    position: {
    x: 0,
    y: 0,
    },
    imageSrc: './img/background.png',
})

const backgroundImageHeight = 432

const camera = {
    position: {
        x: 0,
        y: -backgroundImageHeight + scaledCanvas.height,
    },
}

const cameraBounds = {
    minY: -backgroundImageHeight + scaledCanvas.height,
    maxY: 0,
}

const showCollisionBlocks = false

const targetFPS = 60
const frameInterval = 1000 / targetFPS
let lastFrameTime = 0
let frameAccumulator = 0

function animate(timestamp = 0) {
    window.requestAnimationFrame(animate)

    if (!lastFrameTime) {
        lastFrameTime = timestamp
    }

    const delta = timestamp - lastFrameTime
    lastFrameTime = timestamp
    frameAccumulator += delta

    if (frameAccumulator < frameInterval) return
    frameAccumulator -= frameInterval
    frameAccumulator %= frameInterval

    camera.position.y = Math.max(
        Math.min(camera.position.y, cameraBounds.maxY),
        cameraBounds.minY
    )

    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)

    c.save()
    c.scale(4, 4)
    c.translate(camera.position.x, camera.position.y)
    background.update()
    if (showCollisionBlocks) {
        collisionBlocks.forEach((collisionBlock) => {
            collisionBlock.update()
        })
    
        platformCollisionBlocks.forEach((block) => {
            block.update()
        })
    }

    player.velocity.x = 0
    if (keys.d.pressed) {
        player.velocity.x = 2
        player.lastDirection = 'right'
    } else if (keys.a.pressed) {
        player.velocity.x = -2
        player.lastDirection = 'left'
    }

    player.update()

    if (keys.d.pressed) {
        player.switchSprite('Run')
    } else if (keys.a.pressed) {
        player.switchSprite('RunLeft')
    } else if (player.velocity.y === 0) {
        if (player.lastDirection === 'right') player.switchSprite('Idle')
        else player.switchSprite('IdleLeft')
    }

    if (player.velocity.y < 0) {
        player.shouldPanCameraDown({ camera, canvas })
        if (player.lastDirection === 'right') player.switchSprite('Jump')
        else player.switchSprite('JumpLeft')
    } else if (player.velocity.y > 0) {
        player.shouldPanCameraUp({ camera, canvas })
        if (player.lastDirection === 'right') player.switchSprite('Fall')
        else player.switchSprite('FallLeft')
    }

    if (player.velocity.x > 0) {
        player.shouldPanCameraToTheLeft({ canvas, camera })
    } else if (player.velocity.x < 0) {
        player.shouldPanCameraToTheRight({ canvas, camera })
    }

    camera.position.y = Math.max(
        Math.min(camera.position.y, cameraBounds.maxY),
        cameraBounds.minY
    )
    

    c.restore()



    
}

animate()

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = true
            break
        case 'a':
            keys.a.pressed = true
            break 
        case 'w':
            if (player.isOnGround) {
                player.velocity.y = -4
                player.isOnGround = false
            }
            break 
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
    }
})
