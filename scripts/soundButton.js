class SoundButton {
    constructor(ctx, x, y) {
        this.c = ctx;
        this.x = x;
        this.y = y;

        this.state = false;
        this.ready = false;

        this.c.canvas.addEventListener("mouseup", (ev) => {
            let x = ev.clientX - this.c.canvas.getBoundingClientRect().x,
                y = ev.clientY - this.c.canvas.getBoundingClientRect().y;

            let xBounds = (x > this.x) && (x < this.x+this.soundOn.width),
                yBounds = (y > this.y) && (y < this.y+this.soundOn.height);
            
            if (xBounds && yBounds) {
                this.state = !this.state;

                if (this.state) {
                    this.audio.play();
                } else {
                    this.audio.pause();
                }
            }
        })

        this.init().then(()=>{ this.ready = true; })
    }

    init(resolve) {
        this.soundOn = document.createElement("img");
        this.soundOff = document.createElement("img");

        this.soundOn.src = "./sources/sound-on.png";
        this.soundOff.src = "./sources/sound-off.png";
        this.audio = new Audio("./sources/hypnotoad_with_sound.mp3");

        this.audio.addEventListener("ended", ()=>{
            if (!this.state) return false;
            
            this.audio.currentTime = 0;
            this.audio.play();
        })

        return Promise.all([
            new Promise(r => { this.soundOn.addEventListener("load", (e)=>r()) }),
            new Promise(r => { this.soundOff.addEventListener("load", (e)=>r()) }),
        ])
    }

    draw() {
        if (!this.ready) return false;

        this.c.beginPath();
            this.c.drawImage(
                this.state ? this.soundOn : this.soundOff,
                this.x, this.y
            );
        this.c.closePath();
    }
}