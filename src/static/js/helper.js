const roundList = (list, prec) => { return list.map((x) => { return Math.round(x * prec) / prec }) }

function fillRect(ctx, x, y, w, h) {
    [x, y, w, h] = roundList([x, y, w, h], 4)
    ctx.fillRect(x, y, w, h)
}

function fillRoundRect(ctx, x, y, w, h, r) {
    if (h > 0) {
        [x, y, w, h] = roundList([x, y, w, h], 4)
        ctx.save()
        ctx.beginPath()
        ctx.moveTo(x + r, y)
        ctx.lineTo(x + w - r, y)
        ctx.quadraticCurveTo(x + w, y, x + w, y + r)
        ctx.lineTo(x + w, y + h - r)
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
        ctx.lineTo(x + r, y + h)
        ctx.quadraticCurveTo(x, y + h, x, y + h - r)
        ctx.lineTo(x, y + r)
        ctx.quadraticCurveTo(x, y, x + r, y)
        ctx.closePath()
        ctx.fill()
        ctx.restore()
    }
}

function drawImage(ctx, image, x, y, w, h) {
    [x, y, w, h] = roundList([x, y, w, h], 4)
    ctx.drawImage(image, x, y, w, h)
}

function drawShadow(ctx, iter, color, vh, x, y, w, h) {
    ctx.save()
    ctx.shadowColor = color
    ctx.shadowBlur = 8
    for (let i = 0; i < iter; i++) {
        ctx.shadowOffsetX = ctx.shadowOffsetY = vh * (2 / iter) * i
        fillRect(ctx, x, y, w, h)
    }
    ctx.restore()
}

export { roundList, fillRect, fillRoundRect, drawImage, drawShadow }