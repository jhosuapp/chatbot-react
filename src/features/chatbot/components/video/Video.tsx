import styles from './video.module.css';

type Props = {
    video: string;
    videoRef: React.RefObject<HTMLVideoElement>;
};  

const Video = ({ video, videoRef }:Props) => {
    return (
        <div className={ styles.video__container }>
            <img src="/bg.png" alt="" />
            <video
                ref={videoRef}
                key={video}
                src={video}
                controls={false}
                autoPlay
                className={ styles.video }
            />
        </div>
    )
}

export { Video }