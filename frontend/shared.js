document.addEventListener('DOMContentLoaded', async () => {
    // --- Particle.js Background Initialization ---
    await tsParticles.load({
        id: "particles-js",
        options: {
            fpsLimit: 60,
            interactivity: {
                events: {
                    onHover: { enable: true, mode: "grab" },
                },
                modes: {
                    grab: { distance: 140, links: { opacity: 1 } },
                },
            },
            particles: {
                color: { value: "#a0aec0" }, // gray-500
                links: { color: "#cbd5e0", distance: 150, enable: true, opacity: 0.4, width: 1 },
                move: { direction: "none", enable: true, outModes: "out", random: false, speed: 1, straight: false },
                number: { density: { enable: true }, value: 80 },
                opacity: { value: 0.5 },
                shape: { type: "circle" },
                size: { value: { min: 1, max: 3 } },
            },
            detectRetina: true,
        },
    });

    // --- Material Ripple Effect for Buttons ---
    function createRipple(event) {
        const button = event.currentTarget;

        const circle = document.createElement("span");
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - (button.offsetLeft + radius)}px`;
        circle.style.top = `${event.clientY - (button.offsetTop + radius)}px`;
        circle.classList.add("ripple");

        const ripple = button.getElementsByClassName("ripple")[0];

        if (ripple) {
            ripple.remove();
        }

        button.appendChild(circle);
    }
    
    // Add relative and overflow-hidden to buttons that need the ripple
    const buttons = document.querySelectorAll('.ripple-btn');
    buttons.forEach(button => {
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.addEventListener("click", createRipple);
    });
});