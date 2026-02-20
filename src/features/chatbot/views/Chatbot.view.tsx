import { AnimatePresence, motion } from "framer-motion";
import { InitChat } from "../components/init-chat/InitChat";
import { Video } from "../components/video/Video";
import { useChatbotController } from "../hooks/useChatbot.controller";
import { Logo } from "../components/logo/Logo";
import { QR } from "../components/qr/QR";
import { AudioVisualizer } from "../components/audio-visualizer/AudioVisualizer";
import { WrapperBlur } from "../components/wrapper-blur/WrapperBlur";
import { Loader } from "../components/loader/Loader";
import { ModalWrapper } from "../../../shared/components";
import { fadeInMotion } from "../../../shared/motion";

const ChatbotView = () => {
    const {
        video,
        status,
        videoRef,
        startContinuousListening,
        isSpeaking,
        queryTextAnalize,
        validation
    } = useChatbotController();



    return (
        <div className="w-full h-svh overflow-hidden px-[5%] animate-fadeIn">

            <div className="z-10 w-full relative h-full flex flex-col items-center py-[10vh] justify-between">
                <div className="flex w-full items-start justify-between max-w-limit px-[10%]">
                    <Logo key={'static-logo'} />
                    {status === 'idle' ? (
                        <QR key={'static-qr'}/>
                    ) : (
                        <AnimatePresence mode="wait">
                            {queryTextAnalize.isLoading ? (
                                <>
                                </>
                            ) : (
                                <motion.p 
                                    className="global-text !text-xl 2xl:!text-3xl max-w-64 2xl:max-w-96 !text-right"
                                    key={`${queryTextAnalize.isLoading}-text`}
                                    {...fadeInMotion(0,0)}
                                >
                                    {validation ? '🎤 Te escucho' : ''}
                                </motion.p>                                
                            )}
                        </AnimatePresence>
                    )}
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
                                    {validation ? (
                                        <AudioVisualizer
                                            isListening={ true }
                                            isActive={ isSpeaking }
                                        />
                                    ) : (
                                        <p className="global-text">Si quieres interrumpir al asistente, simplemente di "pregunta" y luego formula tu duda.</p>
                                    )}
                                </WrapperBlur>
                            )}
                        </>
                    )}
                </AnimatePresence>

                {status === "unsupported" && (
                    <ModalWrapper 
                        title="Tu navegador no soporta reconocimiento de voz."
                        description="Prueba ingresando desde google chrome o en caso de estar desactualizado tu navegador, actualizalo, reinicia e ingresa de nuevo"
                        hasResetFlux
                    />
                )}

                {status === "error" && (
                    <ModalWrapper 
                        title="Error al acceder al micrófono"
                        description="Habilita los permisos de acceso al micrófono y recarga la página"
                        hasResetFlux
                    />
                )}

                {queryTextAnalize.error && (
                    <ModalWrapper 
                        title="Ha ocurrido un error"
                        description="Reinicia el flujo, e intenta de nuevo"
                        hasResetFlux
                    />
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