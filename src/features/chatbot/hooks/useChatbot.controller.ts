import { useRef, useState, useEffect } from "react";
import { StatusMicrophone } from "../interfaces/chatbot.interface";
import { useTextAnalizeQuery } from "./useTextAnalize.query";

const useChatbotController = () => {
    const [status, setStatus] = useState<StatusMicrophone>("idle");
    const [transcript, setTranscript] = useState("");
    const [video, setVideo] = useState("/welcome.mp4");
    const [isVideoPlaying, setIsVideoPlaying] = useState(true);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const recognitionRef = useRef<any>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    // @ts-ignore
    const speakingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    // @ts-ignore
    const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null); 
    const queryTextAnalize = useTextAnalizeQuery(transcript);

    const getVideoByMessage = (message: string) => {
        const text = message.toLowerCase();

        if (text.includes("adoptar")) return "/diagnostico.mp4";
        if (text.includes("donar")) return "/diagnostico.mp4";
        if (text.includes("voluntario")) return "/diagnostico.mp4";

        return "/diagnostico.mp4";
    };

    useEffect(() => {
        if (video === "/default-wait-answer.mp4" && status === "listening") {
            // Limpiar timeout anterior si existe
            if (inactivityTimeoutRef.current) {
                clearTimeout(inactivityTimeoutRef.current);
            }

            // Iniciar nuevo timeout de 30 segundos
            inactivityTimeoutRef.current = setTimeout(() => {
                console.log("30 segundos de inactividad, reiniciando...");
                setStatus('idle');
                setIsVideoPlaying(false);
                setVideo('/welcome.mp4');
                videoRef.current?.pause();
                window.location.reload();
            }, 30000); // 30 segundos
        } else {
            // Si cambia a otro video, limpiar el timeout
            if (inactivityTimeoutRef.current) {
                clearTimeout(inactivityTimeoutRef.current);
                inactivityTimeoutRef.current = null;
            }
        }

        return () => {
            if (inactivityTimeoutRef.current) {
                clearTimeout(inactivityTimeoutRef.current);
            }
        };
    }, [video, status]);

    useEffect(() => {
        if (isSpeaking && inactivityTimeoutRef.current) {
            clearTimeout(inactivityTimeoutRef.current);
            inactivityTimeoutRef.current = null;
        }
    }, [isSpeaking]);

    useEffect(() => {
        const videoElement = videoRef.current;
        
        if (!videoElement) return;

        const handleVideoEnd = () => {
            if (status === "listening" && !isSpeaking && video !== "/default-wait-answer.mp4") {
                setVideo("/default-wait-answer.mp4");
            }
        };

        videoElement.addEventListener("ended", handleVideoEnd);

        return () => {
            videoElement.removeEventListener("ended", handleVideoEnd);
        };
    }, [status, isSpeaking, video]);

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
        recognition.interimResults = true;
        recognition.continuous = true;
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
                setIsSpeaking(true);
                
                if (speakingTimeoutRef.current) {
                    clearTimeout(speakingTimeoutRef.current);
                }

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
                    
                    setVideo(selectedVideo);

                    // Marcar que dejó de hablar después de un momento
                    speakingTimeoutRef.current = setTimeout(() => {
                        setIsSpeaking(false);
                    }, 500);

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
            
            if (event.error === "no-speech") {
                setIsSpeaking(false);
                return;
            }

            setStatus("error");
            setIsSpeaking(false);
            
            setTimeout(() => {
                if (recognitionRef.current) {
                    recognition.start();
                }
            }, 1000);
        };

        recognition.onend = () => {
            setIsSpeaking(false);
            
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
            setIsSpeaking(false);
        }

        if (speakingTimeoutRef.current) {
            clearTimeout(speakingTimeoutRef.current);
        }

        if (inactivityTimeoutRef.current) {
            clearTimeout(inactivityTimeoutRef.current);
        }
    };

    useEffect(() => {
        videoRef.current?.pause();
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            if (speakingTimeoutRef.current) {
                clearTimeout(speakingTimeoutRef.current);
            }
            if (inactivityTimeoutRef.current) {
                clearTimeout(inactivityTimeoutRef.current);
            }
        };
    }, []);

    return {
        transcript,
        video,
        status,
        isVideoPlaying,
        isSpeaking, 
        videoRef,
        startContinuousListening,
        stopListening, 
        queryTextAnalize
    };
};

export { useChatbotController };