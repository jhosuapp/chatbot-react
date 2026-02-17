import { motion } from 'framer-motion';
import { fadeInMotion } from '../../../../shared/motion';

import styles from './qr.module.css';

const QR = () => {
    return (
        <motion.picture {...fadeInMotion(0,0)} className={ styles.qr }>
            <img src="/images/qr.png" alt="" />
        </motion.picture>
    )
}

export { QR }