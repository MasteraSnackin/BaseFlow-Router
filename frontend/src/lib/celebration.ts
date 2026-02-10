import confetti from 'canvas-confetti';

export const triggerCelebration = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    // Colors matching our Aurora theme
    const colors = ['#0ea5e9', '#8b5cf6', '#ec4899', '#10b981'];

    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
};
