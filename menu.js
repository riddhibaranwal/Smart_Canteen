// Menu Management Module
class MenuManager {
    constructor(app) {
        this.app = app;
        this.categories = ['all', 'snacks', 'meals', 'beverages', 'deals'];
        this.init();
    }

    init() {
        this.setupMenuEventListeners();
    }

    setupMenuEventListeners() {
        // Menu-specific event listeners
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('menu-item')) {
                this.handleMenuItemClick(e.target);
            }
        });
    }

    handleMenuItemClick(item) {
        // Handle menu item interactions
        const itemId = parseInt(item.dataset.itemId);
        if (itemId) {
            this.showItemDetails(itemId);
        }
    }

    showItemDetails(itemId) {
        const item = this.app.menuItems.find(i => i.id === itemId);
        if (item) {
            // Show item details modal (future enhancement)
            console.log('Item details:', item);
        }
    }

    getCategoryIcon(category) {
        const icons = {
            snacks: 'cookie-bite',
            meals: 'utensils',
            beverages: 'mug-hot',
            deals: 'tag'
        };
        return icons[category] || 'utensils';
    }

    filterByCategory(category) {
        return this.app.menuItems.filter(item => 
            category === 'all' || item.category === category
        );
    }

    searchMenuItems(query) {
        const searchTerm = query.toLowerCase();
        return this.app.menuItems.filter(item => 
            item.name.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm)
        );
    }

    getAvailableItems() {
        return this.app.menuItems.filter(item => item.available);
    }

    getDeals() {
        return this.app.menuItems.filter(item => item.category === 'deals');
    }

    addDealItem(originalItem, discountPercentage = 30) {
        const dealItem = {
            ...originalItem,
            id: Date.now(),
            category: 'deals',
            price: Math.floor(originalItem.price * (1 - discountPercentage / 100)),
            originalPrice: originalItem.price,
            discountPercentage: discountPercentage,
            available: true,
            dealExpiry: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours from now
        };
        
        this.app.menuItems.push(dealItem);
        return dealItem;
    }

    removeExpiredDeals() {
        const now = new Date();
        this.app.menuItems = this.app.menuItems.filter(item => {
            if (item.category === 'deals' && item.dealExpiry) {
                return new Date(item.dealExpiry) > now;
            }
            return true;
        });
    }

    updateItemAvailability(itemId, available) {
        const item = this.app.menuItems.find(i => i.id === itemId);
        if (item) {
            item.available = available;
            this.app.saveToLocalStorage();
        }
    }

    addMenuItem(itemData) {
        const newItem = {
            id: Date.now(),
            ...itemData,
            available: true
        };
        
        this.app.menuItems.push(newItem);
        this.app.saveToLocalStorage();
        return newItem;
    }

    removeMenuItem(itemId) {
        this.app.menuItems = this.app.menuItems.filter(item => item.id !== itemId);
        this.app.saveToLocalStorage();
    }

    updateMenuItem(itemId, updates) {
        const item = this.app.menuItems.find(i => i.id === itemId);
        if (item) {
            Object.assign(item, updates);
            this.app.saveToLocalStorage();
        }
    }
}
