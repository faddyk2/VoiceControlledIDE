import { useEffect, useState } from 'react';

const useSpeechRecognition = (onResult) => {
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = true;
        recognition.onresult = (event) => {
            const currentTranscript = event.results[event.resultIndex][0].transcript;
            setTranscript(currentTranscript);
            onResult(currentTranscript);
        };

        recognition.onerror = (event) => {
            setError(event.error);
        };
        recognition.onSpeechEnd = () => {
            recognition.start();

        };

        recognition.start();

        return () => {
            
        };
    }, [onResult]);

    const clearTranscript = () => {
        setTranscript('');
    };

    return { transcript, error, clearTranscript };
};

export default useSpeechRecognition;
