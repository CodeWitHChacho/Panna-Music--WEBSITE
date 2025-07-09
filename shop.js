document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('product-grid');
    const cartCount = document.getElementById('cart-count');
    const cartItemsList = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const checkoutForm = document.getElementById('checkout-form');
    const cartModal = document.getElementById('cart-modal');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartIconBtn = document.getElementById('cart-icon-btn');
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');

    let products = [];
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Fetch products from JSON file
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            if (productGrid) {
                displayProducts(products);
            }
            if (categoryFilter) {
                populateCategories();
            }
        });

    function displayProducts(productsToDisplay) {
        productGrid.innerHTML = '';
        productsToDisplay.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <a href="product.html?productId=${product.id}">
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                </a>
                <p class="price">Ksh${product.price.toFixed(2)}</p>
                <p>Status: ${product.availability}</p>
                <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
            `;
            productGrid.appendChild(productCard);
        });
    }

    function populateCategories() {
        const categories = [...new Set(products.map(p => p.category))];
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }

    // Event Listeners
    if (productGrid) {
        productGrid.addEventListener('click', e => {
            if (e.target.classList.contains('add-to-cart-btn')) {
                const productId = parseInt(e.target.dataset.id);
                addToCart(productId);
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', handleFiltering);
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', handleFiltering);
    }

    function handleFiltering() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;

        let filteredProducts = products;

        if (searchTerm) {
            filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(searchTerm));
        }

        if (selectedCategory) {
            filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
        }

        displayProducts(filteredProducts);
    }


    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        const cartItem = cart.find(item => item.id === productId);

        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        updateCart();
    }

    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
    }

    function updateCartUI() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        // Update all cart counts
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(el => {
            el.textContent = totalItems;
        });

        if (cartItemsList) {
            renderCartItems();
        }
    }

    function renderCartItems() {
        cartItemsList.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${item.name} (x${item.quantity})</span>
                <span>Ksh${(item.price * item.quantity).toFixed(2)}</span>
            `;
            cartItemsList.appendChild(li);
            total += item.price * item.quantity;
        });
        if (cartTotal) {
            cartTotal.textContent = `Total: Ksh${total.toFixed(2)}`;
        }
    }

    // Handle product details page
    if (window.location.pathname.endsWith('product.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('productId'));
        // We need to fetch products first, then find the one.
        fetch('products.json')
            .then(res => res.json())
            .then(allProducts => {
                const product = allProducts.find(p => p.id === productId);
                if (product) {
                    displayProductDetails(product);
                }
            });
    }

    function displayProductDetails(product) {
        const productDetailContainer = document.getElementById('product-detail');
        if (productDetailContainer) {
            productDetailContainer.innerHTML = `
                <h2>${product.name}</h2>
                <img src="${product.image}" alt="${product.name}" style="max-width: 400px;">
                <p>${product.description}</p>
                <p class="price">Ksh${product.price.toFixed(2)}</p>
                <p>Status: ${product.availability}</p>
                <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
            `;
            // Re-add event listener for the new button
            productDetailContainer.addEventListener('click', e => {
                if (e.target.classList.contains('add-to-cart-btn')) {
                    // Need to refetch products to add to cart correctly
                     fetch('products.json')
                        .then(response => response.json())
                        .then(data => {
                            products = data;
                            addToCart(product.id);
                        });
                }
            });
        }
    }

    // Handle Checkout
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', e => {
            e.preventDefault();
            const formData = new FormData(checkoutForm);
            const customerInfo = Object.fromEntries(formData.entries());
            
            // In a real app, you'd send this to a server
            console.log({
                customer: customerInfo,
                order: cart
            });

            localStorage.setItem('order', JSON.stringify({ customer: customerInfo, order: cart }));
            
            // Clear cart and redirect
            cart = [];
            updateCart();
            window.location.href = 'confirmation.html';
        });
    }

    // Handle Confirmation Page
    if (window.location.pathname.endsWith('confirmation.html')) {
        const orderSummary = document.getElementById('order-summary');
        const order = JSON.parse(localStorage.getItem('order'));

        if (order && orderSummary) {
            let itemsHtml = order.order.map(item => `<li>${item.name} (x${item.quantity}) - Ksh${(item.price * item.quantity).toFixed(2)}</li>`).join('');
            let total = order.order.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            orderSummary.innerHTML = `
                <h3>Thank you for your order, ${order.customer.name}!</h3>
                <p>Your order has been placed successfully.</p>
                <h4>Order Details:</h4>
                <ul>${itemsHtml}</ul>
                <p><strong>Total: Ksh${total.toFixed(2)}</strong></p>
                <p>Payment Method: ${order.customer['payment-method']}</p>
            `;
            localStorage.removeItem('order'); // Clean up
        }
    }


    // Cart Modal Logic
    if (cartIconBtn) {
        cartIconBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (cartModal) {
                cartModal.classList.add('open');
                document.body.classList.add('modal-open');
            }
        });
    }

    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', () => {
            if (cartModal) {
                cartModal.classList.remove('open');
                document.body.classList.remove('modal-open');
            }
        });
    }

    // Close modal if clicking outside of it
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove('open');
            document.body.classList.remove('modal-open');
        }
    });


    // Initial UI update
    updateCartUI();
});