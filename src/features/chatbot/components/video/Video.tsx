import { motion } from 'framer-motion';
import styles from './video.module.css';
import { fadeInMotion } from '../../../../shared/motion';

type Props = {
    video: string;
    videoRef: React.RefObject<HTMLVideoElement>;
};  

const Video = ({ video, videoRef }:Props) => {
    const isWaitingVideo = (video === "/default-wait-answer.mp4" || video === '/INTRONEW.mp4');

    return (
        <motion.div 
            className={ styles.video__container }
            key={video}
            {...fadeInMotion(0.1,0.2)}
        >
            <img src="/images/bg.png" alt="" />
            <video
                ref={videoRef}
                key={`${video}-video-tag`}
                src={video}
                controls={false}
                autoPlay
                loop={isWaitingVideo}
                className={ styles.video }                
            />
        </motion.div>
    )
}

export { Video }