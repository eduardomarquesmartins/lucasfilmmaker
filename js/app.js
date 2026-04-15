import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const firebaseConfig = {
  projectId: "comentarios-lucasfilmmaker",
  appId: "1:216848198050:web:f967b2e37b2aec4c94aafb",
  storageBucket: "comentarios-lucasfilmmaker.firebasestorage.app",
  apiKey: "AIzaSyA0gNr6mFKvHOmBq5OMss87SRymn4fLRho",
  authDomain: "comentarios-lucasfilmmaker.firebaseapp.com",
  messagingSenderId: "216848198050"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize GSAP
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {

    // --- Preloader Logic ---
    const preloader = document.getElementById('preloader');
    const heroVideo = document.getElementById('hero-video');

    const hidePreloader = () => {
        if (!preloader.classList.contains('preloader-hidden')) {
            preloader.classList.add('preloader-hidden');

            gsap.to(preloader, {
                opacity: 0,
                scale: 1.1,
                duration: 1.2,
                ease: 'power3.inOut',
                onComplete: () => {
                    preloader.style.display = 'none';
                    document.body.classList.remove('no-scroll');
                    
                    // Trigger entrance animations for hero content
                    gsap.from('.hero-title', {
                        y: 50,
                        opacity: 0,
                        duration: 1.5,
                        ease: 'power4.out',
                        delay: 0.2
                    });
                }
            });
        }
    };

    if (heroVideo) {
        // If video is already loaded
        if (heroVideo.readyState >= 3) {
            setTimeout(hidePreloader, 500);
        } else {
            heroVideo.addEventListener('canplaythrough', () => {
                setTimeout(hidePreloader, 500);
            });
        }
    }

    // Fallback: hide preloader after 5 seconds anyway
    setTimeout(hidePreloader, 5000);

    // --- Navbar Scroll Effect ---
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links li');

    // Toggle Mobile Menu
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
        hamburger.classList.toggle('toggle');
        // Prevent scrolling when menu is open
        document.body.classList.toggle('no-scroll');
    });

    // Close menu when link is clicked
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('nav-active');
            hamburger.classList.remove('toggle');
            document.body.classList.remove('no-scroll');
        });
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });

    // --- Hero Animation ---
    const heroTl = gsap.timeline();

    heroTl.to('.hero-content', {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: 'power3.out',
        delay: 0.5
    });

    // --- Generic Reveal Animation ---
    gsap.utils.toArray('.reveal-text').forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: "top 95%", // Trigger earlier
                toggleActions: "play none none none" // Stay visible after play
            },
            y: 20, // Reduced offset for speed
            opacity: 0,
            duration: 0.8, // Faster duration
            ease: "power3.out"
        });
    });

    gsap.utils.toArray('.reveal-image').forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: "top 90%", // Trigger earlier
                toggleActions: "play none none none" // Stay visible after play
            },
            y: 20,
            opacity: 0,
            duration: 1,
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
    const autoPlayInterval = setInterval(() => {
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

    // --- Comments Logic ---
    const commentForm = document.getElementById('commentForm');
    const commentsList = document.getElementById('commentsList');

    if (commentForm && commentsList) {
        const commentsRef = collection(db, 'comments');
        const q = query(commentsRef, orderBy('createdAt', 'desc'));

        // Realtime listener
        onSnapshot(q, (snapshot) => {
            const comments = [];
            snapshot.forEach((doc) => {
                comments.push({ id: doc.id, ...doc.data() });
            });

            commentsList.innerHTML = '';
            if (comments.length === 0) {
                commentsList.innerHTML = '<p style="text-align:center; color:var(--text-muted); font-size:0.9rem;">Seja o primeiro a deixar uma mensagem!</p>';
            } else {
                comments.forEach(comment => {
                    const commentEl = document.createElement('div');
                    commentEl.className = 'comment-item';
                    commentEl.innerHTML = `
                        <h4 class="comment-author">${comment.name}</h4>
                        <span class="comment-date">${comment.date}</span>
                        <p class="comment-body">${comment.text}</p>
                    `;
                    // comments are ordered desc by createdAt
                    commentsList.appendChild(commentEl);
                });
            }
            
            // Refresh scroll triggers since elements changed height
            setTimeout(() => { ScrollTrigger.refresh(); }, 100);
        });

        // Submit comment
        commentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('commentName').value;
            const text = document.getElementById('commentText').value;
            
            if (!name || !text) return;
            
            const btn = commentForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Enviando...';
            btn.disabled = true;
            
            try {
                await addDoc(commentsRef, {
                    name: name,
                    text: text,
                    date: new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' }),
                    createdAt: Date.now()
                });
                
                document.getElementById('commentName').value = '';
                document.getElementById('commentText').value = '';
            } catch (error) {
                console.error("Error adding document: ", error);
                alert("Erro ao salvar mensagem no banco de dados.");
            } finally {
                btn.innerText = originalText;
                btn.disabled = false;
            }
        });
    }

    // --- Video Player Modal Logic ---
    const videoModal = document.getElementById('video-modal');
    const modalVideo = document.getElementById('modal-video');
    const modalClose = document.querySelector('.modal-close');
    const modalOverlay = document.querySelector('.modal-overlay');
    const portfolioVideoItems = document.querySelectorAll('.portfolio-item video');

    portfolioVideoItems.forEach(video => {
        const portfolioItem = video.closest('.portfolio-item');

        portfolioItem.addEventListener('click', () => {
            const videoSrc = video.querySelector('source').src;
            modalVideo.src = videoSrc;
            videoModal.style.display = 'flex';
            setTimeout(() => {
                videoModal.classList.add('active');
            }, 10);
            modalVideo.play();
            document.body.style.overflow = 'hidden'; // Prevent scroll
        });
    });

    const closeVideoModal = () => {
        videoModal.classList.remove('active');
        setTimeout(() => {
            videoModal.style.display = 'none';
            modalVideo.pause();
            modalVideo.src = "";
        }, 500);
        document.body.style.overflow = 'auto';
    };

    if (modalClose) modalClose.addEventListener('click', closeVideoModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeVideoModal);

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal.classList.contains('active')) {
            closeVideoModal();
        }
    });

    console.log("Site initialized with all features");
});
