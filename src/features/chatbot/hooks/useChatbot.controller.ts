import { useRef, useState, useEffect, useCallback } from "react";
import { StatusMicrophone } from "../interfaces/chatbot.interface";
import { useTextAnalizeQuery } from "./useTextAnalize.query";
import { AnalysisIds } from "../interfaces/textAnalize.interface";
import { useUsageQuery } from "./useUsage.query";

const BOT_KEYWORDS = ["bot", "asistente", "vos", "pregunta", "preguntas", "preguntar"];
const DEFAULT_VIDEO_NAME = '/default-wait-answer.mp4';

const useChatbotController = () => {
    const [status, setStatus] = useState<StatusMicrophone>("idle");
    const [transcript, setTranscript] = useState("");
    const [rawTranscript, setRawTranscript] = useState("");
    const [rawTranscriptSecondary, setRawTranscriptSecondary] = useState("");
    const [counter, setCounter] = useState<number>(0);
    const [initCounter, setInitCounter] = useState<boolean>(false);
    const [video, setVideo] = useState("/INTRONEW.mp4");
    const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(true);
    const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
    const [isVideoDefault, setIsVideoDefault] = useState<boolean>(false);
    const counterRef = useRef(0);
    const recognitionRef = useRef<any>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const speakingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const inactivityTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const isLoadingRef = useRef(false);
    const statusRef = useRef<StatusMicrophone>("idle");
    const isVideoDefaultRef = useRef(false);

    const queryTextAnalize = useTextAnalizeQuery(transcript);
    const mutation = useUsageQuery();

    const validation = (
        isVideoDefault ||
        /pregunt/i.test(rawTranscript) ||
        /pregunt/i.test(rawTranscriptSecondary)
    );

    useEffect(() => {
        if (validation) {
            setVideo(DEFAULT_VIDEO_NAME);
        }
    }, [validation]);

    useEffect(() => {
        if (initCounter) {
            intervalRef.current = setInterval(() => {
                setCounter(prev => prev + 1);
            }, 1000);
        }
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [initCounter]);

    useEffect(() => {
        counterRef.current = counter;
    }, [counter]);

    useEffect(() => {
        const handleClick = () => {
            status === 'idle' && videoRef.current?.play();
        };
        document.body.addEventListener('click', handleClick);
        return () => {
            document.body.removeEventListener('click', handleClick);
        };
    }, [status]);

    useEffect(() => {
        isLoadingRef.current = queryTextAnalize.isLoading;
    }, [queryTextAnalize.isLoading]);

    useEffect(() => {
        setTranscript('');
        setRawTranscript('');
        setRawTranscriptSecondary('');
    }, [queryTextAnalize.isSuccess]);

    useEffect(() => {
        statusRef.current = status;
    }, [status]);


    useEffect(() => {
        isVideoDefaultRef.current = isVideoDefault;
    }, [isVideoDefault]);

    const getVideoByCategory = (category: AnalysisIds) => {
        return `${category}.mp4`;
    };

    const getConfidenceThreshold = useCallback((): number => {
        return isVideoDefaultRef.current ? 0.75 : 0.85;
    }, []);

    const isBotInvoked = (text: string): boolean => {
        const words = text.toLowerCase().split(/\s+/);
        return BOT_KEYWORDS.some(keyword => words.includes(keyword));
    };

    const cleanTranscript = (text: string): string => {
        let cleanedText = text;
        BOT_KEYWORDS.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, "gi");
            cleanedText = cleanedText.replace(regex, "").trim();
        });
        return cleanedText.replace(/\s+/g, " ").trim();
    };

    const isMeaningfulSpeech = useCallback((text: string, confidence: number): boolean => {
        if (!isBotInvoked(text) && !isVideoDefaultRef.current) return false;

        const trimmed = text.trim();
        const wordCount = trimmed.split(/\s+/).filter(Boolean).length;
        if (wordCount < 3) return false;

        const confidenceThreshold = getConfidenceThreshold();
        if (confidence < confidenceThreshold) return false;

        const words = trimmed.toLowerCase().split(/\s+/);
        const uniqueWords = new Set(words);
        if (uniqueWords.size === 1 && words.length > 1) return false;
        return true;
    }, [getConfidenceThreshold]);

    // Controlar video y reconocimiento según isLoading
    useEffect(() => {
        if (queryTextAnalize.isLoading) {
            if (recognitionRef.current) {
                try { recognitionRef.current.stop(); } catch (_) {}
            }
        }
    }, [queryTextAnalize.isLoading]);

    // Aplicar nuevo video y reproducirlo cuando llega la respuesta
    useEffect(() => {
        if (!queryTextAnalize.data) return;

        const selectedVideo = getVideoByCategory(queryTextAnalize.data.video_id);
        setVideo(selectedVideo);

        if (videoRef.current) {
            videoRef.current.load();
            videoRef.current
                .play()
                .then(() => setIsVideoPlaying(true))
                .catch((e) => console.error("Error al reproducir video:", e));
        }

        if (recognitionRef.current) {
            try { recognitionRef.current.start(); } catch (_) {}
        }
    }, [queryTextAnalize.data]);

    // Timeout de inactividad
    useEffect(() => {
        if (video === DEFAULT_VIDEO_NAME && status === "listening") {
            if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
            inactivityTimeoutRef.current = setTimeout(async () => {
                window.dataLayer &&
                    window.dataLayer.push({
                        reset_flux: 'Flujo reiniciado',
                        event: "reset-flux",
                    });

                try {
                    await mutation.mutateAsync({
                        usage_time_seconds: counterRef.current,
                        session_id: 'Cliente',
                        additional_data: { page: 'Info' }
                    });
                } catch (error) {
                    console.log(error);
                } finally {
                    setStatus("idle");
                    setIsVideoPlaying(false);
                    videoRef.current?.pause();
                    setVideo("/A1_BIENVENIDA.mp4");
                    setCounter(0);
                    setInitCounter(false);
                    window.location.reload();
                }
            }, 24000);
        } else {
            if (inactivityTimeoutRef.current) {
                clearTimeout(inactivityTimeoutRef.current);
                inactivityTimeoutRef.current = null;
            }
        }

        return () => {
            if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
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

        if (video === DEFAULT_VIDEO_NAME) {
            setIsVideoDefault(true);
            videoRef.current?.play();
        } else {
            setIsVideoDefault(false);
        }

        const handleVideoEnd = () => {
            if (statusRef.current === "listening" && !isLoadingRef.current && video !== DEFAULT_VIDEO_NAME) {
                setVideo(DEFAULT_VIDEO_NAME);
            }
        };

        videoElement.addEventListener("ended", handleVideoEnd);
        return () => videoElement.removeEventListener("ended", handleVideoEnd);
    }, [video]);

    // Iniciar escucha continua
    const startContinuousListening = useCallback(() => {
        if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch (_) {}
            recognitionRef.current = null;
        }

        setVideo('A1_BIENVENIDA.mp4');
        setInitCounter(true);
        videoRef.current?.pause();

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
            statusRef.current = "listening";
        };

        recognition.onresult = (event: any) => {
            if (isLoadingRef.current) return;

            const current = event.resultIndex;
            const transcriptText = event.results[current][0].transcript;
            const confidence = event.results[current][0].confidence;
            const isFinal = event.results[current].isFinal;

            setRawTranscript(transcriptText);

            if (!isFinal) {
                setIsSpeaking(true);
                if (speakingTimeoutRef.current) clearTimeout(speakingTimeoutRef.current);
                speakingTimeoutRef.current = setTimeout(() => {
                    setIsSpeaking(false);
                }, 1500);
                return;
            }

            if (isFinal && isMeaningfulSpeech(transcriptText, confidence)) {
                setIsSpeaking(false);

                if (videoRef.current && !videoRef.current.paused) {
                    setIsVideoPlaying(false);
                }
                const cleanedText = cleanTranscript(transcriptText);
                setRawTranscriptSecondary(transcriptText);
                setTranscript(cleanedText);
                setStatus("processing");
                statusRef.current = "processing";
            }
        };

        recognition.onerror = (event: any) => {
            console.error("Error de reconocimiento:", event.error);

            if (event.error === "no-speech") {
                setIsSpeaking(false);
                return;
            }

            setStatus("error");
            statusRef.current = "error";
            setIsSpeaking(false);

            // BUG 5 CORREGIDO: se usa recognitionRef.current.start() en lugar de
            // recognition.start() para no crear una closure sobre la instancia vieja.
            // Si recognition fue reemplazada, el timeout intentaría reiniciar la instancia
            // anterior generando instancias zombie que bloquean el micrófono.
            setTimeout(() => {
                if (recognitionRef.current) {
                    try { recognitionRef.current.start(); } catch (_) {}
                }
            }, 1000);
        };

        recognition.onend = () => {
            setIsSpeaking(false);

            if (isLoadingRef.current) return;

            // BUG 5 CORREGIDO: igual que en onerror, usar recognitionRef.current
            // para reiniciar siempre la instancia activa, no la del closure.
            if (statusRef.current !== "error" && recognitionRef.current) {
                try { recognitionRef.current.start(); } catch (e) {
                    console.error("Error al reiniciar:", e);
                }
            }
        };

        recognitionRef.current = recognition;
        recognition.start();
    }, [isMeaningfulSpeech]);

    // Cleanup al desmontar
    useEffect(() => {
        videoRef.current?.pause();
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
                recognitionRef.current = null;
            }
            if (speakingTimeoutRef.current) clearTimeout(speakingTimeoutRef.current);
            if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
            // BUG 1 CORREGIDO: limpiar también el interval al desmontar
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, []);

    // Data layers
    useEffect(() => {
        window.dataLayer &&
            window.dataLayer.push({
                video_id: video,
                event: "video-id",
            });
    }, [video]);

    return {
        transcript,
        video,
        status,
        isVideoPlaying,
        isSpeaking,
        videoRef,
        startContinuousListening,
        queryTextAnalize,
        isVideoDefault,
        rawTranscript,
        rawTranscriptSecondary,
        validation,
        initCounter
    };
};

export { useChatbotController };