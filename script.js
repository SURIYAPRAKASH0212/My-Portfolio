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

    // Add simple CSS for the animation dynamically
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

    // Contact Form Handling (Formspree AJAX)
    const form = document.getElementById("contact-form");
    const status = document.getElementById("form-status");

    async function handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        fetch(event.target.action, {
            method: form.method,
            body: data,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                status.innerHTML = "Thanks for your message! I'll get back to you soon.";
                status.style.color = "#4CAF50"; // Green
                form.reset();
            } else {
                response.json().then(data => {
                    if (Object.hasOwn(data, 'errors')) {
                        status.innerHTML = data["errors"].map(error => error["message"]).join(", ")
                    } else {
                        status.innerHTML = "Oops! There was a problem submitting your form."
                    }
                    status.style.color = "#FF0000"; // Red
                })
            }
        }).catch(error => {
            status.innerHTML = "Oops! There was a problem submitting your form."
            status.style.color = "#FF0000"; // Red
        });
    }

    if (form) {
        form.addEventListener("submit", handleSubmit);
    }


    // Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenu.classList.toggle('is-active');
        });
    }

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenu.classList.remove('is-active');
            }
        });
    });
    // Scroll to Top Button
    const scrollTopBtn = document.getElementById("scrollTopBtn");

    if (scrollTopBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 300) {
                scrollTopBtn.style.display = "flex";
            } else {
                scrollTopBtn.style.display = "none";
            }
        });

        scrollTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }


    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.documentElement;

    // Check localStorage for theme
    // const savedTheme = localStorage.getItem('theme') || 'light';
    const savedTheme = 'light';
    body.setAttribute('data-theme', savedTheme);

    // Sync switch state
    if (themeToggle) {
        if (savedTheme === 'dark') {
            themeToggle.checked = true;
        }

        themeToggle.addEventListener('change', () => {
            if (themeToggle.checked) {
                body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            } else {
                body.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            }
        });
    }
    // LeetCode Stats Fetcher & Dashboard Populator
    const leetcodeDashboard = document.querySelector('.leetcode-dashboard');
    if (leetcodeDashboard) {
        const username = 'SURIYA0212';
        fetch(`https://leetcode-stats-api.herokuapp.com/${username}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // 1. Update Stats Numbers
                    document.getElementById('total-solved').textContent = data.totalSolved;
                    document.getElementById('easy-solved').textContent = data.easySolved;
                    document.getElementById('medium-solved').textContent = data.mediumSolved;
                    document.getElementById('hard-solved').textContent = data.hardSolved;

                    document.getElementById('total-easy').textContent = data.totalEasy;
                    document.getElementById('total-medium').textContent = data.totalMedium;
                    document.getElementById('total-hard').textContent = data.totalHard;

                    // 2. Update Circular Progress
                    // Formula: (solved / total) * 360deg
                    // Keep the colors: Easy (teal), Medium (yellow), Hard (red).
                    // Since it's a single circle, we usually match the 'Total' or use segmenting.
                    // The reference image shows a simple yellow/gold arc for "Solved".
                    // Let's create a segmented gradient for accuracy: Easy -> Medium -> Hard.

                    const totalQ = data.totalQuestions;
                    const easyDeg = (data.easySolved / totalQ) * 360;
                    const medDeg = (data.mediumSolved / totalQ) * 360;
                    const hardDeg = (data.hardSolved / totalQ) * 360;

                    const circle = document.getElementById('total-progress-circle');
                    // We stack them: Easy starts at 0, Medium starts after Easy, Hard starts after Medium.
                    circle.style.background = `conic-gradient(
                        #FFA116 0deg ${easyDeg + medDeg + hardDeg}deg,
                        #3E3E3E ${easyDeg + medDeg + hardDeg}deg 360deg
                    )`;

                    // 3. Update Activity Heatmap
                    // submissionCalendar is a map: { "timestamp": count }
                    const calendar = data.submissionCalendar;
                    const stats = processHeatmapData(calendar);

                    document.getElementById('total-submissions').textContent = stats.totalSubmissions;
                    document.getElementById('active-days').textContent = stats.activeDays;
                    document.getElementById('max-streak').textContent = stats.maxStreak;

                    renderHeatmap(calendar);

                } else {
                    console.error('Failed to fetch LeetCode stats');
                }
            })
            .catch(error => console.error('Error fetching LeetCode stats:', error));
    }

    function processHeatmapData(calendar) {
        let totalSubmissions = 0;
        let activeDays = 0;
        let maxStreak = 0;
        let currentStreak = 0;

        // Convert keys to numbers and sort
        const timestamps = Object.keys(calendar).map(Number).sort((a, b) => a - b);

        // Simple iteration for stats
        // Note: Logic for exact max streak requires checking day continuity which involves date parsing.
        // For simplicity in this static pass, we sum up.

        let previousDate = null;

        timestamps.forEach(ts => {
            const count = calendar[ts];
            totalSubmissions += count;
            activeDays++;

            // Basic streak calculation
            const date = new Date(ts * 1000);
            // Reset hours to compare dates only
            date.setHours(0, 0, 0, 0);

            if (previousDate) {
                const diffTime = Math.abs(date - previousDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays === 1) {
                    currentStreak++;
                } else {
                    currentStreak = 1;
                }
            } else {
                currentStreak = 1;
            }
            if (currentStreak > maxStreak) maxStreak = currentStreak;
            previousDate = date;
        });

        return { totalSubmissions, activeDays, maxStreak };
    }

    function renderHeatmap(calendar) {
        const heatmapGrid = document.getElementById('heatmap-grid');
        heatmapGrid.innerHTML = '';

        // Generate last 365 days (approx 52 weeks * 7 days = 364)
        const today = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setDate(today.getDate() - 364);

        // Loop through each day from oneYearAgo to today
        let currentDate = new Date(oneYearAgo);

        for (let i = 0; i < 371; i++) { // 53 weeks * 7 = 371 cells to fill grid safely
            // Normalize timestamp string for lookup
            // API uses unix timestamp in seconds for the KEY.
            // We need to match the date.
            // Since API keys are specific timestamps, we check if any key falls in this day.
            // This is tricky because the API key is a specific second. 
            // Ideally we convert both to YYYY-MM-DD strings to match.

            const dateKey = currentDate.toISOString().split('T')[0];

            // Check if we have submissions for this date
            // This requires efficient lookup. Since specific seconds differ, we can't direct lookup.
            // Better approach: Pre-process calendar into a Map of "YYYY-MM-DD" -> count.

            // Let's do a simplified visual fill for now to match the "Pattern".
            // Real logic requires mapping the exact API keys to dates.

            // Create cell
            const cell = document.createElement('div');
            cell.className = 'heatmap-cell level-0'; // Default empty

            // Optimization: Find if this date exists in calendar
            // Convert current date to start/end timestamp
            const startOfDay = currentDate.setHours(0, 0, 0, 0) / 1000;
            const endOfDay = currentDate.setHours(23, 59, 59, 999) / 1000;

            // Find any key in calendar between start and end
            // This is O(N*M) heavy, but N is small (submissions).
            // Better: Iterate generated map.

            // For implementation speed:
            // We will match simplified keys.

            // ... Actually, let's just lookup by iterating the keys once into a Set/Map.

            currentDate.setDate(currentDate.getDate() + 1);
        }

        // RE-IMPLEMENTATION with Map for efficiency
        const dateMap = new Map();
        Object.keys(calendar).forEach(ts => {
            const date = new Date(ts * 1000);
            const key = date.toISOString().split('T')[0];
            dateMap.set(key, (dateMap.get(key) || 0) + calendar[ts]);
        });

        currentDate = new Date(oneYearAgo);

        for (let i = 0; i < 371; i++) {
            const key = currentDate.toISOString().split('T')[0];
            const count = dateMap.get(key) || 0;

            const cell = document.createElement('div');
            cell.className = 'heatmap-cell';

            if (count === 0) cell.classList.add('level-0');
            else if (count <= 2) cell.classList.add('level-1');
            else if (count <= 5) cell.classList.add('level-2');
            else if (count <= 10) cell.classList.add('level-3');
            else cell.classList.add('level-4');

            cell.title = `${count} submissions on ${key}`;
            heatmapGrid.appendChild(cell);

            currentDate.setDate(currentDate.getDate() + 1);
        }
    }
});
