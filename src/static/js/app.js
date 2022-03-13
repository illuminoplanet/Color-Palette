import { Wall } from "./wall.js"

class App {
    constructor() {
        // Create canvas 
        this.mainCanvas = document.createElement('canvas')
        this.mainCtx = this.mainCanvas.getContext('2d')
        document.body.appendChild(this.mainCanvas)

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
        this.setCanvasSize(this.stageWidth, this.stageHeight)

        // Resize child component
        this.wall.resize(this.stageWidth, this.stageHeight)
    }
    animate() {
        requestAnimationFrame(this.animate.bind(this))
        this.mainCtx.clearRect(0, 0, this.stageWidth, this.stageHeight)

        // Draw child components
        this.wall.draw(this.mainCtx)
        this.mainCtx.fill()
        this.mainCtx.stroke()
    }
    setCanvasSize(w, h) {
        this.mainCanvas.width = w * 2
        this.mainCanvas.height = h * 2
        this.mainCtx.scale(2, 2)
    }
}

window.onload = () => {
    new App()
}