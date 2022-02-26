import { Wall } from "./wall.js"

class App {
    constructor() {
        this.canvas = document.createElement('canvas')
        this.ctx = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)

        this.wall = new Wall(5)

        // Add event listener
        window.addEventListener('resize', this.resize.bind(this))
        this.resize()
        window.addEventListener('mousemove', this.mouseMove.bind(this))
        this.mouseMove()

        requestAnimationFrame(this.animate.bind(this))
    }
    resize() {
        this.stageWidth = document.body.clientWidth
        this.stageHeight = document.body.clientHeight

        this.canvas.width = this.stageWidth * 2
        this.canvas.height = this.stageHeight * 2
        this.ctx.scale(2, 2)

        this.wall.resize(this.stageWidth, this.stageHeight)
    }
    mouseMove(event) {
        this.wall.mouseMove(event)
    }
    animate() {
        requestAnimationFrame(this.animate.bind(this))
        this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight)

        this.wall.draw(this.ctx)
    }
}

window.onload = () => {
    new App()
}