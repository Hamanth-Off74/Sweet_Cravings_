import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import FestivalAnimation from './FestivalAnimation';
import '../styles/OfferBanner.css';

function OfferBanner() {
    const [offers, setOffers] = useState([]);
    const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOffers();
    }, []);

    // Auto-rotate offers every 5 seconds
    useEffect(() => {
        if (offers.length > 1) {
            const interval = setInterval(() => {
                setCurrentOfferIndex((prev) => (prev + 1) % offers.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [offers.length]);

    const fetchOffers = async () => {
        try {
            const response = await axios.get('/api/offers');
            setOffers(response.data);
        } catch (error) {
            console.error('Error fetching offers:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || offers.length === 0) {
        return null;
    }

    const currentOffer = offers[currentOfferIndex];

    return (
        <div className="offer-banner-container">
            <div className="offer-banner">
                {/* Festival Animation based on admin selection */}
                <FestivalAnimation type={currentOffer.festivalAnimation} />

                <div className="offer-banner-content">
                    <div className="offer-icon">
                        <i className="fas fa-tags"></i>
                    </div>

                    <div className="offer-details">
                        <span className="offer-label">Special Offer</span>
                        <h3 className="offer-title">{currentOffer.title}</h3>
                        <p className="offer-description">{currentOffer.description}</p>
                    </div>

                    <div className="offer-value">
                        <span className="discount-amount">
                            {currentOffer.discountType === 'percentage'
                                ? `${currentOffer.discountValue}% OFF`
                                : `₹${currentOffer.discountValue} OFF`
                            }
                        </span>
                        {currentOffer.code && (
                            <div className="offer-code">
                                <span>Use Code:</span>
                                <strong>{currentOffer.code}</strong>
                            </div>
                        )}
                    </div>

                    <Link to="/menu" className="offer-cta">
                        <span>Shop Now</span>
                        <i className="fas fa-arrow-right"></i>
                    </Link>
                </div>

                {/* Offer indicators if multiple offers */}
                {offers.length > 1 && (
                    <div className="offer-indicators">
                        {offers.map((_, index) => (
                            <button
                                key={index}
                                className={`indicator ${index === currentOfferIndex ? 'active' : ''}`}
                                onClick={() => setCurrentOfferIndex(index)}
                            />
                        ))}
                    </div>
                )}

                {/* Validity info */}
                <div className="offer-validity">
                    <i className="fas fa-clock"></i>
                    <span>
                        Valid till {new Date(currentOffer.endDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        })}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default OfferBanner;
