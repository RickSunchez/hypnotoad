class HypnoEye {
    constructor(ctx, x=0, y=0, scale=0.5, startDirection=1, FPS=60, speed=500) {
        this.c = ctx;
        this.x = x;
        this.y = y;
        this.scale = scale;

        this.diffOuter = [];
        this.diffInner = [];

        this.speed = speed;
        this.FPS = FPS;
        this.framesLimit = this.FPS*this.speed / 1000;
        this.animationDirection = startDirection;
        this.frameCount = 0;
        this.onBlink = false;

        this.width = 0;
        this.height = 0;

        this.init();
    }

    init() {
        var _basePts = {
            minusOuter: [[129,62,124,60,88,62],[59,67,11,68,3,112],[1,159,65,155,110,175],[142,188,146,190,195,189],[229,186,237,172,267,165],[305,155,353,166,361,121],[361,76,310,80,243,57],[209,45,187,51,153,58]],
            plusOuter: [[165,0,165,40,120,60],[90,75,25,60,20,115],[20,155,65,155,110,175],[150,190,130,230,195,235],[235,235,240,195,270,180],[305,155,350,165,350,115],[350,75,310,80,260,55],[225,35,240,10,200,5]],
            minusInner: [[138,81,123,74,96,75],[73,75,44,86,37,111],[37,153,76,151,118,157],[152,162,158,170,194,171],[215,171,225,165,258,151],[296,135,344,149,332,112],[316,81,270,103,230,82],[196,65,186,57,157,75]],
            plusInner: [[169,25,168,77,132,80],[99,79,62,72,56,117],[58,153,88,142,124,152],[158,166,135,197,194,209],[222,209,216,166,252,161],[274,154,305,160,315,120],[320,80,297,83,244,65],[212,54,225,22,199,23]]
        };

        for (let key in _basePts) {
            this[key] = structuredClone(_basePts[key]).map((curvePoint, i) => {
                var diffRow = [];
                let newCurvePoint = curvePoint.map((param, j)=>{
                    let newParam = param * this.scale;

                    if (j % 2 == 0) {
                        this.width = Math.max(this.width, newParam);
                        newParam += this.x;
                    } else {
                        this.height = Math.max(this.height, newParam);
                        newParam += this.y;
                    }

                    if (key == "plusOuter") diffRow.push((this.minusOuter[i][j] - newParam) / this.framesLimit);
                    if (key == "plusInner") diffRow.push((this.minusInner[i][j] - newParam) / this.framesLimit);

                    return newParam;
                })

                if (key == "plusOuter") this.diffOuter.push(diffRow);
                if (key == "plusInner") this.diffInner.push(diffRow);

                return newCurvePoint;
            })
        }
        
        if (this.animationDirection == 1) {
            this.activeOuter = structuredClone(this.plusOuter);
            this.activeInner = structuredClone(this.plusInner);
        } else {
            this.activeOuter = structuredClone(this.minusOuter);
            this.activeInner = structuredClone(this.minusInner);
        }
    }

    draw() {           
        this.c.beginPath();
            this.c.moveTo(this.activeOuter[7][4], this.activeOuter[7][5]);
            for (let pt of this.activeOuter) {
                this.c.bezierCurveTo(...pt);
            }
            this.c.fillStyle = "#fd1501";
            this.c.strokeStyle = "rgba(228, 196, 2, 0.7)"; //#e4c402
            this.c.lineWidth = this.width / 4;
            this.c.fill();

            if (this.onBlink) this.c.stroke();
        this.c.closePath();

        this.c.beginPath();
            this.c.moveTo(this.activeInner[7][4], this.activeInner[7][5]);
            for (let pt of this.activeInner) {
                this.c.bezierCurveTo(...pt);
            }
            this.c.fillStyle = "#000000";

            this.c.fill();
        this.c.closePath();

        for (let i=0; i<this.diffOuter.length; i++) {
            for (let j=0; j<this.diffOuter[i].length; j++) {
                this.activeOuter[i][j] += this.animationDirection * this.diffOuter[i][j];
                this.activeInner[i][j] += this.animationDirection * this.diffInner[i][j];
            }
        }

        this.frameCount++;
        if (this.frameCount >= this.framesLimit) {
            this.animationDirection *= -1;
            this.frameCount = 0;
        }
        if (this.frameCount%7 == 0) this.onBlink = !this.onBlink;
    }
}