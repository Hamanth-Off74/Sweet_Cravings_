import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAdminAuth } from '../context/AdminAuthContext';
import DessertManagement from '../components/admin/DessertManagement';
import OffersManagement from '../components/admin/OffersManagement';
import '../styles/AdminDashboard.css';

// Real-time polling interval (5 seconds)
const POLL_INTERVAL = 5000;

function Admin() {
  const { admin, logout, getAuthHeaders } = useAdminAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0
  });

  // Real-time clock
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(clockInterval);
  }, []);

  // Fetch orders function
  const fetchOrders = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);

    try {
      const response = await axios.get('/api/admin/orders', {
        headers: getAuthHeaders()
      });
      const orderData = response.data || [];
      setOrders(orderData);
      setLastUpdated(new Date());

      // Calculate stats
      const calculatedStats = {
        totalOrders: orderData.length,
        totalRevenue: orderData.reduce((sum, order) => sum + order.total, 0),
        pendingOrders: orderData.filter(o => o.orderStatus === 'pending').length,
        completedOrders: orderData.filter(o => o.orderStatus === 'delivered').length
      };
      setStats(calculatedStats);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [getAuthHeaders]);

  // Initial fetch and real-time polling
  useEffect(() => {
    fetchOrders();

    // Set up polling interval for real-time updates
    const pollInterval = setInterval(() => {
      fetchOrders(false);
    }, POLL_INTERVAL);

    return () => clearInterval(pollInterval);
  }, [fetchOrders]);

  const handleManualRefresh = () => {
    fetchOrders(true);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`/api/admin/orders/${orderId}`, { orderStatus: newStatus }, {
        headers: getAuthHeaders()
      });
      fetchOrders(true);
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status');
    }
  };

  const deleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await axios.delete(`/api/admin/orders/${orderId}`, {
          headers: getAuthHeaders()
        });
        fetchOrders(true);
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('Failed to delete order');
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
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

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-chart-line' },
    { id: 'desserts', label: 'Desserts', icon: 'fas fa-birthday-cake' },
    { id: 'offers', label: 'Offers', icon: 'fas fa-tags' },
    { id: 'orders', label: 'Orders', icon: 'fas fa-shopping-bag' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'desserts':
        return <DessertManagement />;
      case 'offers':
        return <OffersManagement />;
      case 'orders':
        return renderOrders();
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <div className="admin-dashboard-content">
      {/* Statistics Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="stat-info">
            <p className="stat-label">Total Orders</p>
            <h3 className="stat-value">{stats.totalOrders}</h3>
          </div>
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ff6161 0%, #ff9a9e 100%)' }}>
            <i className="fas fa-shopping-bag"></i>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-info">
            <p className="stat-label">Total Revenue</p>
            <h3 className="stat-value">₹{stats.totalRevenue.toFixed(2)}</h3>
          </div>
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <i className="fas fa-rupee-sign"></i>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-info">
            <p className="stat-label">Pending Orders</p>
            <h3 className="stat-value">{stats.pendingOrders}</h3>
          </div>
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <i className="fas fa-clock"></i>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-info">
            <p className="stat-label">Completed</p>
            <h3 className="stat-value">{stats.completedOrders}</h3>
          </div>
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}>
            <i className="fas fa-check-circle"></i>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h3 className="section-title">
          <i className="fas fa-bolt" style={{ marginRight: '10px', color: '#ff6161' }}></i>
          Quick Actions
        </h3>
        <div className="quick-actions-grid">
          <button onClick={() => setActiveTab('desserts')} className="quick-action-btn">
            <i className="fas fa-plus-circle"></i>
            <span>Add Dessert</span>
          </button>
          <button onClick={() => setActiveTab('offers')} className="quick-action-btn">
            <i className="fas fa-percentage"></i>
            <span>Create Offer</span>
          </button>
          <button onClick={() => setActiveTab('orders')} className="quick-action-btn">
            <i className="fas fa-list-alt"></i>
            <span>View Orders</span>
          </button>
          <button onClick={handleManualRefresh} className={`quick-action-btn ${refreshing ? 'spinning' : ''}`}>
            <i className={`fas fa-sync-alt ${refreshing ? 'fa-spin' : ''}`}></i>
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* Recent Orders Preview */}
      <div className="recent-orders-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 className="section-title" style={{ margin: 0 }}>
            <i className="fas fa-history" style={{ marginRight: '10px', color: '#ff6161' }}></i>
            Recent Orders
          </h3>
          <span className="last-updated">
            <i className="fas fa-clock"></i>
            Updated: {formatTime(lastUpdated)}
          </span>
        </div>
        {orders.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-inbox"></i>
            <p>No orders yet</p>
          </div>
        ) : (
          <div className="orders-preview">
            {orders.slice(0, 5).map(order => (
              <div key={order.orderId} className="order-preview-item">
                <div className="order-preview-info">
                  <span className="order-id">{order.orderId}</span>
                  <span className="order-customer">{order.customer.firstName} {order.customer.lastName}</span>
                </div>
                <div className="order-preview-meta">
                  <span className="order-total">₹{order.total.toFixed(2)}</span>
                  <span className="order-status" style={{ background: getStatusColor(order.orderStatus) }}>
                    {order.orderStatus}
                  </span>
                </div>
              </div>
            ))}
            <button onClick={() => setActiveTab('orders')} className="view-all-btn">
              View All Orders <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="orders-management">
      <div className="orders-header">
        <div>
          <h2>
            <i className="fas fa-shopping-bag" style={{ marginRight: '10px', color: '#ff6161' }}></i>
            Order Management
          </h2>
          <p>{orders.length} orders total</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span className="last-updated">
            <i className="fas fa-clock"></i>
            Last updated: {formatTime(lastUpdated)}
          </span>
          <button
            onClick={handleManualRefresh}
            className={`refresh-btn ${refreshing ? 'spinning' : ''}`}
          >
            <i className={`fas fa-sync-alt ${refreshing ? '' : ''}`}></i>
            Refresh
          </button>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-inbox"></i>
          <p>No orders found</p>
        </div>
      ) : (
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order.orderId} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                  <td className="order-id-cell" data-label="Order ID">{order.orderId}</td>
                  <td data-label="Customer">
                    <div className="customer-name">{order.customer.firstName}</div>
                    <div className="customer-lastname">{order.customer.lastName}</div>
                  </td>
                  <td className="email-cell" data-label="Email">{order.customer.email}</td>
                  <td data-label="Phone">{order.customer.phone}</td>
                  <td data-label="Items">
                    <div className="items-count">{order.items.length}</div>
                    <div className="items-label">items</div>
                  </td>
                  <td className="total-cell" data-label="Total">₹{order.total.toFixed(2)}</td>
                  <td className="payment-cell" data-label="Payment">
                    <span className={`payment-status ${order.paymentStatus}`}>
                      {order.paymentStatus}
                    </span>
                    <div className="payment-method">{order.paymentMethod}</div>
                  </td>
                  <td data-label="Status">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => updateOrderStatus(order.orderId, e.target.value)}
                      className="status-select"
                      style={{ background: getStatusColor(order.orderStatus) }}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="date-cell" data-label="Date">
                    <div className="order-date">{new Date(order.createdAt).toLocaleDateString('en-GB')}</div>
                    <div className="order-time">
                      {new Date(order.createdAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </div>
                  </td>
                  <td data-label="Actions">
                    <button onClick={() => deleteOrder(order.orderId)} className="delete-order-btn" title="Delete Order">
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
  );

  if (loading) {
    return (
      <div className="admin-loading">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <button onClick={() => navigate('/')} className="close-admin-btn" title="Back to Home">
            <i className="fas fa-times"></i>
          </button>
          <div className="sidebar-logo">
            <i className="fas fa-birthday-cake"></i>
          </div>
          <h2>Sweet Cravings</h2>
          <p>Admin Panel</p>
        </div>

        <nav className="sidebar-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
            >
              <i className={tab.icon}></i>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="admin-info">
            <div className="admin-avatar">
              <i className="fas fa-user-shield"></i>
            </div>
            <div className="admin-details">
              <span className="admin-name">{admin?.username || 'Admin'}</span>
              <span className="admin-role">Administrator</span>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        {/* Top Bar */}
        <div className="admin-topbar">
          <button onClick={() => navigate('/')} className="mobile-close-btn" title="Back to Home">
            <i className="fas fa-times"></i>
          </button>
          <div className="topbar-title">
            <h1>{tabs.find(t => t.id === activeTab)?.label}</h1>
            <p>Welcome back, {admin?.username || 'Admin'}!</p>
          </div>
          <div className="topbar-actions">
            <div className="realtime-indicator">
              <span className="realtime-dot"></span>
              Real-time
            </div>
            <div className="current-date">
              <i className="fas fa-clock"></i>
              <span>{formatTime(currentTime)}</span>
            </div>
            <div className="current-date">
              <i className="fas fa-calendar-alt"></i>
              <span>{formatDate(currentTime)}</span>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="admin-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

export default Admin;
