import React, { useState, useRef } from 'react';
import { useCart } from '../context/CartContext';
import axios from '../api/axios';
import '../styles/VoiceOrder.css';

/**
 * VoiceOrder Component
 * Allows users to record their dessert order using voice and automatically adds items to cart
 * Uses MediaRecorder API for recording and AssemblyAI for transcription
 */
const VoiceOrder = () => {
    const { addToCart } = useCart();
    
    // Component state
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [transcription, setTranscription] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [detectedItems, setDetectedItems] = useState([]);
    
    // Refs for MediaRecorder
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    /**
     * Start recording audio from user's microphone
     */
    const startRecording = async () => {
        try {
            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100
                } 
            });

            // Create MediaRecorder instance
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm'
            });

            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            // Collect audio data chunks
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            // Handle recording stop
            mediaRecorder.onstop = async () => {
                // Create audio blob from chunks
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                
                // Send to backend for processing
                await processAudioOrder(audioBlob);

                // Stop all tracks to release microphone
                stream.getTracks().forEach(track => track.stop());
            };

            // Start recording
            mediaRecorder.start();
            setIsRecording(true);
            setError('');
            setMessage('');
            setTranscription('');
            setDetectedItems([]);

            console.log('Recording started...');

        } catch (err) {
            console.error('Error accessing microphone:', err);
            setError('Could not access microphone. Please check permissions.');
        }
    };

    /**
     * Stop recording audio
     */
    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setIsProcessing(true);
            console.log('Recording stopped. Processing...');
        }
    };

    /**
     * Send audio to backend for transcription and order parsing
     * @param {Blob} audioBlob - Recorded audio data
     */
    const processAudioOrder = async (audioBlob) => {
        try {
            // Create FormData to send audio file
            const formData = new FormData();
            formData.append('audio', audioBlob, 'voice-order.webm');

            console.log('Sending audio to backend...');

            // Send to backend API
            const response = await axios.post('/api/voice-order', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                timeout: 60000 // 60 second timeout for transcription
            });

            if (response.data.success) {
                setTranscription(response.data.transcription);
                setMessage(response.data.message);
                setDetectedItems(response.data.items);

                // Automatically add detected items to cart
                if (response.data.items && response.data.items.length > 0) {
                    response.data.items.forEach(item => {
                        // Add each item to cart with the correct format
                        for (let i = 0; i < item.quantity; i++) {
                            addToCart({
                                id: item._id,
                                name: item.name,
                                price: item.price,
                                image: item.imageURL
                            });
                        }
                    });
                    
                    // Show success message
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

    /**
     * Cancel recording
     */
    const cancelRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            // Stop the recording without processing
            const stream = mediaRecorderRef.current.stream;
            mediaRecorderRef.current.stop();
            stream.getTracks().forEach(track => track.stop());
            
            setIsRecording(false);
            setIsProcessing(false);
            audioChunksRef.current = [];
            
            console.log('Recording cancelled');
        }
    };

    return (
        <div className="voice-order-container">
            <div className="voice-order-header">
                <h3>🎤 Voice Order</h3>
                <p>Click the button and speak your dessert order</p>
            </div>

            <div className="voice-order-controls">
                {!isRecording && !isProcessing && (
                    <button 
                        className="voice-btn voice-btn-start"
                        onClick={startRecording}
                        disabled={isProcessing}
                    >
                        <span className="mic-icon">🎙️</span>
                        Start Recording
                    </button>
                )}

                {isRecording && (
                    <div className="recording-active">
                        <button 
                            className="voice-btn voice-btn-stop"
                            onClick={stopRecording}
                        >
                            <span className="stop-icon">⏹️</span>
                            Stop & Process
                        </button>
                        <button 
                            className="voice-btn voice-btn-cancel"
                            onClick={cancelRecording}
                        >
                            <span className="cancel-icon">❌</span>
                            Cancel
                        </button>
                        <div className="recording-indicator">
                            <span className="recording-dot"></span>
                            Recording...
                        </div>
                    </div>
                )}

                {isProcessing && (
                    <div className="processing-indicator">
                        <div className="spinner"></div>
                        <p>Processing your order...</p>
                    </div>
                )}
            </div>

            {/* Display transcription */}
            {transcription && (
                <div className="voice-result voice-transcription">
                    <h4>📝 What you said:</h4>
                    <p>"{transcription}"</p>
                </div>
            )}

            {/* Display success message */}
            {message && !error && (
                <div className="voice-result voice-success">
                    <h4>✅ {message}</h4>
                </div>
            )}

            {/* Display detected items */}
            {detectedItems.length > 0 && (
                <div className="voice-result voice-items">
                    <h4>🛒 Items Detected:</h4>
                    <ul>
                        {detectedItems.map((item, index) => (
                            <li key={index}>
                                {item.quantity}x {item.name} - ₹{(item.price * item.quantity).toFixed(2)}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Display error */}
            {error && (
                <div className="voice-result voice-error">
                    <h4>❌ Error:</h4>
                    <p>{error}</p>
                </div>
            )}

            {/* Usage tips */}
            <div className="voice-order-tips">
                <h4>💡 Tips for better results:</h4>
                <ul>
                    <li>Speak clearly and at a normal pace</li>
                    <li>Mention quantities: "Two chocolate cakes and one vanilla ice cream"</li>
                    <li>Use full dessert names when possible</li>
                    <li>Avoid background noise for best accuracy</li>
                </ul>
            </div>
        </div>
    );
};

export default VoiceOrder;
