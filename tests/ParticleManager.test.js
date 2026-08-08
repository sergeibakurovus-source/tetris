import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';

// Mock DOM elements for Node test environment
function createMockElement(tagName = 'div') {
    const element = {
        tagName: tagName.toUpperCase(),
        className: '',
        style: {},
        parentNode: null,
        children: [],
        appendChild(child) {
            child.parentNode = element;
            element.children.push(child);
            return child;
        },
        removeChild(child) {
            const index = element.children.indexOf(child);
            if (index !== -1) {
                element.children.splice(index, 1);
            }
            child.parentNode = null;
            return child;
        }
    };
    return element;
}

global.document = {
    createElement: (tagName) => createMockElement(tagName)
};

import { ParticleManager } from '../src/js/ParticleManager.js';

describe('ParticleManager Business Logic & Physics', () => {
    let container;
    let particleManager;

    beforeEach(() => {
        container = createMockElement('div');
        particleManager = new ParticleManager(container);
    });

    it('should initialize with an empty particles array and preset color palette', () => {
        assert.strictEqual(particleManager.particles.length, 0);
        assert.ok(particleManager.colors.length > 0);
        assert.ok(particleManager.colors.includes('#e63946')); // рубиново-красный
        assert.ok(particleManager.colors.includes('#e9c46a')); // саванное золото
    });

    it('should create specified number of particles on createFirework', () => {
        const x = 100;
        const y = 200;
        const count = 15;

        particleManager.createFirework(x, y, count);

        assert.strictEqual(particleManager.particles.length, count);
        assert.strictEqual(container.children.length, count);

        const particle = particleManager.particles[0];
        assert.strictEqual(particle.x, x);
        assert.strictEqual(particle.y, y);
        assert.strictEqual(particle.alpha, 1.0);
        assert.strictEqual(particle.gravity, 0.15);
        assert.ok(particle.decay >= 0.02 && particle.decay <= 0.05);
        assert.ok(particle.el !== null);
        assert.strictEqual(particle.el.parentNode, container);
    });

    it('should apply velocity, gravity, and decay on update()', () => {
        particleManager.createFirework(100, 100, 1);
        const particle = particleManager.particles[0];

        const initialX = particle.x;
        const initialY = particle.y;
        const initialVy = particle.vy;
        const initialAlpha = particle.alpha;

        particleManager.update();

        // Position updated
        assert.strictEqual(particle.x, initialX + particle.vx);
        assert.strictEqual(particle.y, initialY + initialVy);

        // Gravity applied to vertical velocity
        assert.strictEqual(particle.vy, initialVy + particle.gravity);

        // Alpha decreased by decay
        assert.strictEqual(particle.alpha, initialAlpha - particle.decay);

        // Style updated
        assert.strictEqual(particle.el.style.left, `${particle.x}px`);
        assert.strictEqual(particle.el.style.top, `${particle.y}px`);
        assert.strictEqual(particle.el.style.opacity, particle.alpha);
    });

    it('should remove faded particles (alpha <= 0) from array and DOM', () => {
        particleManager.createFirework(50, 50, 1);
        const particle = particleManager.particles[0];

        // Force alpha to near zero so next update causes removal
        particle.alpha = 0.01;
        particle.decay = 0.05;

        particleManager.update();

        assert.strictEqual(particleManager.particles.length, 0);
        assert.strictEqual(container.children.length, 0);
    });

    it('should clear all particles on clear() call', () => {
        particleManager.createFirework(100, 100, 30);
        assert.strictEqual(particleManager.particles.length, 30);
        assert.strictEqual(container.children.length, 30);

        particleManager.clear();

        assert.strictEqual(particleManager.particles.length, 0);
        assert.strictEqual(container.children.length, 0);
    });

    it('should trigger line clear explosion across multiple positions', async () => {
        particleManager.triggerLineClearExplosion(300, 200);

        // Wait for setTimeouts in triggerLineClearExplosion to finish (4 * 60ms = 240ms max)
        await new Promise(resolve => setTimeout(resolve, 300));

        // 4 explosions * 20 particles = 80 particles
        assert.strictEqual(particleManager.particles.length, 80);
        assert.strictEqual(container.children.length, 80);
    });
});
