// DOM Elements
const header = document.getElementById('header');
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-link');
const backToTopBtn = document.getElementById('backToTop');
const currentYear = document.getElementById('currentYear');
const contactForm = document.getElementById('contactForm');
const plantContainer = document.getElementById('plantContainer');
const categoryBtns = document.querySelectorAll('.category-btn');
const sections = document.querySelectorAll('section');

// Sample plant data (in a real app, this would come from a backend API)
const plants = [
    {
        id: 1,
        name: 'Peace Lily',
        category: 'indoor',
        price: '₹299',
        image: 'images/plants/peace-lily.jpeg',
        description: 'Beautiful air-purifying plant with glossy leaves and white flowers.'
    },
    {
        id: 2,
        name: 'Snake Plant',
        category: 'indoor',
        price: '₹249',
        image: 'images/plants/snake-plant.jpg',
        description: 'Low-maintenance plant that thrives in low light conditions.'
    },
    {
        id: 3,
        name: 'Rose Plant',
        category: 'outdoor',
        price: '₹199',
        image: 'images/plants/rose-plant.jpg',
        description: 'Classic flowering plant with beautiful fragrant blooms.'
    },
    {
        id: 4,
        name: 'Tulsi (Holy Basil)',
        category: 'medicinal',
        price: '₹149',
        image: 'images/plants/tulsi.webp',
        description: 'Sacred plant with medicinal properties and aromatic leaves.'
    },
    {
        id: 5,
        name: 'Money Plant',
        category: 'indoor',
        price: '₹179',
        image: 'images/plants/money-plant.jpg',
        description: 'Easy-to-grow vine that brings good luck and prosperity.'
    },
    {
        id: 6,
        name: 'Jasmine',
        category: 'outdoor',
        price: '₹349',
        image: 'images/plants/jasmine.jpg',
        description: 'Fragrant flowering plant perfect for gardens and balconies.'
    },
    {
        id: 7,
        name: 'Aloe Vera',
        category: 'medicinal',
        price: '₹199',
        image: 'images/plants/aloe-vera.jpeg',
        description: 'Succulent with medicinal gel inside its leaves.'
    },
    {
        id: 8,
        name: 'Orchid',
        category: 'flowering',
        price: '₹599',
        image: 'images/plants/orchid.jpeg',
        description: 'Exotic flowering plant that adds elegance to any space.'
    },
    {
        id: 9,
        name: 'Marigold',
        category: 'flowering',
        price: '₹99',
        image: 'images/plants/marigold.jpeg',
        description: 'Bright and cheerful flowers that bloom throughout the year.'
    }
];

// Sample gallery data
const galleryImages = [
    'images/gallery/gallery-1.jpg',
    'images/gallery/gallery-2.jpg',
    'images/gallery/gallery-3.jpg',
    'images/gallery/gallery-4.jpg',
    'images/gallery/gallery-5.jpg',
    'images/gallery/gallery-6.jpg',
    'images/gallery/gallery-7.jpg',
    'images/gallery/gallery-8.jpg',
    'images/gallery/gallery-9.jpg'
];

// Split Text Animation Function - Inspired by React Bits Split Text
function initSplitText() {
    const heroTitle = document.getElementById('heroTitle');
    if (!heroTitle) return;
    
    const text = heroTitle.textContent.trim();
    
    // Clear the original text
    heroTitle.innerHTML = '';
    
    // Split into words first
    const words = text.split(/(\s+)/); // Split but keep spaces
    
    let charIndex = 0;
    
    words.forEach((word, wordIndex) => {
        if (word.trim() === '') {
            // This is a space - add it directly
            const spaceSpan = document.createElement('span');
            spaceSpan.className = 'char space';
            spaceSpan.textContent = word;
            spaceSpan.style.animationDelay = `${charIndex * 0.03}s`;
            heroTitle.appendChild(spaceSpan);
            charIndex++;
            return;
        }
        
        // Create word wrapper
        const wordSpan = document.createElement('span');
        wordSpan.className = 'word';
        
        // Split word into characters
        for (let i = 0; i < word.length; i++) {
            const charSpan = document.createElement('span');
            charSpan.className = 'char';
            charSpan.textContent = word[i];
            charSpan.style.animationDelay = `${charIndex * 0.03}s`;
            wordSpan.appendChild(charSpan);
            charIndex++;
        }
        
        heroTitle.appendChild(wordSpan);
    });
}

// Run once on page load
document.addEventListener('DOMContentLoaded', () => {
    // Set initial state
    handleScroll();
    setActiveNavItem();
    
    // Initialize split text animation
    initSplitText();
    
    // Add loaded class to body for animations
    document.body.classList.add('loaded');
    
    // Set current year in footer
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // Load plants and gallery if on the home page
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        // Load plants
        if (typeof displayPlants === 'function' && plantContainer) {
            displayPlants(plants);
        }
        
        // Load gallery
        if (typeof loadGallery === 'function') {
            loadGallery();
        }
    }
    
    // Initialize event listeners
    initEventListeners();
    
    // Initialize sliders
    if (typeof initSliders === 'function') {
        initSliders();
    }
});

// Display plants in the grid
function displayPlants(plantsToShow) {
    if (!plantContainer) return;
    
    plantContainer.innerHTML = '';
    
    if (plantsToShow.length === 0) {
        plantContainer.innerHTML = '<p class="no-plants">No plants found in this category.</p>';
        return;
    }
    
    plantsToShow.forEach(plant => {
        const plantCard = document.createElement('div');
        plantCard.className = 'plant-card';
        plantCard.innerHTML = `
            <div class="plant-img">
                <img src="${plant.image}" alt="${plant.name}" onerror="this.src='images/plants/placeholder.jpg'">
            </div>
            <div class="plant-info">
                <span class="plant-category">${plant.category.charAt(0).toUpperCase() + plant.category.slice(1)}</span>
                <h3 class="plant-name">${plant.name}</h3>
                <p class="plant-desc">${plant.description}</p>
                <div class="plant-actions">
                    <span class="plant-price">${plant.price}</span>
                    <button class="add-to-cart" data-id="${plant.id}">Add to Cart</button>
                </div>
            </div>
        `;
        plantContainer.appendChild(plantCard);
    });
    
    // Add event listeners to the new buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Load gallery images
function loadGallery() {
    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) return;
    
    galleryImages.forEach((image, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `
            <img src="${image}" alt="Gallery Image ${index + 1}" onerror="this.src='images/gallery/placeholder.jpg'">
            <div class="gallery-overlay">
                <div class="gallery-icon">
                    <i class="fas fa-search-plus"></i>
                </div>
            </div>
        `;
        galleryGrid.appendChild(galleryItem);
    });
    
    // Initialize lightbox for gallery
    initLightbox();
}

// Initialize lightbox for gallery
function initLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').src;
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <span class="close-lightbox">&times;</span>
                    <img src="${imgSrc}" alt="">
                </div>
            `;
            document.body.appendChild(lightbox);
            
            // Close lightbox when clicking outside the image
            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox || e.target.classList.contains('close-lightbox')) {
                    lightbox.remove();
                }
            });
            
            // Close with Escape key
            document.addEventListener('keydown', function closeOnEscape(e) {
                if (e.key === 'Escape') {
                    lightbox.remove();
                    document.removeEventListener('keydown', closeOnEscape);
                }
            });
        }); // Close click event listener
    }); // Close forEach
} // Close initLightbox function

// Add to cart functionality
function addToCart(e) {
    const plantId = parseInt(e.target.getAttribute('data-id'));
    const plant = plants.find(p => p.id === plantId);
    
    if (plant) {
        // In a real app, you would add this to a cart state or send to a server
        const button = e.target;
        button.textContent = 'Added to Cart';
        button.style.backgroundColor = '#4caf50';
        
        // Show notification
        showNotification(`${plant.name} added to cart!`);
        
        // Reset button after delay
        setTimeout(() => {
            button.textContent = 'Add to Cart';
            button.style.backgroundColor = '';
        }, 2000);
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove notification after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Navbar Scroll Effect
function handleScroll() {
    // Add/remove scrolled class based on scroll position
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Update active nav link based on scroll position
    setActiveNavItem();
}

// Set active navigation item based on scroll position
function setActiveNavItem() {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Close mobile menu
function closeMobileMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
}

// Initialize all event listeners
function initEventListeners() {
    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Toggle body scroll
            if (hamburger.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }
    
    // Close mobile menu when clicking on a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav') && !e.target.closest('.hamburger')) {
            closeMobileMenu();
        }
    });
    
    // Handle scroll events
    window.addEventListener('scroll', handleScroll);
    
    // Back to top button
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', scrollToTop);
    }
    
    // Category filter buttons
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', filterPlants);
    });
    
    // Contact form submission
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = header.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}


// Close mobile menu
function closeMobileMenu() {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
    document.body.style.overflow = '';
}

// Handle scroll events
function handleScroll() {
    // Sticky header
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Show/hide back to top button
    if (backToTopBtn) {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    }
    
    // Animate elements on scroll
    animateOnScroll();
}

// Scroll to top
function scrollToTop(e) {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Filter plants by category
function filterPlants(e) {
    const category = e.target.getAttribute('data-category');
    
    // Update active button
    categoryBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    // Filter plants
    if (category === 'all') {
        displayPlants(plants);
    } else {
        const filteredPlants = plants.filter(plant => plant.category === category);
        displayPlants(filteredPlants);
    }
}

// Handle contact form submission
function handleContactForm(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const formValues = Object.fromEntries(formData.entries());
    
    // Basic validation
    if (!formValues.name || !formValues.email || !formValues.message) {
        showNotification('Please fill in all required fields');
        return;
    }
    
    // In a real app, you would send this data to a server
    console.log('Form submitted:', formValues);
    
    // Show success message
    showNotification('Thank you for your message! We will get back to you soon.');
    
    // Reset form
    contactForm.reset();
}

// Animate elements on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.value-item, .service-card, .feature, .plant-card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Add animation styles to elements
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .value-item,
        .service-card,
        .feature,
        .plant-card {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #4caf50;
            color: white;
            padding: 15px 25px;
            border-radius: 5px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            transform: translateX(120%);
            transition: transform 0.3s ease-in-out;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .lightbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        
        .lightbox.active {
            opacity: 1;
            visibility: visible;
        }
        
        .lightbox-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
        }
        
        .lightbox img {
            max-width: 100%;
            max-height: 80vh;
            border: 5px solid white;
            border-radius: 5px;
        }
        
        .close-lightbox {
            position: absolute;
            top: -40px;
            right: 0;
            color: white;
            font-size: 3rem;
            cursor: pointer;
        }
        
        @media (max-width: 768px) {
            .lightbox img {
                max-width: 95%;
            }
        }
    `;
    document.head.appendChild(style);
}

// Add animation styles when the script loads
addAnimationStyles();

// Initial animation on page load
window.addEventListener('load', () => {
    // Animate hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
    }
    
    // Animate initial elements
    animateOnScroll();
});

// Animate elements when they come into view
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.value-item, .service-card, .feature, .plant-card');
    elements.forEach(element => {
        observer.observe(element);
    });
    
    // Initialize scroll animations for About section cards
    initAboutScrollAnimations();
    
    // Initialize particles for plants section
    initParticles();
});

// About Section Scroll Animations
function initAboutScrollAnimations() {
    const aboutCards = document.querySelectorAll('.about-card');
    if (aboutCards.length === 0) return;
    
    const aboutObserverOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    };
    
    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                aboutObserver.unobserve(entry.target);
            }
        });
    }, aboutObserverOptions);
    
    // Add staggered delay based on card index
    aboutCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.15}s`;
        aboutObserver.observe(card);
    });
}

// Particle System for Plants Section
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const plantsSection = document.getElementById('plants');
    
    if (!plantsSection) return;
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = plantsSection.offsetWidth;
        canvas.height = plantsSection.offsetHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.3;
            this.color = this.getRandomColor();
        }
        
        getRandomColor() {
            const colors = [
                'rgba(46, 125, 50, 0.6)',   // Primary green
                'rgba(129, 199, 132, 0.5)', // Light green
                'rgba(76, 175, 80, 0.5)',   // Medium green
                'rgba(144, 238, 144, 0.4)', // Light green
                'rgba(152, 251, 152, 0.4)'  // Pale green
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Wrap around edges
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Create particles
    const particleCount = 80;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Connection lines between nearby particles
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    ctx.strokeStyle = `rgba(46, 125, 50, ${0.2 * (1 - distance / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw connections
        drawConnections();
        
        requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
}

// Slider Functionality
function initSliders() {
    // Initialize Services Slider (Right to Left)
    initServicesSlider();
    
    // Initialize Features Slider (Left to Right)
    initFeaturesSlider();
}

// Services Slider - Right to Left
function initServicesSlider() {
    const track = document.getElementById('servicesSliderTrack');
    const prevBtn = document.getElementById('servicesPrevBtn');
    const nextBtn = document.getElementById('servicesNextBtn');
    
    if (!track) return;
    
    // Clone items for seamless loop (duplicate the set)
    const items = Array.from(track.querySelectorAll('.service-card'));
    items.forEach(item => {
        const clone = item.cloneNode(true);
        track.appendChild(clone);
    });
    
    let currentIndex = 0;
    const totalItems = items.length;
    let autoplayInterval;
    let isPaused = false;
    
    function getItemWidth() {
        const firstItem = track.querySelector('.service-card');
        if (firstItem) {
            const style = window.getComputedStyle(firstItem);
            const width = firstItem.offsetWidth;
            const marginRight = parseFloat(style.marginRight) || 0;
            return width + marginRight;
        }
        return 300; // fallback
    }
    
    function updateSliderPosition(instant = false) {
        const itemWidth = getItemWidth();
        
        if (instant) {
            track.style.transition = 'none';
        } else {
            track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }
        
        // Right to Left: move negative direction
        const offset = -(currentIndex * itemWidth);
        track.style.transform = `translateX(${offset}px)`;
        
        // Seamless loop: reset when reaching cloned set
        if (currentIndex >= totalItems) {
            setTimeout(() => {
                track.style.transition = 'none';
                currentIndex = currentIndex - totalItems;
                track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
                setTimeout(() => {
                    track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                }, 50);
            }, instant ? 0 : 500);
        }
    }
    
    function nextSlide() {
        currentIndex++;
        updateSliderPosition();
    }
    
    function prevSlide() {
        currentIndex--;
        if (currentIndex < 0) {
            currentIndex = totalItems * 2 - 1;
            updateSliderPosition(true);
        } else {
            updateSliderPosition();
        }
    }
    
    function startAutoplay() {
        if (autoplayInterval) clearInterval(autoplayInterval);
        autoplayInterval = setInterval(() => {
            if (!isPaused) {
                nextSlide();
            }
        }, 2000); // Increased speed - slides every 2 seconds
    }
    
    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
    }
    
    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoplay();
            startAutoplay();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoplay();
            startAutoplay();
        });
    }
    
    // Pause on hover
    const wrapper = track.closest('.services-slider-wrapper');
    if (wrapper) {
        wrapper.addEventListener('mouseenter', () => {
            isPaused = true;
        });
        wrapper.addEventListener('mouseleave', () => {
            isPaused = false;
        });
    }
    
    // Initialize
    updateSliderPosition(true);
    startAutoplay();
    
    // Update on resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateSliderPosition(true);
        }, 250);
    });
}

// Features Slider - Left to Right
function initFeaturesSlider() {
    const track = document.getElementById('featuresSliderTrack');
    const prevBtn = document.getElementById('featuresPrevBtn');
    const nextBtn = document.getElementById('featuresNextBtn');
    
    if (!track) return;
    
    // Clone items for seamless loop (duplicate the set)
    const items = Array.from(track.querySelectorAll('.feature'));
    items.forEach(item => {
        const clone = item.cloneNode(true);
        track.appendChild(clone);
    });
    
    // Start from the end (cloned set) for left-to-right effect
    let currentIndex = items.length;
    const totalItems = items.length;
    let autoplayInterval;
    let isPaused = false;
    
    function getItemWidth() {
        const firstItem = track.querySelector('.feature');
        if (firstItem) {
            const style = window.getComputedStyle(firstItem);
            const width = firstItem.offsetWidth;
            const marginRight = parseFloat(style.marginRight) || 0;
            return width + marginRight;
        }
        return 300; // fallback
    }
    
    function updateSliderPosition(instant = false) {
        const itemWidth = getItemWidth();
        
        if (instant) {
            track.style.transition = 'none';
        } else {
            track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }
        
        // Left to Right: we start from negative (cloned items) and move toward 0
        const offset = -((currentIndex - totalItems) * itemWidth);
        track.style.transform = `translateX(${offset}px)`;
        
        // Seamless loop: reset when reaching original set
        if (currentIndex < totalItems) {
            setTimeout(() => {
                track.style.transition = 'none';
                currentIndex = currentIndex + totalItems;
                const newOffset = -((currentIndex - totalItems) * itemWidth);
                track.style.transform = `translateX(${newOffset}px)`;
                setTimeout(() => {
                    track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                }, 50);
            }, instant ? 0 : 500);
        }
    }
    
    function nextSlide() {
        // For left-to-right, "next" actually decreases index
        currentIndex--;
        updateSliderPosition();
    }
    
    function prevSlide() {
        // For left-to-right, "prev" actually increases index
        currentIndex++;
        if (currentIndex >= totalItems * 2) {
            currentIndex = totalItems * 2 - 1;
            updateSliderPosition(true);
        } else {
            updateSliderPosition();
        }
    }
    
    function startAutoplay() {
        if (autoplayInterval) clearInterval(autoplayInterval);
        autoplayInterval = setInterval(() => {
            if (!isPaused) {
                nextSlide();
            }
        }, 2000); // Increased speed - slides every 2 seconds
    }
    
    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
    }
    
    // Event listeners (swapped for left-to-right effect)
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            prevSlide(); // Swapped
            stopAutoplay();
            startAutoplay();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            nextSlide(); // Swapped
            stopAutoplay();
            startAutoplay();
        });
    }
    
    // Pause on hover
    const wrapper = track.closest('.features-slider-wrapper');
    if (wrapper) {
        wrapper.addEventListener('mouseenter', () => {
            isPaused = true;
        });
        wrapper.addEventListener('mouseleave', () => {
            isPaused = false;
        });
    }
    
    // Initialize - start from cloned set (negative position)
    updateSliderPosition(true);
    startAutoplay();
    
    // Update on resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateSliderPosition(true);
        }, 250);
    });
}

// Testimonials Auto-Slider
function initTestimonialsSlider() {
    const track = document.getElementById('testimonialsSliderTrack');
    if (!track) {
        console.error('Testimonials slider track not found');
        return;
    }
    
    const testimonials = Array.from(track.querySelectorAll('.testimonial-card'));
    if (testimonials.length === 0) {
        console.error('No testimonial cards found');
        return;
    }
    
    // Clone testimonials for seamless loop
    testimonials.forEach(testimonial => {
        const clone = testimonial.cloneNode(true);
        track.appendChild(clone);
    });
    
    let currentIndex = 0;
    const totalTestimonials = testimonials.length;
    let autoplayInterval;
    let isPaused = false;
    let itemsPerView = 1; // Always show 1 item at a time
    
    // Update track width to accommodate all testimonials
    track.style.width = `${totalTestimonials * 100}%`;
    
    // Set width for each testimonial card
    const testimonialCards = track.querySelectorAll('.testimonial-card');
    testimonialCards.forEach(card => {
        card.style.width = `${100 / itemsPerView}%`;
    });
    
    function getItemsPerView() {
        return 1; // Always show 1 item at a time
    }
    
    function updateSliderPosition(instant = false) {
        itemsPerView = getItemsPerView();
        
        if (instant) {
            track.style.transition = 'none';
        } else {
            track.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }
        
        // Calculate offset: each item takes full width
        const itemWidth = 100; // 100% width for each item
        const offset = -(currentIndex * itemWidth);
        track.style.transform = `translateX(${offset}%)`;
        
        // Seamless loop: reset when reaching cloned set
        if (currentIndex >= totalTestimonials) {
            setTimeout(() => {
                track.style.transition = 'none';
                currentIndex = currentIndex - totalTestimonials;
                const resetOffset = -(currentIndex * itemWidth);
                track.style.transform = `translateX(${resetOffset}%)`;
                setTimeout(() => {
                    track.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                }, 50);
            }, instant ? 0 : 600);
        }
    }
    
    function nextSlide() {
        currentIndex++;
        updateSliderPosition();
    }
    
    function startAutoplay() {
        stopAutoplay(); // Clear any existing interval first
        autoplayInterval = setInterval(() => {
            if (!document.hidden && !isPaused) { // Only autoplay if tab is active
                nextSlide();
            }
        }, 1000); // Slides every 1 second
    }
    
    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
    }
    
    // Pause on hover and add navigation buttons
    const container = track.closest('.testimonials-slider-container');
    if (container) {
        // Create navigation buttons
        const prevButton = document.createElement('button');
        prevButton.className = 'testimonial-nav-btn prev';
        prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = totalTestimonials - 1;
            }
            updateSliderPosition();
        });
        
        const nextButton = document.createElement('button');
        nextButton.className = 'testimonial-nav-btn next';
        nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextButton.addEventListener('click', nextSlide);
        
        container.appendChild(prevButton);
        container.appendChild(nextButton);
        
        // Pause on hover
        container.addEventListener('mouseenter', () => {
            isPaused = true;
        });
        container.addEventListener('mouseleave', () => {
            isPaused = false;
        });
        
        // Touch events for mobile swipe
        let touchStartX = 0;
        let touchEndX = 0;
        
        container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);
        
        container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);
        
        function handleSwipe() {
            const swipeThreshold = 50; // Minimum distance for a swipe
            
            if (touchEndX < touchStartX - swipeThreshold) {
                // Swipe left - go to next
                nextSlide();
            } else if (touchEndX > touchStartX + swipeThreshold) {
                // Swipe right - go to previous
                if (currentIndex > 0) {
                    currentIndex--;
                } else {
                    currentIndex = totalTestimonials - 1;
                }
                updateSliderPosition();
            }
        }
    
    // Initialize
    updateSliderPosition(true);
    startAutoplay();
    
    // Update on resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateSliderPosition(true);
        }, 250);
    });
}

// Initialize sliders when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initSliders();
    initTestimonialsSlider();
});
}
