import { ReactNode } from "react";
import { motion } from 'framer-motion';

import styles from './modalWrapper.module.css';
import { fadeInMotion } from "../../motion/fadeIn.motion";
import { Button } from "../button/Button";

type Props = {
    children?: ReactNode;
    title?: string;
    description?: string;
    hasResetFlux?: boolean;
    callBackClose?: ()=> void;
}

const ModalWrapper = ({ children, title, description, callBackClose, hasResetFlux = false }:Props) => {
    return (
        <motion.section className={ styles.modalWrapper } {...fadeInMotion(0, 0.1)}>
            <article className={ styles.modalWrapper__bg }></article>
            <article className={ styles.modalWrapper__content }>
                <picture className={ styles.modalWrapper__icon }>
                    <img src="/svg/icon-error.svg" alt="error" />
                </picture>
                {callBackClose && (
                    <div className={ styles.modalWrapper__end }>
                        <button 
                            className={ styles.modalWrapper__button }
                            onClick={ callBackClose }
                        >
                            <img src="/icon-close.svg" alt="" />
                        </button>
                    </div>
                )}
                {title && (
                    <div className={ styles.modalWrapper__title }>
                        <p>{ title }</p>
                    </div>
                )}
                {description && (
                    <div className={ styles.modalWrapper__description }>
                        <p>{ description }</p>
                    </div>
                )}
                {hasResetFlux && (
                    <Button
                        text="Entendido"
                        style="primary"
                        onClick={ ()=> window.location.reload() }
                        className="mt-5"
                    />
                )}
                { children }
            </article>
        </motion.section>
    )
}

export { ModalWrapper }