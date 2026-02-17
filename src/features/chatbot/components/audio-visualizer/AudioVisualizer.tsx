import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import styles from './audioVisualizer.module.css';

interface AudioVisualizerProps {
    isListening: boolean;
    isActive: boolean; 
}

const AudioVisualizer = ({ isListening, isActive }: AudioVisualizerProps) => {
    const [bars, setBars] = useState<number[]>([20, 30, 50, 70, 50, 30, 20]);

    useEffect(() => {
        if (!isListening) {
            setBars([20, 30, 50, 70, 50, 30, 20]);
            return;
        }

        if (!isActive) {
            setBars([0, 0, 0, 0, 0, 0, 0]);
            return;
        }

        const interval = setInterval(() => {
            setBars(
                Array.from({ length: 7 }, () => Math.random() * 100)
            );
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
                        duration: 0.15,
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