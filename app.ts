function GetRandomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

function GetRandomInt(min: number, max: number): number {
    return Math.floor(GetRandomFloat(min, max));
}

function FromPolar(v: number, theta: number) {
    return [v * Math.cos(theta), v * Math.sin(theta)];
}





interface IsimObject {
    Update(): void;
    Draw(ctx: CanvasRenderingContext2D): void;
}

const MaxParticleSize = 3;



class Particle implements IsimObject {
    x = 0;
    y = 0;
    speed = 0;
    theta = 0;
    radius = 1.5;
    ttl = 500;
    lifetime = 500;
    color = "black";
    constructor(private w: number, private h: number, private palette: string[]) {
        this.x = GetRandomFloat(0, w);
        this.y = GetRandomFloat(0, h);

        this.speed = GetRandomFloat(0, 3.0);
        this.theta = GetRandomFloat(0, 2 * Math.PI);

        this.radius = GetRandomFloat(0.05, MaxParticleSize);
        this.lifetime = this.ttl = GetRandomFloat(25, 50);

        this.color = palette[GetRandomInt(0, palette.length)]
    }


    Update() {



        let dRadius = GetRandomFloat(-MaxParticleSize / 10, MaxParticleSize / 10)
        const dSpeed = GetRandomFloat(-0.01, 0.01);
        const dTheta = GetRandomFloat(-Math.PI / 8, Math.PI / 8);



        this.speed += dSpeed
        this.theta += dTheta

        const [dx, dy] = FromPolar(this.speed, this.theta);
        this.x += dx;
        this.y += dy;
        this.radius += dRadius;

        this.radius += (this.radius < 0) ? - 2 * dRadius : 0;
    }

    Draw(ctx: CanvasRenderingContext2D) {
        ctx.save();

        this.experiment1(ctx);

        ctx.restore();
    }
    experiment1(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        let circle = new Path2D();
        circle.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill(circle);
    }
}
const ParticleCount = 200;

const ColorPalettes = [ ["EA5C2B", "A13333", "F6D860", "#FFFDDE", "DB6B97",],
                        ["B5DEFF", "A6CF98", "DD4A48", "FFA6D5", "#F90716",],
                        ["#FFA6D5","#8E0505","#9CC094","#FFF7E0","005792",]]


class Simulation implements IsimObject {
    particles: Particle[] = [];
    palette: string[] = []
    constructor(private width: number, private height: number) {
        this.palette = ColorPalettes[GetRandomInt(0, ColorPalettes.length)]
        for (let i = 0; i < ParticleCount; i++) {
            this.particles.push(new Particle(this.width, this.height, this.palette));
        }
    }

    Update() {
        this.particles.forEach(p => p.Update())
    }

    init = false

    Draw(ctx: CanvasRenderingContext2D) {
        if (!this.init) {
            ctx.fillStyle = this.palette[0]
            ctx.fillRect(0, 0, this.width, this.height);
            this.init = true
        }
        this.particles.forEach((p) => p.Draw(ctx));
    }
}

// Model - Template 
function bootstrapper() {
    const widht = 400;
    const height = 400;

    const updateFrameRate = 50;
    const renderFrameRate = 50;
    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    if (!canvas) return;
    canvas.width = widht;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const sim = new Simulation(widht, height);

    setInterval(() => {
        sim.Update();
    }, 1000 / updateFrameRate);

    setInterval(() => {
        sim.Draw(ctx);
    }, 1000 / renderFrameRate);
}

bootstrapper();
