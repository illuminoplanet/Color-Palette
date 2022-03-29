import { ARTWORKS, eventLoaded, eventPreloaded } from "./constants.js"
import { fillRect, fillRoundRect, drawImage, drawShadow } from "./helper.js"

export class Artwork {
    constructor(key, preload) {
        this.latest = false
        this.preload = preload

        this.painting = new Painting(key, () => {
            if (this.preload)
                this.updateColorPallete()
        })
        this.frame = new Frame()
        this.label = new Label(ARTWORKS[key])

        // Canvas used to draw artwork
        this.artworkCanvas = document.createElement('canvas')
        this.artworkCtx = this.artworkCanvas.getContext('2d')
        document.body.appendChild(this.artworkCanvas)
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
        this.aw = this.w * 1.5
        this.ah = this.h * 1.5

        // Resize canvas 
        this.setCanvasSize(this.aw, this.ah)

        // Draw fixed object & shadow
        this.frame.drawShadow(this.artworkCtx, this.aw * 0.5, this.ah * 0.5 - this.h * 0.5 + this.frame.h * 0.5)
        this.frame.draw(this.artworkCtx, this.aw * 0.5, this.ah * 0.5 - this.h * 0.5 + this.frame.h * 0.5)
        this.label.drawShadow(this.artworkCtx, this.aw * 0.5 - (this.painting.w - this.label.w) * 0.5, this.ah * 0.5 + this.h * 0.5 - this.label.h * 0.5)
    }
    draw(ctx, x, y) {
        const [luX, luY] = [x - this.aw * 0.5, y - this.ah * 0.5]
        this.painting.draw(this.artworkCtx, this.aw * 0.5, this.ah * 0.5 - this.h * 0.5 + this.frame.h * 0.5)
        this.label.draw(this.artworkCtx, this.aw * 0.5 - (this.painting.w - this.label.w) * 0.5, this.ah * 0.5 + this.h * 0.5 - this.label.h * 0.5)
        drawImage(ctx, this.artworkCanvas, luX, luY, this.aw, this.ah)
    }
    updateColorPallete() {
        if (!this.latest)
            this.setColorPallete()
        this.latest = true
    }
    setColorPallete() {
        this.painting.getPainting().then((body) => {
            fetch(`https://www.onsemiro.cloud/flask/color-pallete`, {
                method: "POST",
                body: body
            })
                .then((res) => { return res.json() })
                .then((json) => {
                    this.label.setColorPallete(json)
                    window.dispatchEvent(eventPreloaded)
                })
        })
    }
    setStageSize(w, h) {
        this.stageWidth = w
        this.stageHeight = h
        this.vw = Math.round(w * 0.01)
        this.vh = Math.round(h * 0.01)
    }
    setCanvasSize(w, h) {
        this.artworkCanvas.width = w * 2
        this.artworkCanvas.height = h * 2
        this.artworkCtx.scale(2, 2)
    }
    setProgress(progress) {
        this.label.setProgress(progress)
    }
    setPosition(x, y) {
        this.x = x
        this.y = y
    }
}


class Painting {
    constructor(key, callback) {
        // Load image 
        this.image = new Image()
        this.image.onload = () => {
            window.dispatchEvent(eventLoaded)
            callback()
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
    resize(stageWidth, stageHeight, paintingW, paintingH) {
        this.setStageSize(stageWidth, stageHeight)

        this.outerFrame = this.vh * 1.5
        this.innerFrame = this.vh * 2
        this.w = paintingW + (this.outerFrame + this.innerFrame) * 2
        this.h = paintingH + (this.outerFrame + this.innerFrame) * 2
    }
    draw(ctx, x, y) {
        const [luX, luY] = [x - this.w * 0.5, y - this.h * 0.5]

        // Draw outer frame
        ctx.fillStyle = "black"
        fillRect(ctx, luX, luY, this.w, this.h)
        // Draw inner frame
        ctx.fillStyle = "white"
        fillRect(ctx, luX + this.outerFrame, luY + this.outerFrame, this.w - this.outerFrame * 2, this.h - this.outerFrame * 2)
    }
    drawShadow(ctx, x, y) {
        const [luX, luY] = [x - this.w * 0.5, y - this.h * 0.5]
        drawShadow(ctx, 8, 'rgba(0, 0, 0, 0.1)', this.vh, luX, luY, this.w, this.h)
    }
    setStageSize(w, h) {
        this.stageWidth = w
        this.stageHeight = h
        this.vw = Math.round(w * 0.01)
        this.vh = Math.round(h * 0.01)
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
                let h = -paletteH / (this.c ** 2) * (this.time - 0.25 * this.c * i) * (this.time - 0.25 * this.c * i - 2 * this.c)
                if (this.time >= 0.25 * this.c * i + this.c)
                    h = paletteH
                fillRoundRect(this.labelCtx, gap * 2 + (gap + paletteW) * i, (this.h - paletteH) - gap * 2, paletteW, h, this.vh * 0.3)
            }
        }
        drawImage(ctx, this.labelCanvas, luX, luY, this.w, this.h)
    }
    drawShadow(ctx, x, y) {
        const [luX, luY] = [x - this.w * 0.5, y - this.h * 0.5]
        // Draw outer shadow
        drawShadow(ctx, 12, 'rgba(0, 0, 0, 0.1)', this.vh * 0.5, luX, luY, this.w, this.h)
        drawShadow(ctx, 4, 'rgba(255, 255, 255, 0.1)', -this.vh, luX, luY, this.w, this.h)
    }
    setColorPallete(colorPallete) {
        this.colorPallete = colorPallete
    }
    setCanvasSize(w, h) {
        this.labelCanvas.width = w * 2
        this.labelCanvas.height = h * 2
        this.labelCtx.scale(2, 2)
    }
    setProgress(spectating) {
        this.time = spectating['time']
        this.c = spectating['cycle'] * 0.25
    }
}