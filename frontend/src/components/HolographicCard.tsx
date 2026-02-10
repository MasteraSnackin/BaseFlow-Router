import React, { useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';

interface Props {
    children: React.ReactNode;
    className?: string;
    glowColor?: string;
}

export const HolographicCard: React.FC<Props> = ({
    children,
    className = "",
    glowColor = "rgba(14, 165, 233, 0.15)" // Default sky blue
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [hovered, setHovered] = useState(false);

    // Mouse position values
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Spring physics for smooth movement
    const mouseX = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseY = useSpring(y, { stiffness: 300, damping: 30 });

    function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        const xPct = (clientX - left) / width - 0.5;
        const yPct = (clientY - top) / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    }

    function onMouseLeave() {
        setHovered(false);
        x.set(0);
        y.set(0);
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={onMouseMove}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={onMouseLeave}
            style={{
                transformStyle: "preserve-3d",
                rotateX: useMotionTemplate`${mouseY.get() * -5}deg`, // Reverse axis for tilt
                rotateY: useMotionTemplate`${mouseX.get() * 5}deg`,
            }}
            className={`relative group rounded-2xl transition-transform duration-200 ease-out ${className}`}
        >
            {/* 3D Content Container */}
            <div className="relative z-10 h-full">
                {children}
            </div>

            {/* Holographic Glow Layer */}
            <motion.div
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX.get() * 100 + 50}% ${mouseY.get() * 100 + 50}%,
              ${glowColor},
              transparent 40%
            )
          `,
                    opacity: hovered ? 1 : 0,
                }}
                className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300 group-hover:opacity-100"
            />

            {/* Border Highlight */}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-slate-700/50 group-hover:ring-slate-500/50 transition-colors duration-300 pointer-events-none" />
        </motion.div>
    );
};
