document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const scrollButtons = document.querySelectorAll('[data-scroll]');
    const faqQuestions = document.querySelectorAll('.faq-question');
    const metricValues = document.querySelectorAll('.metric-value');
    const form = document.querySelector('.cta-form');
    const dashboardTabs = document.querySelectorAll('.dashboard-tab');
    const rangeLabel = document.getElementById('rangeLabel');
    const rangeBadge = document.querySelector('[data-dashboard-range]');
    const chartCanvas = document.getElementById('volumeChart');
    const laneList = document.getElementById('laneList');
    const statShipments = document.getElementById('statShipments');
    const statShipmentsDelta = document.getElementById('statShipmentsDelta');
    const statOnTime = document.getElementById('statOnTime');
    const statDistance = document.getElementById('statDistance');
    const statEmissions = document.getElementById('statEmissions');

    const toggleNav = () => {
        hamburger?.classList.toggle('is-open');
        hamburger?.classList.toggle('active'); // legacy support
        navMenu?.classList.toggle('is-open');
        navMenu?.classList.toggle('active'); // legacy support
        document.body.classList.toggle('nav-open');
    };

    const closeNav = () => {
        hamburger?.classList.remove('is-open', 'active');
        navMenu?.classList.remove('is-open', 'active');
        document.body.classList.remove('nav-open');
    };

    hamburger?.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleNav();
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => closeNav());
    });

    document.addEventListener('click', (event) => {
        if (!navMenu || !hamburger) return;
        const clickedInsideMenu = navMenu.contains(event.target);
        const clickedHamburger = hamburger.contains(event.target);
        if (!clickedInsideMenu && !clickedHamburger && navMenu.classList.contains('is-open')) {
            closeNav();
        }
    });

    const smoothScroll = (target) => {
        if (!target) return;
        const el = document.querySelector(target);
        if (!el) return;
        const navHeight = document.querySelector('.navbar')?.offsetHeight ?? 0;
        const top = el.getBoundingClientRect().top + window.scrollY - navHeight - 20;
        window.scrollTo({
            top,
            behavior: 'smooth'
        });
    };

    scrollButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-scroll');
            smoothScroll(target);
        });
    });

    faqQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const expanded = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', String(!expanded));
            btn.closest('.faq-item')?.classList.toggle('open', !expanded);
        });
    });

    const animateMetrics = (entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseFloat(el.dataset.target);
            if (Number.isNaN(target)) return;
            const duration = 1200;
            const startTime = performance.now();

            const step = (timestamp) => {
                const progress = Math.min((timestamp - startTime) / duration, 1);
                let value = target * progress;
                if (target > 999) {
                    value = Math.round(value).toLocaleString();
                } else {
                    value = (Math.round(value * 10) / 10).toString();
                }
                el.textContent = value;
                if (progress < 1) {
                    requestAnimationFrame(step);
                }
            };

            requestAnimationFrame(step);
            observer.unobserve(el);
        });
    };

    if (metricValues.length) {
        const observer = new IntersectionObserver((entries, obs) => animateMetrics(entries, obs), {
            threshold: 0.6
        });
        metricValues.forEach(value => observer.observe(value));
    }

    const dashboardData = {
        day: {
            label: 'Day',
            heading: "Today's",
            chart: {
                labels: ['4a', '7a', '10a', '1p', '4p', '7p', '10p'],
                loads: [180, 230, 310, 360, 410, 380, 320],
                capacity: [240, 260, 340, 390, 430, 420, 360]
            },
            stats: {
                shipments: '428 loads',
                shipmentsDelta: '+4.2%',
                onTime: '98.3%',
                distance: '312 mi',
                emissions: '-9.4%'
            },
            lanes: [
                { route: 'Dallas → Atlanta', mode: 'Linehaul', loads: 182, trend: '+8%' },
                { route: 'Houston → Chicago', mode: 'FTL', loads: 154, trend: '+5%' },
                { route: 'Memphis → Miami', mode: 'Air Express', loads: 96, trend: '-2%', negative: true },
                { route: 'LA → Phoenix', mode: 'Parcel', loads: 88, trend: '+3%' }
            ]
        },
        week: {
            label: 'Week',
            heading: 'This week’s',
            chart: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                loads: [1920, 2050, 2140, 2280, 2440, 2105, 1880],
                capacity: [2100, 2200, 2300, 2380, 2500, 2300, 2050]
            },
            stats: {
                shipments: '14,115 loads',
                shipmentsDelta: '+6.1%',
                onTime: '97.6%',
                distance: '642 mi',
                emissions: '-7.1%'
            },
            lanes: [
                { route: 'Newark → Toronto', mode: 'Cross-border', loads: 740, trend: '+11%' },
                { route: 'Seattle → LA', mode: 'West coast', loads: 612, trend: '+4%' },
                { route: 'Chicago → Denver', mode: 'Linehaul', loads: 508, trend: '+2%' },
                { route: 'Austin → Tampa', mode: 'Reefer', loads: 392, trend: '-1%', negative: true }
            ]
        },
        month: {
            label: 'Month',
            heading: 'This month’s',
            chart: {
                labels: ['W1', 'W2', 'W3', 'W4', 'W5'],
                loads: [6120, 6480, 7020, 7340, 6880],
                capacity: [6400, 6700, 7200, 7500, 7000]
            },
            stats: {
                shipments: '33,840 loads',
                shipmentsDelta: '+3.4%',
                onTime: '97.1%',
                distance: '698 mi',
                emissions: '-5.6%'
            },
            lanes: [
                { route: 'Shanghai → LA', mode: 'Ocean + drayage', loads: 1120, trend: '+6%' },
                { route: 'Rotterdam → Newark', mode: 'Ocean', loads: 980, trend: '+3%' },
                { route: 'Dallas → Mexico City', mode: 'Cross-border', loads: 864, trend: '+9%' },
                { route: 'Chicago → Montreal', mode: 'Rail intermodal', loads: 752, trend: '-4%', negative: true }
            ]
        },
        year: {
            label: 'Year',
            heading: 'Year-to-date',
            chart: {
                labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                loads: [18000, 19600, 20840, 22150],
                capacity: [19000, 20500, 21500, 22800]
            },
            stats: {
                shipments: '80,590 loads',
                shipmentsDelta: '+9.8%',
                onTime: '96.4%',
                distance: '712 mi',
                emissions: '-12.2%'
            },
            lanes: [
                { route: 'Global auto OEMs', mode: 'Control tower', loads: 3420, trend: '+12%' },
                { route: 'Retail omni-channel', mode: 'Parcel + LTL', loads: 2960, trend: '+7%' },
                { route: 'Pharma cold chain', mode: 'Temp controlled', loads: 2340, trend: '+5%' },
                { route: 'Industrial projects', mode: 'Heavy haul', loads: 1980, trend: '-3%', negative: true }
            ]
        }
    };

    const chartCtx = chartCanvas?.getContext('2d');
    let currentRange = 'day';
    let currentChartData = null;

    const drawGrid = (ctx, width, height, padding, steps = 4) => {
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 8]);
        for (let i = 0; i <= steps; i++) {
            const y = padding + ((height - padding * 2) / steps) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }
        ctx.setLineDash([]);
    };

    const drawLineChart = (chart) => {
        if (!chartCanvas || !chartCtx || !chart) return;
        const width = chartCanvas.width = chartCanvas.clientWidth || 700;
        const height = chartCanvas.height;
        const padding = 50;
        const chartHeight = height - padding * 2;
        const chartWidth = width - padding * 2;
        const maxValue = Math.max(...chart.loads, ...chart.capacity) * 1.1;

        chartCtx.clearRect(0, 0, width, height);
        drawGrid(chartCtx, width, height, padding);

        const mapPoints = (values) => values.map((value, index) => {
            const x = padding + (chartWidth * (index / (values.length - 1 || 1)));
            const y = padding + chartHeight - (value / maxValue) * chartHeight;
            return { x, y };
        });

        const drawDataset = (points, color, fill) => {
            chartCtx.beginPath();
            chartCtx.lineWidth = 3;
            chartCtx.strokeStyle = color;
            points.forEach((point, index) => {
                if (index === 0) {
                    chartCtx.moveTo(point.x, point.y);
                } else {
                    chartCtx.lineTo(point.x, point.y);
                }
            });
            chartCtx.stroke();

            if (fill) {
                const gradient = chartCtx.createLinearGradient(0, padding, 0, height - padding);
                gradient.addColorStop(0, 'rgba(37, 99, 235, 0.35)');
                gradient.addColorStop(1, 'rgba(37, 99, 235, 0)');
                chartCtx.lineTo(points.at(-1).x, height - padding);
                chartCtx.lineTo(points[0].x, height - padding);
                chartCtx.closePath();
                chartCtx.fillStyle = gradient;
                chartCtx.fill();
            }
        };

        const loadPoints = mapPoints(chart.loads);
        const capacityPoints = mapPoints(chart.capacity);

        drawDataset(loadPoints, '#2563eb', true);
        drawDataset(capacityPoints, '#a5b4fc');
    };

    const renderLanes = (lanes = []) => {
        if (!laneList) return;
        laneList.innerHTML = lanes.map(lane => `
            <li class="lane-row">
                <div class="lane-meta">
                    <span class="lane-route">${lane.route}</span>
                    <span class="lane-mode">${lane.mode}</span>
                </div>
                <div class="lane-metrics">
                    <span class="lane-loads">${lane.loads.toLocaleString()} loads</span>
                    <span class="lane-trend ${lane.negative ? 'negative' : ''}">${lane.trend}</span>
                </div>
            </li>
        `).join('');
    };

    const updateDashboard = (range) => {
        const data = dashboardData[range];
        if (!data) return;
        currentRange = range;
        currentChartData = data.chart;

        if (rangeLabel) rangeLabel.textContent = `${data.heading}`;
        if (rangeBadge) rangeBadge.textContent = `${data.label} view`;
        if (statShipments) statShipments.textContent = data.stats.shipments;
        if (statShipmentsDelta) statShipmentsDelta.textContent = data.stats.shipmentsDelta;
        if (statOnTime) statOnTime.textContent = data.stats.onTime;
        if (statDistance) statDistance.textContent = data.stats.distance;
        if (statEmissions) statEmissions.textContent = data.stats.emissions;
        renderLanes(data.lanes);
        drawLineChart(data.chart);
    };

    dashboardTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const range = tab.getAttribute('data-range');
            if (!range) return;
            dashboardTabs.forEach(btn => {
                const isActive = btn === tab;
                btn.classList.toggle('active', isActive);
                btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });
            updateDashboard(range);
        });
    });

    if (chartCanvas) {
        chartCanvas.height = 360;
        updateDashboard('day');
        window.addEventListener('resize', () => drawLineChart(currentChartData));
    }

    form?.addEventListener('submit', (event) => {
        event.preventDefault();
        form.reset();
        alert('Thanks! Our team will get back to you shortly.');
    });
});

// Tracking Data (Simulated Database)
const trackingData = {
    'FT123456789': {
        status: 'In Transit',
        statusIcon: 'fa-truck',
        description: 'Your package is on the way to its destination',
        deliveryDate: 'Dec 25, 2024',
        weight: '2.5 kg',
        timeline: [
            { date: 'Dec 20, 2024 10:30 AM', location: 'New York, USA', status: 'Package picked up', active: false },
            { date: 'Dec 21, 2024 2:15 PM', location: 'New York Distribution Center', status: 'In transit to sorting facility', active: false },
            { date: 'Dec 22, 2024 9:00 AM', location: 'Chicago, USA', status: 'Arrived at sorting facility', active: false },
            { date: 'Dec 23, 2024 11:45 AM', location: 'Chicago, USA', status: 'Departed from sorting facility', active: true },
            { date: 'Dec 24, 2024 3:30 PM', location: 'Los Angeles, USA', status: 'Out for delivery', active: false }
        ]
    },
    'FT987654321': {
        status: 'Out for Delivery',
        statusIcon: 'fa-shipping-fast',
        description: 'Your package is out for delivery today',
        deliveryDate: 'Dec 24, 2024',
        weight: '1.8 kg',
        timeline: [
            { date: 'Dec 18, 2024 9:00 AM', location: 'Miami, USA', status: 'Package picked up', active: false },
            { date: 'Dec 19, 2024 1:30 PM', location: 'Miami Distribution Center', status: 'In transit to sorting facility', active: false },
            { date: 'Dec 20, 2024 10:15 AM', location: 'Atlanta, USA', status: 'Arrived at sorting facility', active: false },
            { date: 'Dec 21, 2024 8:00 AM', location: 'Atlanta, USA', status: 'Departed from sorting facility', active: false },
            { date: 'Dec 24, 2024 6:00 AM', location: 'Dallas, USA', status: 'Out for delivery', active: true }
        ]
    },
    'FT0000000000': {
        status: 'Delivered',
        statusIcon: 'fa-check-circle',
        description: 'Your package has been successfully delivered',
        deliveryDate: 'Dec 22, 2024',
        weight: '3.2 kg',
        timeline: [
            { date: 'Dec 15, 2024 11:00 AM', location: 'Seattle, USA', status: 'Package picked up', active: false },
            { date: 'Dec 16, 2024 3:45 PM', location: 'Seattle Distribution Center', status: 'In transit to sorting facility', active: false },
            { date: 'Dec 17, 2024 10:30 AM', location: 'Portland, USA', status: 'Arrived at sorting facility', active: false },
            { date: 'Dec 18, 2024 8:15 AM', location: 'Portland, USA', status: 'Departed from sorting facility', active: false },
            { date: 'Dec 19, 2024 2:00 PM', location: 'San Francisco, USA', status: 'Out for delivery', active: false },
            { date: 'Dec 22, 2024 4:30 PM', location: 'San Francisco, USA', status: 'Delivered', active: true }
        ]
    }
};

// Quick track function
function quickTrack(trackingNumber) {
    document.getElementById('trackingNumber').value = trackingNumber;
    trackShipment();
}

// Main tracking function
function trackShipment() {
    const trackingNumber = document.getElementById('trackingNumber').value.trim().toUpperCase();
    const trackResults = document.getElementById('trackResults');

    if (!trackingNumber) {
        alert('Please enter a tracking number');
        return;
    }

    if (trackingData[trackingNumber]) {
        const data = trackingData[trackingNumber];

        // Update status text
        document.getElementById('statusTitle').textContent = data.status;
        document.getElementById('statusDescription').textContent = data.description;

        // Update status icon FIXED
        const statusIcon = document.querySelector('.status-icon i');
        statusIcon.className = `fas ${data.statusIcon}`;

        // Update shipment details
        document.getElementById('detailTracking').textContent = trackingNumber;
        document.getElementById('detailStatus').textContent = data.status;
        document.getElementById('detailDelivery').textContent = data.deliveryDate;
        document.getElementById('detailWeight').textContent = data.weight;

        // Update timeline FIXED
        const timeline = document.getElementById('timeline');
        timeline.innerHTML = '';

        data.timeline.forEach(item => {
            const timelineItem = document.createElement('div');

            timelineItem.className = `timeline-item ${item.active ? 'active' : ''}`;

            timelineItem.innerHTML = `
                <h4>${item.status}</h4>
                <p><i class="fas fa-map-marker-alt"></i> ${item.location}</p>
                <p><i class="fas fa-clock"></i> ${item.date}</p>
            `;

            timeline.appendChild(timelineItem);
        });

        // Show results box
        trackResults.style.display = "block";
        trackResults.scrollIntoView({ behavior: "smooth" });

        // Status color logic
        if (data.status === "Delivered") {
            statusIcon.style.color = "#4CAF50";
        } else if (data.status === "Out for Delivery") {
            statusIcon.style.color = "#FF6B35";
        } else {
            statusIcon.style.color = "var(--primary-color)";
        }

    } else {
        // If tracking not found
        trackResults.style.display = "block";
        trackResults.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <i class="fas fa-exclamation-triangle" style="font-size: 4rem; color: var(--secondary-color); margin-bottom: 1rem;"></i>
                <h3>Tracking Number Not Found</h3>
                <p>The tracking number "${trackingNumber}" does not exist in our system.</p>
            </div>
        `;
    }
}

// Form submit
document.addEventListener('DOMContentLoaded', function () {
    const trackForm = document.getElementById('trackForm');

    if (trackForm) {
        trackForm.addEventListener('submit', function (e) {
            e.preventDefault();
            trackShipment();
        });
    }
});
