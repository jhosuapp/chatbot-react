import { motion } from 'framer-motion';
import styles from './video.module.css';
import { fadeInMotion } from '../../../../shared/motion';

type Props = {
    video: string;
    videoRef: React.RefObject<HTMLVideoElement>;
};  

const Video = ({ video, videoRef }:Props) => {
    const isWaitingVideo = video === "/default-wait-answer.mp4";

    return (
        <div className={ styles.video__container }>
            <img src="/bg.png" alt="" />
            <motion.video
                ref={videoRef}
                key={video}
                src={video}
                controls={false}
                autoPlay
                loop={isWaitingVideo}
                className={ styles.video }
                {...fadeInMotion(0,0)}
            />
        </div>
    )
}

export { Video }