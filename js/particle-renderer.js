const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function initParticles() {
    for (let i = 0; i < 50; i++) {
        addParticle({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2
        });
    }
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const particle of particles) {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 2, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
    }
}

function gameLoop() {
    updateParticles();
    render();
    requestAnimationFrame(gameLoop);
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

initParticles();
gameLoop();
