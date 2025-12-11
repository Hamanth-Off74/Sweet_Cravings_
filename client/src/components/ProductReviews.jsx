import { useState } from 'react';
import '../styles/ProductReviews.css';

function ProductReviews({ productId, productName }) {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      userName: 'Sarah Johnson',
      rating: 5,
      date: '2024-01-15',
      comment: 'Absolutely delicious! The chocolate cake was moist and rich. Perfect for my birthday party.',
      helpful: 12,
      verified: true
    },
    {
      id: 2,
      userName: 'Mike Davis',
      rating: 4,
      date: '2024-01-10',
      comment: 'Great taste and quality. Delivery was on time. Would definitely order again!',
      helpful: 8,
      verified: true
    },
    {
      id: 3,
      userName: 'Emma Wilson',
      rating: 5,
      date: '2024-01-05',
      comment: 'Best dessert I\'ve ever had! The presentation was beautiful and taste was heavenly.',
      helpful: 15,
      verified: false
    }
  ]);

  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [sortBy, setSortBy] = useState('recent');

  const handleSubmitReview = (e) => {
    e.preventDefault();
    const review = {
      id: reviews.length + 1,
      userName: 'You',
      rating: newReview.rating,
      date: new Date().toISOString().split('T')[0],
      comment: newReview.comment,
      helpful: 0,
      verified: false
    };
    setReviews([review, ...reviews]);
    setNewReview({ rating: 5, comment: '' });
    setShowReviewForm(false);
  };

  const handleHelpful = (reviewId) => {
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { ...review, helpful: review.helpful + 1 }
        : review
    ));
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'recent') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'helpful') return b.helpful - a.helpful;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const ratingCounts = [5, 4, 3, 2, 1].map(rating => 
    reviews.filter(r => r.rating === rating).length
  );

  return (
    <div className="product-reviews">
      <div className="reviews-header">
        <h2>Customer Reviews</h2>
        <button 
          className="write-review-btn"
          onClick={() => setShowReviewForm(!showReviewForm)}
        >
          <i className="fas fa-pen"></i> Write a Review
        </button>
      </div>

      {/* Overall Rating Summary */}
      <div className="rating-summary">
        <div className="summary-left">
          <div className="overall-rating">
            <div className="rating-number">{averageRating.toFixed(1)}</div>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map(star => (
                <i 
                  key={star}
                  className={`fas fa-star ${star <= Math.round(averageRating) ? 'filled' : ''}`}
                ></i>
              ))}
            </div>
            <div className="total-reviews">Based on {reviews.length} reviews</div>
          </div>
        </div>
        <div className="summary-right">
          {[5, 4, 3, 2, 1].map((rating, index) => (
            <div key={rating} className="rating-bar">
              <span className="rating-label">{rating} <i className="fas fa-star"></i></span>
              <div className="bar-container">
                <div 
                  className="bar-fill"
                  style={{ width: `${(ratingCounts[index] / reviews.length) * 100}%` }}
                ></div>
              </div>
              <span className="rating-count">{ratingCounts[index]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <form className="review-form" onSubmit={handleSubmitReview}>
          <h3>Write Your Review</h3>
          <div className="form-group">
            <label>Your Rating</label>
            <div className="rating-input">
              {[1, 2, 3, 4, 5].map(star => (
                <i
                  key={star}
                  className={`fas fa-star ${star <= newReview.rating ? 'active' : ''}`}
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                ></i>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>Your Review</label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              placeholder="Share your experience with this dessert..."
              rows="4"
              required
            ></textarea>
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-btn">
              <i className="fas fa-paper-plane"></i> Submit Review
            </button>
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => setShowReviewForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Sort Options */}
      <div className="reviews-controls">
        <span className="showing-text">Showing {sortedReviews.length} reviews</span>
        <div className="sort-options">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="recent">Most Recent</option>
            <option value="helpful">Most Helpful</option>
            <option value="rating">Highest Rating</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="reviews-list">
        {sortedReviews.map(review => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              <div className="reviewer-info">
                <div className="reviewer-avatar">
                  <i className="fas fa-user"></i>
                </div>
                <div>
                  <div className="reviewer-name">
                    {review.userName}
                    {review.verified && (
                      <span className="verified-badge">
                        <i className="fas fa-check-circle"></i> Verified Purchase
                      </span>
                    )}
                  </div>
                  <div className="review-date">
                    {new Date(review.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </div>
              <div className="review-rating">
                {[1, 2, 3, 4, 5].map(star => (
                  <i 
                    key={star}
                    className={`fas fa-star ${star <= review.rating ? 'filled' : ''}`}
                  ></i>
                ))}
              </div>
            </div>
            <p className="review-comment">{review.comment}</p>
            <div className="review-footer">
              <button 
                className="helpful-btn"
                onClick={() => handleHelpful(review.id)}
              >
                <i className="far fa-thumbs-up"></i> Helpful ({review.helpful})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductReviews;
