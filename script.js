document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Fade-in animation on scroll using Intersection Observer
    const sections = document.querySelectorAll('.section, .hero-content, .hero-image-container');

    const maxMobileWidth = 768;

    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.classList.add('fade-in'); // Add initial class
        observer.observe(section);
    });

    // Add simple CSS for the animation dynamically or assume in CSS (Added to JS to keep logic self-contained if needed, but better in CSS)
    // We will append a style block for the animation classes to ensure they work without modifying CSS again right now.
    const style = document.createElement('style');
    style.innerHTML = `
        .fade-in {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        .fade-in.visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
});
