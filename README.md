# Smart Canteen - Digital Pre-ordering System

A modern web application designed for college canteens to reduce overcrowding, waiting time, and food wastage through smart pre-ordering technology.

## Features

### Core Functionality
- **User Authentication**: Multi-role system (Student, Staff, Admin)
- **Digital Menu**: Categorized food items with real-time availability
- **Smart Ordering**: Add to cart, 50% advance payment, time slot selection
- **Order Tracking**: Real-time status updates (Preparing, Ready, Collected)
- **Cancellation System**: Cancelled orders automatically added to discount deals
- **Admin Dashboard**: Real-time order management and analytics

### Advanced Features
- **Live Crowd Indicator**: Shows current canteen crowd level (Low/Medium/High)
- **Smart Time Suggestions**: Recommends optimal ordering times
- **Loyalty Points System**: Earn points on every order
- **Waste Reduction Tracker**: Analytics on food waste reduction
- **Multi-language Support**: English and Hindi languages
- **Responsive Design**: Works seamlessly on mobile and desktop

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Modern CSS with gradients, animations, and responsive design
- **Storage**: LocalStorage for data persistence
- **Icons**: Font Awesome
- **Payment**: Simulated payment system (no real API)

## Quick Start

1. Clone or download the project files
2. Open `index.html` in a web browser
3. Or run a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   ```

## Demo Credentials

### Student Login
- **Email**: student@college.com
- **Password**: 123456

### Staff Login
- **Email**: staff@college.com
- **Password**: 123456

### Admin Login
- **Email**: admin@college.com
- **Password**: 123456

## Project Structure

```
smart-canteen/
|-- index.html              # Main application page
|-- css/
|   |-- style.css           # Complete styling
|-- js/
|   |-- app.js              # Main application controller
|   |-- auth.js             # Authentication module
|   |-- menu.js             # Menu management
|   |-- orders.js           # Order management
|   |-- admin.js            # Admin panel functionality
|   |-- utils.js            # Utility functions
|-- README.md               # This file
```

## How It Works

### For Students
1. **Login** with student credentials
2. **Browse Menu** - View available food items by category
3. **Add to Cart** - Select items and quantities
4. **Checkout** - Pay 50% advance, select pickup time slot
5. **Track Order** - Monitor order status in real-time
6. **Collect Order** - Show QR code at pickup, pay remaining 50%

### For Admin
1. **Login** with admin credentials
2. **Dashboard** - View real-time order statistics
3. **Manage Orders** - Update order status, handle cancellations
4. **Analytics** - Monitor peak hours, revenue, waste reduction
5. **Menu Management** - Update item availability and pricing

### Cancellation & Waste Reduction
- Orders can be cancelled before preparation starts
- Cancelled food items automatically appear in "Discount Deals" section at 30% off
- Reduces food waste while offering value to other students

## Key Features Explained

### Live Crowd Indicator
- **Green (Low)**: Best time to order, minimal wait
- **Orange (Medium)**: Moderate crowd, short wait expected
- **Red (High)**: Peak hours, longer wait times

### Smart Time Suggestions
- Analyzes historical order data
- Suggests optimal ordering times based on current crowd level
- Helps students avoid peak hours

### Loyalty Points
- Earn 1 point for every Rs. 10 spent
- Points can be redeemed for discounts (future feature)
- Encourages repeat usage

### Waste Reduction
- Tracks cancelled orders and calculates waste reduction percentage
- Provides insights to optimize food preparation
- Contributes to sustainability goals

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Mobile Responsiveness

- Fully responsive design
- Touch-friendly interface
- Optimized for mobile browsers
- Works on all screen sizes

## Security Features

- Client-side data validation
- Secure password handling (demo only)
- Session management
- Role-based access control

## Future Enhancements

- Real payment gateway integration
- Push notifications for order updates
- QR code generation for order pickup
- Advanced analytics with AI predictions
- Multi-canteen support
- Chatbot for customer support

## Contributing

This is a demo project for hackathon purposes. Feel free to extend and modify the codebase.

## License

MIT License - Feel free to use this project for educational and commercial purposes.

## Team

**Team Name**: InnovX  
**Tagline**: "Skip the queue, not your meal"

---

### Note
This is a prototype/demo application. Payment processing, email notifications, and some advanced features are simulated for demonstration purposes.
