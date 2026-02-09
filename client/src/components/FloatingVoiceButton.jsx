import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from '../api/axios';
import '../styles/FloatingVoiceButton.css';

/**
 * Floating Voice Order Button
 * A floating action button (FAB) that opens voice ordering modal
 */
const FloatingVoiceButton = ({ isInline = false }) => {
    const { addToCart } = useCart();

    const [isOpen, setIsOpen] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [transcription, setTranscription] = useState('');
    const [interimText, setInterimText] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [detectedItems, setDetectedItems] = useState([]);

    const recognitionRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    // Initialize Speech Recognition
    const initSpeechRecognition = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn('Speech recognition not supported in this browser.');
            return null;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-IN';

        recognition.onresult = (event) => {
            let interim = '';
            let final = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final += event.results[i][0].transcript;
                } else {
                    interim += event.results[i][0].transcript;
                }
            }

            if (final) setTranscription(prev => prev + ' ' + final);
            setInterimText(interim);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            if (event.error === 'not-allowed') {
                setError('Microphone access denied. Please allow permissions.');
            }
        };

        return recognition;
    };

    const startRecording = async () => {
        setTranscription('');
        setInterimText('');
        setError('');
        setMessage('');
        setDetectedItems([]);
        setIsRecording(true);

        // Start Web Speech API for real-time feedback
        const recognition = initSpeechRecognition();
        if (recognition) {
            recognitionRef.current = recognition;
            recognition.start();
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100
                }
            });

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm'
            });

            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                await processAudioOrder(audioBlob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();

        } catch (err) {
            console.error('Error accessing microphone:', err);
            setError('Could not access microphone. Please check permissions.');
            setIsRecording(false);
            if (recognitionRef.current) recognitionRef.current.stop();
        }
    };

    const stopRecording = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setIsProcessing(true);
        }
    };

    const processAudioOrder = async (audioBlob) => {
        try {
            const formData = new FormData();
            formData.append('audio', audioBlob, 'voice-order.webm');

            const response = await axios.post('/api/voice-order', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                timeout: 60000
            });

            if (response.data.success) {
                setTranscription(response.data.transcription);
                setMessage(response.data.message);
                setDetectedItems(response.data.items);

                if (response.data.items && response.data.items.length > 0) {
                    response.data.items.forEach(item => {
                        for (let i = 0; i < item.quantity; i++) {
                            addToCart({
                                id: item._id,
                                name: item.name,
                                price: item.price,
                                image: item.imageURL
                            });
                        }
                    });

                    setTimeout(() => {
                        setMessage(prev => prev + ' - Items added to cart!');
                    }, 500);
                }
            } else {
                setError(response.data.error || 'Failed to process voice order');
            }

        } catch (err) {
            console.error('Error processing voice order:', err);

            if (err.code === 'ECONNABORTED') {
                setError('Request timeout. Please try again with a shorter recording.');
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Failed to process voice order. Please try again.');
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const cancelRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            const stream = mediaRecorderRef.current.stream;
            mediaRecorderRef.current.stop();
            stream.getTracks().forEach(track => track.stop());

            setIsRecording(false);
            setIsProcessing(false);
            audioChunksRef.current = [];
        }
    };

    const closeModal = () => {
        if (isRecording) {
            stopRecording();
        }
        setIsOpen(false);
        setTranscription('');
        setInterimText('');
        setMessage('');
        setError('');
        setDetectedItems([]);
    };

    const handleOpen = () => {
        setIsOpen(true);
        // Start recording automatically after a short delay to allow modal animation
        setTimeout(() => {
            startRecording();
        }, 500);
    };

    return (
        <>
            {/* Action Button */}
            <button
                className={isInline ? "inline-voice-btn" : "floating-voice-btn"}
                onClick={handleOpen}
                type="button"
                title="Voice Order"
                aria-label="Open voice ordering"
            >
                {isInline ? (
                    <i className="fas fa-microphone" style={{ fontSize: '16px' }}></i>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        width="28"
                        height="28"
                    >
                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                    </svg>
                )}
            </button>

            {/* Voice Order Modal - Portalled to body to escape parent transforms */}
            {isOpen && createPortal(
                <div className="voice-modal-overlay" onClick={closeModal}>
                    <div className="yt-voice-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="yt-close-btn" onClick={closeModal}>
                            <i className="fas fa-times"></i>
                        </button>

                        <div className="yt-voice-content">
                            <h2 className="yt-status">
                                {isRecording ? (interimText || transcription ? 'Listening...' : 'Say something...') :
                                    isProcessing ? 'Thinking...' :
                                        error ? 'Try again' :
                                            detectedItems.length > 0 ? 'Added to cart!' : 'Ready'}
                            </h2>

                            <div className={`yt-mic-container ${isRecording ? 'listening' : ''}`}>
                                <div className="yt-mic-rings">
                                    <div className="ring"></div>
                                    <div className="ring"></div>
                                    <div className="ring"></div>
                                </div>
                                <button
                                    className={`yt-mic-btn ${isRecording ? 'active' : ''}`}
                                    onClick={isRecording ? stopRecording : startRecording}
                                    title={isRecording ? "Stop listening" : "Start listening"}
                                >
                                    <i className="fas fa-microphone"></i>
                                </button>
                            </div>

                            <div className="yt-transcription-container">
                                <p className="yt-transcription">
                                    {transcription}
                                    <span className="yt-interim">{interimText}</span>
                                </p>
                                {!isRecording && !isProcessing && !transcription && !error && (
                                    <p className="yt-hint">Tap microphone to start</p>
                                )}
                                {error && <p className="yt-error">{error}</p>}
                            </div>

                            {detectedItems.length > 0 && (
                                <>
                                    <div className="yt-items-list">
                                        {detectedItems.map((item, index) => (
                                            <div key={index} className="yt-item-pill">
                                                <i className="fas fa-check"></i> {item.quantity}x {item.name}
                                            </div>
                                        ))}
                                    </div>
                                    <Link to="/cart" className="yt-cart-link" onClick={closeModal}>
                                        Go to Cart <i className="fas fa-arrow-right"></i>
                                    </Link>
                                </>
                            )}
                        </div>

                        <div className="yt-footer">
                            <p>Try: "I want 2 Chocolate Cakes and a Strawberry Tarte"</p>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

export default FloatingVoiceButton;
