/**
 * Varun PK Portfolio - White Theme JS
 * Controls: Pipeline Simulator, Dynamic Metrics Counter, Timeline Tracker, Chart.js, QA Console, Mobile Menu, Contact Form
 */

document.addEventListener('DOMContentLoaded', () => {
    initPipelineSimulator();
    initMetricCounters();
    initScrollAnimations();
    initCharts();
    initQaConsole();
    initMobileNav();
    initContactForm();
});

/* ==========================================================================
   INTERACTIVE QA PIPELINE SIMULATION (Hero Graphic Animation)
   ========================================================================== */
function initPipelineSimulator() {
    const runBtn = document.getElementById('runPipelineBtn');
    if (!runBtn) return;

    const stages = document.querySelectorAll('.stage-item');
    const timeVal = document.getElementById('pipelineTimeVal');
    const savingsVal = document.getElementById('pipelineSavingsVal');
    let isRunning = false;

    // Set initial states
    resetPipeline();

    runBtn.addEventListener('click', () => {
        if (isRunning) return;
        isRunning = true;
        runBtn.disabled = true;
        runBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Running Suite...';

        resetPipeline();
        runStage(0);
    });

    function resetPipeline() {
        stages.forEach(stage => {
            stage.className = 'stage-item pending';
            const statusDiv = stage.querySelector('.stage-status');
            statusDiv.innerHTML = '<span class="status-waiting"><i class="fa-regular fa-clock"></i> Pending</span>';
            const numDiv = stage.querySelector('.stage-num');
            numDiv.innerHTML = numDiv.getAttribute('data-num');
        });
        timeVal.textContent = '48h';
        savingsVal.textContent = '€0';
    }

    function runStage(index) {
        if (index >= stages.length) {
            // Pipeline finished successfully!
            runBtn.disabled = false;
            runBtn.innerHTML = '<i class="fa-solid fa-rotate-left"></i> Run Simulation';
            isRunning = false;
            animateFinalMetrics();
            return;
        }

        const stage = stages[index];
        stage.className = 'stage-item running';
        const statusDiv = stage.querySelector('.stage-status');
        statusDiv.innerHTML = '<span class="status-spinner"></span> <span style="color: var(--primary)">Running...</span>';

        // Stage-specific processing times
        const delay = 1200 + Math.random() * 800;

        setTimeout(() => {
            stage.className = 'stage-item success';
            statusDiv.innerHTML = '<span class="status-check"><i class="fa-solid fa-circle-check"></i> Passed</span>';
            
            // Dynamic incremental metric updates during pipeline
            if (index === 0) {
                animateValue(timeVal, 48, 36, 600, 'h');
            } else if (index === 1) {
                animateValue(timeVal, 36, 24, 600, 'h');
                animateValue(savingsVal, 0, 50, 600, '€', 'K');
            } else if (index === 2) {
                animateValue(timeVal, 24, 15, 600, 'h');
                animateValue(savingsVal, 50, 140, 600, '€', 'K');
            } else if (index === 3) {
                animateValue(timeVal, 15, 12, 600, 'h');
                animateValue(savingsVal, 140, 200, 600, '€', 'K');
            }

            runStage(index + 1);
        }, delay);
    }

    function animateFinalMetrics() {
        // Double check values are set correctly at the end
        timeVal.textContent = '12h';
        savingsVal.textContent = '€200K';
    }
}

// Utility function to animate numbers in pipeline
function animateValue(obj, start, end, duration, prefix = '', suffix = '') {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentVal = Math.floor(progress * (end - start) + start);
        if (prefix === '€') {
            obj.textContent = `${prefix}${currentVal}${suffix}`;
        } else {
            obj.textContent = `${currentVal}${prefix}`;
        }
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            if (prefix === '€') {
                obj.textContent = `${prefix}${end}${suffix}`;
            } else {
                obj.textContent = `${end}${prefix}`;
            }
        }
    };
    window.requestAnimationFrame(step);
}

/* ==========================================================================
   DYNAMIC SCROLL METRICS COUNTER
   ========================================================================== */
function initMetricCounters() {
    const metricsSection = document.getElementById('metrics');
    const metricVals = document.querySelectorAll('.metric-val');
    
    if (!metricsSection || metricVals.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                metricVals.forEach(val => {
                    const target = parseInt(val.getAttribute('data-target'), 10);
                    const prefix = val.getAttribute('data-prefix') || '';
                    const suffix = val.getAttribute('data-suffix') || '';
                    
                    let count = 0;
                    const speed = 2000 / target; // complete in 2 seconds

                    const updateCount = () => {
                        const increment = Math.ceil(target / 40);
                        if (count < target) {
                            count += increment;
                            if (count > target) count = target;
                            val.textContent = `${prefix}${count}${suffix}`;
                            setTimeout(updateCount, 40);
                        } else {
                            val.textContent = `${prefix}${target}${suffix}`;
                        }
                    };
                    updateCount();
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    observer.observe(metricsSection);
}

/* ==========================================================================
   SCROLL TRIGGERS & TIMELINE LINE ANCHORS
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
                        const targetWidth = fill.getAttribute('data-width');
                        fill.style.width = targetWidth;
                    });
                    skillsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        
        skillsObserver.observe(skillsSection);
    }

    // 2. Timeline Item Fade/Slide Animation on Scroll
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems.length > 0) {
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });
        
        timelineItems.forEach(item => timelineObserver.observe(item));
    }

    // 3. Timeline Path Scroll Tracker (Draw line as user scrolls)
    const timelineSection = document.getElementById('experience');
    const timelineBarFill = document.querySelector('.timeline-bar-fill');
    if (timelineSection && timelineBarFill) {
        window.addEventListener('scroll', () => {
            const rect = timelineSection.getBoundingClientRect();
            const sectionHeight = rect.height;
            const windowHeight = window.innerHeight;
            
            // Calculate how far the section is scrolled
            // 0 when section top enters viewport bottom, 1 when section bottom leaves viewport top
            let scrolled = (windowHeight - rect.top) / (sectionHeight + windowHeight - 200);
            scrolled = Math.max(0, Math.min(1, scrolled));
            
            // Map scroll progress to line height
            timelineBarFill.style.height = `${scrolled * 100}%`;
        });
    }

    // 4. Navbar active link tracking
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, { rootMargin: '-30% 0px -50% 0px' });

    sections.forEach(section => navObserver.observe(section));
}

/* ==========================================================================
   GRAPHICAL DATA VISUALIZATIONS (CHART.JS)
   ========================================================================== */
function initCharts() {
    // Elegant light theme styling overrides
    Chart.defaults.color = '#64748b'; // Slate 500
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.font.size = 11;
    Chart.defaults.font.weight = 500;
    
    // 1. ROI COST SAVINGS CHART
    const roiCtx = document.getElementById('roiChartWhite');
    if (roiCtx) {
        new Chart(roiCtx, {
            type: 'bar',
            data: {
                labels: ['2020', '2021', '2022', '2023 (Migration)', '2024 (Post-Migration)', '2025 (Projected)'],
                datasets: [
                    {
                        label: 'QA Tool Licensing (EUR)',
                        data: [230000, 245000, 260000, 60000, 15000, 15000],
                        backgroundColor: 'rgba(239, 68, 68, 0.15)',
                        borderColor: '#ef4444',
                        borderWidth: 2,
                        borderRadius: 6,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Net Savings (Cumulative EUR)',
                        data: [0, 0, 0, 200000, 445000, 690000],
                        type: 'line',
                        borderColor: '#4f46e5',
                        backgroundColor: 'rgba(79, 70, 229, 0.05)',
                        borderWidth: 3,
                        pointBackgroundColor: '#4f46e5',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 5,
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
                                weight: '600'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#0f172a',
                        bodyColor: '#475569',
                        borderColor: '#e2e8f0',
                        borderWidth: 1,
                        padding: 12,
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) label += ': ';
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
                        grid: { color: '#f1f5f9' },
                        ticks: { color: '#475569' }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        grid: { color: '#f1f5f9' },
                        title: { display: true, text: 'Licensing Expenses', font: { weight: 'bold' } },
                        ticks: {
                            color: '#475569',
                            callback: value => '€' + value / 1000 + 'k'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: { drawOnChartArea: false },
                        title: { display: true, text: 'Accrued Savings', font: { weight: 'bold' } },
                        ticks: {
                            color: '#475569',
                            callback: value => '€' + value / 1000 + 'k'
                        }
                    }
                }
            }
        });
    }

    // 2. DOMAIN RADAR CHART
    const radarCtx = document.getElementById('radarChartWhite');
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
                    backgroundColor: 'rgba(139, 92, 246, 0.12)',
                    borderColor: '#8b5cf6',
                    pointBackgroundColor: '#8b5cf6',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverBackgroundColor: '#ffffff',
                    pointHoverBorderColor: '#8b5cf6',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderColor: '#e2e8f0',
                        borderWidth: 1,
                        padding: 10,
                        titleColor: '#0f172a',
                        bodyColor: '#475569'
                    }
                },
                scales: {
                    r: {
                        angleLines: { color: '#e2e8f0' },
                        grid: { color: '#e2e8f0' },
                        pointLabels: {
                            color: '#475569',
                            font: { size: 10, weight: '600' }
                        },
                        ticks: {
                            backdropColor: 'transparent',
                            color: '#94a3b8',
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
   INTERACTIVE QA DIAGNOSTIC CONSOLE (SaaS Console WOW Element)
   ========================================================================== */
function initQaConsole() {
    const selector = document.getElementById('qaChallengeSelect');
    const consoleOutput = document.getElementById('consoleOutput');
    if (!selector || !consoleOutput) return;

    const solutions = {
        'flaky-tests': [
            'Analyzing framework locator schema...',
            'ERROR: Found 14 loose relative bindings and 6 hard-coded sleep triggers (Thread.sleep).',
            'Resolving flakiness index...',
            '-------------------------------------------------------',
            '>>> IMPLEMENTED EXPLICIT WAITS WRAPPERS (ExpectedConditions)',
            '>>> REFACTORED LOCATORS USING ANCHORED STABLE DOM OBJECTS',
            '>>> ADDED AUTO-RETRY ALGORITHMS FOR TRANSIENT IFRAME LOADING',
            '-------------------------------------------------------',
            'STATUS: Verification Completed.',
            'Framework Stability Index raised to 98% (Success rate: 100%).'
        ],
        'licensing': [
            'Scanning license audits...',
            'AUDIT REPORT: 120 commercial seats costing €2,100 per device/year.',
            'Initiating migration layout (SeeTest -> Custom Appium Wrapper)...',
            '-------------------------------------------------------',
            '>>> COMPILED LIGHTWEIGHT OPEN-SOURCE MOBILE CAPABILITY MANAGERS',
            '>>> TRANSITIONED DEVICE SHARING GRID TO SELENIUM GRID / APP RELEASES',
            '>>> REMIGRATED DEPT RUNS TO RUN ON PARALLEL DOCKER HOSTS',
            '-------------------------------------------------------',
            'STATUS: Department migration complete.',
            'Tooling Licensing Expense reduced by €200,000 annually.'
        ],
        'slow-ci': [
            'Measuring pipeline bottleneck triggers...',
            'METRIC: Webhook regression tests running sequentially (Duration: 48 hours).',
            'Executing parallelization plan...',
            '-------------------------------------------------------',
            '>>> CONTAINERIZED QA RUNNERS VIA DOCKER / KUBERNETES PODS',
            '>>> INTEGRATED PARALLEL MATRIX PIPELINES ON GITHUB ACTIONS',
            '>>> CONFIGURED BROWSERSTACK SHARDING TO DISTRIBUTE RUNS ACROSS 30+ NODES',
            '-------------------------------------------------------',
            'STATUS: CI Integration Verified.',
            'Regression Test run cycle reduced from 48h to 12h (75% savings).'
        ],
        'api-perf': [
            'Probing healthcare endpoints under load simulation...',
            'WARNING: Rest-Assured suites experiencing 18% latency spike at 50 concurrent requests.',
            'Injecting load engineering solution...',
            '-------------------------------------------------------',
            '>>> COMPILED LOCUST GRAPH SCRIPTS MIRRORING PRODUCTION ROUTING TRAFFIC',
            '>>> MOCKED HIGH-VOLUME DEPENDENCIES USING WIREMOCK CONTAINER STORAGE',
            '>>> OPTIMIZED CACHING HEADERS AND ENDPOINT ROUTING FOR REST SESSIONS',
            '-------------------------------------------------------',
            'STATUS: Stress test diagnostics compiled.',
            'Endpoint throughput stabilized; p99 latency < 200ms.'
        ]
    };

    selector.addEventListener('change', () => {
        const value = selector.value;
        if (!value) return;

        // Clear screen and run print simulation
        consoleOutput.innerHTML = '';
        consoleOutput.className = 'console-output';

        let lineIndex = 0;
        const lines = solutions[value];

        function printLine() {
            if (lineIndex < lines.length) {
                const lineText = lines[lineIndex];
                const pre = document.createElement('div');
                
                // Color formatting based on contents
                if (lineText.includes('ERROR:') || lineText.includes('WARNING:')) {
                    pre.style.color = '#ef4444'; // red
                } else if (lineText.includes('>>>')) {
                    pre.style.color = '#f59e0b'; // amber
                } else if (lineText.includes('STATUS:') || lineText.includes('raised to') || lineText.includes('reduced by')) {
                    pre.style.color = '#10b981'; // emerald
                }

                pre.textContent = lineText;
                consoleOutput.appendChild(pre);
                
                // Scroll to bottom of console
                consoleOutput.scrollTop = consoleOutput.scrollHeight;
                
                lineIndex++;
                setTimeout(printLine, 350 + Math.random() * 250);
            }
        }

        printLine();
    });

    // Run first option automatically as a demo
    selector.dispatchEvent(new Event('change'));
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
            
            // Animate hamburger lines
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
   CONTACT FORM SUBMISSION WITH ACCREDITED LOADER
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');
    
    if (form && status && submitBtn) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            submitBtn.disabled = true;
            const originalContent = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Sending Message <i class="fa-solid fa-circle-notch fa-spin"></i>';
            status.style.display = 'none';
            
            // Mock API dispatch timeout
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalContent;
                
                status.className = 'form-status success';
                status.innerHTML = '<i class="fa-solid fa-circle-check"></i> Thank you! Your message was sent successfully. Varun will get back to you shortly.';
                status.style.display = 'flex';
                
                form.reset();
                
                setTimeout(() => {
                    status.style.display = 'none';
                }, 6000);
            }, 1500);
        });
    }
}
