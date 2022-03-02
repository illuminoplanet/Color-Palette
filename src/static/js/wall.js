import { Artwork } from "./js/artwork.js.js.js"
import { ARTWORKS } from "./js/constants.js.js.js"

export class Wall {
    constructor(numArtworks) {
        this.numArtworks = numArtworks
        this.offset = 0

        this.artworks = []
        for (const key in ARTWORKS)
            this.artworks.push(new Artwork(key))
    }
    focusNearest(focus) {
        if (!this.focus && focus) {
            let targetDx = Infinity
            let x = this.offset
            for (const artwork of this.artworks) {
                const dx = this.vw * 50 - x
                if (Math.abs(dx) < Math.abs(targetDx))
                    targetDx = dx
                x += this.gap + artwork.w
            }
            this.targetOffset = this.offset + targetDx
        }
        this.focus = focus
    }
    resize(stageWidth, stageHeight) {
        this.gap = Math.max(480, stageWidth * 0.5)
        this.vw = Math.round(stageWidth * 0.01)
        this.vh = Math.round(stageHeight * 0.01)

        for (const artwork of this.artworks)
            artwork.resize(stageWidth, stageHeight)
    }
    draw(ctx) {
        if (this.focus) {
            const dx = this.offset - this.targetOffset
            if (Math.abs(dx) > 4)
                this.offset -= dx * 0.1
        }
        else {
            this.offset -= 2
        }

        let [x, y] = [this.offset, 50 * this.vh]

        for (const artwork of this.artworks) {
            artwork.draw(ctx, x, y)
            x += this.gap + artwork.w
        }

        if (this.offset + this.artworks[0].w < 0) {
            this.offset += this.gap + this.artworks[0].w
            this.artworks.push(this.artworks.shift())
        }
        ctx.fill()
    }
}