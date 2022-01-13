"use strict";
function GetRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}
function GetRandomInt(min, max) {
    return Math.floor(GetRandomFloat(min, max));
}
function FromPolar(v, theta) {
    return [v * Math.cos(theta), v * Math.sin(theta)];
}
const MaxParticleSize = 3;
class Particle {
    constructor(w, h, palette) {
        this.w = w;
        this.h = h;
        this.palette = palette;
        this.x = 0;
        this.y = 0; // location
        this.speed = 0;
        this.theta = 0; // velocity
        this.radius = 1.0; // size particle
        this.ttl = 500; // time to live
        this.lifetime = 500; // lifetime
        this.color = "black";
        this.x = GetRandomFloat(0, w);
        this.y = GetRandomFloat(0, h);
        this.speed = GetRandomFloat(0, 3.0);
        this.theta = GetRandomFloat(0, 2 * Math.PI);
        this.radius = GetRandomFloat(0.05, MaxParticleSize);
        this.lifetime = this.ttl = GetRandomFloat(25, 50);
        this.color = palette[GetRandomInt(0, palette.length)];
    }
    Update() {
        let dRadius = GetRandomFloat(-MaxParticleSize / 10, MaxParticleSize / 10);
        const dSpeed = GetRandomFloat(-0.01, 0.01);
        const dTheta = GetRandomFloat(-Math.PI / 8, Math.PI / 8);
        this.speed += dSpeed;
        this.theta += dTheta;
        const [dx, dy] = FromPolar(this.speed, this.theta);
        this.x += dx;
        this.y += dy;
        this.radius += dRadius;
        this.radius += (this.radius < 0) ? -2 * dRadius : 0;
    }
    Draw(ctx) {
        ctx.save();
        this.experiment1(ctx);
        ctx.restore();
    }
    experiment1(ctx) {
        ctx.fillStyle = this.color;
        let circle = new Path2D();
        circle.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill(circle);
    }
}
const ParticleCount = 200;
const ColorPalettes = [["C996CC", "719FB0", "5C527F", "#FFFDDE", "FF5DA2"], ["#BC8CF2", "#CFFFDC", "F0A500", "#B24080", "#F90716"]];
class Simulation {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.particles = [];
        this.palette = [];
        this.init = false;
        this.palette = ColorPalettes[GetRandomInt(0, ColorPalettes.length)];
        for (let i = 0; i < ParticleCount; i++) {
            this.particles.push(new Particle(this.width, this.height, this.palette));
        }
    }
    Update() {
        this.particles.forEach(p => p.Update());
    }
    Draw(ctx) {
        if (!this.init) {
            ctx.fillStyle = this.palette[0]; //  "blue";
            ctx.fillRect(0, 0, this.width, this.height);
            this.init = true;
        }
        this.particles.forEach((p) => p.Draw(ctx));
    }
}
function bootstrapper() {
    const widht = 400;
    const height = 400;
    const updateFrameRate = 50;
    const renderFrameRate = 50;
    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    if (!canvas)
        return;
    canvas.width = widht;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx)
        return;
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
