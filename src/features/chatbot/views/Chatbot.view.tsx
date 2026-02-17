import { AnimatePresence } from "framer-motion";
import { InitChat } from "../components/init-chat/InitChat";
import { Video } from "../components/video/Video";
import { useChatbotController } from "../hooks/useChatbot.controller";
import { Logo } from "../components/logo/Logo";
import { QR } from "../components/qr/QR";
import { AudioVisualizer } from "../components/audio-visualizer/AudioVisualizer";
import { WrapperBlur } from "../components/wrapper-blur/WrapperBlur";
import { Loader } from "../components/loader/Loader";

const ChatbotView = () => {
    const {
        video,
        status,
        videoRef,
        startContinuousListening,
        isSpeaking,
        queryTextAnalize
    } = useChatbotController();

    return (
        <div className="w-full h-svh overflow-hidden px-[5%] animate-fadeIn">
            <div className="z-10 w-full relative h-full flex flex-col items-center py-[10vh] justify-between">
                <div className="flex w-full items-start justify-between max-w-limit">
                    <Logo key={'static-logo'} />
                    <QR key={'static-qr'}/>
                </div>

                <AnimatePresence mode="wait">
                    {(status !== 'listening' && status !== 'processing') && (
                        <InitChat status={ status } startContinuousListening={ startContinuousListening } key={'cta'} />
                    )}
                    {queryTextAnalize.isLoading ? (
                        <Loader key={`static-loading`} />
                    ) : (
                        <>
                            {(status === 'listening' || status === 'processing') && (
                                <WrapperBlur className="max-w-2xl" key={`static`}>
                                    <AudioVisualizer
                                        isListening={ true }
                                        isActive={ isSpeaking }
                                    />
                                </WrapperBlur>
                            )}
                        </>
                    )}
                </AnimatePresence>

                {status === "unsupported" && (
                    <p style={{ color: "red" }}>
                        ❌ Tu navegador no soporta reconocimiento de voz.
                    </p>
                )}

                {status === "error" && (
                    <p style={{ color: "red" }}>
                        ⚠️ Error al acceder al micrófono o procesar audio.
                    </p>
                )}
            </div>

            <Video
                video={ video }
                videoRef={ videoRef as any }
            />
        </div>
    );
};

export { ChatbotView };