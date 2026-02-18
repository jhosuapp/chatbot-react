import { motion } from 'framer-motion';
import styles from './spinner.module.css';
import { fadeInMotion } from '../../motion';

type Props = {
    className?: string;
}

const Spinner = ({ className = '' }:Props) => {
    return (
        <motion.div 
            {...fadeInMotion(0,0)}
            className={ `${styles.spinner} ${className}` }
        >
            <img src="/svg/icon-spinner.svg" alt="cargando" />
        </motion.div>
    )
}

export { Spinner }