// Orders Management Module
class OrderManager {
    constructor(app) {
        this.app = app;
        this.orderStatuses = ['preparing', 'ready', 'collected', 'cancelled'];
        this.init();
    }

    init() {
        this.setupOrderListeners();
        this.startOrderStatusUpdates();
    }

    setupOrderListeners() {
        // Order-specific event listeners
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('cancel-order')) {
                const orderId = parseInt(e.target.dataset.orderId);
                this.cancelOrder(orderId);
            }
            
            if (e.target.classList.contains('collect-order')) {
                const orderId = parseInt(e.target.dataset.orderId);
                this.collectOrder(orderId);
            }
        });
    }

    startOrderStatusUpdates() {
        // Update order statuses every 30 seconds
        setInterval(() => {
            this.updateOrderStatuses();
        }, 30000);
    }

    updateOrderStatuses() {
        const now = new Date();
        
        this.app.orders.forEach(order => {
            if (order.status === 'preparing') {
                const orderTime = new Date(order.orderTime);
                const timeDiff = (now - orderTime) / (1000 * 60); // minutes
                
                // Auto-mark as ready after 15 minutes
                if (timeDiff >= 15) {
                    order.status = 'ready';
                    this.app.saveToLocalStorage();
                }
            }
        });
    }

    cancelOrder(orderId) {
        const order = this.app.orders.find(o => o.id === orderId);
        if (!order) return;

        // Can only cancel preparing orders
        if (order.status !== 'preparing') {
            this.app.showToast('Cannot cancel order at this stage', 'error');
            return;
        }

        // Update order status
        order.status = 'cancelled';
        order.cancelledTime = new Date().toISOString();

        // Add items to discount deals
        order.items.forEach(item => {
            const dealItem = this.app.menuManager.addDealItem(item, 30);
            this.app.showToast(`${item.name} added to discount deals at 30% off!`, 'success');
        });

        // Refund logic (in real app, this would process refund)
        this.processRefund(order);

        this.app.saveToLocalStorage();
        this.app.updateUI();
        this.app.showToast('Order cancelled successfully', 'success');
    }

    collectOrder(orderId) {
        const order = this.app.orders.find(o => o.id === orderId);
        if (!order) return;

        // Can only collect ready orders
        if (order.status !== 'ready') {
            this.app.showToast('Order is not ready for collection', 'error');
            return;
        }

        // Update order status
        order.status = 'collected';
        order.collectedTime = new Date().toISOString();

        // Process remaining payment
        this.processRemainingPayment(order);

        // Add loyalty points
        const points = Math.floor(order.total / 10);
        this.app.currentUser.loyaltyPoints += points;
        this.app.showToast(`Order collected! You earned ${points} loyalty points.`, 'success');

        this.app.saveToLocalStorage();
        this.app.updateUI();
    }

    processRefund(order) {
        // In a real app, this would integrate with payment gateway
        console.log(`Processing refund of Rs. ${order.advance} for order ${order.id}`);
        
        // For demo purposes, we'll just log it
        this.app.showToast(`Refund of Rs. ${order.advance} will be processed`, 'info');
    }

    processRemainingPayment(order) {
        const remainingAmount = order.total - order.advance;
        
        // In a real app, this would integrate with payment gateway
        console.log(`Processing remaining payment of Rs. ${remainingAmount} for order ${order.id}`);
        
        // For demo purposes, we'll just log it
        this.app.showToast(`Remaining payment of Rs. ${remainingAmount} processed`, 'info');
    }

    getOrderById(orderId) {
        return this.app.orders.find(order => order.id === orderId);
    }

    getUserOrders(userId) {
        return this.app.orders.filter(order => order.userId === userId);
    }

    getOrdersByStatus(status) {
        return this.app.orders.filter(order => order.status === status);
    }

    getRecentOrders(limit = 10) {
        return this.app.orders
            .sort((a, b) => new Date(b.orderTime) - new Date(a.orderTime))
            .slice(0, limit);
    }

    getOrderStats() {
        const stats = {
            total: this.app.orders.length,
            preparing: this.getOrdersByStatus('preparing').length,
            ready: this.getOrdersByStatus('ready').length,
            collected: this.getOrdersByStatus('collected').length,
            cancelled: this.getOrdersByStatus('cancelled').length,
            totalRevenue: this.app.orders.reduce((sum, order) => sum + order.total, 0),
            advanceRevenue: this.app.orders.reduce((sum, order) => sum + order.advance, 0)
        };

        return stats;
    }

    getPeakHours() {
        const hourCounts = {};
        
        this.app.orders.forEach(order => {
            const hour = new Date(order.orderTime).getHours();
            hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        });

        // Convert to array and sort by count
        const peakHours = Object.entries(hourCounts)
            .map(([hour, count]) => ({
                hour: parseInt(hour),
                count: count,
                timeRange: `${hour}:00 - ${hour + 1}:00`
            }))
            .sort((a, b) => b.count - a.count);

        return peakHours;
    }

    getWasteReductionStats() {
        const totalOrders = this.app.orders.length;
        const cancelledOrders = this.getOrdersByStatus('cancelled').length;
        const wasteReductionPercentage = totalOrders > 0 
            ? Math.floor((cancelledOrders / totalOrders) * 100) 
            : 0;

        return {
            totalOrders,
            cancelledOrders,
            wasteReductionPercentage,
            savedMeals: cancelledOrders * 1.5 // Average 1.5 meals per cancelled order
        };
    }

    generateOrderReport() {
        const stats = this.getOrderStats();
        const peakHours = this.getPeakHours();
        const wasteStats = this.getWasteReductionStats();

        return {
            summary: stats,
            peakHours: peakHours.slice(0, 5), // Top 5 peak hours
            wasteReduction: wasteStats,
            generatedAt: new Date().toISOString()
        };
    }

    updateOrderStatus(orderId, newStatus) {
        const order = this.getOrderById(orderId);
        if (!order) return false;

        // Validate status transition
        if (!this.isValidStatusTransition(order.status, newStatus)) {
            this.app.showToast('Invalid status transition', 'error');
            return false;
        }

        order.status = newStatus;
        
        if (newStatus === 'ready') {
            order.readyTime = new Date().toISOString();
        } else if (newStatus === 'collected') {
            order.collectedTime = new Date().toISOString();
            this.processRemainingPayment(order);
        }

        this.app.saveToLocalStorage();
        this.app.updateUI();
        this.app.showToast(`Order #${orderId} updated to ${newStatus}`, 'success');
        
        return true;
    }

    isValidStatusTransition(currentStatus, newStatus) {
        const validTransitions = {
            'preparing': ['ready', 'cancelled'],
            'ready': ['collected'],
            'cancelled': [],
            'collected': []
        };

        return validTransitions[currentStatus]?.includes(newStatus) || false;
    }

    createOrder(orderData) {
        const order = {
            id: Date.now(),
            ...orderData,
            status: 'preparing',
            orderTime: new Date().toISOString()
        };

        this.app.orders.push(order);
        this.app.saveToLocalStorage();
        
        return order;
    }

    notifyOrderReady(orderId) {
        const order = this.getOrderById(orderId);
        if (order && order.status === 'ready') {
            // In a real app, this would send a notification
            this.app.showToast(`Order #${orderId} is ready for pickup!`, 'success');
        }
    }

    autoUpdateOrders() {
        // Automatically update order statuses based on time
        const now = new Date();
        
        this.app.orders.forEach(order => {
            if (order.status === 'preparing') {
                const orderTime = new Date(order.orderTime);
                const minutesElapsed = (now - orderTime) / (1000 * 60);
                
                // Mark as ready after 15 minutes
                if (minutesElapsed >= 15) {
                    this.updateOrderStatus(order.id, 'ready');
                    this.notifyOrderReady(order.id);
                }
            }
        });
    }
}
