import { Artwork } from "./artwork.js"
import { ARTWORKS } from "./constants.js"

export class Wall {
    constructor(numArtworks) {
        this.numArtworks = numArtworks
        this.offset = 0
        this.v0 = 2.5
        // Create artworks
        this.artworks = []
        for (const [i, key] of Object.keys(ARTWORKS).entries()) {
            if (i >= this.numArtworks)
                break
            this.artworks.push(new Artwork(key))
        }
    }
    resize(stageWidth, stageHeight) {
        this.stageWidth = stageWidth
        this.stageHeight = stageHeight
        this.vw = Math.round(stageWidth * 0.01)
        this.vh = Math.round(stageHeight * 0.01)

        this.gap = Math.max(this.stageWidth * 0.5, 480)

        // Resize child components
        for (const artwork of this.artworks)
            artwork.resize(stageWidth, stageHeight)
    }
    draw(ctx) {
        // Draw child components
        let [midX, midY] = [this.offset, this.stageHeight * 0.5]
        let distClosestArtwork = Infinity
        for (const artwork of this.artworks) {
            midX += artwork.w * 0.5
            artwork.draw(ctx, midX, midY)

            const distArtwork = Math.abs(midX - this.stageWidth * 0.5)
            if (distArtwork != NaN && distArtwork < distClosestArtwork)
                distClosestArtwork = distArtwork

            midX += this.gap + artwork.w * 0.5
        }

        // Move artwork to back when out of screen
        if (this.offset + this.artworks[0].w < 0) {
            this.offset += this.gap + this.artworks[0].w
            this.artworks.push(this.artworks.shift())
        }

        // Slide offset 
        let v = this.v0
        if (distClosestArtwork <= this.stageWidth * 0.15) {
            this.t++
            v = 0.5 * this.v0 * (Math.cos(Math.PI * this.v0 / (this.stageWidth * 0.15 * 2) * this.t) + 1)
            v = Math.max(v, 0.01)
        }
        else this.t = 0
        this.offset -= v
    }
}