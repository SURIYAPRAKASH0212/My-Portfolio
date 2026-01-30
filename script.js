document.addEventListener('DOMContentLoaded', () => {
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

    const sections = document.querySelectorAll('.section, .hero-content, .hero-image-container');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });

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
                status.style.color = "#4CAF50"; 
                form.reset();
            } else {
                response.json().then(data => {
                    if (Object.hasOwn(data, 'errors')) {
                        status.innerHTML = data["errors"].map(error => error["message"]).join(", ")
                    } else {
                        status.innerHTML = "Oops! There was a problem submitting your form."
                    }
                    status.style.color = "#FF0000"; 
                })
            }
        }).catch(error => {
            status.innerHTML = "Oops! There was a problem submitting your form."
            status.style.color = "#FF0000";
        });
    }

    if (form) {
        form.addEventListener("submit", handleSubmit);
    }


    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenu.classList.toggle('is-active');
        });
    }

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenu.classList.remove('is-active');
            }
        });
    });
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


    const themeToggle = document.getElementById('theme-toggle');
    const body = document.documentElement;

    const savedTheme = 'light';
    body.setAttribute('data-theme', savedTheme);

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
    const leetcodeDashboard = document.querySelector('.leetcode-dashboard');
    if (leetcodeDashboard) {
        const username = 'SURIYA0212';
        fetch(`https://leetcode-stats-api.herokuapp.com/${username}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    document.getElementById('total-solved').textContent = data.totalSolved;
                    document.getElementById('easy-solved').textContent = data.easySolved;
                    document.getElementById('medium-solved').textContent = data.mediumSolved;
                    document.getElementById('hard-solved').textContent = data.hardSolved;

                    document.getElementById('total-easy').textContent = data.totalEasy;
                    document.getElementById('total-medium').textContent = data.totalMedium;
                    document.getElementById('total-hard').textContent = data.totalHard;


                    const totalQ = data.totalQuestions;
                    const easyDeg = (data.easySolved / totalQ) * 360;
                    const medDeg = (data.mediumSolved / totalQ) * 360;
                    const hardDeg = (data.hardSolved / totalQ) * 360;

                    const circle = document.getElementById('total-progress-circle');
                    circle.style.background = `conic-gradient(
                        #FFA116 0deg ${easyDeg + medDeg + hardDeg}deg,
                        #3E3E3E ${easyDeg + medDeg + hardDeg}deg 360deg
                    )`;

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

        const timestamps = Object.keys(calendar).map(Number).sort((a, b) => a - b);


        let previousDate = null;

        timestamps.forEach(ts => {
            const count = calendar[ts];
            totalSubmissions += count;
            activeDays++;

            const date = new Date(ts * 1000);
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

        const today = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setDate(today.getDate() - 364);

        let currentDate = new Date(oneYearAgo);

        for (let i = 0; i < 371; i++) { 

            const dateKey = currentDate.toISOString().split('T')[0];

            const cell = document.createElement('div');
            cell.className = 'heatmap-cell level-0';

            const startOfDay = currentDate.setHours(0, 0, 0, 0) / 1000;
            const endOfDay = currentDate.setHours(23, 59, 59, 999) / 1000;


            currentDate.setDate(currentDate.getDate() + 1);
        }

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
