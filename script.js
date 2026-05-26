/**
 * Varun PK Portfolio JavaScript
 * Includes: Interactive Particle Canvas, Chart.js Visualizations, Scroll Animations, Nav Toggles
 */

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initCharts();
    initScrollAnimations();
    initMobileNav();
    initContactForm();
});

/* ==========================================================================
   INTERACTIVE CANVAS PARTICLE NETWORK (QA Connection Theme)
   ========================================================================== */
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let particlesArray = [];
    const numberOfParticles = 70;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    
    // Mouse interactivity
    let mouse = {
        x: null,
        y: null,
        radius: 120
    };
    
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });
    
    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        particlesArray = [];
        createParticles();
    });

    // Particle Blueprints
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            // Velocity
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.size = Math.random() * 2 + 1.5;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 242, 254, 0.45)';
            ctx.fill();
        }
        
        update() {
            // Boundary checks
            if (this.x < 0 || this.x > width) this.vx = -this.vx;
            if (this.y < 0 || this.y > height) this.vy = -this.vy;
            
            // Move particle
            this.x += this.vx;
            this.y += this.vy;
            
            // Mouse push effect
            if (mouse.x != null && mouse.y != null) {
                let dx = this.x - mouse.x;
                let dy = this.y - mouse.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    let force = (mouse.radius - distance) / mouse.radius;
                    let angle = Math.atan2(dy, dx);
                    this.vx += Math.cos(angle) * force * 0.2;
                    this.vy += Math.sin(angle) * force * 0.2;
                }
            }
            
            // Drag friction
            this.vx *= 0.98;
            this.vy *= 0.98;
            
            // Re-apply a tiny base speed if they slow down too much
            const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (currentSpeed < 0.1) {
                this.vx += (Math.random() - 0.5) * 0.1;
                this.vy += (Math.random() - 0.5) * 0.1;
            }
            
            this.draw();
        }
    }

    function createParticles() {
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    // Connect particles near each other
    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a + 1; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 110) {
                    opacityValue = 1 - (distance / 110);
                    ctx.strokeStyle = `rgba(79, 172, 254, ${opacityValue * 0.15})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particlesArray.forEach(p => p.update());
        connect();
        requestAnimationFrame(animate);
    }
    
    createParticles();
    animate();
}

/* ==========================================================================
   GRAPHICAL DATA VISUALIZATIONS (CHART.JS)
   ========================================================================== */
function initCharts() {
    // Custom Chart Styles
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.font.size = 11;
    
    // 1. ROI COST SAVINGS CHART (Philips migration effect)
    const roiCtx = document.getElementById('roiChart');
    if (roiCtx) {
        new Chart(roiCtx, {
            type: 'bar',
            data: {
                labels: ['2020', '2021', '2022', '2023 (Migration)', '2024 (Post-Migration)', '2025 (Projected)'],
                datasets: [
                    {
                        label: 'QA Tool Licensing Cost (EUR)',
                        data: [230000, 245000, 260000, 60000, 15000, 15000],
                        backgroundColor: 'rgba(255, 95, 86, 0.45)',
                        borderColor: '#ff5f56',
                        borderWidth: 2,
                        borderRadius: 6,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Net Savings (Cumulative EUR)',
                        data: [0, 0, 0, 200000, 445000, 690000],
                        type: 'line',
                        borderColor: '#00f2fe',
                        backgroundColor: 'rgba(0, 242, 254, 0.1)',
                        borderWidth: 3,
                        pointBackgroundColor: '#00f2fe',
                        pointBorderColor: '#fff',
                        pointHoverRadius: 8,
                        tension: 0.3,
                        fill: true,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            boxWidth: 15,
                            padding: 15,
                            font: {
                                family: "'Outfit', sans-serif",
                                weight: '500'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(7, 9, 14, 0.95)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: 'rgba(0, 242, 254, 0.2)',
                        borderWidth: 1,
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255,255,255,0.03)'
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        grid: {
                            color: 'rgba(255,255,255,0.05)'
                        },
                        title: {
                            display: true,
                            text: 'Licensing Expenses'
                        },
                        ticks: {
                            callback: function(value) {
                                return '€' + value / 1000 + 'k';
                            }
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: {
                            drawOnChartArea: false // only want the grid lines for one axis
                        },
                        title: {
                            display: true,
                            text: 'Accrued Savings'
                        },
                        ticks: {
                            callback: function(value) {
                                return '€' + value / 1000 + 'k';
                            }
                        }
                    }
                }
            }
        });
    }

    // 2. DOMAIN RADAR CHART (Competency weights)
    const radarCtx = document.getElementById('radarChart');
    if (radarCtx) {
        new Chart(radarCtx, {
            type: 'radar',
            data: {
                labels: [
                    'Automation Architecture', 
                    'API QA & Mocking', 
                    'Performance Testing', 
                    'CI/CD & Release', 
                    'Agile Leadership', 
                    'Cross-Device Mobile QA'
                ],
                datasets: [{
                    label: 'Expertise Rating',
                    data: [95, 90, 85, 88, 92, 94],
                    fill: true,
                    backgroundColor: 'rgba(0, 242, 254, 0.15)',
                    borderColor: '#00f2fe',
                    pointBackgroundColor: '#00f2fe',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#00f2fe',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(7, 9, 14, 0.95)',
                        borderColor: 'rgba(0, 242, 254, 0.2)',
                        borderWidth: 1,
                        padding: 10
                    }
                },
                scales: {
                    r: {
                        angleLines: {
                            color: 'rgba(255,255,255,0.06)'
                        },
                        grid: {
                            color: 'rgba(255,255,255,0.06)'
                        },
                        pointLabels: {
                            color: '#94a3b8',
                            font: {
                                size: 10,
                                weight: '500'
                            }
                        },
                        ticks: {
                            backdropColor: 'transparent',
                            color: '#64748b',
                            stepSize: 20,
                            showLabelBackdrop: false
                        },
                        suggestedMin: 30,
                        suggestedMax: 100
                    }
                }
            }
        });
    }
}

/* ==========================================================================
   SCROLL TRIGGERS & BAR ANIMATIONS
   ========================================================================== */
function initScrollAnimations() {
    // 1. Skill Progress Bars Animation on Scroll
    const skillsSection = document.getElementById('skills');
    const progressFills = document.querySelectorAll('.progress-bar-fill');
    
    if (skillsSection && progressFills.length > 0) {
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    progressFills.forEach(fill => {
                        // Get target width from style attribute or inline data
                        const targetWidth = fill.style.width;
                        fill.style.width = '0%';
                        setTimeout(() => {
                            fill.style.width = targetWidth;
                        }, 100);
                    });
                    // Unobserve to run animation only once
                    skillsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        
        skillsObserver.observe(skillsSection);
    }
    
    // 2. Active Menu Link Highlighting on Scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // 3. Interactive Timeline Highlight on Scroll
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems.length > 0) {
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                } else {
                    entry.target.classList.remove('active');
                }
            });
        }, { threshold: 0.25, rootMargin: '0px 0px -10% 0px' });
        
        timelineItems.forEach(item => timelineObserver.observe(item));
    }
}

/* ==========================================================================
   MOBILE NAVIGATION MENU TOGGLE
   ========================================================================== */
function initMobileNav() {
    const toggle = document.querySelector('.mobile-nav-toggle');
    const navbar = document.querySelector('.navbar');
    const links = document.querySelectorAll('.nav-link');
    
    if (toggle && navbar) {
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navbar.classList.toggle('mobile-active');
            toggle.classList.toggle('open');
            
            // Animate bars
            const bars = toggle.querySelectorAll('.bar');
            if (navbar.classList.contains('mobile-active')) {
                bars[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
        
        // Close menu on link click
        links.forEach(link => {
            link.addEventListener('click', () => {
                navbar.classList.remove('mobile-active');
                const bars = toggle.querySelectorAll('.bar');
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navbar.classList.contains('mobile-active') && !navbar.contains(e.target) && !toggle.contains(e.target)) {
                navbar.classList.remove('mobile-active');
                const bars = toggle.querySelectorAll('.bar');
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
    }
}

/* ==========================================================================
   CONTACT FORM HANDLER WITH FEEDBACK EFFECTS
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');
    
    if (form && status && submitBtn) {
        form.addEventListener('submit', () => {
            // Visual loading state
            submitBtn.disabled = true;
            const originalContent = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Sending Message <i class="fa-solid fa-spinner fa-spin"></i>';
            status.style.display = 'none';
            
            // Mock API dispatch timeout (1.5 seconds)
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalContent;
                
                // Show success status
                status.className = 'form-status success';
                status.innerHTML = '<i class="fa-solid fa-circle-check"></i> Thank you! Your message was sent successfully. Varun will get back to you shortly.';
                
                // Reset fields
                form.reset();
                
                // Hide status after 5s
                setTimeout(() => {
                    status.style.display = 'none';
                }, 5000);
                
            }, 1500);
        });
    }
}
