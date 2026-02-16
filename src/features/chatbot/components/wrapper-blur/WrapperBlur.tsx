import { ReactNode } from 'react';
import { motion } from 'framer-motion';

import styles from './wrapperBlur.module.css';
import { fadeInMotion } from '../../../../shared/motion';

type Props = {
    children: ReactNode;
    className?: string;
}

const WrapperBlur = ({ children, className = '' }:Props) => {
    return (
        <motion.div className={ `${styles.wrapperBlur} ${className}` } {...fadeInMotion(0,0)}>
            { children }
        </motion.div>
    )
}

export { WrapperBlur }