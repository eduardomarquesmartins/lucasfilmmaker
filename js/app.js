// Initialize GSAP
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {

    // --- Preloader Logic ---
    const preloader = document.getElementById('preloader');
    document.body.classList.add('preloader-active');

    const startHeroAnimations = () => {
        const heroVideo = document.querySelector('.hero-bg-video');
        if (heroVideo) heroVideo.play();

        const heroTl = gsap.timeline();
        heroTl.to('.hero-content', {
            opacity: 1,
            y: 0,
            duration: 1.5,
            ease: 'power3.out',
            delay: 0.2
        });
    };

    setTimeout(() => {
        if (preloader) {
            preloader.classList.add('fade-out');
            document.body.classList.remove('preloader-active');

            // Start hero animations after preloader fades
            setTimeout(startHeroAnimations, 600);
        }
    }, 3000);

    // --- Navbar Scroll Effect ---
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.height = '70px';
        } else {
            navbar.style.height = '80px';
        }
    });

    // --- Hamburger Menu ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Close menu when a link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // --- Generic Reveal Animation ---
    gsap.utils.toArray('.reveal-text').forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    gsap.utils.toArray('.reveal-image').forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            y: 30,
            opacity: 0,
            duration: 1.2,
            ease: "power2.out"
        });
    });

    // --- Portfolio Filtering ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    gsap.to(item, {
                        scale: 1,
                        opacity: 1,
                        duration: 0.5,
                        display: 'block',
                        ease: 'power2.out'
                    });
                } else {
                    gsap.to(item, {
                        scale: 0.8,
                        opacity: 0,
                        duration: 0.5,
                        display: 'none',
                        ease: 'power2.out'
                    });
                }
            });

            // Refresh ScrollTrigger after animation to fix layout
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 550);
        });
    });
    // --- Mobile Portfolio Overlay Visibility ---
    ScrollTrigger.matchMedia({
        "(max-width: 768px)": function () {
            gsap.utils.toArray('.portfolio-item').forEach(item => {
                ScrollTrigger.create({
                    trigger: item,
                    start: "top 75%",
                    end: "bottom 25%",
                    toggleClass: "mobile-visible",
                });
            });
        }
    });

    // --- Testimonials Slider ---
    const slides = document.querySelectorAll('.testimonial-slide');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    let currentSlide = 0;

    function showSlide(index) {
        // Remove active class from all
        slides.forEach(slide => slide.classList.remove('active'));

        // Handle index bounds
        if (index >= slides.length) currentSlide = 0;
        else if (index < 0) currentSlide = slides.length - 1;
        else currentSlide = index;

        // Add active class to current
        slides[currentSlide].classList.add('active');
    }

    nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
    prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));

    // Auto play reviews
    setInterval(() => {
        showSlide(currentSlide + 1);
    }, 5000);

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80, // Adjust for navbar height
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- WhatsApp Contact Form ---
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        // Date Input Masking
        const dateInput = document.getElementById('date');
        if (dateInput) {
            dateInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, ''); // Remove non-digits

                if (value.length > 8) value = value.slice(0, 8);

                if (value.length >= 5) {
                    value = value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4);
                } else if (value.length >= 3) {
                    value = value.slice(0, 2) + '/' + value.slice(2);
                }

                e.target.value = value;
            });
        }

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const date = document.getElementById('date').value;
            const location = document.getElementById('location').value;
            const message = document.getElementById('message').value;

            const phoneNumber = "5551989118543";

            const whatsappMessage = `*Novo Contato do Site*\n\n` +
                `*Nome:* ${name}\n` +
                `*Data:* ${date}\n` +
                `*Local:* ${location}\n\n` +
                `*Mensagem:*\n${message}`;

            const encodedMessage = encodeURIComponent(whatsappMessage);
            const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

            window.open(url, '_blank');
        });
    }

    console.log("Site initialized with all features");
});
