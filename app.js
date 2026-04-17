// Main Application Controller
class SmartCanteen {
    constructor() {
        this.currentUser = null;
        this.cart = [];
        this.orders = [];
        this.menuItems = [];
        this.init();
    }

    init() {
        this.loadFromLocalStorage();
        this.setupEventListeners();
        this.initializeApp();
        this.updateUI();
    }

    loadFromLocalStorage() {
        const savedUser = localStorage.getItem('currentUser');
        const savedCart = localStorage.getItem('cart');
        const savedOrders = localStorage.getItem('orders');

        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        }
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
        }
        if (savedOrders) {
            this.orders = JSON.parse(savedOrders);
        }
    }

    saveToLocalStorage() {
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        localStorage.setItem('cart', JSON.stringify(this.cart));
        localStorage.setItem('orders', JSON.stringify(this.orders));
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.showSection(targetId);
                this.updateActiveNav(link);
            });
        });

        // Login
        document.getElementById('loginBtn').addEventListener('click', () => {
            this.showModal('loginModal');
        });

        document.getElementById('closeLoginModal').addEventListener('click', () => {
            this.hideModal('loginModal');
        });

        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Cart
        document.getElementById('cartBtn').addEventListener('click', () => {
            this.showCart();
        });

        document.getElementById('closeCartModal').addEventListener('click', () => {
            this.hideModal('cartModal');
        });

        document.getElementById('checkoutBtn').addEventListener('click', () => {
            this.showCheckout();
        });

        // Order
        document.getElementById('closeOrderModal').addEventListener('click', () => {
            this.hideModal('orderModal');
        });

        document.getElementById('orderForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.placeOrder();
        });

        // Hero Actions
        document.getElementById('orderNowBtn').addEventListener('click', () => {
            if (this.currentUser) {
                this.showSection('menu');
                this.updateActiveNav(document.querySelector('[href="#menu"]'));
            } else {
                this.showModal('loginModal');
            }
        });

        document.getElementById('viewMenuBtn').addEventListener('click', () => {
            this.showSection('menu');
            this.updateActiveNav(document.querySelector('[href="#menu"]'));
        });

        // Mobile Menu
        document.querySelector('.hamburger').addEventListener('click', () => {
            document.querySelector('.nav-menu').classList.toggle('active');
        });

        // Close modals on outside click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal.id);
                }
            });
        });
    }

    initializeApp() {
        // Initialize menu items
        this.initializeMenu();
        
        // Update crowd indicator
        this.updateCrowdIndicator();
        
        // Update time suggestion
        this.updateTimeSuggestion();
        
        // Start real-time updates
        this.startRealTimeUpdates();
    }

    initializeMenu() {
        this.menuItems = [
            // Snacks
            {
                id: 1,
                name: 'Samosa',
                category: 'snacks',
                description: 'Crispy triangular pastry with spiced potatoes and peas',
                price: 15,
                image: 'samosa',
                available: true
            },
            {
                id: 2,
                name: 'Vada Pav',
                category: 'snacks',
                description: 'Spicy potato fritter in a bun with chutney',
                price: 25,
                image: 'vadapav',
                available: true
            },
            {
                id: 3,
                name: 'French Fries',
                category: 'snacks',
                description: 'Crispy golden potato fries with seasoning',
                price: 35,
                image: 'fries',
                available: true
            },
            // Meals
            {
                id: 4,
                name: 'Thali',
                category: 'meals',
                description: 'Complete meal with rice, dal, roti, vegetables and salad',
                price: 80,
                image: 'thali',
                available: true
            },
            {
                id: 5,
                name: 'Biryani',
                category: 'meals',
                description: 'Fragrant rice dish with spiced vegetables and herbs',
                price: 120,
                image: 'biryani',
                available: true
            },
            {
                id: 6,
                name: 'Noodles',
                category: 'meals',
                description: 'Stir-fried noodles with vegetables and sauces',
                price: 60,
                image: 'noodles',
                available: true
            },
            // Beverages
            {
                id: 7,
                name: 'Tea',
                category: 'beverages',
                description: 'Hot Indian tea with spices',
                price: 10,
                image: 'tea',
                available: true
            },
            {
                id: 8,
                name: 'Coffee',
                category: 'beverages',
                description: 'Freshly brewed coffee',
                price: 20,
                image: 'coffee',
                available: true
            },
            {
                id: 9,
                name: 'Fresh Juice',
                category: 'beverages',
                description: 'Fresh seasonal fruit juice',
                price: 30,
                image: 'juice',
                available: true
            }
        ];
    }

    updateCrowdIndicator() {
        const hour = new Date().getHours();
        const crowdStatus = document.getElementById('crowdStatus');
        
        let level, barClass, width;
        
        if (hour >= 12 && hour <= 14) {
            // Peak hours (12-2 PM)
            level = 'High';
            barClass = 'high';
            width = 90;
        } else if (hour >= 8 && hour <= 10 || hour >= 15 && hour <= 17) {
            // Medium hours (8-10 AM, 3-5 PM)
            level = 'Medium';
            barClass = 'medium';
            width = 60;
        } else {
            // Low hours
            level = 'Low';
            barClass = 'low';
            width = 30;
        }
        
        crowdStatus.innerHTML = `
            <span class="status-${barClass}">${level}</span>
            <div class="status-bar">
                <div class="bar-fill ${barClass}" style="width: ${width}%"></div>
            </div>
        `;
    }

    updateTimeSuggestion() {
        const hour = new Date().getHours();
        const suggestion = document.getElementById('timeSuggestion');
        
        let bestTime;
        
        if (hour < 11) {
            bestTime = '11:30 AM';
        } else if (hour < 14) {
            bestTime = '2:30 PM';
        } else if (hour < 17) {
            bestTime = '5:30 PM';
        } else {
            bestTime = '6:30 PM';
        }
        
        suggestion.textContent = `Best time to order: ${bestTime}`;
    }

    startRealTimeUpdates() {
        // Update crowd indicator every 5 minutes
        setInterval(() => {
            this.updateCrowdIndicator();
            this.updateTimeSuggestion();
        }, 300000);
    }

    handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const userType = document.getElementById('userType').value;
        
        // Simple authentication (in real app, this would be server-side)
        const validCredentials = {
            'student@college.com': { password: '123456', type: 'student', name: 'John Student' },
            'staff@college.com': { password: '123456', type: 'staff', name: 'Jane Staff' },
            'admin@college.com': { password: '123456', type: 'admin', name: 'Admin User' }
        };
        
        if (validCredentials[email] && validCredentials[email].password === password) {
            this.currentUser = {
                email: email,
                type: userType,
                name: validCredentials[email].name,
                loyaltyPoints: 0
            };
            
            this.saveToLocalStorage();
            this.updateUI();
            this.hideModal('loginModal');
            this.showToast('Login successful!', 'success');
            
            // Reset form
            document.getElementById('loginForm').reset();
        } else {
            this.showToast('Invalid credentials. Please try again.', 'error');
        }
    }

    logout() {
        this.currentUser = null;
        this.saveToLocalStorage();
        this.updateUI();
        this.showSection('home');
        this.updateActiveNav(document.querySelector('[href="#home"]'));
        this.showToast('Logged out successfully', 'success');
    }

    updateUI() {
        // Update navigation
        const loginBtn = document.getElementById('loginBtn');
        const cartBtn = document.getElementById('cartBtn');
        const adminLink = document.querySelector('.admin-only');
        
        if (this.currentUser) {
            loginBtn.innerHTML = `
                <i class="fas fa-user"></i> ${this.currentUser.name}
            `;
            loginBtn.onclick = () => this.logout();
            cartBtn.style.display = 'flex';
            
            if (this.currentUser.type === 'admin') {
                adminLink.style.display = 'block';
            }
        } else {
            loginBtn.innerHTML = '<i class="fas fa-user"></i> Login';
            loginBtn.onclick = () => this.showModal('loginModal');
            cartBtn.style.display = 'none';
            adminLink.style.display = 'none';
        }
        
        // Update cart count
        this.updateCartCount();
        
        // Update menu if on menu page
        if (document.getElementById('menu').style.display !== 'none') {
            this.renderMenu();
        }
        
        // Update orders if on orders page
        if (document.getElementById('orders').style.display !== 'none') {
            this.renderOrders();
        }
        
        // Update admin panel if on admin page
        if (document.getElementById('admin').style.display !== 'none') {
            this.renderAdminPanel();
        }
    }

    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('section').forEach(section => {
            section.style.display = 'none';
        });
        
        // Show target section
        document.getElementById(sectionId).style.display = 'block';
        
        // Initialize section-specific content
        if (sectionId === 'menu') {
            this.renderMenu();
        } else if (sectionId === 'orders') {
            this.renderOrders();
        } else if (sectionId === 'admin') {
            this.renderAdminPanel();
        }
    }

    updateActiveNav(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    showModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    }

    hideModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    updateCartCount() {
        const count = this.cart.reduce((total, item) => total + item.quantity, 0);
        document.querySelector('.cart-count').textContent = count;
    }

    showCart() {
        this.renderCart();
        this.showModal('cartModal');
    }

    renderCart() {
        const cartItems = document.getElementById('cartItems');
        
        if (this.cart.length === 0) {
            cartItems.innerHTML = '<p class="text-center">Your cart is empty</p>';
        } else {
            cartItems.innerHTML = this.cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">Rs. ${item.price} x ${item.quantity}</div>
                    </div>
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="app.updateCartQuantity(${item.id}, -1)">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn" onclick="app.updateCartQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
            `).join('');
        }
        
        this.updateCartSummary();
    }

    updateCartQuantity(itemId, change) {
        const item = this.cart.find(item => item.id === itemId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.cart = this.cart.filter(item => item.id !== itemId);
            }
            this.saveToLocalStorage();
            this.updateUI();
            this.renderCart();
        }
    }

    updateCartSummary() {
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const advance = Math.floor(subtotal * 0.5);
        
        document.getElementById('cartSubtotal').textContent = `Rs. ${subtotal}`;
        document.getElementById('cartAdvance').textContent = `Rs. ${advance}`;
        document.getElementById('cartTotal').textContent = `Rs. ${subtotal}`;
    }

    showCheckout() {
        if (this.cart.length === 0) {
            this.showToast('Your cart is empty', 'warning');
            return;
        }
        
        this.renderOrderSummary();
        this.generateTimeSlots();
        this.hideModal('cartModal');
        this.showModal('orderModal');
    }

    renderOrderSummary() {
        const orderItems = document.getElementById('orderItems');
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const advance = Math.floor(subtotal * 0.5);
        
        orderItems.innerHTML = this.cart.map(item => `
            <div class="order-item">
                <span>${item.name} x ${item.quantity}</span>
                <span>Rs. ${item.price * item.quantity}</span>
            </div>
        `).join('');
        
        document.getElementById('orderTotal').textContent = `Rs. ${subtotal}`;
        document.getElementById('orderAdvance').textContent = `Rs. ${advance}`;
    }

    generateTimeSlots() {
        const pickupTime = document.getElementById('pickupTime');
        const now = new Date();
        const slots = [];
        
        // Generate next 8 time slots (30 minutes each)
        for (let i = 0; i < 8; i++) {
            const slotTime = new Date(now.getTime() + (i * 30 * 60 * 1000));
            const timeString = slotTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
            });
            slots.push(`<option value="${timeString}">${timeString}</option>`);
        }
        
        pickupTime.innerHTML = slots.join('');
    }

    placeOrder() {
        const pickupTime = document.getElementById('pickupTime').value;
        const specialInstructions = document.getElementById('specialInstructions').value;
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const advance = Math.floor(subtotal * 0.5);
        
        const order = {
            id: Date.now(),
            items: [...this.cart],
            total: subtotal,
            advance: advance,
            pickupTime: pickupTime,
            specialInstructions: specialInstructions,
            status: 'preparing',
            orderTime: new Date().toISOString(),
            userId: this.currentUser.email
        };
        
        this.orders.push(order);
        this.cart = [];
        
        // Add loyalty points (1 point per Rs. 10 spent)
        const points = Math.floor(subtotal / 10);
        this.currentUser.loyaltyPoints += points;
        
        this.saveToLocalStorage();
        this.updateUI();
        this.hideModal('orderModal');
        this.showToast(`Order placed successfully! You earned ${points} loyalty points.`, 'success');
        
        // Reset form
        document.getElementById('orderForm').reset();
    }

    renderMenu() {
        this.renderMenuItems();
        this.setupMenuFilters();
    }

    renderMenuItems(category = 'all') {
        const menuGrid = document.getElementById('menuGrid');
        const filteredItems = category === 'all' 
            ? this.menuItems 
            : this.menuItems.filter(item => item.category === category);
        
        if (filteredItems.length === 0) {
            menuGrid.innerHTML = '<div class="text-center">No items available in this category</div>';
            return;
        }
        
        menuGrid.innerHTML = filteredItems.map(item => `
            <div class="menu-item ${item.category === 'deals' ? 'deal' : ''}">
                <div class="menu-item-image">
                    <i class="fas fa-${this.getFoodIcon(item.name)}"></i>
                </div>
                <div class="menu-item-content">
                    <div class="menu-item-name">${item.name}</div>
                    <div class="menu-item-description">${item.description}</div>
                    <div class="menu-item-footer">
                        <div class="menu-item-price">Rs. ${item.price}</div>
                        <div class="menu-item-actions">
                            <div class="quantity-control">
                                <button class="quantity-btn" onclick="app.addToCart(${item.id}, -1)">-</button>
                                <span class="quantity-value" id="qty-${item.id}">0</span>
                                <button class="quantity-btn" onclick="app.addToCart(${item.id}, 1)">+</button>
                            </div>
                            <button class="add-to-cart" onclick="app.addToCart(${item.id}, 1)">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Update quantity displays
        this.updateQuantityDisplays();
    }

    getFoodIcon(name) {
        const icons = {
            'Samosa': 'cheese',
            'Vada Pav': 'bread-slice',
            'French Fries': 'fire',
            'Thali': 'utensils',
            'Biryani': 'bowl-food',
            'Noodles': 'egg',
            'Tea': 'mug-hot',
            'Coffee': 'mug-hot',
            'Fresh Juice': 'glass-water'
        };
        return icons[name] || 'utensils';
    }

    setupMenuFilters() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.renderMenuItems(btn.dataset.category);
            });
        });
    }

    addToCart(itemId, quantity) {
        const item = this.menuItems.find(item => item.id === itemId);
        if (!item) return;
        
        const existingItem = this.cart.find(cartItem => cartItem.id === itemId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
            if (existingItem.quantity <= 0) {
                this.cart = this.cart.filter(cartItem => cartItem.id !== itemId);
            }
        } else if (quantity > 0) {
            this.cart.push({
                ...item,
                quantity: quantity
            });
        }
        
        this.saveToLocalStorage();
        this.updateUI();
        this.updateQuantityDisplays();
        
        if (quantity > 0) {
            this.showToast(`${item.name} added to cart`, 'success');
        }
    }

    updateQuantityDisplays() {
        this.menuItems.forEach(item => {
            const cartItem = this.cart.find(cartItem => cartItem.id === item.id);
            const qtyElement = document.getElementById(`qty-${item.id}`);
            if (qtyElement) {
                qtyElement.textContent = cartItem ? cartItem.quantity : 0;
            }
        });
    }

    renderOrders() {
        this.renderOrdersList();
        this.setupOrderTabs();
    }

    renderOrdersList(status = 'all') {
        const ordersList = document.getElementById('ordersList');
        const userOrders = this.orders.filter(order => order.userId === this.currentUser.email);
        const filteredOrders = status === 'all' 
            ? userOrders 
            : userOrders.filter(order => order.status === status);
        
        if (filteredOrders.length === 0) {
            ordersList.innerHTML = '<div class="text-center">No orders found</div>';
            return;
        }
        
        ordersList.innerHTML = filteredOrders.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <div class="order-id">Order #${order.id}</div>
                    <div class="order-status status-${order.status}">${order.status.toUpperCase()}</div>
                </div>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <span>${item.name} x ${item.quantity}</span>
                            <span>Rs. ${item.price * item.quantity}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="order-footer">
                    <div class="order-total">Total: Rs. ${order.total}</div>
                    <div class="order-actions">
                        ${order.status === 'preparing' ? `
                            <button class="btn btn-outline" onclick="app.cancelOrder(${order.id})">
                                <i class="fas fa-times"></i> Cancel
                            </button>
                        ` : ''}
                        ${order.status === 'ready' ? `
                            <button class="btn btn-primary" onclick="app.collectOrder(${order.id})">
                                <i class="fas fa-check"></i> Collect
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }

    setupOrderTabs() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.renderOrdersList(btn.dataset.status);
            });
        });
    }

    cancelOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            order.status = 'cancelled';
            
            // Add to discount deals (30% off)
            const dealItem = {
                ...order.items[0],
                id: Date.now(),
                category: 'deals',
                price: Math.floor(order.items[0].price * 0.7),
                originalPrice: order.items[0].price,
                available: true
            };
            this.menuItems.push(dealItem);
            
            this.saveToLocalStorage();
            this.updateUI();
            this.renderOrdersList();
            this.showToast('Order cancelled. Item added to discount deals!', 'success');
        }
    }

    collectOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            order.status = 'collected';
            this.saveToLocalStorage();
            this.updateUI();
            this.renderOrdersList();
            this.showToast('Order collected successfully!', 'success');
        }
    }

    renderAdminPanel() {
        if (this.currentUser.type !== 'admin') {
            this.showSection('home');
            this.showToast('Access denied. Admin privileges required.', 'error');
            return;
        }
        
        this.renderAdminStats();
        this.renderAdminOrders();
    }

    renderAdminStats() {
        const totalOrders = this.orders.length;
        const totalRevenue = this.orders.reduce((sum, order) => sum + order.total, 0);
        const cancelledOrders = this.orders.filter(order => order.status === 'cancelled').length;
        const wasteReduction = totalOrders > 0 ? Math.floor((cancelledOrders / totalOrders) * 100) : 0;
        
        document.getElementById('totalOrders').textContent = totalOrders;
        document.getElementById('totalRevenue').textContent = `Rs. ${totalRevenue}`;
        document.getElementById('wasteReduction').textContent = `${wasteReduction}%`;
    }

    renderAdminOrders() {
        const adminOrdersTable = document.getElementById('adminOrdersTable');
        
        if (this.orders.length === 0) {
            adminOrdersTable.innerHTML = '<div class="text-center">No orders found</div>';
            return;
        }
        
        adminOrdersTable.innerHTML = `
            <table class="table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.orders.map(order => `
                        <tr>
                            <td>#${order.id}</td>
                            <td>${order.userId}</td>
                            <td>Rs. ${order.total}</td>
                            <td>
                                <span class="order-status status-${order.status}">
                                    ${order.status.toUpperCase()}
                                </span>
                            </td>
                            <td>
                                ${order.status === 'preparing' ? `
                                    <button class="btn btn-sm btn-primary" onclick="app.updateOrderStatus(${order.id}, 'ready')">
                                        Mark Ready
                                    </button>
                                ` : ''}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    updateOrderStatus(orderId, newStatus) {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            order.status = newStatus;
            this.saveToLocalStorage();
            this.renderAdminPanel();
            this.showToast(`Order #${orderId} marked as ${newStatus}`, 'success');
        }
    }
}

// Initialize the application
const app = new SmartCanteen();
