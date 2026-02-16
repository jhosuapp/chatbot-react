import { motion } from 'framer-motion';
import { fadeInMotion } from '../../../../shared/motion';

import styles from './logo.module.css';

const Logo = () => {
    return (
        <motion.picture {...fadeInMotion(0,0)} className={ styles.logo }>
            <img src="/logo.png" alt="Logo" />
        </motion.picture>
    )
}

export { Logo }