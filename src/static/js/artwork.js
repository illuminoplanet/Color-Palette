import { ARTWORKS, eventImageLoaded } from "./constants.js"
import { fillRect, fillRoundRect, drawImage, drawShadow } from "./helper.js"

export class Artwork {
    constructor(key) {
        this.painting = new Painting(key)
        this.frame = new Frame()
        this.label = new Label(ARTWORKS[key])

        this.latestColorPallete = false
    }
    resize(stageWidth, stageHeight) {
        // Resize stage 
        this.setStageSize(stageWidth, stageHeight)

        // Resize child components
        this.painting.resize(stageWidth, stageHeight)
        this.frame.resize(stageWidth, stageHeight, this.painting.w, this.painting.h)
        this.label.resize(stageWidth, stageHeight)

        // Resize self 
        this.w = this.frame.w
        this.h = this.frame.h + this.label.h + this.vh * 3
    }
    draw(ctx, x, y) {
        this.frame.draw(ctx, x, y - (this.h - this.frame.h))
        this.painting.draw(ctx, x, y - (this.h - this.frame.h))
        this.label.draw(ctx, x - (this.painting.w - this.label.w) * 0.5, y + (this.frame.h - this.label.h) * 0.5)
    }
    updateColorPallete() {
        if (!this.latestColorPallete)
            this.setColorPallete()
        this.latestColorPallete = true
    }
    setColorPallete() {
        this.painting.getPainting().then((body) => {
            fetch(`https://www.onsemiro.cloud/flask/color-pallete`, {
                method: "POST",
                body: body
            })
                .then((res) => { return res.json() })
                .then((json) => { this.label.setColorPallete(json) })
        })
    }
    setStageSize(stageWidth, stageHeight) {
        this.stageWidth = stageWidth
        this.stageHeight = stageHeight
        this.vw = Math.round(stageWidth * 0.01)
        this.vh = Math.round(stageHeight * 0.01)
    }
}


class Painting {
    constructor(key) {
        // Load image 
        this.image = new Image()
        this.image.onload = () => {
            window.dispatchEvent(eventImageLoaded)
        }
        this.image.src = `static/image/${key}.jpg`

        // Canvas used to draw painting 
        this.paintingCanvas = document.createElement('canvas')
        this.paintingCtx = this.paintingCanvas.getContext('2d')
        document.body.appendChild(this.paintingCanvas)
    }
    resize(stageWidth, stageHeight) {
        // Resize 
        this.h = Math.round(stageHeight * 0.3)
        this.w = Math.round(this.image.width * (this.h / this.image.height))

        // Resize stage and canvas 
        this.setStageSize(stageWidth, stageHeight)
        this.setCanvasSize(this.w, this.h)

        // Redraw image on canvas   
        drawImage(this.paintingCtx, this.image, 0, 0, this.w, this.h)
    }
    draw(ctx, x, y) {
        const [luX, luY] = [x - this.w * 0.5, y - this.h * 0.5]
        drawImage(ctx, this.paintingCanvas, luX, luY, this.w, this.h)
    }
    setStageSize(stageWidth, stageHeight) {
        this.stageWidth = stageWidth
        this.stageHeight = stageHeight
        this.vw = Math.round(stageWidth * 0.01)
        this.vh = Math.round(stageHeight * 0.01)
    }
    setCanvasSize(w, h) {
        this.paintingCanvas.width = w * 2
        this.paintingCanvas.height = h * 2
        this.paintingCtx.scale(2, 2)
    }
    async getPainting() {
        let formData = await new Promise((resolve) => {
            this.paintingCanvas.toBlob((blob) => {
                let formData = new FormData()
                formData.append("image", blob)
                resolve(formData)
            }), 'image/jpeg'
        })
        return formData
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

        // Draw outer shadow
        drawShadow(ctx, 8, 'rgba(0, 0, 0, 0.1)', this.vh, luX, luY, this.w, this.h)
        // Draw outer frame
        ctx.fillStyle = this.frameColor[0]
        fillRect(ctx, luX, luY, this.w, this.h)
        // Draw inner frame
        ctx.fillStyle = this.frameColor[1]
        fillRect(ctx, luX + this.outerFrame, luY + this.outerFrame, this.w - this.outerFrame * 2, this.h - this.outerFrame * 2)
    }
}

class Label {
    constructor(artworkLabel) {
        this.artworkLabel = artworkLabel

        this.labelCanvas = document.createElement('canvas')
        this.labelCtx = this.labelCanvas.getContext('2d')
        document.body.appendChild(this.labelCanvas)
    }
    resize(stageWidth, stageHeight) {
        this.vw = Math.round(stageWidth * 0.01)
        this.vh = Math.round(stageHeight * 0.01)

        this.w = this.vh * 14
        this.h = this.vh * 11
        this.font = ' ' + Math.round(this.vh * 1.5).toString() + 'px Arial'

        this.setCanvasSize(this.w, this.h)
    }
    draw(ctx, x, y) {
        const [luX, luY] = [x - this.w * 0.5, y - this.h * 0.5]

        // Draw outer shadow
        drawShadow(this.labelCtx, 3, 'rgba(0, 0, 0, 0.1)', this.vh * 0.5, 0, 0, this.w, this.h)
        drawShadow(this.labelCtx, 2, 'rgba(255, 255, 255, 0.1)', -this.vh, 0, 0, this.w, this.h)

        // Draw background
        this.labelCtx.fillStyle = "white"
        fillRect(this.labelCtx, 0, 0, this.w, this.h)

        // Draw text
        this.labelCtx.fillStyle = "black"
        this.labelCtx.font = 'bold' + this.font
        this.labelCtx.fillText(this.artworkLabel['artist'], this.vh * 0.5, this.vh * 1.5, this.w - this.vh * 2)
        this.labelCtx.font = 'italic' + this.font
        this.labelCtx.fillText(this.artworkLabel['title'], this.vh * 0.5, this.vh * 3.1, this.w - this.vh * 2)
        this.labelCtx.font = this.font
        this.labelCtx.fillText(this.artworkLabel['year'], this.vh * 0.5, this.vh * 4.7, this.w - this.vh * 2)

        // Draw color pallete
        if (this.colorPallete) {
            const [paletteW, paletteH] = [this.w * 0.15, this.h * 0.42]
            const gap = (this.w - paletteW * this.colorPallete.length) / (this.colorPallete.length + 3)

            for (let i = 0; i < this.colorPallete.length; i++) {
                this.labelCtx.fillStyle = this.colorPallete[i]
                fillRoundRect(this.labelCtx, gap * 2 + (gap + paletteW) * i, (this.h - paletteH) - gap * 2, paletteW, paletteH, this.vh * 0.5)
            }
        }

        drawImage(ctx, this.labelCanvas, luX, luY, this.w, this.h)
    }
    setColorPallete(colorPallete) {
        this.colorPallete = colorPallete
        this.t = 0
    }
    setCanvasSize(w, h) {
        this.labelCanvas.width = w * 2
        this.labelCanvas.height = h * 2
        this.labelCtx.scale(2, 2)
    }
}