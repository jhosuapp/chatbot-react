import { ButtonHTMLAttributes } from 'react';
import { motion, MotionProps } from 'framer-motion';

import styles from './button.module.css';

type NativeProps = ButtonHTMLAttributes<HTMLButtonElement>;

type CustomProps = {
    text?: string;
    style?: 'primary' | 'fit' | 'secondary';
    className?: string;
    icon?: string;
    isLoad?: boolean;
    isSmall?: boolean;
    motionVariants?: any;
} & MotionProps;

type Props = CustomProps & NativeProps;

const Button = ({ text, style, className, icon, isLoad = false, isSmall = false, motionVariants, ...props }:Props) => {
    return (
        <motion.button 
            className={ `${styles.button} ${styles[`button--${style}`]} ${className ?? ''} ${isLoad && styles.button__loader} ${isSmall && styles.button__small}` }
            whileTap={{ scale: 0.95 }} 
            whileHover={{ scale: 1.02 }}
            {...props}
            {...motionVariants}
        >
            <img 
                className={ styles.button__icon }
                src={ icon ? icon : '/svg/icon-arrow.svg' } 
                alt="icono Navy"
            />
            <span>{ isLoad ? 'Enviando' : text }</span>
            {isLoad ? (
                <img 
                    className={ styles.button__iconLoader }
                    src={ '/assets/svg/icon-spinner.svg' } 
                    alt="icono loader Navy"
                />
            ) : (
                <b></b>
            )}
        </motion.button>
    )
}

export { Button }