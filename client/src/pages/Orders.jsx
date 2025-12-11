import { useState, useEffect } from 'react';
import axios from '../api/axios';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders');
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeStyle = (status) => {
    const styles = {
      pending: { background: '#ffd700', color: '#000' },
      processing: { background: '#ff9800', color: '#fff' },
      shipped: { background: '#2196f3', color: '#fff' },
      delivered: { background: '#4caf50', color: '#fff' },
      cancelled: { background: '#f44336', color: '#fff' }
    };
    return styles[status] || styles.pending;
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.orderStatus.toLowerCase() === filterStatus);

  if (loading) {
    return (
      <div className="container" style={{textAlign: 'center', padding: '60px 20px'}}>
        <i className="fas fa-spinner fa-spin" style={{fontSize: '40px', color: '#ff6161'}}></i>
        <p style={{marginTop: '20px', fontSize: '16px', color: '#666'}}>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="cart-section">
      <div className="container">
        <div style={{textAlign: 'center', marginBottom: '40px'}}>
          <h1 className="section-title" style={{color: '#ff6161', fontSize: '36px', marginBottom: '10px'}}>My Orders</h1>
          <p style={{color: '#666', fontSize: '14px'}}>Track your order status and view order history</p>
        </div>

        {/* Filter Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          marginBottom: '30px',
          flexWrap: 'wrap'
        }}>
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              style={{
                padding: '10px 24px',
                border: 'none',
                borderRadius: '25px',
                background: filterStatus === status ? '#ff6161' : '#fff',
                color: filterStatus === status ? '#fff' : '#666',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                textTransform: 'capitalize',
                transition: 'all 0.3s',
                boxShadow: filterStatus === status ? '0 4px 12px rgba(255, 97, 97, 0.3)' : '0 2px 6px rgba(0,0,0,0.1)'
              }}
            >
              {status === 'all' ? 'All Orders' : status}
            </button>
          ))}
        </div>
        
        {filteredOrders.length === 0 ? (
          <div style={{textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
            <i className="fas fa-box-open" style={{fontSize: '80px', color: '#ffcdd2', marginBottom: '20px'}}></i>
            <h2 style={{color: '#333', marginBottom: '10px'}}>No orders found</h2>
            <p style={{color: '#666', marginBottom: '20px'}}>
              {filterStatus === 'all' ? 'Start ordering your favorite desserts!' : `No ${filterStatus} orders`}
            </p>
            <a href="/menu" style={{
              display: 'inline-block',
              padding: '12px 30px',
              background: 'linear-gradient(135deg, #ff6161 0%, #ff8787 100%)',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600'
            }}>
              Browse Menu
            </a>
          </div>
        ) : (
          <div style={{maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px'}}>
            {filteredOrders.map(order => (
              <div key={order.orderId} style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '25px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                border: '1px solid #f0f0f0'
              }}>
                {/* Order Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                  paddingBottom: '15px',
                  borderBottom: '2px solid #f5f5f5'
                }}>
                  <div>
                    <h3 style={{
                      margin: '0 0 5px 0',
                      fontSize: '18px',
                      color: '#ff6161',
                      fontWeight: '600'
                    }}>
                      Order #{order.orderId}
                    </h3>
                    <p style={{
                      margin: 0,
                      fontSize: '13px',
                      color: '#999',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <i className="far fa-calendar"></i>
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                  <span style={{
                    padding: '8px 20px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '600',
                    textTransform: 'capitalize',
                    ...getStatusBadgeStyle(order.orderStatus)
                  }}>
                    Order {order.orderStatus}
                  </span>
                </div>

                {/* Order Items */}
                <div style={{marginBottom: '20px'}}>
                  {order.items.map((item, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      padding: '12px 0',
                      borderBottom: index < order.items.length - 1 ? '1px solid #f5f5f5' : 'none'
                    }}>
                      <img src={item.image} alt={item.name} style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }} />
                      <div style={{flex: 1}}>
                        <h4 style={{
                          margin: '0 0 4px 0',
                          fontSize: '15px',
                          color: '#333',
                          fontWeight: '600'
                        }}>
                          {item.name}
                        </h4>
                        <p style={{
                          margin: 0,
                          fontSize: '13px',
                          color: '#999'
                        }}>
                          × Quantity: {item.quantity}
                        </p>
                      </div>
                      <div style={{
                        fontSize: '15px',
                        fontWeight: '600',
                        color: '#ff6161'
                      }}>
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '15px',
                  borderTop: '2px solid #f5f5f5'
                }}>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#333',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <i className="fas fa-money-bill-wave" style={{color: '#ff6161'}}></i>
                    Total: <span style={{color: '#ff6161'}}>₹{order.total.toFixed(2)}</span>
                  </div>
                  <div style={{display: 'flex', gap: '10px'}}>
                    <button style={{
                      padding: '10px 20px',
                      border: 'none',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #ff6161 0%, #ff8787 100%)',
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      transition: 'transform 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                      View Details
                    </button>
                    <button style={{
                      padding: '10px 20px',
                      border: '2px solid #ff6161',
                      borderRadius: '8px',
                      background: '#fff',
                      color: '#ff6161',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = '#ff6161';
                      e.target.style.color = '#fff';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = '#fff';
                      e.target.style.color = '#ff6161';
                    }}
                    >
                      Track Order
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
