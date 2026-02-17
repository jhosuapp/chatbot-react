import { WrapperBlur } from "../wrapper-blur/WrapperBlur";

import styles from './loader.module.css';

const Loader = () => {
    return (
        <WrapperBlur className="max-w-lg w-fit">
            <p className={ styles.loader }>Por favor espera hasta que la <br /> respuesta esté completa.</p>
        </WrapperBlur>
    )
}

export { Loader }