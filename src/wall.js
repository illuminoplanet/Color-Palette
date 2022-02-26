import { Painting } from "./painting.js"

export class Wall {
    constructor(numPaintings) {
        this.numPaintings = numPaintings
        this.offset = 0

        this.paintings = []
        for (let i = 0; i < this.numPaintings; i++) {
            const imagePath = "static/image/" + i.toString() + ".jpg"
            this.paintings.push(
                new Painting(imagePath)
            )
        }
    }
    focusNearest(focus) {
        if (!this.focus && focus) {
            let targetDx = Infinity
            let x = this.offset
            for (let i = 0; i < this.numPaintings; i++) {
                const dx = this.stageWidth * 0.5 - x
                if (Math.abs(dx) < Math.abs(targetDx)) {
                    targetDx = dx
                }
                x += this.gap + this.paintings[i].w
            }
            this.targetOffset = this.offset + targetDx
        }
        this.focus = focus
    }
    resize(stageWidth, stageHeight) {
        this.gap = Math.max(480, stageWidth * 0.5)
        this.stageWidth = stageWidth
        this.stageHeight = stageHeight

        for (let i = 0; i < this.numPaintings; i++) {
            this.paintings[i].resize(stageWidth, stageHeight)
        }
    }
    draw(ctx) {
        if (this.focus) {
            const dx = this.offset - this.targetOffset
            if (Math.abs(dx) > 4) {
                this.offset -= dx * 0.1
            }
        }
        else {
            this.offset -= 2
        }

        let x = this.offset
        let y = this.stageHeight / 2

        for (let i = 0; i < this.numPaintings; i++) {
            this.paintings[i].draw(ctx, x, y)
            x += this.gap + this.paintings[i].w
        }

        if (this.offset + this.paintings[0].w < 0) {
            this.offset += this.gap + this.paintings[0].w
            this.paintings.push(this.paintings.shift())
        }
        ctx.fill()
    }
}