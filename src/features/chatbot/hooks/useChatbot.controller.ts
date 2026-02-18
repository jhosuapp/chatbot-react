import { useRef, useState, useEffect } from "react";
import { StatusMicrophone } from "../interfaces/chatbot.interface";
import { useTextAnalizeQuery } from "./useTextAnalize.query";
import { AnalysisIds } from "../interfaces/textAnalize.interface";

const useChatbotController = () => {
    const [status, setStatus] = useState<StatusMicrophone>("idle");
    const [transcript, setTranscript] = useState("");
    const [video, setVideo] = useState("/INTRONEW.mp4");
    const [isVideoPlaying, setIsVideoPlaying] = useState(true);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const recognitionRef = useRef<any>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    // @ts-ignore
    const speakingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    // @ts-ignore
    const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isLoadingRef = useRef(false);
    const statusRef = useRef<StatusMicrophone>("idle");
    const queryTextAnalize = useTextAnalizeQuery(transcript);

    document.body.addEventListener('click', ()=>{
        videoRef.current?.play();
    });

    useEffect(() => {
        isLoadingRef.current = queryTextAnalize.isLoading;
    }, [queryTextAnalize.isLoading]);

    useEffect(() => {
        statusRef.current = status;
    }, [status]);

    // ── 1. Video según category del endpoint ──────────────────────────────────
    const getVideoByCategory = (category: AnalysisIds) => {
        if (category) return `${category}.mp4`;
        
        return "/diagnostico.mp4";
    };

    // ── Habla con sentido real: para pausar video y enviar al endpoint ─────────
    const isMeaningfulSpeech = (text: string, confidence: number): boolean => {
        const trimmed = text.trim();
        const wordCount = trimmed.split(/\s+/).filter(Boolean).length;
        if (wordCount < 3) return false;
        if (confidence < 0.75) return false;
        const words = trimmed.toLowerCase().split(/\s+/);
        const uniqueWords = new Set(words);
        if (uniqueWords.size === 1 && words.length > 1) return false;
        return true;
    };

    // ── 2. Controlar video y reconocimiento según isLoading ───────────────────
    useEffect(() => {
        if (queryTextAnalize.isLoading) {
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
                setIsVideoPlaying(false);
            }
            if (recognitionRef.current) {
                try { recognitionRef.current.stop(); } catch (_) {}
            }
        }
    }, [queryTextAnalize.isLoading]);

    // ── 3. Aplicar nuevo video y reproducirlo cuando llega la respuesta ───────
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

    // ── Timeout de inactividad ─────────────────────────────────────────────────
    useEffect(() => {
        if (video === "/default-wait-answer.mp4" && status === "listening") {
            if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
            inactivityTimeoutRef.current = setTimeout(() => {
                setStatus("idle");
                setIsVideoPlaying(false);
                setVideo("/welcome.mp4");
                videoRef.current?.pause();
                window.location.reload();
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

        const handleVideoEnd = () => {
            if (statusRef.current === "listening" && !isLoadingRef.current && video !== "/default-wait-answer.mp4") {
                setVideo("/default-wait-answer.mp4");
            }
        };

        videoElement.addEventListener("ended", handleVideoEnd);
        return () => videoElement.removeEventListener("ended", handleVideoEnd);
    }, [video]);

    // ── Iniciar escucha continua ───────────────────────────────────────────────
    const startContinuousListening = () => {
        setVideo('A1_BIENVENIDA.mp4');
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

            // ── Animación: cualquier resultado intermedio activa isSpeaking ───
            if (!isFinal) {
                setIsSpeaking(true);
                if (speakingTimeoutRef.current) clearTimeout(speakingTimeoutRef.current);
                // Apagar animación si deja de hablar por 1.5s
                speakingTimeoutRef.current = setTimeout(() => {
                    setIsSpeaking(false);
                }, 1500);
                return;
            }

            // ── Acción real: solo si tiene sentido semántico ───────────────────
            if (isFinal && isMeaningfulSpeech(transcriptText, confidence)) {
                setIsSpeaking(false);

                if (videoRef.current && !videoRef.current.paused) {
                    videoRef.current.pause();
                    setIsVideoPlaying(false);
                }

                setTranscript(transcriptText);
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

            setTimeout(() => {
                if (recognitionRef.current) {
                    try { recognition.start(); } catch (_) {}
                }
            }, 1000);
        };

        recognition.onend = () => {
            setIsSpeaking(false);

            if (isLoadingRef.current) return;

            if (statusRef.current !== "error" && recognitionRef.current) {
                try { recognition.start(); } catch (e) {
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
            statusRef.current = "idle";
            setIsSpeaking(false);
        }

        if (speakingTimeoutRef.current) clearTimeout(speakingTimeoutRef.current);
        if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
    };

    useEffect(() => {
        videoRef.current?.pause();
        return () => {
            if (recognitionRef.current) recognitionRef.current.stop();
            if (speakingTimeoutRef.current) clearTimeout(speakingTimeoutRef.current);
            if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
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
        queryTextAnalize,
    };
};

export { useChatbotController };