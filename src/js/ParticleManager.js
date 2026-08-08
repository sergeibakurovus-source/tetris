export class ParticleManager {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.colors = [
            '#e63946', // рубиново-красный
            '#f4a261', // золотистый апельсин
            '#e76f51', // терракотовый
            '#2a9d8f', // изумрудный
            '#e9c46a', // саванное золото
            '#ffb703', // солнечный янтарный
            '#ffffff'  // белая вспышка
        ];
    }

    createFirework(x, y, count = 25) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 6 + 2;
            const size = Math.random() * 6 + 4;
            const color = this.colors[Math.floor(Math.random() * this.colors.length)];
            
            const el = document.createElement('div');
            el.className = 'firework-particle';
            el.style.width = `${size}px`;
            el.style.height = `${size}px`;
            el.style.backgroundColor = color;
            el.style.left = `${x}px`;
            el.style.top = `${y}px`;
            el.style.boxShadow = `0 0 8px ${color}, 0 0 16px ${color}`;

            this.container.appendChild(el);

            this.particles.push({
                el,
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 1.5,
                gravity: 0.15,
                alpha: 1.0,
                decay: Math.random() * 0.03 + 0.02,
                rotation: Math.random() * 360,
                vRot: (Math.random() - 0.5) * 15
            });
        }
    }

    triggerLineClearExplosion(rowY, width) {
        const explosionsCount = 4;
        const step = width / (explosionsCount + 1);
        for (let i = 1; i <= explosionsCount; i++) {
            setTimeout(() => {
                this.createFirework(step * i + (Math.random() * 20 - 10), rowY, 20);
            }, (i - 1) * 60);
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
