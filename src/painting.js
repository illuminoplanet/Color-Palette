export class Painting {
    constructor(painting) {
        this.image = new Image()
        this.image.onload = () => {
            this.imageLoaded = true
            this.resize(this.stageWidth, this.stageHeight)
        }
        this.imageLoaded = false
        this.image.src = painting

        this.frame_color = ['black', 'white']
        this.frame_thick = [12, 10]
    }
    resize(stageWidth, stageHeight) {
        this.stageWidth = stageWidth
        this.stageHeight = stageHeight

        if (this.imageLoaded) {
            this.h = this.stageHeight / 2
            this.w = this.image.width * (this.h / this.image.height)
        }
    }
    draw(ctx, x, y) {
        const lu_x = x - this.w / 2
        const lu_y = y - this.h / 2

        this.drawFrame(ctx, lu_x, lu_y)
        this.drawImage(ctx, lu_x, lu_y)
    }
    drawFrame(ctx, lu_x, lu_y) {
        // Outer frame 
        let thickness = this.frame_thick[0] + this.frame_thick[1]
        ctx.fillStyle = this.frame_color[0]
        ctx.fillRect(lu_x - thickness, lu_y - thickness, this.w + thickness * 2, this.h + thickness * 2)
        // Inner frame 
        thickness = this.frame_thick[1]
        ctx.fillStyle = this.frame_color[1]
        ctx.fillRect(lu_x - thickness, lu_y - thickness, this.w + thickness * 2, this.h + thickness * 2)
    }
    drawImage(ctx, lu_x, lu_y) {
        // Image
        ctx.drawImage(this.image, lu_x, lu_y, this.w, this.h)
    }
}