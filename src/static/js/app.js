import { Wall } from "./wall.js"

class App {
    constructor() {
        // Create canvas 
        this.canvas = document.createElement('canvas')
        this.ctx = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)

        // Add event listener
        this.numArtworks = { 'total': 10, 'loaded': 0 }
        window.addEventListener('imageLoaded', this.imageLoaded.bind(this))
        window.addEventListener('resize', this.resize.bind(this))

        // Create wall 
        this.wall = new Wall(this.numArtworks)
    }
    imageLoaded() {
        this.numArtworks['loaded']++;
        if (this.numArtworks['loaded'] == this.numArtworks['total']) {
            this.resize()
            requestAnimationFrame(this.animate.bind(this))
        }
    }
    resize() {
        this.stageWidth = document.body.clientWidth
        this.stageHeight = document.body.clientHeight

        this.canvas.width = this.stageWidth * 2
        this.canvas.height = this.stageHeight * 2
        this.ctx.scale(2, 2)

        // Resize child component
        this.wall.resize(this.stageWidth, this.stageHeight)
    }
    animate() {
        requestAnimationFrame(this.animate.bind(this))
        this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight)

        // Draw child components
        this.wall.draw(this.ctx)
        this.ctx.fill()
    }
}

window.onload = () => {
    new App()
}