import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { FESTIVAL_SPECIAL_ITEMS } from '../data/festivalItems';
import '../styles/FestivalSpecials.css';

function FestivalSpecials() {
    const [activeOffer, setActiveOffer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchActiveOffer();
    }, []);

    const fetchActiveOffer = async () => {
        try {
            const response = await axios.get('/api/offers');
            // Find offer with festival type
            const festivalOffer = response.data.find(offer =>
                offer.festivalType && offer.festivalType !== 'none'
            );
            setActiveOffer(festivalOffer);
        } catch (error) {
            console.error('Error fetching offers:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !activeOffer || !activeOffer.festivalType || activeOffer.festivalType === 'none') {
        return null;
    }

    const festivalData = FESTIVAL_SPECIAL_ITEMS[activeOffer.festivalType];
    if (!festivalData) return null;

    return (
        <div className="festival-specials-container">
            <div
                className="festival-specials-banner"
                style={{ background: festivalData.gradient }}
            >
                <div className="festival-header">
                    <span className="festival-emoji">{festivalData.emoji}</span>
                    <div className="festival-title-wrapper">
                        <h2 className="festival-title">{festivalData.name} Specials</h2>
                        <p className="festival-subtitle">Limited Time Festival Offers</p>
                    </div>
                    {activeOffer.discountValue > 0 && (
                        <div className="festival-discount-badge">
                            {activeOffer.discountType === 'percentage'
                                ? `${activeOffer.discountValue}% OFF`
                                : `₹${activeOffer.discountValue} OFF`
                            }
                        </div>
                    )}
                </div>

                <div className="festival-items-scroll">
                    {festivalData.items.map((item, index) => (
                        <div key={index} className="festival-item-card">
                            <div className="festival-item-icon">
                                <i className="fas fa-cookie-bite"></i>
                            </div>
                            <span className="festival-item-name">{item}</span>
                            <button className="festival-item-btn">
                                <i className="fas fa-plus"></i>
                            </button>
                        </div>
                    ))}
                </div>

                {activeOffer.code && (
                    <div className="festival-promo-code">
                        <span>Use Code:</span>
                        <strong>{activeOffer.code}</strong>
                        <button onClick={() => navigator.clipboard.writeText(activeOffer.code)}>
                            <i className="fas fa-copy"></i>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FestivalSpecials;
