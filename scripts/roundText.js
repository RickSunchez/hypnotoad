// https://stackoverflow.com/questions/6061880/html5-canvas-circle-text
class RoundText {
    constructor(ctx, x, y, radius, text, size, color, speed) {
        this.c = ctx;
        this.x = x;
        this.y = y;
        this.text = text;
        this.radius = radius;
        this.size = size;
        this.color = color;

        this.angle = 0;
        this.speed = speed * Math.PI / 180;
    }

    draw() {
        var rpl = 2*Math.PI / this.text.length;

        this.c.beginPath();

        this.c.save();

        this.c.textAlign = "center";
        this.c.font = `bold ${this.size}px Rounds-Black`;
        this.c.fillStyle = this.color;
        this.c.lineWidth = 1;
        this.c.strokeStyle = "#ffffff";

        this.c.translate(this.x, this.y);
        this.c.rotate(this.angle);

        for(let i=0; i<this.text.length; i++){
            
            let letterAngle = this.c.measureText(this.text[i]).width / this.radius;
            this.c.rotate(letterAngle);
            this.c.save();

            this.c.translate(0, -this.radius);
            this.c.fillText(this.text[i], 0, 0);
            this.c.strokeText(this.text[i], 0, 0);

            this.c.restore();
        }
        this.c.restore();
        this.c.closePath();

        this.angle += this.speed;
    }
}