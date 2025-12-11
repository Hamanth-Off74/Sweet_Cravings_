import { Link } from 'react-router-dom';

function Confirmation() {
  return (
    <div className="container" style={{textAlign: 'center', padding: '60px 20px'}}>
      <div style={{maxWidth: '600px', margin: '0 auto'}}>
        <div style={{fontSize: '80px', color: '#4caf50', marginBottom: '20px'}}>
          <i className="fas fa-check-circle"></i>
        </div>
        <h1>Order Confirmed!</h1>
        <p style={{fontSize: '18px', color: '#666', margin: '20px 0'}}>
          Thank you for your order. Your delicious desserts are being prepared and will be delivered soon!
        </p>
        <p style={{fontSize: '16px', color: '#888', marginBottom: '30px'}}>
          You will receive a confirmation email with your order details shortly.
        </p>
        <div style={{display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap'}}>
          <Link to="/orders" className="btn btn-primary">
            <i className="fas fa-box"></i> View My Orders
          </Link>
          <Link to="/menu" className="btn btn-secondary">
            <i className="fas fa-shopping-bag"></i> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Confirmation;
