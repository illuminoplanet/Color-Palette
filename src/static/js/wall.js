import { Artwork } from "./artwork.js"
import { ARTWORKS } from "./constants.js"

export class Wall {
    constructor(numArtworks) {
        this.numArtworks = numArtworks
        this.currentMode = "spectating"

        // Set spatial variables
        this.offset = 0
        this.gap = 0

        // Set spectating mode variables
        this.spectating = {
            "initial_velocity": 2.5,
            'time': 0
        }

        // Create artworks instance
        this.artworks = []
        for (const [i, key] of Object.keys(ARTWORKS).entries()) {
            if (i >= this.numArtworks['totalLoad'])
                break
            const isPreload = i < this.numArtworks['totalPreload']
            this.artworks.push(new Artwork(key, isPreload))
        }
    }
    switchMode(mode) {
        this.currentMode = mode
        if (this.currentMode == "spectating") {
            this.spectating["time"] = this.spectating["cycle"] * 0.5
            for (const artwork of this.artworks)
                artwork.resize(this.stageWidth, this.stageHeight)
        }
        else if (this.currentMode == "focusing") {
            this.spectating["time"] = this.spectating["cycle"] * 0.5
        }
    }
    resize(stageWidth, stageHeight) {
        this.setStageSize(stageWidth, stageHeight)

        this.gap = Math.max(Math.round(this.stageWidth * 0.5), 480)
        this.spectating['distance'] = Math.round(this.stageWidth * 0.15)
        this.spectating['cycle'] = Math.round(4 * this.spectating['distance'] / this.spectating['initial_velocity'])

        // Resize child components
        for (const artwork of this.artworks)
            artwork.resize(stageWidth, stageHeight)
    }
    draw(ctx) {
        // Draw child components
        let [midX, midY] = [this.offset, this.stageHeight * 0.5]
        this.closestArtwork = this.artworks[0]
        for (const artwork of this.artworks) {
            midX += artwork.w * 0.5

            artwork.setPosition(midX, midY)
            if (midX - artwork.w * 0.5 <= this.stageWidth + this.gap) {
                artwork.draw(ctx, midX, midY)
                artwork.updateColorPallete()
            }

            // Get closest to middle artwork
            const distCurrArtwork = Math.abs(midX - this.stageWidth * 0.5)
            const distClosestArtwork = Math.abs(this.closestArtwork.x - this.stageWidth * 0.5)
            if (distCurrArtwork < distClosestArtwork)
                this.closestArtwork = artwork

            midX += this.gap + artwork.w * 0.5
        }

        // Move artwork to back when out of screen
        if (this.offset + this.artworks[0].w < 0) {
            this.offset += this.gap + this.artworks[0].w
            this.artworks.push(this.artworks.shift())
        }

        // Slide offset 
        let velocity = this.spectating["initial_velocity"]
        if (this.currentMode == "spectating") {
            const dist = Math.abs(this.closestArtwork.x - this.stageWidth * 0.5)
            if (dist <= this.spectating["distance"]) {
                this.spectating["time"]++
                velocity = this.getVelocity()
                this.closestArtwork.setProgress(this.spectating)
            }
            else
                this.spectating["time"] = 0
        }
        else {
            velocity = (this.closestArtwork.x - this.stageWidth * 0.5) * 0.1
            this.closestArtwork.setProgress(this.spectating)
        }

        this.offset -= velocity
    }
    getVelocity() {
        const v1 = 0.5 * this.spectating["initial_velocity"]
        const v2 = Math.cos(Math.PI * this.spectating["initial_velocity"] / (this.spectating["distance"] * 2) * this.spectating["time"])
        return Math.max(0, Math.round((v1 * v2 + 1) * 4) / 4)
    }
    setStageSize(w, h) {
        this.stageWidth = w
        this.stageHeight = h
        this.vw = Math.round(w * 0.01)
        this.vh = Math.round(h * 0.01)
    }
}