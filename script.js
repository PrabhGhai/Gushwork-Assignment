document.addEventListener('DOMContentLoaded', () => {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('main-product-image');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    let currentIndex = 0;

    const updateMainImage = (index) => {
        const thumb = thumbnails[index];
        const newSrc = thumb.getAttribute('data-src');

        // Smooth fade-out/fade-in transition
        mainImage.style.transition = 'opacity 0.4s ease-in-out';
        mainImage.style.opacity = '0';

        setTimeout(() => {
            mainImage.src = newSrc;
            mainImage.style.opacity = '1';
        }, 400);

        // Update active thumbnail state
        thumbnails.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        currentIndex = index;
    };

    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            updateMainImage(index);
        });
    });

    prevBtn.addEventListener('click', () => {
        let newIndex = currentIndex - 1;
        if (newIndex < 0) newIndex = thumbnails.length - 1;
        updateMainImage(newIndex);
    });

    nextBtn.addEventListener('click', () => {
        let newIndex = currentIndex + 1;
        if (newIndex >= thumbnails.length) newIndex = 0;
        updateMainImage(newIndex);
    });

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all others
            faqItems.forEach(i => i.classList.remove('active'));

            // Toggle current
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Manufacturing Tabs
    const tabs = document.querySelectorAll('.mfg-tab');
    const contents = document.querySelectorAll('.mfg-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');

            // Update tabs
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update content (in real app, swap info/images dynamically)
            // For now, we just show the active state
            console.log(`Switched to tab: ${target}`);
        });
    });

    // Manufacturing Carousel Logic
    const mfgSlides = document.querySelectorAll('.mfg-slide');
    const mfgPrevBtn = document.getElementById('mfg-prev-btn');
    const mfgNextBtn = document.getElementById('mfg-next-btn');
    let currentMfgIndex = 0;

    const updateMfgCarousel = (index) => {
        mfgSlides.forEach(slide => slide.classList.remove('active'));
        mfgSlides[index].classList.add('active');
        currentMfgIndex = index;
    };

    if (mfgPrevBtn && mfgNextBtn) {
        mfgPrevBtn.addEventListener('click', () => {
            let nextIndex = currentMfgIndex - 1;
            if (nextIndex < 0) nextIndex = mfgSlides.length - 1;
            updateMfgCarousel(nextIndex);
        });

        mfgNextBtn.addEventListener('click', () => {
            let nextIndex = currentMfgIndex + 1;
            if (nextIndex >= mfgSlides.length) nextIndex = 0;
            updateMfgCarousel(nextIndex);
        });
    }

    // Applications Carousel Logic
    const appTrack = document.getElementById('app-track');
    const appPrevBtn = document.getElementById('app-prev-btn');
    const appNextBtn = document.getElementById('app-next-btn');

    if (appTrack && appPrevBtn && appNextBtn) {
        let scrollPosition = 0;
        const cardWidth = 420 + 24; // Width + Gap

        appNextBtn.addEventListener('click', () => {
            const maxScroll = appTrack.scrollWidth - appTrack.parentElement.clientWidth;
            scrollPosition += cardWidth;
            if (scrollPosition > maxScroll) scrollPosition = maxScroll;
            appTrack.style.transform = `translateX(-${scrollPosition}px)`;
        });

        appPrevBtn.addEventListener('click', () => {
            scrollPosition -= cardWidth;
            if (scrollPosition < 0) scrollPosition = 0;
            appTrack.style.transform = `translateX(-${scrollPosition}px)`;
        });
    }

    // Image Zoom Logic
    const imageZoom = (imgID, resultID, lensID) => {
        const img = document.getElementById(imgID);
        const result = document.getElementById(resultID);
        const lens = document.getElementById(lensID);

        // Function to update result background based on image
        const updateResultImage = () => {
            result.style.backgroundImage = `url('${img.src}')`;
            // Calculate ratios
            const cx = result.offsetWidth / lens.offsetWidth;
            const cy = result.offsetHeight / lens.offsetHeight;
            result.style.backgroundSize = `${img.width * cx}px ${img.height * cy}px`;
        };

        updateResultImage();

        // Cursor move handler
        const moveLens = (e) => {
            e.preventDefault();
            const pos = getCursorPos(e);
            let x = pos.x - (lens.offsetWidth / 2);
            let y = pos.y - (lens.offsetHeight / 2);

            // Bounds check
            if (x > img.width - lens.offsetWidth) x = img.width - lens.offsetWidth;
            if (x < 0) x = 0;
            if (y > img.height - lens.offsetHeight) y = img.height - lens.offsetHeight;
            if (y < 0) y = 0;

            // Update lens position
            lens.style.left = x + "px";
            lens.style.top = y + "px";

            // Update result position
            const cx = result.offsetWidth / lens.offsetWidth;
            const cy = result.offsetHeight / lens.offsetHeight;
            result.style.backgroundPosition = `-${x * cx}px -${y * cy}px`;
        };

        const getCursorPos = (e) => {
            const a = img.getBoundingClientRect();
            let x = (e.pageX || e.touches[0].pageX) - a.left;
            let y = (e.pageY || e.touches[0].pageY) - a.top;
            x = x - window.pageXOffset;
            y = y - window.pageYOffset;
            return { x: x, y: y };
        };

        // Listeners for both mouse and touch
        lens.addEventListener("mousemove", moveLens);
        img.addEventListener("mousemove", moveLens);
        lens.addEventListener("touchmove", moveLens);
        img.addEventListener("touchmove", moveLens);

        // Keep a reference to update when image changes
        img.addEventListener('load', updateResultImage);
    };

    // Initialize Zoom
    if (document.getElementById('main-product-image')) {
        imageZoom("main-product-image", "zoom-result", "zoom-lens");
    }

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (nav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking a link
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                menuToggle.querySelector('i').classList.remove('fa-times');
                menuToggle.querySelector('i').classList.add('fa-bars');
            });
        });
    }


    // --- Sticky Header Functionality ---
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    const firstFold = 150; // Distance to scroll before sticky header triggers

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > firstFold) {
            header.classList.add('header-sticky');
            // Hide if scrolling up, show if scrolling down beyond first fold
            if (currentScrollY < lastScrollY) {
                header.classList.remove('sticky-visible');
            } else {
                header.classList.add('sticky-visible');
            }
        } else {
            header.classList.remove('header-sticky', 'sticky-visible');
        }
        lastScrollY = currentScrollY;
    });

    // --- Image Carousel Logic ---
    const logoTrack = document.querySelector('.logo-track');
    if (logoTrack) {
        // Optimized auto-scroll for logos
        let scrollAmount = 0;
        const logoStep = () => {
            scrollAmount += 0.5; // Smoother scroll
            if (scrollAmount >= logoTrack.scrollWidth / 2) {
                scrollAmount = 0;
            }
            logoTrack.scrollLeft = scrollAmount;
            requestAnimationFrame(logoStep);
        };
        logoStep();
    }
});
