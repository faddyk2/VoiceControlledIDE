import { useEffect, useState } from 'react';

const useSpeechRecognition = (onResult) => {
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState(null);
    const [isListening, setIsListening] = useState(false);

    useEffect(() => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            setError('Speech recognition not supported in this browser');
            return;
        }

        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = true;
        recognition.interimResults = false;
        
        recognition.onstart = () => {
            setIsListening(true);
            setError(null);
        };

        recognition.onend = () => {
            setIsListening(false);
            // Auto-restart to maintain continuous listening
            setTimeout(() => {
                try {
                    recognition.start();
                } catch (e) {
                    console.log('Recognition restart failed:', e);
                }
            }, 1000);
        };

        recognition.onresult = (event) => {
            const currentTranscript = event.results[event.resultIndex][0].transcript;
            setTranscript(currentTranscript);
            onResult(currentTranscript);
        };

        recognition.onerror = (event) => {
            setError(event.error);
            setIsListening(false);
        };

        try {
            recognition.start();
        } catch (e) {
            setError('Failed to start speech recognition');
        }

        return () => {
            recognition.stop();
            setIsListening(false);
        };
    }, [onResult]);

    const clearTranscript = () => {
        setTranscript('');
    };

    return { transcript, error, isListening, clearTranscript };
};

export default useSpeechRecognition;
