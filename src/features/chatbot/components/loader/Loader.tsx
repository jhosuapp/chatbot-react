import { Spinner } from "../../../../shared/components";
import { WrapperBlur } from "../wrapper-blur/WrapperBlur";

import styles from './loader.module.css';

const Loader = () => {
    return (
        <WrapperBlur className="max-w-lg w-fit flex items-center gap-4">
            <Spinner />
            <p className={ `${styles.loader} global-text` }>Por favor espera hasta que la <br /> respuesta esté completa.</p>
        </WrapperBlur>
    )
}

export { Loader }