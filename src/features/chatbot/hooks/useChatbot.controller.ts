import { useRef, useState, useEffect } from "react";
import { StatusMicrophone } from "../interfaces/chatbot.interface";

const useChatbotController = () => {
    const [status, setStatus] = useState<StatusMicrophone>("idle");
    const [transcript, setTranscript] = useState("");
    const [video, setVideo] = useState("/welcome.mp4");
    const [isVideoPlaying, setIsVideoPlaying] = useState(true);

    const recognitionRef = useRef<any>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const getVideoByMessage = (message: string) => {
        const text = message.toLowerCase();

        if (text.includes("adoptar")) return "/videos/adopcion.mp4";
        if (text.includes("donar")) return "/videos/donaciones.mp4";
        if (text.includes("voluntario")) return "/videos/voluntariado.mp4";

        return "/videos/default.mp4";
    };

    const startContinuousListening = () => {
        const SpeechRecognition =
            (window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setStatus("unsupported");
            return;
        }

        videoRef.current?.play();

        const recognition = new SpeechRecognition();
        recognition.lang = "es-CO";
        recognition.interimResults = true; // Detecta mientras habla
        recognition.continuous = true; // Escucha continua

        // Configuración para mejor detección de voz vs ruido
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setStatus("listening");
        };

        recognition.onresult = (event: any) => {
            const current = event.resultIndex;
            const transcriptText = event.results[current][0].transcript;
            const confidence = event.results[current][0].confidence;
            const isFinal = event.results[current].isFinal;

            // Filtro de confianza para diferenciar voz de ruido
            if (confidence > 0.5 || transcriptText.length > 3) {
                // Pausar video cuando detecta voz
                if (videoRef.current && !videoRef.current.paused) {
                    videoRef.current.pause();
                    setIsVideoPlaying(false);
                }

                // Si es resultado final, procesar
                if (isFinal) {
                    setTranscript(transcriptText);
                    setStatus("processing");

                    const selectedVideo = getVideoByMessage(transcriptText);
                    
                    // Cambiar video si es diferente
                    if (selectedVideo !== video) {
                        setVideo(selectedVideo);
                    }

                    // Reanudar video después de procesar
                    setTimeout(() => {
                        setStatus("listening");
                        if (videoRef.current) {
                            videoRef.current.play();
                            setIsVideoPlaying(true);
                        }
                    }, 1000);
                }
            }
        };

        recognition.onerror = (event: any) => {
            console.error("Error de reconocimiento:", event.error);
            
            // Ignorar errores de "no-speech" (silencio)
            if (event.error === "no-speech") {
                return;
            }

            setStatus("error");
            
            // Reintentar después de un error
            setTimeout(() => {
                if (recognitionRef.current) {
                    recognition.start();
                }
            }, 1000);
        };

        recognition.onend = () => {
            // Reiniciar automáticamente para escucha continua
            if (status !== "error" && recognitionRef.current) {
                try {
                    recognition.start();
                } catch (e) {
                    console.error("Error al reiniciar:", e);
                }
            }
        };

        recognition.start();
        recognitionRef.current = recognition;
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
            setStatus("idle");
        }
    };

    // Cleanup al desmontar
    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    return {
        transcript,
        video,
        status,
        isVideoPlaying,
        videoRef,
        startContinuousListening,
        stopListening
    };
};

export { useChatbotController };