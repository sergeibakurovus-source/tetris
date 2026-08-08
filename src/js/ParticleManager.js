export class ParticleManager {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.colors = [
            '#ff1a40', // carmine
            '#ffb830', // gold
            '#ffffff', // white
            '#00e5ff'  // cyan
        ];
    }

    createFirework(x, y, count = 35) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 8 + 3;
            const size = Math.random() * 4 + 2;
            const color = this.colors[Math.floor(Math.random() * this.colors.length)];
            
            const el = document.createElement('div');
            el.className = 'firework-particle';
            el.style.width = `${size}px`;
            el.style.height = `${size}px`;
            el.style.backgroundColor = color;
            el.style.left = `${x}px`;
            el.style.top = `${y}px`;
            el.style.boxShadow = `0 0 ${size*2}px ${color}, 0 0 ${size*4}px ${color}`;
            
            // titanium shards styling for white particles
            if (color === '#ffffff') {
                el.style.borderRadius = '0';
                el.style.clipPath = 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';
            }

            this.container.appendChild(el);

            this.particles.push({
                el,
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 2,
                gravity: 0.25,
                alpha: 1.0,
                decay: Math.random() * 0.04 + 0.02,
                rotation: Math.random() * 360,
                vRot: (Math.random() - 0.5) * 30
            });
        }
    }

    triggerLineClearExplosion(rowY, width) {
        const explosionsCount = 5;
        const step = width / (explosionsCount + 1);
        for (let i = 1; i <= explosionsCount; i++) {
            setTimeout(() => {
                this.createFirework(step * i + (Math.random() * 30 - 15), rowY, 10);
            }, (i - 1) * 40);
        }
    }

    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.alpha -= p.decay;
            p.rotation += p.vRot;

            if (p.alpha <= 0) {
                if (p.el.parentNode) {
                    p.el.parentNode.removeChild(p.el);
                }
                this.particles.splice(i, 1);
            } else {
                p.el.style.left = `${p.x}px`;
                p.el.style.top = `${p.y}px`;
                p.el.style.opacity = p.alpha;
                p.el.style.transform = `rotate(${p.rotation}deg) scale(${p.alpha})`;
            }
        }
    }

    clear() {
        this.particles.forEach(p => {
            if (p.el.parentNode) {
                p.el.parentNode.removeChild(p.el);
            }
        });
        this.particles = [];
    }
}
