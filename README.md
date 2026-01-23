# 🛒 Grocery Tracker

A modern, feature-rich React application to track your daily grocery purchases with visual analytics and expiry alerts.

## 🚀 Features

### Core Features
- **Add Groceries** - Track items with detailed information:
  - Item name
  - Category and subcategory
  - Weight/quantity
  - Price in Indian Rupees (₹)
  - Purchase date
  - Expiry date
  - Status (In Stock / Finished)

### Analytics & Dashboard
- **Total Summary Cards**
  - Total items in stock
  - Total amount spent
  
- **Visual Charts**
  - 📊 Pie chart showing spending by category
  - 📊 Pie chart showing spending by subcategory
  - Interactive tooltips and legends
  - Color-coded visualization

### Smart Alerts
- **🚨 Expired Items Alert** (Red Flag)
  - Displays all items that have passed their expiry date
  - Shows when each item expired
  - Remove button to mark items as finished
  
- **⚠️ Close to Expire Alert** (Amber Flag)
  - Shows items expiring within the next 7 days
  - Displays days remaining until expiry
  - Remove button to mark items as finished

### Data Management
- **Sorting**
  - Sort groceries by date (Newest First / Oldest First)
  
- **Item Status Tracking**
  - Mark items as "In Stock" (📦) - Active items
  - Mark items as "Finished" (✓) - Consumed/Disposed items
  - Finished items remain in database for historical tracking
  - Finished items don't appear in alerts

- **Comprehensive Dashboard Table**
  - View all items with all details
  - Status indicators (In Stock / Finished)
  - Faded appearance for finished items

### UI/UX Features
- **Beautiful Modern Design**
  - Gradient purple-themed header with emoji decorations
  - Animated header icons with bounce effect
  - Responsive grid layout
  - Smooth card animations on hover
  
- **Interactive Elements**
  - Hover effects on cards and buttons
  - Slide-in animations for alerts
  - Color-coded badges and indicators
  - Form inputs with focus states
  - Delete buttons with visual feedback

## 📋 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation Steps

1. Clone the repository:
```bash
git clone <repository-url>
cd grocery-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## 📦 Available Scripts

### `npm start`
Runs the app in development mode. The page reloads automatically when you make changes.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production in the `build` folder. The build is minized and ready for deployment.

### `npm run eject`
**Note:** This is a one-way operation. Once you eject, you can't go back!

## 🛠️ Technologies Used

- **React 19.2.3** - Frontend framework
- **Recharts** - Data visualization library for pie charts
- **CSS3** - Styling and animations
- **JavaScript (ES6+)** - Core logic

## 📁 Project Structure

```
grocery-tracker/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── GroceryForm.js       # Form to add new groceries
│   │   └── GroceryDashboard.js  # Table display of all items
│   ├── data/
│   │   └── groceryData.js       # Sample initial data
│   ├── App.js                   # Main app component
│   ├── App.css                  # App styling
│   ├── index.js                 # Entry point
│   └── setupTests.js
├── package.json
└── README.md
```

## 🎯 How to Use

1. **Add Items**
   - Fill in the form with item details
   - Click "Add" to add to your grocery list
   - Fields auto-reset after adding an item

2. **View Analytics**
   - See total items and total spent at the top
   - View spending breakdown in pie charts
   - Check category and subcategory wise spending

3. **Check Alerts**
   - Red alert shows expired items
   - Amber alert shows items expiring soon
   - Click "🗑️ Remove" to mark items as finished

4. **Sort Items**
   - Use the sort dropdown to order by date
   - Choose "Newest First" or "Oldest First"

5. **Track Status**
   - Check the Status column in the dashboard
   - "📦 In Stock" = Active item
   - "✓ Finished" = Consumed/Disposed item

## � Screenshots

### Dashboard Overview
Shows the pie charts for spending analysis by category and subcategory, grocery form for adding new items, and sorting controls.

**To add this screenshot:**
1. Take a screenshot of your dashboard with the pie charts and form visible
2. Save it as `dashboard.png` in the `screenshots/` folder
3. The image will then display in GitHub

### Header & Alerts Section
Beautiful header with emoji decorations, summary cards showing total items and total spent, and expired items alert with remove buttons.

**To add this screenshot:**
1. Take a screenshot of the header and alerts section
2. Save it as `header-alerts.png` in the `screenshots/` folder
3. The image will then display in GitHub

Once you add the screenshots to the `screenshots/` folder, they will automatically display in the GitHub repository.

## �💡 Tips

- Items marked as "Finished" don't appear in expiry alerts
- All finished items remain in the database for history
- Expired items have a red background color
- Close-to-expire items have an amber background
- Charts update automatically when you add/remove items

## 📝 Learn More

- [React Documentation](https://react.dev)
- [Recharts Documentation](https://recharts.org)
- [Create React App Documentation](https://create-react-app.dev)

## 📄 License

This project is open source and available under the MIT License.

---

**Happy Grocery Tracking! 🥬🥕🍎**

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
