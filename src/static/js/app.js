import { Wall } from "../wall.js.js.js"

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
        event = event || window.event

        const inXBound = (event.pageX > this.stageWidth * 0.25) && (event.pageX < this.stageWidth * 0.75)
        const inYBound = (event.pageY > this.stageHeight * 0.25) && (event.pageY < this.stageHeight * 0.75)

        this.wall.focusNearest(inXBound && inYBound)
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