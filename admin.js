// Admin Panel Module
class AdminManager {
    constructor(app) {
        this.app = app;
        this.init();
    }

    init() {
        this.setupAdminListeners();
        this.initializeCharts();
    }

    setupAdminListeners() {
        // Admin-specific event listeners
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('update-status-btn')) {
                const orderId = parseInt(e.target.dataset.orderId);
                const newStatus = e.target.dataset.status;
                this.updateOrderStatus(orderId, newStatus);
            }
            
            if (e.target.classList.contains('toggle-availability')) {
                const itemId = parseInt(e.target.dataset.itemId);
                this.toggleItemAvailability(itemId);
            }
        });
    }

    initializeCharts() {
        // Initialize peak hours chart
        this.renderPeakHoursChart();
    }

    renderPeakHoursChart() {
        const canvas = document.getElementById('peakHoursChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const peakHours = this.app.orderManager.getPeakHours();
        
        // Simple bar chart implementation
        this.drawBarChart(ctx, peakHours);
    }

    drawBarChart(ctx, data) {
        const canvas = ctx.canvas;
        const width = canvas.width = 400;
        const height = canvas.height = 300;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        if (data.length === 0) {
            ctx.fillStyle = '#666';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('No data available', width / 2, height / 2);
            return;
        }
        
        // Chart dimensions
        const padding = 40;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;
        const barWidth = chartWidth / Math.min(data.length, 8);
        const maxCount = Math.max(...data.map(d => d.count));
        
        // Draw axes
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();
        
        // Draw bars
        data.slice(0, 8).forEach((item, index) => {
            const barHeight = (item.count / maxCount) * chartHeight;
            const x = padding + index * barWidth;
            const y = height - padding - barHeight;
            
            // Bar
            ctx.fillStyle = '#ff6b35';
            ctx.fillRect(x + barWidth * 0.1, y, barWidth * 0.8, barHeight);
            
            // Label
            ctx.fillStyle = '#666';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(item.hour, x + barWidth / 2, height - padding + 20);
            
            // Count
            ctx.fillText(item.count, x + barWidth / 2, y - 5);
        });
        
        // Title
        ctx.fillStyle = '#333';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Orders by Hour', width / 2, 20);
    }

    updateOrderStatus(orderId, newStatus) {
        const success = this.app.orderManager.updateOrderStatus(orderId, newStatus);
        if (success) {
            this.renderAdminPanel();
        }
    }

    toggleItemAvailability(itemId) {
        const item = this.app.menuItems.find(i => i.id === itemId);
        if (item) {
            item.available = !item.available;
            this.app.saveToLocalStorage();
            this.app.showToast(`${item.name} is now ${item.available ? 'available' : 'unavailable'}`, 'success');
        }
    }

    renderAdminPanel() {
        this.renderAdminStats();
        this.renderAdminOrders();
        this.renderInventoryManagement();
        this.renderAnalytics();
    }

    renderAdminStats() {
        const stats = this.app.orderManager.getOrderStats();
        const wasteStats = this.app.orderManager.getWasteReductionStats();
        
        document.getElementById('totalOrders').textContent = stats.total;
        document.getElementById('totalRevenue').textContent = `Rs. ${stats.totalRevenue}`;
        document.getElementById('wasteReduction').textContent = `${wasteStats.wasteReductionPercentage}%`;
    }

    renderAdminOrders() {
        const adminOrdersTable = document.getElementById('adminOrdersTable');
        const recentOrders = this.app.orderManager.getRecentOrders(10);
        
        if (recentOrders.length === 0) {
            adminOrdersTable.innerHTML = '<div class="text-center">No orders found</div>';
            return;
        }
        
        adminOrdersTable.innerHTML = `
            <table class="table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Time</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${recentOrders.map(order => `
                        <tr>
                            <td>#${order.id}</td>
                            <td>${order.userId}</td>
                            <td>${order.items.length} items</td>
                            <td>Rs. ${order.total}</td>
                            <td>
                                <span class="order-status status-${order.status}">
                                    ${order.status.toUpperCase()}
                                </span>
                            </td>
                            <td>${new Date(order.orderTime).toLocaleTimeString()}</td>
                            <td>
                                ${this.getOrderActionButtons(order)}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    getOrderActionButtons(order) {
        let buttons = '';
        
        if (order.status === 'preparing') {
            buttons += `
                <button class="btn btn-sm btn-primary update-status-btn" 
                        data-order-id="${order.id}" data-status="ready">
                    Mark Ready
                </button>
                <button class="btn btn-sm btn-outline update-status-btn" 
                        data-order-id="${order.id}" data-status="cancelled">
                    Cancel
                </button>
            `;
        } else if (order.status === 'ready') {
            buttons += `
                <button class="btn btn-sm btn-success update-status-btn" 
                        data-order-id="${order.id}" data-status="collected">
                    Mark Collected
                </button>
            `;
        }
        
        return buttons;
    }

    renderInventoryManagement() {
        // This would render inventory management interface
        // For now, we'll keep it simple
    }

    renderAnalytics() {
        this.renderPeakHoursChart();
        this.renderWasteReductionChart();
        this.renderRevenueChart();
    }

    renderWasteReductionChart() {
        const wasteStats = this.app.orderManager.getWasteReductionStats();
        
        // Create a simple pie chart for waste reduction
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        
        const total = wasteStats.totalOrders;
        const cancelled = wasteStats.cancelledOrders;
        const collected = total - cancelled;
        
        // Simple pie chart
        const centerX = 150;
        const centerY = 100;
        const radius = 80;
        
        // Collected slice
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, (collected / total) * Math.PI * 2);
        ctx.fillStyle = '#4caf50';
        ctx.fill();
        
        // Cancelled slice
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, (collected / total) * Math.PI * 2, Math.PI * 2);
        ctx.fillStyle = '#ff6b35';
        ctx.fill();
        
        // Add to analytics section if it exists
        const analyticsSection = document.querySelector('.admin-analytics');
        if (analyticsSection) {
            const existingChart = analyticsSection.querySelector('#wasteChart');
            if (existingChart) {
                existingChart.replaceWith(canvas);
            } else {
                canvas.id = 'wasteChart';
                analyticsSection.appendChild(canvas);
            }
        }
    }

    renderRevenueChart() {
        // Simple revenue trend chart
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        
        // Get last 7 days of revenue
        const revenueData = this.getRevenueByDay();
        
        this.drawLineChart(ctx, revenueData);
        
        // Add to analytics section if it exists
        const analyticsSection = document.querySelector('.admin-analytics');
        if (analyticsSection) {
            const existingChart = analyticsSection.querySelector('#revenueChart');
            if (existingChart) {
                existingChart.replaceWith(canvas);
            } else {
                canvas.id = 'revenueChart';
                analyticsSection.appendChild(canvas);
            }
        }
    }

    getRevenueByDay() {
        const revenueByDay = {};
        const today = new Date();
        
        // Initialize last 7 days
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateKey = date.toISOString().split('T')[0];
            revenueByDay[dateKey] = 0;
        }
        
        // Calculate revenue for each day
        this.app.orders.forEach(order => {
            const orderDate = order.orderTime.split('T')[0];
            if (revenueByDay.hasOwnProperty(orderDate)) {
                revenueByDay[orderDate] += order.total;
            }
        });
        
        return Object.entries(revenueByDay).map(([date, revenue]) => ({
            date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            revenue: revenue
        }));
    }

    drawLineChart(ctx, data) {
        const canvas = ctx.canvas;
        const width = canvas.width;
        const height = canvas.height;
        const padding = 40;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        if (data.length === 0) return;
        
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;
        const maxRevenue = Math.max(...data.map(d => d.revenue));
        const stepX = chartWidth / (data.length - 1);
        
        // Draw axes
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();
        
        // Draw line
        ctx.strokeStyle = '#ff6b35';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        data.forEach((point, index) => {
            const x = padding + index * stepX;
            const y = height - padding - (point.revenue / maxRevenue) * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Draw points
        data.forEach((point, index) => {
            const x = padding + index * stepX;
            const y = height - padding - (point.revenue / maxRevenue) * chartHeight;
            
            ctx.fillStyle = '#ff6b35';
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
            
            // Labels
            ctx.fillStyle = '#666';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(point.date, x, height - padding + 20);
        });
        
        // Title
        ctx.fillStyle = '#333';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Revenue Trend (Last 7 Days)', width / 2, 20);
    }

    exportData() {
        const report = this.app.orderManager.generateOrderReport();
        
        // Create downloadable JSON file
        const dataStr = JSON.stringify(report, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `smart-canteen-report-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        this.app.showToast('Report exported successfully', 'success');
    }

    generateDailyReport() {
        const today = new Date().toISOString().split('T')[0];
        const todayOrders = this.app.orders.filter(order => 
            order.orderTime.split('T')[0] === today
        );
        
        const report = {
            date: today,
            summary: {
                totalOrders: todayOrders.length,
                totalRevenue: todayOrders.reduce((sum, order) => sum + order.total, 0),
                advanceRevenue: todayOrders.reduce((sum, order) => sum + order.advance, 0),
                cancelledOrders: todayOrders.filter(order => order.status === 'cancelled').length,
                collectedOrders: todayOrders.filter(order => order.status === 'collected').length
            },
            orders: todayOrders,
            peakHours: this.getTodayPeakHours(todayOrders),
            generatedAt: new Date().toISOString()
        };
        
        return report;
    }

    getTodayPeakHours(orders) {
        const hourCounts = {};
        
        orders.forEach(order => {
            const hour = new Date(order.orderTime).getHours();
            hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        });
        
        return Object.entries(hourCounts)
            .map(([hour, count]) => ({ hour: parseInt(hour), count }))
            .sort((a, b) => b.count - a.count);
    }

    sendNotifications() {
        // Send notifications for ready orders
        const readyOrders = this.app.orderManager.getOrdersByStatus('ready');
        
        readyOrders.forEach(order => {
            // In a real app, this would send push notifications
            console.log(`Notification sent for order #${order.id}`);
        });
    }

    updateMenuAvailability() {
        // Update menu item availability based on time and stock
        const currentHour = new Date().getHours();
        
        this.app.menuItems.forEach(item => {
            // Example logic: some items only available during certain hours
            if (item.name === 'Tea' && (currentHour < 8 || currentHour > 22)) {
                item.available = false;
            } else if (item.name === 'Tea') {
                item.available = true;
            }
        });
        
        this.app.saveToLocalStorage();
    }

    startAdminTasks() {
        // Run admin tasks periodically
        setInterval(() => {
            this.updateMenuAvailability();
            this.sendNotifications();
        }, 60000); // Every minute
    }
}
