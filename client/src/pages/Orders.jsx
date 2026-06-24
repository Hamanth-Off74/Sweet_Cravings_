import { useState, useEffect } from 'react';
import axios from '../api/axios';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [trackingOrder, setTrackingOrder] = useState(null);

  const getFakeOrders = () => [
    {
      orderId: 'SC-84920-CBE',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
      orderStatus: 'processing',
      items: [
        {
          name: 'Chocolate Fudge Brownie Ice Cream',
          quantity: 2,
          price: 249,
          imageURL: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500'
        },
        {
          name: 'Fudgy Chocolate Brownie',
          quantity: 1,
          price: 120,
          imageURL: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500'
        }
      ],
      total: 618.00,
      address: 'Flat 4B, Lotus Apartments, Peelamedu, Coimbatore - 641004',
      deliveryPartner: {
        name: 'Ramesh Krishnan',
        phone: '+91 94421 87654',
        vehicle: 'TVS Apache (TN-37-BY-8821)'
      },
      trackingSteps: [
        { title: 'Order Placed', time: '10:15 AM', done: true },
        { title: 'Order Confirmed', time: '10:20 AM', done: true },
        { title: 'Preparing Dessert', time: '10:30 AM', done: true },
        { title: 'Out for Delivery', time: 'Estimated: 11:15 AM', done: false },
        { title: 'Delivered', time: 'Estimated: 11:30 AM', done: false }
      ]
    },
    {
      orderId: 'SC-83911-CBE',
      createdAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString(), // 1 day ago
      orderStatus: 'delivered',
      items: [
        {
          name: 'Fruit Tart',
          quantity: 1,
          price: 180,
          imageURL: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=500'
        }
      ],
      total: 180.00,
      address: '15, D.B. Road, RS Puram, Coimbatore - 641002',
      deliveryPartner: {
        name: 'Suresh Kumar',
        phone: '+91 98432 10987',
        vehicle: 'Honda Activa (TN-37-CZ-4512)'
      },
      trackingSteps: [
        { title: 'Order Placed', time: '04:10 PM', done: true },
        { title: 'Order Confirmed', time: '04:15 PM', done: true },
        { title: 'Preparing Dessert', time: '04:30 PM', done: true },
        { title: 'Out for Delivery', time: '04:45 PM', done: true },
        { title: 'Delivered', time: '05:05 PM', done: true }
      ]
    }
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders');
      console.log('Orders received:', response.data);
      let data = response.data || [];
      if (data.length > 0) {
        data = data.map(order => {
          const streetStr = order.address?.street || '12, Peelamedu';
          const cityStr = order.address?.city || 'Coimbatore';
          const zipStr = order.address?.zipCode || '641004';
          const formattedAddress = `${streetStr}, ${cityStr} - ${zipStr}`;

          const status = (order.orderStatus || 'pending').toLowerCase();
          const steps = [
            { title: 'Order Placed', time: '10:00 AM', done: true },
            { title: 'Order Confirmed', time: '10:05 AM', done: ['processing', 'shipped', 'delivered'].includes(status) },
            { title: 'Preparing Dessert', time: '10:15 AM', done: ['processing', 'shipped', 'delivered'].includes(status) },
            { title: 'Out for Delivery', time: '10:35 AM', done: ['shipped', 'delivered'].includes(status) },
            { title: 'Delivered', time: '10:55 AM', done: status === 'delivered' }
          ];

          return {
            ...order,
            address: formattedAddress,
            deliveryPartner: {
              name: 'Arun Prasath',
              phone: '+91 97890 12345',
              vehicle: 'Yamaha FZ (TN-37-CY-5521)'
            },
            trackingSteps: steps
          };
        });
      } else {
        data = getFakeOrders();
      }
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders(getFakeOrders());
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
    : orders.filter(order => (order.orderStatus || 'pending').toLowerCase() === filterStatus);

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
                      <img src={item.imageURL || item.image} alt={item.name} style={{
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
                    <button 
                      onClick={() => setTrackingOrder(order)}
                      style={{
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

        {/* Tracking Modal */}
        {trackingOrder && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }} onClick={() => setTrackingOrder(null)}>
            <div style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '30px',
              maxWidth: '500px',
              width: '100%',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
              position: 'relative'
            }} onClick={(e) => e.stopPropagation()}>
              <button 
                onClick={() => setTrackingOrder(null)}
                style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#666',
                  lineHeight: '1',
                  padding: '5px'
                }}
              >
                &times;
              </button>

              <h2 style={{color: '#ff6161', marginBottom: '20px', fontSize: '22px', fontWeight: '700', fontFamily: 'var(--font-serif)'}}>
                Track Order #{trackingOrder.orderId}
              </h2>

              {/* Status Header */}
              <div style={{
                background: '#fff0f0',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '20px',
                borderLeft: '4px solid #ff6161'
              }}>
                <span style={{fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block'}}>Current Status</span>
                <h3 style={{margin: '3px 0 0 0', color: '#ff6161', fontSize: '16px', textTransform: 'capitalize', fontWeight: '700'}}>
                  {trackingOrder.orderStatus}
                </h3>
              </div>

              {/* Stepper Progress */}
              <div style={{position: 'relative', paddingLeft: '32px', marginBottom: '25px'}}>
                {/* Vertical Line */}
                <div style={{
                  position: 'absolute',
                  left: '11px',
                  top: '8px',
                  bottom: '8px',
                  width: '3px',
                  background: '#f0f0f0'
                }}></div>

                {/* Vertical Line Progress Fill */}
                <div style={{
                  position: 'absolute',
                  left: '11px',
                  top: '8px',
                  width: '3px',
                  background: '#ff6161',
                  height: `${
                    trackingOrder.trackingSteps.filter(s => s.done).length === 5 ? '100%' :
                    trackingOrder.trackingSteps.filter(s => s.done).length === 4 ? '75%' :
                    trackingOrder.trackingSteps.filter(s => s.done).length === 3 ? '50%' :
                    trackingOrder.trackingSteps.filter(s => s.done).length === 2 ? '25%' : '0%'
                  }`
                }}></div>

                {/* Steps */}
                {trackingOrder.trackingSteps.map((step, index) => (
                  <div key={index} style={{
                    position: 'relative',
                    marginBottom: index < trackingOrder.trackingSteps.length - 1 ? '16px' : 0,
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    {/* Circle Indicator */}
                    <div style={{
                      position: 'absolute',
                      left: '-29px',
                      top: '3px',
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: step.done ? '#ff6161' : '#fff',
                      border: `3px solid ${step.done ? '#ff6161' : '#ddd'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 2
                    }}>
                      {step.done && <i className="fas fa-check" style={{fontSize: '8px', color: '#fff'}}></i>}
                    </div>

                    <span style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: step.done ? '#333' : '#999'
                    }}>
                      {step.title}
                    </span>
                    <span style={{
                      fontSize: '11px',
                      color: step.done ? '#666' : '#bbb'
                    }}>
                      {step.time}
                    </span>
                  </div>
                ))}
              </div>

              {/* Delivery Details */}
              <div style={{
                borderTop: '1px solid #eee',
                paddingTop: '15px'
              }}>
                <div style={{marginBottom: '15px'}}>
                  <h4 style={{margin: '0 0 3px 0', fontSize: '12px', color: '#888', textTransform: 'uppercase'}}>Delivery Address</h4>
                  <p style={{margin: 0, fontSize: '13px', color: '#333', lineHeight: '1.4'}}>
                    <i className="fas fa-map-marker-alt" style={{color: '#ff6161', marginRight: '6px'}}></i>
                    {trackingOrder.address}
                  </p>
                </div>

                {trackingOrder.deliveryPartner && (
                  <div style={{
                    background: '#f9f9f9',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    border: '1px solid #eee'
                  }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: '#ffebee',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <i className="fas fa-motorcycle" style={{color: '#ff6161', fontSize: '16px'}}></i>
                    </div>
                    <div style={{flex: 1}}>
                      <h4 style={{margin: '0 0 2px 0', fontSize: '13px', color: '#333', fontWeight: '600'}}>
                        {trackingOrder.deliveryPartner.name}
                      </h4>
                      <p style={{margin: 0, fontSize: '11px', color: '#888'}}>
                        {trackingOrder.deliveryPartner.vehicle}
                      </p>
                    </div>
                    <a href={`tel:${trackingOrder.deliveryPartner.phone}`} style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#ff6161',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      textDecoration: 'none',
                      boxShadow: '0 2px 6px rgba(255, 97, 97, 0.2)',
                      flexShrink: 0
                    }}>
                      <i className="fas fa-phone" style={{fontSize: '12px'}}></i>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
