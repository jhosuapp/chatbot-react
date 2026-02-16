import { AnimatePresence } from "framer-motion";
import { InitChat } from "../components/init-chat/InitChat";
import { Video } from "../components/video/Video";
import { useChatbotController } from "../hooks/useChatbot.controller";
import { Logo } from "../components/logo/Logo";
import { QR } from "../components/qr/QR";

const ChatbotView = () => {
    const {
        transcript,
        video,
        status,
        videoRef,
        startContinuousListening,
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
                </AnimatePresence>

                {transcript && (
                    <div
                        style={{
                            padding: 15,
                            backgroundColor: "#e3f2fd",
                            borderRadius: 5,
                            marginBottom: 20
                        }}
                    >
                        <p style={{ margin: 0 }}>
                            <strong>Escuché:</strong> "{transcript}"
                        </p>
                    </div>
                )}

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