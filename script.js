const products = [
    {
        id: 1,
        title: "Smartphone Pro Max",
        category: "electronics",
        price: 899.99,
        image: "https://www.apple.com/v/iphone/home/cb/images/meta/iphone__kqge21l9n26q_og.png"
    },
    {
        id: 2,
        title: "Wireless Headphones",
        category: "electronics",
        price: 149.99,
        image: "https://m.media-amazon.com/images/I/71zfpkr4bYL._SX679_.jpg"
    },
    {
        id: 3,
        title: "Men's Casual T-Shirt",
        category: "clothing",
        price: 24.99,
        image: "https://m.media-amazon.com/images/I/71axOQHBUhL._SY879_.jpg"
    },
    {
        id: 4,
        title: "Women's Running Shoes",
        category: "clothing",
        price: 79.99,
        image: "https://m.media-amazon.com/images/I/81JEmrWRp1L._SY695_.jpg"
    },
    {
        id: 5,
        title: "Coffee Maker",
        category: "home",
        price: 69.99,
        image: "https://m.media-amazon.com/images/I/61zdqgKDffL._SX679_.jpg"
    },
    {
        id: 6,
        title: "Non-Stick Cookware Set",
        category: "home",
        price: 129.99,
        image: "https://m.media-amazon.com/images/I/81IcLYCiWKL._SX679_.jpg"
    },
    {
        id: 7,
        title: "Yoga Mat",
        category: "sports",
        price: 29.99,
        image: "https://m.media-amazon.com/images/I/61+J--H8kHL._SX679_.jpg"
    },
    {
        id: 8,
        title: "Basketball",
        category: "sports",
        price: 19.99,
        image: "https://m.media-amazon.com/images/I/81f4weUqUzL._SX679_.jpg"
    }
];

// Cart functionality
let cart = [];

// DOM elements
const productsGrid = document.getElementById('products-grid');
const categoryBtns = document.querySelectorAll('.category-btn');
const cartIcon = document.getElementById('cart-icon');
const cartModal = document.getElementById('cart-modal');
const closeModal = document.getElementById('close-modal');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const proceedCheckout = document.getElementById('proceed-checkout');
const cartContainer = document.getElementById('cart-container');
const checkoutForm = document.getElementById('checkout-form');
const paymentForm = document.getElementById('payment-form');

// Display products
function displayProducts(category = 'all') {
    productsGrid.innerHTML = '';
    
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(product => product.category === category);
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-category">${product.category}</p>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="product-btn" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
    
    // Add event listeners to the "Add to Cart" buttons
    document.querySelectorAll('.product-btn').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Filter products by category
categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        categoryBtns.forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        // Get category and display filtered products
        const category = btn.getAttribute('data-category');
        displayProducts(category);
    });
});

// Add product to cart
function addToCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);
    
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    // Update cart count
    updateCartCount();
    
    // Show success message
    const button = e.target;
    const originalText = button.textContent;
    button.textContent = 'Added!';
    button.style.backgroundColor = '#4CAF50';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '';
    }, 2000);
}

// Update cart count
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;
}

// Render cart items
function renderCart() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        cartTotal.style.display = 'none';
        proceedCheckout.style.display = 'none';
        return;
    }
    
    cartTotal.style.display = 'block';
    proceedCheckout.style.display = 'block';
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="cart-item-img">
            <div class="cart-item-info">
                <h4 class="cart-item-title">${item.title}</h4>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
                <span class="cart-item-remove" data-id="${item.id}">Remove</span>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    // Update total
    cartTotal.innerHTML = `Total: <span>$${total.toFixed(2)}</span>`;
    
    // Add event listeners for quantity buttons and remove buttons
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', decreaseQuantity);
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', increaseQuantity);
    });
    
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', removeItem);
    });
}

// Increase item quantity
function increaseQuantity(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += 1;
        updateCartCount();
        renderCart();
    }
}

// Decrease item quantity
function decreaseQuantity(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity -= 1;
        
        if (item.quantity === 0) {
            cart = cart.filter(item => item.id !== productId);
        }
        
        updateCartCount();
        renderCart();
    }
}

// Remove item from cart
function removeItem(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    cart = cart.filter(item => item.id !== productId);
    
    updateCartCount();
    renderCart();
}

// Show cart modal
cartIcon.addEventListener('click', () => {
    renderCart();
    cartModal.style.display = 'flex';
});

// Close cart modal
closeModal.addEventListener('click', () => {
    cartModal.style.display = 'none';
    // Reset checkout form
    cartContainer.style.display = 'block';
    checkoutForm.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
        // Reset checkout form
        cartContainer.style.display = 'block';
        checkoutForm.style.display = 'none';
    }
});

// Proceed to checkout
proceedCheckout.addEventListener('click', () => {
    cartContainer.style.display = 'none';
    checkoutForm.style.display = 'block';
});

// Payment form submission
paymentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Show success message
    checkoutForm.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <h2 style="color: #4CAF50; margin-bottom: 1rem;">Order Placed Successfully!</h2>
            <p>Thank you for your order. We have received your payment and will process your order shortly.</p>
            <p>A confirmation email has been sent to your email address.</p>
            <button class="checkout-btn" id="continue-shopping" style="float: none; margin-top: 1.5rem;">Continue Shopping</button>
        </div>
    `;
    
    // Add event listener to continue shopping button
    document.getElementById('continue-shopping').addEventListener('click', () => {
        cartModal.style.display = 'none';
        // Reset cart
        cart = [];
        updateCartCount();
        
        // Reset checkout form
        setTimeout(() => {
            cartContainer.style.display = 'block';
            checkoutForm.style.display = 'none';
        }, 300);
    });
});

// Initialize
displayProducts();