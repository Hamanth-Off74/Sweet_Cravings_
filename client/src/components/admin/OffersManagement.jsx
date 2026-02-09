import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { FESTIVAL_SPECIAL_ITEMS, FESTIVAL_OPTIONS } from '../../data/festivalItems';

const CATEGORIES = ['All', 'Cakes', 'Cookies', 'Pies', 'Italian', 'Brownies', 'Tarts', 'Ice Cream'];
const ANIMATION_OPTIONS = [
    { value: 'none', label: 'No Animation', icon: 'fas fa-times-circle' },
    { value: 'fireworks', label: '🎆 Fireworks (New Year)', icon: 'fas fa-fire' },
    { value: 'snowfall', label: '❄️ Snowfall (Winter)', icon: 'fas fa-snowflake' },
    { value: 'confetti', label: '🎊 Confetti (Celebration)', icon: 'fas fa-birthday-cake' },
    { value: 'hearts', label: '❤️ Hearts (Valentine)', icon: 'fas fa-heart' },
    { value: 'diwali_lights', label: '🪔 Diwali Lights', icon: 'fas fa-lightbulb' },
    { value: 'holi_colors', label: '🌈 Holi Colors', icon: 'fas fa-palette' },
    { value: 'balloons', label: '🎈 Balloons (Birthday)', icon: 'fas fa-gift' }
];

function OffersManagement() {
    const { getAuthHeaders } = useAdminAuth();
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingOffer, setEditingOffer] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        discountType: 'percentage',
        discountValue: '',
        code: '',
        applicableCategories: ['All'],
        startDate: '',
        endDate: '',
        minOrderAmount: '',
        maxDiscount: '',
        festivalAnimation: 'none',
        festivalType: 'none'
    });

    useEffect(() => {
        fetchOffers();
    }, []);

    const fetchOffers = async () => {
        try {
            const response = await axios.get('/api/admin/offers', {
                headers: getAuthHeaders()
            });
            setOffers(response.data);
        } catch (error) {
            console.error('Error fetching offers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleCategoryToggle = (category) => {
        const currentCategories = formData.applicableCategories;

        if (category === 'All') {
            setFormData({
                ...formData,
                applicableCategories: ['All']
            });
        } else {
            let newCategories;
            if (currentCategories.includes(category)) {
                newCategories = currentCategories.filter(c => c !== category);
            } else {
                newCategories = [...currentCategories.filter(c => c !== 'All'), category];
            }

            if (newCategories.length === 0) {
                newCategories = ['All'];
            }

            setFormData({
                ...formData,
                applicableCategories: newCategories
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingOffer) {
                await axios.put(`/api/admin/offers/${editingOffer._id}`, formData, {
                    headers: getAuthHeaders()
                });
                alert('Offer updated successfully!');
            } else {
                await axios.post('/api/admin/offers', formData, {
                    headers: getAuthHeaders()
                });
                alert('Offer created successfully!');
            }

            fetchOffers();
            closeModal();
        } catch (error) {
            console.error('Error saving offer:', error);
            alert('Failed to save offer');
        }
    };

    const handleEdit = (offer) => {
        setEditingOffer(offer);
        setFormData({
            title: offer.title,
            description: offer.description || '',
            discountType: offer.discountType,
            discountValue: offer.discountValue.toString(),
            code: offer.code || '',
            applicableCategories: offer.applicableCategories || ['All'],
            startDate: new Date(offer.startDate).toISOString().split('T')[0],
            endDate: new Date(offer.endDate).toISOString().split('T')[0],
            minOrderAmount: offer.minOrderAmount?.toString() || '',
            maxDiscount: offer.maxDiscount?.toString() || '',
            festivalAnimation: offer.festivalAnimation || 'none',
            festivalType: offer.festivalType || 'none'
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this offer?')) return;

        try {
            await axios.delete(`/api/admin/offers/${id}`, {
                headers: getAuthHeaders()
            });
            alert('Offer deleted successfully!');
            fetchOffers();
        } catch (error) {
            console.error('Error deleting offer:', error);
            alert('Failed to delete offer');
        }
    };

    const toggleOfferStatus = async (offer) => {
        try {
            await axios.put(`/api/admin/offers/${offer._id}`, {
                ...offer,
                isActive: !offer.isActive
            }, {
                headers: getAuthHeaders()
            });
            fetchOffers();
        } catch (error) {
            console.error('Error updating offer status:', error);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingOffer(null);
        setFormData({
            title: '',
            description: '',
            discountType: 'percentage',
            discountValue: '',
            code: '',
            applicableCategories: ['All'],
            startDate: '',
            endDate: '',
            minOrderAmount: '',
            maxDiscount: '',
            festivalAnimation: 'none',
            festivalType: 'none'
        });
    };

    const isOfferActive = (offer) => {
        const now = new Date();
        const start = new Date(offer.startDate);
        const end = new Date(offer.endDate);
        return offer.isActive && start <= now && end >= now;
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '40px' }}>
                <i className="fas fa-spinner fa-spin" style={{ fontSize: '32px', color: '#ff6b6b' }}></i>
                <p style={{ marginTop: '15px', color: '#666' }}>Loading offers...</p>
            </div>
        );
    }

    return (
        <div className="offers-management">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h2 style={{ margin: '0 0 5px 0', fontSize: '22px', color: '#333', fontWeight: '600' }}>
                        <i className="fas fa-tags" style={{ marginRight: '10px', color: '#ff6b6b' }}></i>
                        Offers & Discounts
                    </h2>
                    <p style={{ margin: 0, color: '#888', fontSize: '14px' }}>{offers.length} offers configured</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    style={{
                        padding: '12px 24px',
                        background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)',
                        border: 'none',
                        borderRadius: '10px',
                        color: '#fff',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)'
                    }}
                >
                    <i className="fas fa-plus"></i>
                    Create Offer
                </button>
            </div>

            {/* Offers Grid */}
            {offers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                    <i className="fas fa-percentage" style={{ fontSize: '48px', color: '#ddd', marginBottom: '15px' }}></i>
                    <h3 style={{ margin: '0 0 10px 0', color: '#666' }}>No Offers Yet</h3>
                    <p style={{ color: '#999', margin: 0 }}>Create your first promotional offer to attract customers</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                    {offers.map(offer => (
                        <div key={offer._id} style={{
                            background: '#fff',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                            border: '1px solid #f0f0f0'
                        }}>
                            <div style={{
                                background: isOfferActive(offer)
                                    ? 'linear-gradient(135deg, #4CAF50 0%, #81C784 100%)'
                                    : 'linear-gradient(135deg, #9e9e9e 0%, #bdbdbd 100%)',
                                padding: '20px',
                                color: '#fff'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <div>
                                        <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>{offer.title}</h3>
                                        <div style={{ fontSize: '28px', fontWeight: '700' }}>
                                            {offer.discountType === 'percentage' ? `${offer.discountValue}% OFF` : `₹${offer.discountValue} OFF`}
                                        </div>
                                    </div>
                                    <div style={{
                                        background: 'rgba(255,255,255,0.2)',
                                        padding: '5px 12px',
                                        borderRadius: '20px',
                                        fontSize: '12px',
                                        fontWeight: '600'
                                    }}>
                                        {isOfferActive(offer) ? 'ACTIVE' : 'INACTIVE'}
                                    </div>
                                </div>
                            </div>

                            <div style={{ padding: '20px' }}>
                                {offer.description && (
                                    <p style={{ margin: '0 0 15px 0', color: '#666', fontSize: '14px' }}>{offer.description}</p>
                                )}

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' }}>
                                    {offer.code && (
                                        <span style={{
                                            background: '#fff3e0',
                                            color: '#e65100',
                                            padding: '6px 12px',
                                            borderRadius: '8px',
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            fontFamily: 'monospace'
                                        }}>
                                            CODE: {offer.code}
                                        </span>
                                    )}
                                    {offer.minOrderAmount > 0 && (
                                        <span style={{
                                            background: '#e3f2fd',
                                            color: '#1565c0',
                                            padding: '6px 12px',
                                            borderRadius: '8px',
                                            fontSize: '12px'
                                        }}>
                                            Min: ₹{offer.minOrderAmount}
                                        </span>
                                    )}
                                </div>

                                {/* Festival Animation Badge */}
                                {offer.festivalAnimation && offer.festivalAnimation !== 'none' && (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        marginBottom: '15px',
                                        padding: '10px 14px',
                                        background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                                        borderRadius: '10px',
                                        border: '1px solid #ffcc80'
                                    }}>
                                        <i className="fas fa-magic" style={{ color: '#f57c00', fontSize: '16px' }}></i>
                                        <div>
                                            <span style={{ fontSize: '11px', color: '#e65100', fontWeight: '600', textTransform: 'uppercase' }}>
                                                Festival Animation
                                            </span>
                                            <div style={{ fontSize: '13px', color: '#bf360c', fontWeight: '600' }}>
                                                {ANIMATION_OPTIONS.find(a => a.value === offer.festivalAnimation)?.label || offer.festivalAnimation}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div style={{ marginBottom: '15px', paddingTop: '15px', borderTop: '1px solid #f0f0f0' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#888', fontSize: '13px' }}>
                                        <i className="fas fa-calendar"></i>
                                        <span>
                                            {new Date(offer.startDate).toLocaleDateString()} - {new Date(offer.endDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        onClick={() => toggleOfferStatus(offer)}
                                        style={{
                                            flex: 1,
                                            padding: '10px',
                                            background: offer.isActive ? '#ffebee' : '#e8f5e9',
                                            border: 'none',
                                            borderRadius: '8px',
                                            color: offer.isActive ? '#c62828' : '#2e7d32',
                                            cursor: 'pointer',
                                            fontSize: '13px',
                                            fontWeight: '500'
                                        }}
                                    >
                                        <i className={`fas ${offer.isActive ? 'fa-pause' : 'fa-play'}`}></i>
                                        {offer.isActive ? ' Pause' : ' Activate'}
                                    </button>
                                    <button
                                        onClick={() => handleEdit(offer)}
                                        style={{
                                            padding: '10px 15px',
                                            background: '#e3f2fd',
                                            border: 'none',
                                            borderRadius: '8px',
                                            color: '#2196f3',
                                            cursor: 'pointer',
                                            fontSize: '13px'
                                        }}
                                    >
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(offer._id)}
                                        style={{
                                            padding: '10px 15px',
                                            background: '#ffebee',
                                            border: 'none',
                                            borderRadius: '8px',
                                            color: '#f44336',
                                            cursor: 'pointer',
                                            fontSize: '13px'
                                        }}
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000,
                    padding: '20px'
                }}>
                    <div style={{
                        background: '#fff',
                        borderRadius: '20px',
                        width: '100%',
                        maxWidth: '550px',
                        maxHeight: '90vh',
                        overflow: 'auto'
                    }}>
                        <div style={{
                            position: 'sticky',
                            top: 0,
                            background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)',
                            padding: '20px 25px',
                            borderRadius: '20px 20px 0 0',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <h3 style={{ margin: 0, color: '#fff', fontSize: '20px', fontWeight: '600' }}>
                                {editingOffer ? 'Edit Offer' : 'Create New Offer'}
                            </h3>
                            <button onClick={closeModal} style={{
                                background: 'rgba(255,255,255,0.2)',
                                border: 'none',
                                borderRadius: '50%',
                                width: '36px',
                                height: '36px',
                                color: '#fff',
                                fontSize: '18px',
                                cursor: 'pointer'
                            }}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ padding: '25px' }}>
                            {/* Title */}
                            <div style={{ marginBottom: '18px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#555', fontSize: '14px' }}>
                                    Offer Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g., Holiday Special, Weekend Deal"
                                    style={{ width: '100%', padding: '12px 16px', border: '1px solid #e0e0e0', borderRadius: '10px', fontSize: '14px' }}
                                />
                            </div>

                            {/* Description */}
                            <div style={{ marginBottom: '18px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#555', fontSize: '14px' }}>
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Brief description of the offer"
                                    rows={2}
                                    style={{ width: '100%', padding: '12px 16px', border: '1px solid #e0e0e0', borderRadius: '10px', fontSize: '14px', resize: 'vertical' }}
                                />
                            </div>

                            {/* Discount Type & Value */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '18px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#555', fontSize: '14px' }}>
                                        Discount Type *
                                    </label>
                                    <select
                                        name="discountType"
                                        value={formData.discountType}
                                        onChange={handleChange}
                                        required
                                        style={{ width: '100%', padding: '12px 16px', border: '1px solid #e0e0e0', borderRadius: '10px', fontSize: '14px', cursor: 'pointer' }}
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount (₹)</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#555', fontSize: '14px' }}>
                                        Discount Value *
                                    </label>
                                    <input
                                        type="number"
                                        name="discountValue"
                                        value={formData.discountValue}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        placeholder={formData.discountType === 'percentage' ? '10' : '50'}
                                        style={{ width: '100%', padding: '12px 16px', border: '1px solid #e0e0e0', borderRadius: '10px', fontSize: '14px' }}
                                    />
                                </div>
                            </div>

                            {/* Promo Code */}
                            <div style={{ marginBottom: '18px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#555', fontSize: '14px' }}>
                                    Promo Code (Optional)
                                </label>
                                <input
                                    type="text"
                                    name="code"
                                    value={formData.code}
                                    onChange={handleChange}
                                    placeholder="e.g., SWEET20"
                                    style={{ width: '100%', padding: '12px 16px', border: '1px solid #e0e0e0', borderRadius: '10px', fontSize: '14px', textTransform: 'uppercase' }}
                                />
                            </div>

                            {/* Date Range */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '18px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#555', fontSize: '14px' }}>
                                        Start Date *
                                    </label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        required
                                        style={{ width: '100%', padding: '12px 16px', border: '1px solid #e0e0e0', borderRadius: '10px', fontSize: '14px' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#555', fontSize: '14px' }}>
                                        End Date *
                                    </label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        required
                                        style={{ width: '100%', padding: '12px 16px', border: '1px solid #e0e0e0', borderRadius: '10px', fontSize: '14px' }}
                                    />
                                </div>
                            </div>

                            {/* Categories */}
                            <div style={{ marginBottom: '18px' }}>
                                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500', color: '#555', fontSize: '14px' }}>
                                    Applicable Categories
                                </label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {CATEGORIES.map(cat => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => handleCategoryToggle(cat)}
                                            style={{
                                                padding: '8px 16px',
                                                border: formData.applicableCategories.includes(cat) ? 'none' : '1px solid #e0e0e0',
                                                borderRadius: '20px',
                                                background: formData.applicableCategories.includes(cat) ? '#ff6b6b' : '#fff',
                                                color: formData.applicableCategories.includes(cat) ? '#fff' : '#666',
                                                fontSize: '13px',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Festival Special Combo */}
                            <div style={{ marginBottom: '18px' }}>
                                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#333', fontSize: '15px' }}>
                                    <i className="fas fa-gift" style={{ marginRight: '8px', color: '#ff6b6b' }}></i>
                                    Festival Special Combo (Displays on Menu)
                                </label>
                                <p style={{ fontSize: '12px', color: '#888', marginBottom: '12px' }}>
                                    Select a festival to show special items on the website
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }}>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, festivalType: 'none' })}
                                        style={{
                                            padding: '12px 14px',
                                            border: formData.festivalType === 'none' ? 'none' : '1px solid #e0e0e0',
                                            borderRadius: '12px',
                                            background: formData.festivalType === 'none' ? '#f5f5f5' : '#fff',
                                            color: '#666',
                                            fontSize: '13px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        ❌ No Festival
                                    </button>
                                    {FESTIVAL_OPTIONS.map(festival => (
                                        <button
                                            key={festival.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, festivalType: festival.value })}
                                            style={{
                                                padding: '12px 14px',
                                                border: formData.festivalType === festival.value ? 'none' : '1px solid #e0e0e0',
                                                borderRadius: '12px',
                                                background: formData.festivalType === festival.value
                                                    ? festival.gradient
                                                    : '#fff',
                                                color: formData.festivalType === festival.value ? '#fff' : '#666',
                                                fontSize: '13px',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                textAlign: 'left',
                                                boxShadow: formData.festivalType === festival.value
                                                    ? '0 4px 15px rgba(0,0,0,0.2)'
                                                    : 'none'
                                            }}
                                        >
                                            {festival.emoji} {festival.name}
                                        </button>
                                    ))}
                                </div>

                                {/* Preview Selected Festival Items */}
                                {formData.festivalType && formData.festivalType !== 'none' && FESTIVAL_SPECIAL_ITEMS[formData.festivalType] && (
                                    <div style={{
                                        marginTop: '15px',
                                        padding: '15px',
                                        background: FESTIVAL_SPECIAL_ITEMS[formData.festivalType].gradient,
                                        borderRadius: '12px',
                                        color: '#fff'
                                    }}>
                                        <div style={{ fontWeight: '600', marginBottom: '10px', fontSize: '14px' }}>
                                            {FESTIVAL_SPECIAL_ITEMS[formData.festivalType].emoji} {FESTIVAL_SPECIAL_ITEMS[formData.festivalType].name} Special Items:
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            {FESTIVAL_SPECIAL_ITEMS[formData.festivalType].items.map((item, idx) => (
                                                <span key={idx} style={{
                                                    background: 'rgba(255,255,255,0.25)',
                                                    padding: '6px 12px',
                                                    borderRadius: '20px',
                                                    fontSize: '12px',
                                                    fontWeight: '500'
                                                }}>
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Festival Animation */}
                            <div style={{ marginBottom: '18px' }}>
                                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500', color: '#555', fontSize: '14px' }}>
                                    <i className="fas fa-magic" style={{ marginRight: '8px', color: '#ff6b6b' }}></i>
                                    Festival Animation (Shows on Website)
                                </label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
                                    {ANIMATION_OPTIONS.map(anim => (
                                        <button
                                            key={anim.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, festivalAnimation: anim.value })}
                                            style={{
                                                padding: '12px 16px',
                                                border: formData.festivalAnimation === anim.value ? 'none' : '1px solid #e0e0e0',
                                                borderRadius: '12px',
                                                background: formData.festivalAnimation === anim.value
                                                    ? 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)'
                                                    : '#fff',
                                                color: formData.festivalAnimation === anim.value ? '#fff' : '#666',
                                                fontSize: '13px',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                textAlign: 'left',
                                                boxShadow: formData.festivalAnimation === anim.value
                                                    ? '0 4px 15px rgba(255, 107, 107, 0.3)'
                                                    : 'none'
                                            }}
                                        >
                                            {anim.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Min Order & Max Discount */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '18px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#555', fontSize: '14px' }}>
                                        Min Order Amount
                                    </label>
                                    <input
                                        type="number"
                                        name="minOrderAmount"
                                        value={formData.minOrderAmount}
                                        onChange={handleChange}
                                        min="0"
                                        placeholder="0"
                                        style={{ width: '100%', padding: '12px 16px', border: '1px solid #e0e0e0', borderRadius: '10px', fontSize: '14px' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#555', fontSize: '14px' }}>
                                        Max Discount (₹)
                                    </label>
                                    <input
                                        type="number"
                                        name="maxDiscount"
                                        value={formData.maxDiscount}
                                        onChange={handleChange}
                                        min="0"
                                        placeholder="No limit"
                                        style={{ width: '100%', padding: '12px 16px', border: '1px solid #e0e0e0', borderRadius: '10px', fontSize: '14px' }}
                                    />
                                </div>
                            </div>

                            {/* Submit */}
                            <button type="submit" style={{
                                width: '100%',
                                padding: '14px',
                                background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)',
                                border: 'none',
                                borderRadius: '10px',
                                color: '#fff',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                marginTop: '10px'
                            }}>
                                {editingOffer ? 'Update Offer' : 'Create Offer'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OffersManagement;
