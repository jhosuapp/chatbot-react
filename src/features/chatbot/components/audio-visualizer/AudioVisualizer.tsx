import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import styles from './audioVisualizer.module.css';

interface AudioVisualizerProps {
    isListening: boolean;
    isActive: boolean; 
}

const AudioVisualizer = ({ isListening, isActive }: AudioVisualizerProps) => {
    const [bars, setBars] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);

    useEffect(() => {
        if (!isListening) {
            setBars([0, 0, 0, 0, 0, 0, 0]);
            return;
        }

        const interval = setInterval(() => {
            if (isActive) {
                // Animación cuando hay voz detectada
                setBars(
                    Array.from({ length: 7 }, () => Math.random() * 100)
                );
            } else {
                // Animación suave de "en espera"
                setBars(
                    Array.from({ length: 7 }, () => Math.random() * 30 + 10)
                );
            }
        }, 100);

        return () => clearInterval(interval);
    }, [isListening, isActive]);

    if (!isListening) return null;

    return (
        <div className={styles.audioVisualizer}>
            {bars.map((height, index) => (
                <motion.div
                    key={index}
                    animate={{
                        height: `${height}%`,
                    }}
                    transition={{
                        duration: 0.1,
                        ease: "easeOut",
                    }}
                    style={{
                        minHeight: "8px",
                    }}
                />
            ))}
        </div>
    );
};

export { AudioVisualizer };