import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);
    const [cursorVariant, setCursorVariant] = useState("default");

    useEffect(() => {
        const mouseMove = (e) => {
            setMousePosition({
                x: e.clientX,
                y: e.clientY
            });
            if (!isVisible) setIsVisible(true);
        };

        window.addEventListener("mousemove", mouseMove);

        return () => {
            window.removeEventListener("mousemove", mouseMove);
        };
    }, [isVisible]);

    useEffect(() => {
        if (isVisible) {
            document.body.style.cursor = 'none';
            // Also target interactive elements if possible, or rely on global CSS class toggle
            const interactiveElements = document.querySelectorAll('a, button, input, select, textarea');
            interactiveElements.forEach(el => el.style.cursor = 'none');
        } else {
            document.body.style.cursor = 'auto';
            const interactiveElements = document.querySelectorAll('a, button, input, select, textarea');
            interactiveElements.forEach(el => el.style.cursor = 'auto');
        }

        return () => {
            document.body.style.cursor = 'auto';
            const interactiveElements = document.querySelectorAll('a, button, input, select, textarea');
            interactiveElements.forEach(el => el.style.cursor = 'auto');
        }
    }, [isVisible]);

    if (!isVisible) return null;

    const variants = {
        default: {
            x: mousePosition.x - 16,
            y: mousePosition.y - 16,
            backgroundColor: "rgba(59, 130, 246, 0.3)",
            border: "1px solid rgba(59, 130, 246, 0.5)",
            height: 32,
            width: 32,
            transition: {
                type: "spring",
                mass: 0.1,
                stiffness: 800,
                damping: 20
            }
        },
        hover: {
            height: 64,
            width: 64,
            x: mousePosition.x - 32,
            y: mousePosition.y - 32,
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            border: "1px solid rgba(59, 130, 246, 0.8)",
            transition: {
                type: "spring",
                mass: 0.1,
                stiffness: 800,
                damping: 20
            }
        }
    };

    const dotVariants = {
        default: {
            x: mousePosition.x - 4,
            y: mousePosition.y - 4,
            transition: {
                type: "tween",
                ease: "linear",
                duration: 0.05
            }
        },
        hover: {
            x: mousePosition.x - 4,
            y: mousePosition.y - 4,
            transition: {
                type: "tween",
                ease: "linear",
                duration: 0.05
            }
        }
    };

    return (
        <>
            <motion.div
                className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999]"
                variants={variants}
                animate={cursorVariant}
                style={{ position: 'fixed', pointerEvents: 'none' }} // Inline styles to force safety
            />
            <motion.div
                className="fixed top-0 left-0 w-2 h-2 bg-blue-400 rounded-full pointer-events-none z-[10000]"
                variants={dotVariants}
                animate="default"
                style={{ position: 'fixed', pointerEvents: 'none' }}
            />
        </>
    );
};

export default CustomCursor;
