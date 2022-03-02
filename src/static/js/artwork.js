import { ARTWORKS } from "./constants.js"

export class Artwork {
    constructor(key) {
        this.painting = new Painting(key, this.resize)
        this.frame = new Frame()
        this.label = new Label(ARTWORKS[key])
    }
    resize(stageWidth, stageHeight) {
        this.vw = Math.round(stageWidth * 0.01)
        this.vh = Math.round(stageHeight * 0.01)

        this.painting.resize(stageWidth, stageHeight)
        this.frame.resize(stageWidth, stageHeight, this.painting.w, this.painting.h)
        // this.label.resize(stageWidth, stageHeight)
    }
    draw(ctx, x, y) {
        this.w = this.painting.w
        this.h = this.painting.h // + this.frame.h + this.label.h + this.vh * 10

        this.painting.draw(ctx, x, y - (this.h * 0.5 - this.painting.h) * 0.5)
        this.frame.draw(ctx, x, y - (this.h * 0.5 - this.painting.h) * 0.5)
        // this.label.draw(ctx, x, y - (this.h - this.label.h) * 0.5)
    }
}

class Painting {
    constructor(key, resize) {
        this.image = new Image()
        this.image.onload = () => {
            this.imageLoaded = true
            this.resize(this.vw * 100, this.vh * 100)
        }
        this.imageLoaded = false
        this.image.src = "static/image/" + key + ".jpg"
    }
    resize(stageWidth, stageHeight) {
        this.vw = Math.ceil(stageWidth * 0.01)
        this.vh = Math.ceil(stageHeight * 0.01)
        if (this.imageLoaded) {
            this.h = this.vh * 50
            this.w = this.image.width * (this.h / this.image.height)
        }
    }
    draw(ctx, x, y) {
        const [lu_x, lu_y] = [x - this.w * 0.5, y - this.h * 0.5]
        ctx.drawImage(this.image, lu_x, lu_y, this.w, this.h)
    }
}

class Frame {
    constructor() {
        this.frameColor = ['black', 'white']
    }
    resize(stageWidth, stageHeight, paintingW, paintingH) {
        this.vw = Math.round(stageWidth * 0.01)
        this.vh = Math.round(stageHeight * 0.01)

        this.outerFrame = this.vh * 5
        this.innerFrame = this.vh * 5
        this.w = paintingW + (this.outerFrame + this.innerFrame) * 2
        this.h = paintingH + (this.outerFrame + this.innerFrame) * 2
    }
    draw(ctx, x, y) {
        const [lu_x, lu_y] = [x - this.w * 0.5, y - this.h * 0.5]

        // Draw outer frame
        ctx.fillStyle = this.frameColor[0]
        ctx.fillRect(lu_x, lu_y, this.w, this.h)
        // Draw inner frame
        ctx.fillStyle = this.frameColor[1]
        ctx.fillRect(lu_x + this.outerFrame, lu_y + this.outerFrame, this.w - this.outerFrame * 2, this.h - this.outerFrame * 2)
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
        const [lu_x, lu_y] = [x - this.w * 0.5, y - this.h * 0.5]
        ctx.fillStyle = "black"
        ctx.fillRect(lu_x, lu_y, this.w, this.h)
    }
}