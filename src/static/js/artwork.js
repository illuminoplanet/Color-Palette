import { ARTWORKS, eventImageLoaded } from "./constants.js"

export class Artwork {
    constructor(key) {
        this.painting = new Painting(key)
        this.frame = new Frame()
    }
    resize(stageWidth, stageHeight) {
        this.stageWidth = stageWidth
        this.stageHeight = stageHeight
        this.vw = Math.round(stageWidth * 0.01)
        this.vh = Math.round(stageHeight * 0.01)

        // Resize child components
        this.painting.resize(stageWidth, stageHeight)
        this.frame.resize(stageWidth, stageHeight, this.painting.w, this.painting.h)

        // Resize self 
        this.w = this.frame.w
        this.h = this.frame.h
    }
    draw(ctx, x, y) {
        this.frame.draw(ctx, x, y)
        this.painting.draw(ctx, x, y)
    }
}

class Painting {
    constructor(key) {
        this.image = new Image()
        this.image.onload = () => {
            window.dispatchEvent(eventImageLoaded)
            this.imageLoaded = true
        }
        this.imageLoaded = false
        this.image.src = "static/image/" + key + ".jpg"
    }
    resize(stageWidth, stageHeight) {
        this.stageWidth = stageWidth
        this.stageHeight = stageHeight
        this.vw = Math.round(stageWidth * 0.01)
        this.vh = Math.round(stageHeight * 0.01)

        if (this.imageLoaded) {
            this.h = stageHeight * 0.5
            this.w = this.image.width * (this.h / this.image.height)
        }
    }
    draw(ctx, x, y) {
        const [luX, luY] = [x - this.w * 0.5, y - this.h * 0.5]
        ctx.drawImage(this.image, luX, luY, this.w, this.h)
    }
}

class Frame {
    constructor() {
        this.frameColor = ['black', 'white']
    }
    resize(stageWidth, stageHeight, paintingW, paintingH) {
        this.vw = Math.round(stageWidth * 0.01)
        this.vh = Math.round(stageHeight * 0.01)

        this.outerFrame = this.vh * 1.5
        this.innerFrame = this.vh * 2
        this.w = paintingW + (this.outerFrame + this.innerFrame) * 2
        this.h = paintingH + (this.outerFrame + this.innerFrame) * 2
    }
    draw(ctx, x, y) {
        const [luX, luY] = [x - this.w * 0.5, y - this.h * 0.5]

        // Draw outer frame
        ctx.fillStyle = this.frameColor[0]
        ctx.fillRect(luX, luY, this.w, this.h)
        // Draw inner frame
        ctx.fillStyle = this.frameColor[1]
        ctx.fillRect(luX + this.outerFrame, luY + this.outerFrame, this.w - this.outerFrame * 2, this.h - this.outerFrame * 2)
    }
}

class Label {
    constructor(artworkLabel) {
        this.artworkLabel = artworkLabel
    }
    resize(stageWidth, stageHeight) {
        this.vw = Math.round(stageWidth * 0.01)
        this.vh = Math.round(stageHeight * 0.01)

        this.w = this.vw * 10
        this.h = this.vh * 10
    }
    draw(ctx, x, y) {
        const [luX, luY] = [x - this.w * 0.5, y - this.h * 0.5]
        ctx.fillStyle = "black"
        ctx.fillRect(luX, luY, this.w, this.h)
    }
}