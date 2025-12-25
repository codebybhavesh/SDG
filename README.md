# Shree Durvankur Greens - Plant Nursery Website

A modern, responsive website for Shree Durvankur Greens - a premium nursery and garden center. This single-page application showcases plants, services, and provides an interactive browsing experience for customers.

## 🌿 Features

- **Responsive Design**: Fully responsive layout that works seamlessly on desktop, tablet, and mobile devices
- **Interactive Plant Catalog**: Browse through a curated collection of indoor, outdoor, flowering, and medicinal plants
- **Category Filtering**: Filter plants by category (All, Indoor, Outdoor, Flowering, Medicinal)
- **Smooth Navigation**: Smooth scrolling navigation with active section highlighting
- **Hero Video Section**: Eye-catching hero section with background video
- **Service Showcase**: Display of nursery services including garden setup, landscaping, and bulk supply
- **Contact Form**: Functional contact form for customer inquiries
- **Particle Animations**: Beautiful animated particle effects in the plants section
- **Mobile Menu**: Hamburger menu for mobile navigation
- **Back to Top Button**: Convenient scroll-to-top functionality
- **Modern UI/UX**: Clean, modern design with smooth animations and transitions

## 🛠️ Technologies Used

- **HTML5**: Semantic markup structure
- **CSS3**: Modern styling with CSS variables, animations, and responsive design
- **JavaScript (Vanilla)**: Interactive functionality without frameworks
- **Font Awesome**: Icon library for UI elements
- **Google Fonts**: Poppins font family
- **Google Maps**: Embedded map for location display

## 📁 Project Structure

```
plant-nursery/
├── index.html          # Main HTML file
├── css/
│   └── style.css      # Main stylesheet
├── js/
│   └── main.js        # JavaScript functionality
├── images/
│   ├── logo/          # Logo files
│   ├── plants/        # Plant product images
│   └── gallery/       # Gallery images
├── nursery_video.mp4  # Hero section background video
├── package.json       # Node.js dependencies
└── README.md          # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (optional, for development)

### Installation

1. **Clone or download the repository**
   ```bash
   git clone <repository-url>
   cd plant-nursery
   ```

2. **Open the project**
   - Simply open `index.html` in your web browser, or
   - Use a local development server for better experience:
 
   
   # Using Node.js (http-server)
   npx http-server
   


3. Access the website
   - Navigate to `http://localhost:8000` in your browser

## 💻 Usage

### Browsing Plants
- Navigate to the "Plants & Products" section
- Use category buttons to filter plants by type
- Click "Add to Cart" to add plants to your cart (UI demo)

### Contact Form
- Scroll to the "Contact" section
- Fill in your name, email, phone, and message
- Submit the form (currently logs to console)

### Navigation
- Use the navigation menu to jump to different sections
- On mobile, use the hamburger menu icon
- The active section is automatically highlighted as you scroll

## 🎨 Customization

### Adding New Plants
Edit the `plants` array in `js/main.js`:

```javascript
const plants = [
    {
        id: 1,
        name: 'Plant Name',
        category: 'indoor', // or 'outdoor', 'flowering', 'medicinal'
        price: '₹299',
        image: 'images/plants/plant-image.jpg',
        description: 'Plant description here.'
    },
    // Add more plants...
];
```

### Updating Colors
Modify CSS variables in `css/style.css`:

```css
:root {
    --primary-color: #2e7d32;
    --primary-dark: #1b5e20;
    --secondary-color: #5d4037;
    /* Update other colors as needed */
}
```

### Changing Contact Information
Update the contact details in `index.html` within the contact section.

## 🌐 Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔧 Future Enhancements

Potential features for future development:
- Backend integration for plant inventory
- Shopping cart functionality with checkout
- User authentication
- Product search functionality
- Blog section
- Online payment integration
- Order tracking system

## 📞 Contact Information

**Shree Durvankur Greens**
- Address: 123 Green Valley Road, Plantation City, PC 400001
- Phone: +91 98765 43210
- Email: info@shreedurvankurgreens.com

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Development

### Adding New Features
1. Follow the existing code structure
2. Maintain consistent styling with CSS variables
3. Add comments for complex functionality
4. Test on multiple browsers and devices

### Code Style
- Use semantic HTML5 elements
- Follow CSS BEM naming convention where applicable
- Use ES6+ JavaScript features
- Keep functions modular and reusable

## 🙏 Acknowledgments

- Font Awesome for icons
- Google Fonts for typography
- All plant images used in this project

---

**Built with ❤️ for Shree Durvankur Greens**

# -website
