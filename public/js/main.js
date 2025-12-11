// Shopping Cart Class
class ShoppingCart {
    constructor() {
        this.cart = this.getCart();
        this.updateCartDisplay();
    }

    getCart() {
        return JSON.parse(localStorage.getItem('sweetcravings_cart')) || [];
    }

    saveCart() {
        localStorage.setItem('sweetcravings_cart', JSON.stringify(this.cart));
        this.updateCartDisplay();
    }

    addToCart(item) {
        const existingItem = this.cart.find(cartItem => cartItem.id === item.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.showAddToCartNotification(item.name);
    }

    removeFromCart(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCart();
    }

    updateQuantity(itemId, newQuantity) {
        const item = this.cart.find(cartItem => cartItem.id === itemId);
        if (item) {
            if (newQuantity <= 0) {
                this.removeFromCart(itemId);
            } else {
                item.quantity = newQuantity;
                this.saveCart();
            }
        }
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getCartCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
    }

    updateCartDisplay() {
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = this.getCartCount();
        }
    }

    showAddToCartNotification(itemName) {
        // Create notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: #4caf50;
            color: white;
            padding: 15px 20px;
            border-radius: 4px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            ${itemName} added to cart!
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Wishlist Class
class Wishlist {
    constructor() {
        this.wishlist = this.getWishlist();
        this.updateWishlistDisplay();
    }

    getWishlist() {
        return JSON.parse(localStorage.getItem('sweetcravings_wishlist')) || [];
    }

    saveWishlist() {
        localStorage.setItem('sweetcravings_wishlist', JSON.stringify(this.wishlist));
        this.updateWishlistDisplay();
    }

    addToWishlist(item) {
        const existingItem = this.wishlist.find(wishItem => wishItem.id === item.id);
        
        if (!existingItem) {
            this.wishlist.push({
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                addedDate: new Date().toISOString()
            });
            this.saveWishlist();
            this.showWishlistNotification(item.name, 'added');
            return true;
        }
        return false;
    }

    removeFromWishlist(itemId) {
        const item = this.wishlist.find(wishItem => wishItem.id === itemId);
        this.wishlist = this.wishlist.filter(wishItem => wishItem.id !== itemId);
        this.saveWishlist();
        if (item) {
            this.showWishlistNotification(item.name, 'removed');
        }
    }

    isInWishlist(itemId) {
        return this.wishlist.some(item => item.id === itemId);
    }

    getWishlistCount() {
        return this.wishlist.length;
    }

    updateWishlistDisplay() {
        const wishlistCountElement = document.getElementById('wishlist-count');
        if (wishlistCountElement) {
            wishlistCountElement.textContent = this.getWishlistCount();
        }
    }

    showWishlistNotification(itemName, action) {
        const notification = document.createElement('div');
        const color = action === 'added' ? '#ff6161' : '#666';
        const icon = action === 'added' ? 'fa-heart' : 'fa-heart-broken';
        
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${color};
            color: white;
            padding: 15px 20px;
            border-radius: 4px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        notification.innerHTML = `
            <i class="fas ${icon}"></i>
            ${itemName} ${action} ${action === 'added' ? 'to' : 'from'} wishlist!
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// User Authentication Class
class UserAuth {
    constructor() {
        this.currentUser = this.getCurrentUser();
        this.updateUserDisplay();
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('sweetcravings_user')) || null;
    }

    login(email, password) {
        // Simulate login - in real app, this would be an API call
        const users = JSON.parse(localStorage.getItem('sweetcravings_users')) || [];
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.currentUser = user;
            localStorage.setItem('sweetcravings_user', JSON.stringify(user));
            this.updateUserDisplay();
            return { success: true, user };
        }
        
        return { success: false, message: 'Invalid email or password' };
    }

    register(userData) {
        // Simulate registration - in real app, this would be an API call
        const users = JSON.parse(localStorage.getItem('sweetcravings_users')) || [];
        
        // Check if user already exists
        if (users.some(u => u.email === userData.email)) {
            return { success: false, message: 'User already exists with this email' };
        }
        
        const newUser = {
            id: Date.now().toString(),
            ...userData,
            joinDate: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('sweetcravings_users', JSON.stringify(users));
        
        this.currentUser = newUser;
        localStorage.setItem('sweetcravings_user', JSON.stringify(newUser));
        this.updateUserDisplay();
        
        return { success: true, user: newUser };
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('sweetcravings_user');
        this.updateUserDisplay();
    }

    updateUserDisplay() {
        const guestActions = document.getElementById('guest-actions');
        const userActions = document.getElementById('user-actions');
        const userNameDisplay = document.getElementById('user-name-display');

        if (this.currentUser) {
            if (guestActions) guestActions.style.display = 'none';
            if (userActions) userActions.style.display = 'block';
            if (userNameDisplay) userNameDisplay.textContent = this.currentUser.firstname;
        } else {
            if (guestActions) guestActions.style.display = 'flex';
            if (userActions) userActions.style.display = 'none';
        }
    }
}

// Initialize shopping cart, wishlist, and auth
const shoppingCart = new ShoppingCart();
const wishlist = new Wishlist();
const userAuth = new UserAuth();

// Background Slideshow
let bgSlideIndex = 0;
const bgSlides = document.querySelectorAll('.bg-slide');

function changeBgSlide() {
    if (bgSlides.length === 0) return;
    
    // Remove active class from all slides
    bgSlides.forEach(slide => slide.classList.remove('active'));
    
    // Move to next slide
    bgSlideIndex++;
    if (bgSlideIndex >= bgSlides.length) {
        bgSlideIndex = 0;
    }
    
    // Add active class to current slide
    bgSlides[bgSlideIndex].classList.add('active');
}

// Initialize background slideshow
function initBgSlideshow() {
    if (bgSlides.length > 0) {
        // Change background every 6 seconds
        setInterval(changeBgSlide, 6000);
    }
}

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    initBgSlideshow();
});

function initializeApp() {
    setupEventListeners();
    
    // Page-specific initialization
    const currentPath = window.location.pathname;
    
    if (currentPath === '/menu') {
        initializeMenuPage();
    } else if (currentPath === '/cart') {
        initializeCartPage();
    } else if (currentPath === '/checkout') {
        initializeCheckoutPage();
    } else if (currentPath === '/orders') {
        initializeOrdersPage();
    }
}

function setupEventListeners() {
    // Add to cart buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart-btn') || e.target.closest('.add-to-cart-btn')) {
            const button = e.target.classList.contains('add-to-cart-btn') ? e.target : e.target.closest('.add-to-cart-btn');
            
            const item = {
                id: button.dataset.id,
                name: button.dataset.name,
                price: parseFloat(button.dataset.price),
                image: button.dataset.image
            };
            
            shoppingCart.addToCart(item);
        }

        // View reviews buttons
        if (e.target.classList.contains('view-reviews-btn') || e.target.closest('.view-reviews-btn')) {
            const button = e.target.classList.contains('view-reviews-btn') ? e.target : e.target.closest('.view-reviews-btn');
            const card = button.closest('.dessert-card');
            const productId = button.dataset.id;
            const productName = card.querySelector('.dessert-name').textContent;
            
            if (!window.reviewManager) {
                window.reviewManager = new ReviewManager();
            }
            window.reviewManager.showReviews(productId, productName);
        }
    });

    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            filterProducts(e.target.value);
        });
    }
}

// Advanced Menu filtering functionality
class MenuFilter {
    constructor() {
        this.dessertCards = document.querySelectorAll('.dessert-card');
        this.originalCards = Array.from(this.dessertCards);
        this.filters = {
            category: 'all',
            priceRange: 3000,
            rating: 'all',
            discount: false,
            freeDelivery: false,
            sort: 'default'
        };
        
        this.initFilters();
    }
    
    initFilters() {
        // Category filters
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.filters.category = button.getAttribute('data-category');
                this.applyFilters();
            });
        });
        
        // Sort functionality
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', () => {
                this.filters.sort = sortSelect.value;
                this.applyFilters();
            });
        }
        
        // Price range
        const priceRange = document.getElementById('price-range');
        const priceDisplay = document.getElementById('price-display');
        if (priceRange && priceDisplay) {
            priceRange.addEventListener('input', () => {
                this.filters.priceRange = parseInt(priceRange.value);
                priceDisplay.textContent = `₹${this.filters.priceRange}`;
                this.applyFilters();
            });
        }
        
        // Rating filters
        const ratingButtons = document.querySelectorAll('.rating-filter-btn');
        ratingButtons.forEach(button => {
            button.addEventListener('click', () => {
                ratingButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.filters.rating = button.getAttribute('data-rating');
                this.applyFilters();
            });
        });
        
        // Offer filters
        const discountFilter = document.getElementById('discount-filter');
        const freeDeliveryFilter = document.getElementById('free-delivery-filter');
        
        if (discountFilter) {
            discountFilter.addEventListener('change', () => {
                this.filters.discount = discountFilter.checked;
                this.applyFilters();
            });
        }
        
        if (freeDeliveryFilter) {
            freeDeliveryFilter.addEventListener('change', () => {
                this.filters.freeDelivery = freeDeliveryFilter.checked;
                this.applyFilters();
            });
        }
        
        // Clear filters
        const clearButton = document.getElementById('clear-filters');
        if (clearButton) {
            clearButton.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }
    }
    
    applyFilters() {
        let filteredCards = [...this.originalCards];
        
        // Filter by category
        if (this.filters.category !== 'all') {
            filteredCards = filteredCards.filter(card => 
                card.getAttribute('data-category') === this.filters.category
            );
        }
        
        // Filter by price
        filteredCards = filteredCards.filter(card => {
            const priceText = card.querySelector('.dessert-price').textContent;
            const price = parseInt(priceText.replace(/[₹,]/g, ''));
            return price <= this.filters.priceRange;
        });
        
        // Filter by rating
        if (this.filters.rating !== 'all') {
            const minRating = parseInt(this.filters.rating);
            filteredCards = filteredCards.filter(card => {
                const ratingElement = card.querySelector('.rating-stars');
                if (ratingElement) {
                    const rating = parseFloat(ratingElement.getAttribute('data-rating') || '0');
                    return rating >= minRating;
                }
                return false;
            });
        }
        
        // Filter by discount
        if (this.filters.discount) {
            filteredCards = filteredCards.filter(card => {
                return card.querySelector('.discount-badge') !== null;
            });
        }
        
        // Filter by free delivery
        if (this.filters.freeDelivery) {
            filteredCards = filteredCards.filter(card => {
                return card.querySelector('.free-delivery-badge') !== null;
            });
        }
        
        // Sort items
        this.sortCards(filteredCards);
        
        // Show/hide items
        this.displayCards(filteredCards);
        
        // Update results count
        this.updateResultsCount(filteredCards.length);
    }
    
    sortCards(cards) {
        switch (this.filters.sort) {
            case 'price-low':
                cards.sort((a, b) => {
                    const priceA = parseInt(a.querySelector('.dessert-price').textContent.replace(/[₹,]/g, ''));
                    const priceB = parseInt(b.querySelector('.dessert-price').textContent.replace(/[₹,]/g, ''));
                    return priceA - priceB;
                });
                break;
            case 'price-high':
                cards.sort((a, b) => {
                    const priceA = parseInt(a.querySelector('.dessert-price').textContent.replace(/[₹,]/g, ''));
                    const priceB = parseInt(b.querySelector('.dessert-price').textContent.replace(/[₹,]/g, ''));
                    return priceB - priceA;
                });
                break;
            case 'rating':
                cards.sort((a, b) => {
                    const ratingA = parseFloat(a.querySelector('.rating-stars')?.getAttribute('data-rating') || '0');
                    const ratingB = parseFloat(b.querySelector('.rating-stars')?.getAttribute('data-rating') || '0');
                    return ratingB - ratingA;
                });
                break;
            case 'discount':
                cards.sort((a, b) => {
                    const discountA = a.querySelector('.discount-badge') ? 1 : 0;
                    const discountB = b.querySelector('.discount-badge') ? 1 : 0;
                    return discountB - discountA;
                });
                break;
            default:
                // Keep original order
                break;
        }
    }
    
    displayCards(filteredCards) {
        // Hide all cards first
        this.originalCards.forEach(card => {
            card.style.display = 'none';
        });
        
        // Show filtered cards
        filteredCards.forEach(card => {
            card.style.display = 'block';
        });
        
        // Reorder cards in DOM based on sort
        const container = document.querySelector('.dessert-grid');
        if (container) {
            filteredCards.forEach(card => {
                container.appendChild(card);
            });
        }
    }
    
    updateResultsCount(count) {
        const resultsInfo = document.getElementById('results-count');
        if (resultsInfo) {
            if (count === this.originalCards.length) {
                resultsInfo.textContent = 'Showing all desserts';
            } else {
                resultsInfo.textContent = `Showing ${count} of ${this.originalCards.length} desserts`;
            }
        }
    }
    
    clearAllFilters() {
        // Reset all filters
        this.filters = {
            category: 'all',
            priceRange: 3000,
            rating: 'all',
            discount: false,
            freeDelivery: false,
            sort: 'default'
        };
        
        // Reset UI elements
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-category') === 'all');
        });
        
        document.querySelectorAll('.rating-filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) sortSelect.value = 'default';
        
        const priceRange = document.getElementById('price-range');
        const priceDisplay = document.getElementById('price-display');
        if (priceRange && priceDisplay) {
            priceRange.value = 3000;
            priceDisplay.textContent = '₹3000';
        }
        
        const discountFilter = document.getElementById('discount-filter');
        const freeDeliveryFilter = document.getElementById('free-delivery-filter');
        if (discountFilter) discountFilter.checked = false;
        if (freeDeliveryFilter) freeDeliveryFilter.checked = false;
        
        // Apply filters (show all)
        this.applyFilters();
    }
}

function initializeMenuPage() {
    // Initialize advanced filters
    new MenuFilter();
    // Initialize review manager for menu page
    if (!window.reviewManager) {
        window.reviewManager = new ReviewManager();
    }
}

// Review Management Class
class ReviewManager {
    constructor() {
        this.reviews = this.getAllReviews();
        this.modal = document.getElementById('reviews-modal');
        if (!this.modal) {
            console.error("Reviews modal not found!");
            return;
        }
        this.closeBtn = this.modal.querySelector('.close-modal');
        this.reviewForm = this.modal.querySelector('#review-form');
        this.reviewsList = this.modal.querySelector('.reviews-list');
        this.starRatingInput = this.modal.querySelector('.star-rating-input');
        this.currentProductId = null;

        this.init();
        this.generateSampleReviews();
    }

    init() {
        this.closeBtn.addEventListener('click', () => this.hideReviews());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hideReviews();
            }
        });

        // Handle star rating input
        if (this.starRatingInput) {
            const stars = this.starRatingInput.querySelectorAll('i');
            stars.forEach(star => {
                star.addEventListener('mouseover', () => {
                    const rating = star.dataset.value;
                    stars.forEach(s => s.classList.toggle('hover', s.dataset.value <= rating));
                });
                star.addEventListener('mouseout', () => {
                     stars.forEach(s => s.classList.remove('hover'));
                });
                star.addEventListener('click', () => {
                    const rating = star.dataset.value;
                    this.reviewForm.querySelector('input[name="rating"]').value = rating;
                    stars.forEach(s => {
                        s.classList.toggle('selected', s.dataset.value <= rating);
                    });
                });
            });
        }

        // Handle form submission
        if (this.reviewForm) {
            this.reviewForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitReview();
            });
        }
    }

    generateSampleReviews() {
        if (Object.keys(this.reviews).length === 0) {
            const sampleReviews = {
                'D001': [
                    { user: 'Alice', rating: 5, text: 'Absolutely divine! The best chocolate cake I have ever had.', date: '2025-10-20' },
                    { user: 'Bob', rating: 4, text: 'Very rich and moist. A bit too sweet for me, but still delicious.', date: '2025-10-18' }
                ],
                'D002': [
                    { user: 'Charlie', rating: 5, text: 'Creamy, smooth, and perfect. Highly recommended!', date: '2025-10-21' }
                ],
                 'D004': [
                    { user: 'Diana', rating: 5, text: 'Tasted just like in Italy. Wonderful dessert.', date: '2025-10-22' }
                ]
            };
            this.reviews = sampleReviews;
            this.saveAllReviews();
        }
    }

    getAllReviews() {
        return JSON.parse(localStorage.getItem('sweetcravings_reviews')) || {};
    }

    saveAllReviews() {
        localStorage.setItem('sweetcravings_reviews', JSON.stringify(this.reviews));
    }

    getProductReviews(productId) {
        return this.reviews[productId] || [];
    }

    showReviews(productId, productName) {
        this.currentProductId = productId;
        this.modal.querySelector('#reviews-product-name').textContent = productName;
        this.renderReviews(productId);
        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    hideReviews() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        // Reset form
        this.reviewForm.reset();
        this.reviewForm.querySelector('input[name="rating"]').value = '';
        this.starRatingInput.querySelectorAll('i').forEach(s => s.classList.remove('selected'));
    }

    renderReviews(productId) {
        const productReviews = this.getProductReviews(productId);
        const avgRating = productReviews.length > 0
            ? (productReviews.reduce((acc, r) => acc + r.rating, 0) / productReviews.length).toFixed(1)
            : 'N/A';

        this.modal.querySelector('.average-rating-value').textContent = avgRating;
        this.modal.querySelector('.total-reviews-count').textContent = `${productReviews.length} ratings`;

        if (productReviews.length === 0) {
            this.reviewsList.innerHTML = '<p class="no-reviews">Be the first to review this product!</p>';
            return;
        }

        this.reviewsList.innerHTML = productReviews.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <span class="review-user">${review.user}</span>
                    <span class="review-date">${new Date(review.date).toLocaleDateString()}</span>
                </div>
                <div class="review-rating">
                    ${[...Array(5)].map((_, i) => `<i class="fas fa-star ${i < review.rating ? 'filled' : ''}"></i>`).join('')}
                </div>
                <p class="review-text">${review.text}</p>
            </div>
        `).join('');
    }

    submitReview() {
        const user = userAuth.getCurrentUser();
        if (!user) {
            showNotification('You must be logged in to submit a review.', 'error');
            // Optionally, open login modal
            // closeModal('reviews-modal');
            // showLoginModal();
            return;
        }

        const rating = parseInt(this.reviewForm.querySelector('input[name="rating"]').value);
        const text = this.reviewForm.querySelector('textarea[name="review-text"]').value;

        if (!rating) {
            showNotification('Please select a star rating.', 'error');
            return;
        }
        if (!text.trim()) {
            showNotification('Please write your review.', 'error');
            return;
        }

        const newReview = {
            user: user.firstname,
            rating: rating,
            text: text,
            date: new Date().toISOString()
        };

        if (!this.reviews[this.currentProductId]) {
            this.reviews[this.currentProductId] = [];
        }
        this.reviews[this.currentProductId].unshift(newReview);
        this.saveAllReviews();
        this.renderReviews(this.currentProductId);
        this.hideReviews();
        showNotification('Thank you for your review!', 'success');
    }
}

// Order Management Class
class OrderManager {
    constructor() {
        this.orders = JSON.parse(localStorage.getItem('userOrders') || '[]');
        this.currentFilter = 'all';
        this.generateSampleOrders();
    }
    
    generateSampleOrders() {
        // Generate sample orders if none exist
        if (localStorage.getItem('userOrders') === null) {
            this.orders = [];
            this.saveOrders();
        }
    }
    
    saveOrders() {
        localStorage.setItem('userOrders', JSON.stringify(this.orders));
    }
    
    addOrder(orderData) {
        const orderId = 'ORD-' + String(Date.now()).slice(-6);
        const newOrder = {
            orderId,
            date: new Date().toISOString(),
            status: 'pending',
            items: orderData.items,
            subtotal: orderData.subtotal,
            deliveryFee: orderData.deliveryFee,
            tax: orderData.tax,
            total: orderData.total,
            deliveryAddress: orderData.address || '123 Sweet Street, Dessert City'
        };
        
        this.orders.unshift(newOrder);
        this.saveOrders();
        return orderId;
    }
    
    getFilteredOrders() {
        if (this.currentFilter === 'all') {
            return this.orders;
        }
        return this.orders.filter(order => order.status === this.currentFilter);
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
    
    getStatusText(status) {
        const statusTexts = {
            'pending': 'Order Placed',
            'processing': 'Processing',
            'shipped': 'Shipped',
            'delivered': 'Delivered',
            'cancelled': 'Cancelled'
        };
        return statusTexts[status] || status;
    }
    
    renderOrders() {
        const container = document.getElementById('orders-container');
        const emptyState = document.getElementById('empty-orders');
        const filteredOrders = this.getFilteredOrders();
        
        if (filteredOrders.length === 0) {
            container.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }
        
        emptyState.style.display = 'none';
        container.innerHTML = filteredOrders.map(order => `
            <div class="order-card" data-status="${order.status}">
                <div class="order-header">
                    <div class="order-info">
                        <h3>Order #${order.orderId}</h3>
                        <div class="order-date">Placed on ${this.formatDate(order.date)}</div>
                    </div>
                    <div class="order-status ${order.status}">
                        ${this.getStatusText(order.status)}
                    </div>
                </div>
                <div class="order-body">
                    <div class="order-items">
                        ${order.items.map(item => `
                            <div class="order-item">
                                <img src="${item.image}" alt="${item.name}" class="order-item-image">
                                <div class="order-item-details">
                                    <div class="order-item-name">${item.name}</div>
                                    <div class="order-item-quantity">Quantity: ${item.quantity}</div>
                                </div>
                                <div class="order-item-price">₹${(item.price * item.quantity).toFixed(2)}</div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="order-footer">
                        <div class="order-total">Total: ₹${order.total.toFixed(2)}</div>
                        <div class="order-actions">
                            <button class="order-btn primary" onclick="orderManager.showOrderDetails('${order.orderId}')">
                                View Details
                            </button>
                            ${order.status === 'delivered' ? 
                                '<button class="order-btn" onclick="orderManager.reorder(\'' + order.orderId + '\')">Reorder</button>' : 
                                '<button class="order-btn" onclick="orderManager.trackOrder(\'' + order.orderId + '\')">Track Order</button>'
                            }
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    showOrderDetails(orderId) {
        const order = this.orders.find(o => o.orderId === orderId);
        if (!order) return;
        
        const modal = document.getElementById('order-details-modal');
        const content = document.getElementById('order-details-content');
        
        content.innerHTML = `
            <div class="order-details-header">
                <h3>Order #${order.orderId}</h3>
                <span class="order-status ${order.status}">${this.getStatusText(order.status)}</span>
            </div>
            
            <div class="tracking-info">
                <h4>Order Tracking</h4>
                <div class="tracking-steps">
                    <div class="tracking-step ${order.status === 'pending' || order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered' ? 'completed' : ''}">
                        <div class="tracking-icon">
                            <i class="fas fa-check"></i>
                        </div>
                        <div class="tracking-label">Order Placed</div>
                    </div>
                    <div class="tracking-step ${order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered' ? 'completed' : order.status === 'processing' ? 'active' : ''}">
                        <div class="tracking-icon">
                            <i class="fas fa-box"></i>
                        </div>
                        <div class="tracking-label">Processing</div>
                    </div>
                    <div class="tracking-step ${order.status === 'shipped' || order.status === 'delivered' ? 'completed' : order.status === 'shipped' ? 'active' : ''}">
                        <div class="tracking-icon">
                            <i class="fas fa-truck"></i>
                        </div>
                        <div class="tracking-label">Shipped</div>
                    </div>
                    <div class="tracking-step ${order.status === 'delivered' ? 'completed' : ''}">
                        <div class="tracking-icon">
                            <i class="fas fa-home"></i>
                        </div>
                        <div class="tracking-label">Delivered</div>
                    </div>
                </div>
            </div>
            
            <h4>Order Items</h4>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <img src="${item.image}" alt="${item.name}" class="order-item-image">
                        <div class="order-item-details">
                            <div class="order-item-name">${item.name}</div>
                            <div class="order-item-quantity">Quantity: ${item.quantity}</div>
                        </div>
                        <div class="order-item-price">₹${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="order-summary" style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
                <h4>Delivery Address</h4>
                <p>${order.deliveryAddress}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                    <span style="font-size: 1.2rem; font-weight: 700;">Total: ₹${order.total.toFixed(2)}</span>
                    <span style="color: #666;">Ordered on ${this.formatDate(order.date)}</span>
                </div>
            </div>
        `;
        
        modal.style.display = 'flex';
    }
    
    trackOrder(orderId) {
        this.showOrderDetails(orderId);
    }
    
    reorder(orderId) {
        const order = this.orders.find(o => o.orderId === orderId);
        if (!order) return;
        
        // Add items to cart and redirect
        order.items.forEach(item => {
            for (let i = 0; i < item.quantity; i++) {
                cart.addToCart(item);
            }
        });
        
        showToast('Items added to cart successfully!', 'success');
        setTimeout(() => {
            window.location.href = '/cart';
        }, 1000);
    }
}

function initializeOrdersPage() {
    window.orderManager = new OrderManager();
    
    // Filter buttons
    const filterButtons = document.querySelectorAll('.order-filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            orderManager.currentFilter = button.getAttribute('data-filter');
            orderManager.renderOrders();
        });
    });
    
    // Close modal functionality
    const modal = document.getElementById('order-details-modal');
    const closeModal = document.querySelector('#order-details-modal .close-modal');
    
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Initial render
    orderManager.renderOrders();
}

function filterProducts(searchTerm) {
    const dessertCards = document.querySelectorAll('.dessert-card');
    
    dessertCards.forEach(card => {
        const name = card.querySelector('.dessert-name').textContent.toLowerCase();
        const description = card.querySelector('.dessert-description').textContent.toLowerCase();
        
        if (name.includes(searchTerm.toLowerCase()) || description.includes(searchTerm.toLowerCase())) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function initializeCartPage() {
    displayCartItems();
}

function displayCartItems() {
    const emptyCart = document.getElementById('empty-cart');
    const cartContainer = document.getElementById('cart-container');
    const cartItems = document.getElementById('cart-items');
    
    if (shoppingCart.cart.length === 0) {
        emptyCart.style.display = 'block';
        cartContainer.style.display = 'none';
        return;
    }
    
    emptyCart.style.display = 'none';
    cartContainer.style.display = 'grid';
    
    cartItems.innerHTML = '';
    
    shoppingCart.cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">₹${item.price.toFixed(2)} each</div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateCartQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" onchange="updateCartQuantity('${item.id}', this.value)">
                    <button class="quantity-btn" onclick="updateCartQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    <button class="remove-item" onclick="removeFromCart('${item.id}')">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    updateCartSummary();
}

function updateCartQuantity(itemId, newQuantity) {
    shoppingCart.updateQuantity(itemId, parseInt(newQuantity));
    displayCartItems();
}

function removeFromCart(itemId) {
    shoppingCart.removeFromCart(itemId);
    displayCartItems();
}

function updateCartSummary() {
    const subtotal = shoppingCart.getCartTotal();
    const deliveryFee = subtotal >= 500 ? 0 : 50; // Free delivery above ₹500
    const tax = subtotal * 0.18; // 18% GST for India
    const total = subtotal + deliveryFee + tax;
    
    document.getElementById('total-items').textContent = shoppingCart.getCartCount();
    document.getElementById('subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('delivery-fee').textContent = deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`;
    document.getElementById('tax').textContent = tax.toFixed(2);
    document.getElementById('total').textContent = total.toFixed(2);
}

function initializeCheckoutPage() {
    if (!window.orderManager) {
        window.orderManager = new OrderManager();
    }
    displayCheckoutSummary();
    setupPaymentMethods();
    setupCheckoutForm();
}

function displayCheckoutSummary() {
    const checkoutItems = document.getElementById('checkout-items');
    
    if (shoppingCart.cart.length === 0) {
        window.location.href = '/cart';
        return;
    }
    
    checkoutItems.innerHTML = '';
    
    shoppingCart.cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.style.cssText = 'display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #eee;';
        itemElement.innerHTML = `
            <span>${item.name} (x${item.quantity})</span>
            <span>₹${(item.price * item.quantity).toFixed(2)}</span>
        `;
        checkoutItems.appendChild(itemElement);
    });
    
    updateCheckoutTotals();
}

function updateCheckoutTotals() {
    const subtotal = shoppingCart.getCartTotal();
    const deliveryFee = subtotal >= 500 ? 0 : 50; // Free delivery above ₹500
    const tax = subtotal * 0.18; // 18% GST for India
    const total = subtotal + deliveryFee + tax;
    
    document.getElementById('checkout-subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('checkout-delivery').textContent = deliveryFee.toFixed(2);
    document.getElementById('checkout-tax').textContent = tax.toFixed(2);
    document.getElementById('checkout-total').textContent = total.toFixed(2);
}

function selectPayment(paymentType) {
    document.querySelectorAll('.payment-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    event.currentTarget.classList.add('selected');
    
    const cardDetails = document.getElementById('card-details');
    if (paymentType === 'card') {
        cardDetails.style.display = 'block';
    } else {
        cardDetails.style.display = 'none';
    }
}

function setupPaymentMethods() {
    // Initialize with card selected
    document.querySelector('.payment-option').classList.add('selected');
}

function setupCheckoutForm() {
    const checkoutForm = document.getElementById('checkout-form');
    
    checkoutForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Collect form data
        const formData = new FormData(checkoutForm);
        const paymentMethod = formData.get('paymentMethod');
        
        // Calculate totals
        const subtotal = shoppingCart.getCartTotal();
        const deliveryFee = subtotal >= 500 ? 0 : 50;
        const tax = subtotal * 0.18;
        const total = subtotal + deliveryFee + tax;
        
        const orderData = {
            customer: {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone')
            },
            address: {
                street: formData.get('address'),
                city: formData.get('city'),
                zipCode: formData.get('zipCode'),
                instructions: formData.get('deliveryInstructions')
            },
            paymentMethod: paymentMethod,
            items: shoppingCart.cart,
            subtotal: subtotal,
            deliveryFee: deliveryFee,
            tax: tax,
            total: total
        };
        
        // Validate form
        if (!orderData.customer.firstName || !orderData.customer.lastName || 
            !orderData.customer.email || !orderData.customer.phone ||
            !orderData.address.street || !orderData.address.city || !orderData.address.zipCode) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Check payment method
        if (paymentMethod === 'razorpay') {
            // Process Razorpay payment
            await processRazorpayPayment(orderData);
        } else if (paymentMethod === 'cash') {
            // Process cash on delivery
            processCashOnDelivery(orderData);
        } else {
            showNotification('Please select a payment method', 'error');
        }
    });
}

// Process Razorpay payment
async function processRazorpayPayment(orderData) {
    try {
        // Disable submit button
        const submitBtn = document.getElementById('place-order-btn');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        
        // Create Razorpay order
        const response = await fetch('/create-razorpay-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: orderData.total,
                currency: 'INR',
                receipt: `order_${Date.now()}`
            })
        });
        
        const data = await response.json();
        
        if (!data.order_id) {
            throw new Error('Failed to create order');
        }
        
        // Configure Razorpay options
        const options = {
            key: data.key_id,
            amount: data.amount,
            currency: data.currency,
            name: 'Sweet Cravings',
            description: 'Delicious Desserts Order',
            order_id: data.order_id,
            handler: async function(razorpayResponse) {
                // Payment successful - verify payment
                try {
                    const verifyResponse = await fetch('/verify-payment', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            razorpay_order_id: razorpayResponse.razorpay_order_id,
                            razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                            razorpay_signature: razorpayResponse.razorpay_signature,
                            orderData: orderData
                        })
                    });
                    
                    const verifyData = await verifyResponse.json();
                    
                    if (verifyData.success) {
                        // Payment verified successfully
                        const orderId = orderManager.addOrder(orderData);
                        
                        // Show success modal
                        document.getElementById('order-id').textContent = orderId;
                        document.getElementById('order-success-modal').style.display = 'flex';
                        
                        // Clear cart
                        shoppingCart.clearCart();
                        
                        showNotification('Payment successful! Order placed.', 'success');
                    } else {
                        throw new Error('Payment verification failed');
                    }
                } catch (error) {
                    console.error('Verification error:', error);
                    showNotification('Payment verification failed. Please contact support.', 'error');
                } finally {
                    // Re-enable button
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }
            },
            prefill: {
                name: `${orderData.customer.firstName} ${orderData.customer.lastName}`,
                email: orderData.customer.email,
                contact: orderData.customer.phone
            },
            notes: {
                address: `${orderData.address.street}, ${orderData.address.city}`,
                zipCode: orderData.address.zipCode
            },
            theme: {
                color: '#ff6161'
            },
            modal: {
                ondismiss: function() {
                    // Payment modal closed
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                    showNotification('Payment cancelled', 'warning');
                }
            }
        };
        
        // Open Razorpay checkout
        const razorpay = new Razorpay(options);
        razorpay.open();
        
        razorpay.on('payment.failed', function(response) {
            console.error('Payment failed:', response.error);
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            showNotification(`Payment failed: ${response.error.description}`, 'error');
        });
        
    } catch (error) {
        console.error('Payment error:', error);
        showNotification('Failed to initiate payment. Please try again.', 'error');
        
        // Re-enable button
        const submitBtn = document.getElementById('place-order-btn');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-lock"></i> Proceed to Payment';
    }
}

// Process cash on delivery
function processCashOnDelivery(orderData) {
    // Add order to order manager
    const orderId = orderManager.addOrder(orderData);
    
    // Show success modal
    document.getElementById('order-id').textContent = orderId;
    document.getElementById('order-success-modal').style.display = 'flex';
    
    // Clear cart
    shoppingCart.clearCart();
    
    showNotification('Order placed successfully! Pay on delivery.', 'success');
}

// Slideshow functionality
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.slide');
const indicators = document.querySelectorAll('.indicator');

function showSlide(index) {
    // Hide all slides
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    // Show current slide
    if (slides[index]) {
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
    }
}

function changeSlide(direction) {
    currentSlideIndex += direction;
    
    if (currentSlideIndex >= slides.length) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = slides.length - 1;
    }
    
    showSlide(currentSlideIndex);
}

function currentSlide(index) {
    currentSlideIndex = index - 1;
    showSlide(currentSlideIndex);
}

// Auto slideshow
function autoSlideshow() {
    if (slides.length > 0) {
        changeSlide(1);
    }
}

// Initialize slideshow when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Welcome screen logic
    const welcomeOverlay = document.getElementById('welcome-overlay');
    if (welcomeOverlay) {
        // Check if user has visited before
        const hasVisited = sessionStorage.getItem('hasVisited');
        
        if (hasVisited) {
            // Hide welcome screen immediately if already visited
            welcomeOverlay.style.display = 'none';
        } else {
            // Show welcome screen and mark as visited
            sessionStorage.setItem('hasVisited', 'true');
            // Remove welcome overlay after animation completes
            setTimeout(() => {
                welcomeOverlay.style.display = 'none';
            }, 4300); // Match animation timing
        }
    }
    
    // Initialize slideshow
    if (slides.length > 0) {
        showSlide(0);
        // Auto change slides every 5 seconds
        setInterval(autoSlideshow, 5000);
    }
    
    // Initialize form handlers
    initializeFormHandlers();
    
    // Add wishlist buttons to existing products
    addWishlistButtons();
});

// Modal Functions
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = 'auto';
}

function showLoginModal() {
    showModal('login-modal');
}

function showRegisterModal() {
    showModal('register-modal');
}

function showWishlist() {
    displayWishlistItems();
    showModal('wishlist-modal');
}

function showProfile() {
    alert('Profile management coming soon!');
}

function showOrders() {
    alert('Order history coming soon!');
}

function showAddresses() {
    alert('Address management coming soon!');
}

function showRewards() {
    alert('Rewards program coming soon!');
}

function logout() {
    userAuth.logout();
    alert('Logged out successfully!');
}

// Initialize form handlers
function initializeFormHandlers() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(loginForm);
            const email = formData.get('email');
            const password = formData.get('password');
            
            const result = userAuth.login(email, password);
            
            if (result.success) {
                closeModal('login-modal');
                showNotification('Login successful! Welcome back!', 'success');
            } else {
                showNotification(result.message, 'error');
            }
        });
    }
    
    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(registerForm);
            
            const userData = {
                firstname: formData.get('firstname'),
                lastname: formData.get('lastname'),
                email: formData.get('email'),
                mobile: formData.get('mobile'),
                password: formData.get('password')
            };
            
            const confirmPassword = formData.get('confirmPassword');
            
            if (userData.password !== confirmPassword) {
                showNotification('Passwords do not match', 'error');
                return;
            }
            
            const result = userAuth.register(userData);
            
            if (result.success) {
                closeModal('register-modal');
                showNotification('Account created successfully! Welcome!', 'success');
            } else {
                showNotification(result.message, 'error');
            }
        });
    }
}

// Add wishlist functionality to product cards
function addWishlistButtons() {
    const productCards = document.querySelectorAll('.dessert-card');
    
    productCards.forEach(card => {
        const cardActions = card.querySelector('.card-actions');
        const addToCartBtn = card.querySelector('.add-to-cart-btn');
        
        if (cardActions && addToCartBtn) {
            const wishlistBtn = document.createElement('button');
            wishlistBtn.className = 'wishlist-btn';
            wishlistBtn.innerHTML = '<i class="fas fa-heart"></i> Wishlist';
            
            const itemId = addToCartBtn.dataset.id;
            const itemName = addToCartBtn.dataset.name;
            const itemPrice = addToCartBtn.dataset.price;
            const itemImage = addToCartBtn.dataset.image;
            
            // Check if item is already in wishlist
            if (wishlist.isInWishlist(itemId)) {
                wishlistBtn.classList.add('active');
                wishlistBtn.innerHTML = '<i class="fas fa-heart"></i> Wishlisted';
            }
            
            wishlistBtn.addEventListener('click', function() {
                const item = {
                    id: itemId,
                    name: itemName,
                    price: parseFloat(itemPrice),
                    image: itemImage
                };
                
                if (wishlist.isInWishlist(itemId)) {
                    wishlist.removeFromWishlist(itemId);
                    wishlistBtn.classList.remove('active');
                    wishlistBtn.innerHTML = '<i class="fas fa-heart"></i> Wishlist';
                } else {
                    wishlist.addToWishlist(item);
                    wishlistBtn.classList.add('active');
                    wishlistBtn.innerHTML = '<i class="fas fa-heart"></i> Wishlisted';
                }
                
                displayWishlistItems(); // Update wishlist modal if open
            });
            
            cardActions.insertBefore(wishlistBtn, addToCartBtn);
        }
    });
}

// Display wishlist items
function displayWishlistItems() {
    const wishlistItemsContainer = document.getElementById('wishlist-items');
    
    if (wishlist.wishlist.length === 0) {
        wishlistItemsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-heart-broken"></i>
                <h3>Your wishlist is empty</h3>
                <p>Add items that you like to your wishlist. Review them anytime and easily move them to cart.</p>
                <a href="/menu" class="btn btn-primary">Browse Desserts</a>
            </div>
        `;
        return;
    }
    
    wishlistItemsContainer.innerHTML = '';
    
    wishlist.wishlist.forEach(item => {
        const wishlistItem = document.createElement('div');
        wishlistItem.className = 'wishlist-item';
        wishlistItem.innerHTML = `
            <div class="wishlist-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="wishlist-item-info">
                <h4>${item.name}</h4>
                <p class="wishlist-item-price">₹${item.price.toFixed(2)}</p>
                <div class="wishlist-item-actions">
                    <button class="btn btn-primary" onclick="moveToCart('${item.id}')">
                        <i class="fas fa-shopping-cart"></i> Move to Cart
                    </button>
                    <button class="btn btn-secondary" onclick="removeFromWishlist('${item.id}')">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div>
        `;
        wishlistItemsContainer.appendChild(wishlistItem);
    });
}

// Move item from wishlist to cart
function moveToCart(itemId) {
    const item = wishlist.wishlist.find(wishItem => wishItem.id === itemId);
    if (item) {
        shoppingCart.addToCart(item);
        wishlist.removeFromWishlist(itemId);
        displayWishlistItems(); // Refresh wishlist display
    }
}

// Remove item from wishlist
function removeFromWishlist(itemId) {
    wishlist.removeFromWishlist(itemId);
    displayWishlistItems(); // Refresh wishlist display
    addWishlistButtons(); // Update wishlist buttons on product cards
}

// Enhanced search functionality
function enhancedSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            filterProducts(searchTerm);
        });
    }
}

// Show notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const colors = {
        success: '#4caf50',
        error: '#f44336',
        info: '#2196f3',
        warning: '#ff9800'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 15px 20px;
        border-radius: 4px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        max-width: 300px;
    `;
    notification.innerHTML = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 4000);
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            closeModal(modal.id);
        }
    });
});

// Add CSS for notifications and wishlist
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .wishlist-item {
        display: flex;
        padding: 15px;
        border-bottom: 1px solid #eee;
        gap: 15px;
    }
    
    .wishlist-item:last-child {
        border-bottom: none;
    }
    
    .wishlist-item-image img {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 8px;
    }
    
    .wishlist-item-info {
        flex: 1;
    }
    
    .wishlist-item-info h4 {
        margin: 0 0 5px 0;
        font-size: 16px;
        color: #333;
    }
    
    .wishlist-item-price {
        color: #ff6161;
        font-weight: 600;
        font-size: 18px;
        margin: 5px 0 10px 0;
    }
    
    .wishlist-item-actions {
        display: flex;
        gap: 10px;
    }
    
    .wishlist-item-actions .btn {
        padding: 8px 16px;
        font-size: 14px;
    }
`;
document.head.appendChild(style);