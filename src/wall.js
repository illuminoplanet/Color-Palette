import { Painting } from "./painting.js"

export class Wall {
    constructor(num_paintings) {
        this.num_paintings = num_paintings
        this.offset = 0

        this.paintings = []
        for (let i = 0; i < this.num_paintings; i++) {
            const image_path = "static/image/" + i.toString() + ".jpg"
            this.paintings.push(
                new Painting(image_path)
            )
        }
    }
    resize(stage_width, stage_height) {
        this.gap = Math.max(480, stage_width / 2)
        this.stage_width = stage_width
        this.stage_height = stage_height

        for (let i = 0; i < this.num_paintings; i++) {
            this.paintings[i].resize(stage_width, stage_height)
        }
    }
    draw(ctx) {
        for (let i = 0; i < this.num_paintings; i++) {
            const x = this.gap * i + this.offset
            const y = this.stage_height / 2
            this.paintings[i].draw(ctx, x, y)
        }

        if (this.offset + this.paintings[0].w < 0) {
            this.paintings.push(this.paintings.shift())
            this.offset += this.gap
        }

        this.offset -= 2
        ctx.fill()
    }
}