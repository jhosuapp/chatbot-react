import { motion } from 'framer-motion';
import { StatusMicrophone } from "../../interfaces/chatbot.interface";


import styles from './initChat.module.css';
import { fadeInMotion } from '../../../../shared/motion';

type Props = {
    status: StatusMicrophone;
    startContinuousListening: ()=> void;
}


const InitChat = ({ startContinuousListening }:Props) => {
    return (
        <motion.div 
            className={ styles.initChat }
            onClick={ startContinuousListening }
            whileTap={{ scale: 0.95 }} 
            whileHover={{ scale: 1.05 }}
            {...fadeInMotion(0,0)}
        >
            <h5>INICIAR COVERSACIÓN</h5>
            <p>Al iniciar la conversación, aceptas que este asistente proporciona información general con fines educativos únicamente. No ofrece diagnóstico, tratamiento ni recomendaciones médicas. Para orientación médica, consulta a un profesional de la salud.</p>
        </motion.div>
    )
}

export { InitChat }