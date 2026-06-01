import { useState, useEffect, useRef } from 'react';
import axios from '../../api/axios';
import { useAdminAuth } from '../../context/AdminAuthContext';

const CATEGORIES = ['Cakes', 'Cookies', 'Pies', 'Italian', 'Brownies', 'Tarts', 'Ice Cream'];

function DessertManagement() {
    const { getAuthHeaders } = useAdminAuth();
    const [desserts, setDesserts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingDessert, setEditingDessert] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        discount: '',
        category: 'Cakes',
        imageURL: '',
        rating: '0',
        reviews: '0'
    });

    useEffect(() => {
        fetchDesserts();
    }, []);

    const fetchDesserts = async () => {
        try {
            const response = await axios.get('/api/admin/desserts', {
                headers: getAuthHeaders()
            });
            setDesserts(response.data);
        } catch (error) {
            console.error('Error fetching desserts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append('image', file);

        try {
            const response = await axios.post('/api/admin/upload-image', uploadFormData, {
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                setFormData({
                    ...formData,
                    imageURL: response.data.imageURL
                });
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingDessert) {
                // Update existing dessert
                await axios.put(`/api/admin/desserts/${editingDessert._id}`, formData, {
                    headers: getAuthHeaders()
                });
                alert('Dessert updated successfully!');
            } else {
                // Add new dessert
                const response = await axios.post('/api/admin/desserts', formData, {
                    headers: getAuthHeaders()
                });
                console.log('New dessert added:', response.data);
                alert('Dessert added successfully!');
            }

            // Wait for desserts to refresh before closing modal
            await fetchDesserts();
            closeModal();
        } catch (error) {
            console.error('Error saving dessert:', error.response?.data || error.message);
            const errorMsg = error.response?.data?.error || error.message || 'Unknown error';
            alert(`Failed to save dessert: ${errorMsg}`);
        }
    };

    const handleEdit = (dessert) => {
        setEditingDessert(dessert);
        setFormData({
            name: dessert.name,
            description: dessert.description,
            price: dessert.price.toString(),
            originalPrice: dessert.originalPrice?.toString() || '',
            discount: dessert.discount?.toString() || '0',
            category: dessert.category,
            imageURL: dessert.imageURL,
            rating: dessert.rating?.toString() || '0',
            reviews: dessert.reviews?.toString() || '0'
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this dessert?')) return;

        try {
            await axios.delete(`/api/admin/desserts/${id}`, {
                headers: getAuthHeaders()
            });
            alert('Dessert deleted successfully!');
            fetchDesserts();
        } catch (error) {
            console.error('Error deleting dessert:', error);
            alert('Failed to delete dessert');
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingDessert(null);
        setFormData({
            name: '',
            description: '',
            price: '',
            originalPrice: '',
            discount: '',
            category: 'Cakes',
            imageURL: '',
            rating: '0',
            reviews: '0'
        });
    };

    const filteredDesserts = desserts.filter(dessert => {
        const matchesSearch = dessert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dessert.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !filterCategory || dessert.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '40px' }}>
                <i className="fas fa-spinner fa-spin" style={{ fontSize: '32px', color: '#ff6b6b' }}></i>
                <p style={{ marginTop: '15px', color: '#666' }}>Loading desserts...</p>
            </div>
        );
    }

    return (
        <div className="dessert-management">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h2 style={{ margin: '0 0 5px 0', fontSize: '22px', color: '#333', fontWeight: '600' }}>
                        <i className="fas fa-birthday-cake" style={{ marginRight: '10px', color: '#ff6b6b' }}></i>
                        Dessert Management
                    </h2>
                    <p style={{ margin: 0, color: '#888', fontSize: '14px' }}>{desserts.length} desserts total</p>
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
                        boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',
                        transition: 'all 0.3s ease'
                    }}
                >
                    <i className="fas fa-plus"></i>
                    Add Dessert
                </button>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1', minWidth: '200px' }}>
                    <div style={{ position: 'relative' }}>
                        <i className="fas fa-search" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }}></i>
                        <input
                            type="text"
                            placeholder="Search desserts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 12px 12px 42px',
                                border: '1px solid #e0e0e0',
                                borderRadius: '10px',
                                fontSize: '14px'
                            }}
                        />
                    </div>
                </div>
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    style={{
                        padding: '12px 20px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '10px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        minWidth: '150px'
                    }}
                >
                    <option value="">All Categories</option>
                    {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            {/* Dessert Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '20px'
            }}>
                {filteredDesserts.map(dessert => (
                    <div key={dessert._id} style={{
                        background: '#fff',
                        borderRadius: '14px',
                        overflow: 'hidden',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                        border: '1px solid #f0f0f0',
                        transition: 'all 0.3s ease'
                    }}>
                        <div style={{
                            height: '160px',
                            background: `url(${dessert.imageURL}) center/cover no-repeat`,
                            backgroundColor: '#f5f5f5',
                            position: 'relative'
                        }}>
                            <span style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: dessert.isActive !== false ? '#4CAF50' : '#ff9800',
                                color: '#fff',
                                padding: '4px 10px',
                                borderRadius: '20px',
                                fontSize: '11px',
                                fontWeight: '600'
                            }}>
                                {dessert.isActive !== false ? 'Active' : 'Inactive'}
                            </span>
                            {dessert.discount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '10px',
                                    left: '10px',
                                    background: '#ff6b6b',
                                    color: '#fff',
                                    padding: '4px 10px',
                                    borderRadius: '20px',
                                    fontSize: '11px',
                                    fontWeight: '600'
                                }}>
                                    -{dessert.discount}%
                                </span>
                            )}
                        </div>
                        <div style={{ padding: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#333' }}>{dessert.name}</h3>
                                <span style={{
                                    background: '#fff0f0',
                                    color: '#ff6b6b',
                                    padding: '3px 8px',
                                    borderRadius: '6px',
                                    fontSize: '11px',
                                    fontWeight: '500'
                                }}>
                                    {dessert.category}
                                </span>
                            </div>
                            <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#888', lineHeight: '1.4' }}>
                                {dessert.description.substring(0, 60)}...
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <span style={{ fontSize: '18px', fontWeight: '700', color: '#ff6b6b' }}>₹{dessert.price}</span>
                                    {dessert.originalPrice > dessert.price && (
                                        <span style={{ marginLeft: '8px', fontSize: '13px', color: '#aaa', textDecoration: 'line-through' }}>
                                            ₹{dessert.originalPrice}
                                        </span>
                                    )}
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={() => handleEdit(dessert)}
                                        style={{
                                            padding: '8px 12px',
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
                                        onClick={() => handleDelete(dessert._id)}
                                        style={{
                                            padding: '8px 12px',
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
                    </div>
                ))}
            </div>

            {filteredDesserts.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
                    <i className="fas fa-search" style={{ fontSize: '48px', marginBottom: '15px', opacity: 0.3 }}></i>
                    <p>No desserts found matching your criteria</p>
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
                        overflow: 'auto',
                        position: 'relative'
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
                                {editingDessert ? 'Edit Dessert' : 'Add New Dessert'}
                            </h3>
                            <button
                                onClick={closeModal}
                                style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '36px',
                                    height: '36px',
                                    color: '#fff',
                                    fontSize: '18px',
                                    cursor: 'pointer'
                                }}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ padding: '25px' }}>
                            {/* Image Upload */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555' }}>
                                    Dessert Image
                                </label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    style={{
                                        border: '2px dashed #ddd',
                                        borderRadius: '12px',
                                        padding: '30px',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        background: formData.imageURL ? `url(${formData.imageURL}) center/cover no-repeat` : '#fafafa',
                                        minHeight: '150px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'relative'
                                    }}
                                >
                                    {uploading ? (
                                        <div>
                                            <i className="fas fa-spinner fa-spin" style={{ fontSize: '24px', color: '#ff6b6b' }}></i>
                                            <p style={{ margin: '10px 0 0 0', color: '#888' }}>Uploading...</p>
                                        </div>
                                    ) : formData.imageURL ? (
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '10px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            background: 'rgba(0,0,0,0.7)',
                                            color: '#fff',
                                            padding: '8px 16px',
                                            borderRadius: '20px',
                                            fontSize: '12px'
                                        }}>
                                            Click to change image
                                        </div>
                                    ) : (
                                        <div>
                                            <i className="fas fa-cloud-upload-alt" style={{ fontSize: '32px', color: '#ccc' }}></i>
                                            <p style={{ margin: '10px 0 0 0', color: '#888' }}>Click to upload image</p>
                                        </div>
                                    )}
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                />
                            </div>

                            {/* Name */}
                            <div style={{ marginBottom: '18px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#555', fontSize: '14px' }}>
                                    Dessert Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter dessert name"
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '10px',
                                        fontSize: '14px'
                                    }}
                                />
                            </div>

                            {/* Description */}
                            <div style={{ marginBottom: '18px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#555', fontSize: '14px' }}>
                                    Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter dessert description"
                                    rows={3}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '10px',
                                        fontSize: '14px',
                                        resize: 'vertical'
                                    }}
                                />
                            </div>

                            {/* Category */}
                            <div style={{ marginBottom: '18px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#555', fontSize: '14px' }}>
                                    Category *
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '10px',
                                        fontSize: '14px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Price Row */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '18px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#555', fontSize: '14px' }}>
                                        Price (₹) *
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            border: '1px solid #e0e0e0',
                                            borderRadius: '10px',
                                            fontSize: '14px'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#555', fontSize: '14px' }}>
                                        Original Price
                                    </label>
                                    <input
                                        type="number"
                                        name="originalPrice"
                                        value={formData.originalPrice}
                                        onChange={handleChange}
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            border: '1px solid #e0e0e0',
                                            borderRadius: '10px',
                                            fontSize: '14px'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#555', fontSize: '14px' }}>
                                        Discount %
                                    </label>
                                    <input
                                        type="number"
                                        name="discount"
                                        value={formData.discount}
                                        onChange={handleChange}
                                        min="0"
                                        max="100"
                                        placeholder="0"
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            border: '1px solid #e0e0e0',
                                            borderRadius: '10px',
                                            fontSize: '14px'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                style={{
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
                                }}
                            >
                                {editingDessert ? 'Update Dessert' : 'Add Dessert'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DessertManagement;
