document.addEventListener("DOMContentLoaded", () => {
    
    
    // ============================================
    //  PROMO MODAL SYSTEM
    // ============================================
    const promoData = {
        hasAd: true, 
        title: "Place Your Ad Here!",
        text: "DM us to place your ads here. Your ad will be featured on this screen for 24 hours!",
        img: "img/ads.png", 
        link: "https://wa.me/2348144516127?text=I%20want%20to%20run%20ads%20on%20ADM"
    };

    const modal = document.getElementById('promo-modal');
    if (modal && promoData.hasAd) {
        // Only run on Home Page
        if(document.body.getAttribute('data-page') === 'home'){
            document.getElementById('modal-title').innerText = promoData.title;
            document.getElementById('modal-text').innerText = promoData.text;
            document.getElementById('modal-img').src = promoData.img;
            document.getElementById('modal-link').href = promoData.link;
            
            const closeBtn = document.querySelector('.close-modal');
            const notifBtn = document.getElementById('notif-btn');

            setTimeout(() => { modal.style.display = "flex"; }, 3000);

            closeBtn.addEventListener('click', () => {
                modal.style.display = "none";
                showBadge();
            });
            window.addEventListener('click', (e) => {
                if (e.target == modal) {
                    modal.style.display = "none";
                    showBadge();
                }
            });
            if(notifBtn){
                notifBtn.addEventListener('click', () => {
                     modal.style.display = "flex";
                });
            }
            function showBadge() {
                if (notifBtn && !document.querySelector('.badge')) {
                    const badge = document.createElement('div');
                    badge.className = 'badge';
                    badge.innerText = '1';
                    notifBtn.appendChild(badge);
                }
            }
        }
    }

    // ============================================
    //  REVIEW SLIDER LOGIC
    // ============================================
    const reviewSlider = document.getElementById('reviews-slider');
    if(reviewSlider) {
        let scrollAmount = 0;
        setInterval(() => {
            scrollAmount += 270;
            if (scrollAmount >= reviewSlider.scrollWidth - reviewSlider.clientWidth) scrollAmount = 0;
            reviewSlider.scrollTo({ top: 0, left: scrollAmount, behavior: 'smooth' });
        }, 3500);
    }

    // ============================================
    //  DARK MODE LOGIC
    // ============================================
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggle ? themeToggle.querySelector('i') : null;

    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        if(icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
                if(icon) {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                }
            } else {
                localStorage.setItem('theme', 'light');
                if(icon) {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                }
            }
        });
    }

    // ===========================
    // LIVE SHOP STATUS LOGIC
    // ===========================
    const statusBadge = document.getElementById('shop-status');
    if (statusBadge) {
        const openHour = parseInt(statusBadge.getAttribute('data-open')) || 9; 
        const closeHour = parseInt(statusBadge.getAttribute('data-close')) || 20; 
        const opensOnSunday = statusBadge.getAttribute('data-sunday') === "true";
        const isOnline247 = statusBadge.getAttribute('data-online') === "true";

        const now = new Date();
        const currentDay = now.getDay(); 
        const currentHour = now.getHours(); 

        if (isOnline247) {
            statusBadge.innerText = "🟢 Online 24/7";
            statusBadge.classList.add('status-open');
        } 
        else if (currentDay === 0 && !opensOnSunday) {
            statusBadge.innerText = "🔴 Closed (Sunday)";
            statusBadge.classList.add('status-closed');
        }
        else if (currentHour < openHour || currentHour >= closeHour) {
            statusBadge.innerText = "🔴 Closed Now";
            statusBadge.classList.add('status-closed');
        } 
        else {
            statusBadge.innerText = "🟢 Open Now";
            statusBadge.classList.add('status-open');
        }
    }

    // ============================================
    //  FAQ ACCORDION & SEARCH
    // ============================================
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if(question){
            question.addEventListener('click', () => {
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) otherItem.classList.remove('active');
                });
                item.classList.toggle('active');
            });
        }
    });

    const faqSearch = document.getElementById('faq-search');
    if (faqSearch) {
        faqSearch.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            faqItems.forEach(item => {
                const questionText = item.querySelector('.faq-question span').innerText.toLowerCase();
                const answerText = item.querySelector('.faq-answer').innerText.toLowerCase();
                if (questionText.includes(query) || answerText.includes(query)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    // ===========================
    // PWA INSTALLATION LOGIC
    // ===========================
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js') // Ensure this points to root
            .then(reg => console.log('✅ Service Worker Registered'))
            .catch(err => console.log('❌ SW Failed:', err));
    }

    let deferredPrompt;
    const manualInstallContainer = document.getElementById('manual-install-container');
    const manualInstallBtn = document.getElementById('manual-install-btn');
    const popupInstallBtn = document.getElementById('install-btn');
    const popup = document.getElementById('install-popup');

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if (manualInstallContainer) manualInstallContainer.style.display = 'block';
        setTimeout(() => {
            if (popup) popup.style.display = 'block';
        }, 3000);
    });

    async function triggerInstall() {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            deferredPrompt = null;
            if (popup) popup.style.display = 'none';
            if (manualInstallContainer) manualInstallContainer.style.display = 'none';
        }
    }

    if (manualInstallBtn) manualInstallBtn.addEventListener('click', triggerInstall);
    if (popupInstallBtn) popupInstallBtn.addEventListener('click', triggerInstall);

    window.addEventListener('appinstalled', () => {
        if (manualInstallContainer) manualInstallContainer.style.display = 'none';
        if (popup) popup.style.display = 'none';
    });

    // ===========================
    // PRELOADER LOGIC
    // ===========================
    const preloader = document.getElementById("preloader");
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = "0";
            preloader.style.visibility = "hidden";
        }, 500); 
    }
});

// ===========================
// HAPTIC FEEDBACK (VIBRATION)
// ===========================
function triggerHaptic() {
    if (navigator.vibrate) {
        navigator.vibrate(15);
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll("button, a, .info-card");
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            triggerHaptic();
        });
    });
});

// ===========================
// SHARE FUNCTIONALITY
// ===========================
async function shareContent(title, text, url) {
    if (navigator.share) {
        try {
            await navigator.share({ title, text, url });
        } catch (err) { console.log('Error sharing:', err); }
    } else {
        prompt("Copy this link to share:", url);
    }
}