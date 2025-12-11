import { useState, useEffect } from 'react';
import axios from '../api/axios';

function Admin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/admin/orders');
      const orderData = response.data || [];
      setOrders(orderData);
      
      // Calculate stats
      const stats = {
        totalOrders: orderData.length,
        totalRevenue: orderData.reduce((sum, order) => sum + order.total, 0),
        pendingOrders: orderData.filter(o => o.orderStatus === 'pending').length,
        completedOrders: orderData.filter(o => o.orderStatus === 'delivered').length
      };
      setStats(stats);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`/api/admin/orders/${orderId}`, { orderStatus: newStatus });
      fetchOrders();
      alert('Order status updated successfully!');
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status');
    }
  };

  const deleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await axios.delete(`/api/admin/orders/${orderId}`);
        fetchOrders();
        alert('Order deleted successfully!');
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('Failed to delete order');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffd700',
      processing: '#ff9800',
      shipped: '#2196f3',
      delivered: '#4caf50',
      cancelled: '#f44336'
    };
    return colors[status] || '#999';
  };

  if (loading) {
    return (
      <div className="container" style={{textAlign: 'center', padding: '60px 20px'}}>
        <i className="fas fa-spinner fa-spin" style={{fontSize: '40px', color: '#ff6161'}}></i>
        <p style={{marginTop: '20px', fontSize: '16px', color: '#666'}}>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="cart-section">
      <div className="container">
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #ff6161 0%, #ff8787 100%)',
          padding: '30px',
          borderRadius: '12px',
          marginBottom: '30px',
          color: '#fff',
          boxShadow: '0 4px 20px rgba(255, 97, 97, 0.3)'
        }}>
          <h1 style={{margin: '0 0 10px 0', fontSize: '32px', fontWeight: '700'}}>
            <i className="fas fa-cog"></i> Admin Dashboard
          </h1>
          <p style={{margin: 0, fontSize: '14px', opacity: 0.9}}>
            Manage orders, track sales, and monitor business performance
          </p>
        </div>

        {/* Statistics Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{
            background: '#fff',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            border: '1px solid #f0f0f0'
          }}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <div>
                <p style={{margin: '0 0 8px 0', fontSize: '14px', color: '#999', fontWeight: '500'}}>Total Orders</p>
                <h3 style={{margin: 0, fontSize: '32px', color: '#333', fontWeight: '700'}}>{stats.totalOrders}</h3>
              </div>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                color: '#fff'
              }}>
                <i className="fas fa-shopping-bag"></i>
              </div>
            </div>
          </div>

          <div style={{
            background: '#fff',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            border: '1px solid #f0f0f0'
          }}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <div>
                <p style={{margin: '0 0 8px 0', fontSize: '14px', color: '#999', fontWeight: '500'}}>Total Revenue</p>
                <h3 style={{margin: 0, fontSize: '32px', color: '#333', fontWeight: '700'}}>₹{stats.totalRevenue.toFixed(2)}</h3>
              </div>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                color: '#fff'
              }}>
                <i className="fas fa-rupee-sign"></i>
              </div>
            </div>
          </div>

          <div style={{
            background: '#fff',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            border: '1px solid #f0f0f0'
          }}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <div>
                <p style={{margin: '0 0 8px 0', fontSize: '14px', color: '#999', fontWeight: '500'}}>Pending Orders</p>
                <h3 style={{margin: 0, fontSize: '32px', color: '#333', fontWeight: '700'}}>{stats.pendingOrders}</h3>
              </div>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #ffd89b 0%, #19547b 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                color: '#fff'
              }}>
                <i className="fas fa-clock"></i>
              </div>
            </div>
          </div>

          <div style={{
            background: '#fff',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            border: '1px solid #f0f0f0'
          }}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <div>
                <p style={{margin: '0 0 8px 0', fontSize: '14px', color: '#999', fontWeight: '500'}}>Completed</p>
                <h3 style={{margin: 0, fontSize: '32px', color: '#333', fontWeight: '700'}}>{stats.completedOrders}</h3>
              </div>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                color: '#333'
              }}>
                <i className="fas fa-check-circle"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '25px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          border: '1px solid #f0f0f0'
        }}>
          <h2 style={{margin: '0 0 20px 0', fontSize: '20px', fontWeight: '600'}}>
            All Orders
          </h2>
          
          {orders.length === 0 ? (
            <div style={{textAlign: 'center', padding: '40px', color: '#999'}}>
              <i className="fas fa-inbox" style={{fontSize: '60px', marginBottom: '15px'}}></i>
              <p>No orders found</p>
            </div>
          ) : (
            <div style={{overflowX: 'auto'}}>
              <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '13px'}}>
                <thead>
                  <tr style={{background: '#ff6b6b', color: '#fff'}}>
                    <th style={{padding: '12px 15px', textAlign: 'left', fontWeight: '600'}}>ID</th>
                    <th style={{padding: '12px 15px', textAlign: 'left', fontWeight: '600'}}>Customer</th>
                    <th style={{padding: '12px 15px', textAlign: 'left', fontWeight: '600'}}>Email</th>
                    <th style={{padding: '12px 15px', textAlign: 'left', fontWeight: '600'}}>Phone</th>
                    <th style={{padding: '12px 15px', textAlign: 'left', fontWeight: '600'}}>Items</th>
                    <th style={{padding: '12px 15px', textAlign: 'left', fontWeight: '600'}}>Total</th>
                    <th style={{padding: '12px 15px', textAlign: 'center', fontWeight: '600'}}>Payment</th>
                    <th style={{padding: '12px 15px', textAlign: 'center', fontWeight: '600'}}>Status</th>
                    <th style={{padding: '12px 15px', textAlign: 'center', fontWeight: '600'}}>Date</th>
                    <th style={{padding: '12px 15px', textAlign: 'center', fontWeight: '600'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={order.orderId} style={{
                      background: index % 2 === 0 ? '#fff' : '#fff5f5',
                      borderBottom: '1px solid #ffe0e0'
                    }}>
                      <td style={{padding: '12px 15px', color: '#333', fontWeight: '500'}}>
                        {order.orderId}
                      </td>
                      <td style={{padding: '12px 15px'}}>
                        <div style={{fontWeight: '500', color: '#333'}}>
                          {order.customer.firstName}
                        </div>
                        <div style={{fontSize: '12px', color: '#666'}}>
                          {order.customer.lastName}
                        </div>
                      </td>
                      <td style={{padding: '12px 15px', color: '#666', fontSize: '12px'}}>
                        {order.customer.email}
                      </td>
                      <td style={{padding: '12px 15px', color: '#666'}}>
                        {order.customer.phone}
                      </td>
                      <td style={{padding: '12px 15px'}}>
                        <div style={{fontWeight: '500', color: '#333'}}>
                          {order.items.length}
                        </div>
                        <div style={{fontSize: '11px', color: '#999'}}>
                          items
                        </div>
                      </td>
                      <td style={{padding: '12px 15px', fontWeight: '600', color: '#333'}}>
                        ₹{order.total.toFixed(2)}
                      </td>
                      <td style={{padding: '12px 15px', textAlign: 'center'}}>
                        <div style={{
                          display: 'inline-block',
                          padding: '5px 12px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '600',
                          background: order.paymentStatus === 'paid' ? '#d4edda' : '#fff3cd',
                          color: order.paymentStatus === 'paid' ? '#155724' : '#856404',
                          textTransform: 'capitalize'
                        }}>
                          {order.paymentStatus}
                        </div>
                        <div style={{fontSize: '10px', color: '#999', marginTop: '2px'}}>
                          {order.paymentMethod}
                        </div>
                      </td>
                      <td style={{padding: '12px 15px', textAlign: 'center'}}>
                        <select 
                          value={order.orderStatus}
                          onChange={(e) => updateOrderStatus(order.orderId, e.target.value)}
                          style={{
                            padding: '5px 10px',
                            borderRadius: '12px',
                            border: 'none',
                            background: getStatusColor(order.orderStatus),
                            color: order.orderStatus === 'pending' ? '#000' : '#fff',
                            fontWeight: '600',
                            fontSize: '11px',
                            cursor: 'pointer',
                            textTransform: 'capitalize'
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td style={{padding: '12px 15px', textAlign: 'center'}}>
                        <div style={{fontSize: '12px', color: '#333', fontWeight: '500'}}>
                          {new Date(order.createdAt).toLocaleDateString('en-GB')}
                        </div>
                        <div style={{fontSize: '10px', color: '#999'}}>
                          {new Date(order.createdAt).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            hour12: true 
                          })}
                        </div>
                      </td>
                      <td style={{padding: '12px 15px', textAlign: 'center'}}>
                        <button 
                          onClick={() => deleteOrder(order.orderId)}
                          style={{
                            padding: '6px 10px',
                            border: 'none',
                            borderRadius: '50%',
                            background: '#ff6b6b',
                            color: '#fff',
                            cursor: 'pointer',
                            fontSize: '14px',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto',
                            transition: 'transform 0.2s'
                          }}
                          onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                          title="Delete Order"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;
