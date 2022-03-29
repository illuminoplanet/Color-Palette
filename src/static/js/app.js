import { Wall } from "./wall.js"

class App {
    constructor() {
        // Create canvas 
        this.mainCanvas = document.createElement("canvas")
        this.mainCtx = this.mainCanvas.getContext("2d")
        document.body.appendChild(this.mainCanvas)

        // Add event listener
        window.addEventListener("resize", this.resize.bind(this))
        window.addEventListener("mousemove", this.mouseMove.bind(this))
        window.addEventListener("loaded", () => this.prepared(true))
        window.addEventListener("preloaded", () => this.prepared(false))

        // Create wall 
        this.numArtworks = { "totalLoad": 10, "totalPreload": 1 }
        this.wall = new Wall(this.numArtworks)

        // Set current mode 
        this.currentMode = "preparing"
    }
    mouseMove(event) {
        // Ignore if program is not prepared
        if (this.currentMode == "preparing")
            return

        event = event || window.event
        let inXRange = event.pageX > this.stageWidth * 0.25 && event.pageX < this.stageWidth * 0.75
        let inYRange = event.pageY > this.stageHeight * 0.25 && event.pageY < this.stageHeight * 0.75

        // spectating -> focusing 
        if (this.currentMode == "spectating" && (inXRange && inYRange)) {
            this.wall.switchMode("focusing")
            this.currentMode = "focusing"
        }
        // focusing -> spectating 
        else if (this.currentMode == "focusing" && !inYRange) {
            this.wall.switchMode("spectating")
            this.currentMode = "spectating"
        }
    }
    resize() {
        this.setStageSize()
        this.setCanvasSize(this.stageWidth, this.stageHeight)

        // Resize child component
        this.wall.resize(this.stageWidth, this.stageHeight)
    }
    animate() {
        requestAnimationFrame(this.animate.bind(this))
        this.mainCtx.clearRect(0, 0, this.stageWidth, this.stageHeight)

        // Draw child component
        this.wall.draw(this.mainCtx)
    }
    prepared(isLoad) {
        // Initialize count in first call
        if (this.count === undefined)
            this.count = { "totalLoad": 0, "totalPreload": 0 }

        this.count['totalLoad'] += isLoad
        this.count['totalPreload'] += !isLoad
        if (this.count["totalLoad"] == this.numArtworks["totalLoad"] && this.count["totalPreload"] == this.numArtworks["totalPreload"]) {
            this.resize()
            this.currentMode = "spectating"
            requestAnimationFrame(this.animate.bind(this))
        }
    }
    setStageSize() {
        this.stageWidth = document.body.clientWidth
        this.stageHeight = document.body.clientHeight
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