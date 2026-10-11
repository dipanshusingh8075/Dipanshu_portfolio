/* ========================================================
   DIPANSHU PORTFOLIO — 3D INTERACTIVE JAVASCRIPT
   Features:
   1. Lightweight 3D Particle Canvas Background
   2. Interactive 3D Card Tilt on Mouse Move
   3. Smooth Mouse Ambient Spotlight
   4. ScrollSpy Navigation Tracker
   5. Mobile Drawer Menu with ARIA states
   6. Contact Form (FormSubmit AJAX + WhatsApp fallback)
   7. Copy to Clipboard with Toast Notification
======================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initParticleCanvas();
    init3DTilt();
    initMouseFollower();
    initMobileMenu();
    initNavbarScrollSpy();
    initContactForm();
});

/* ---------------------------------------------------------
   1. 3D PARTICLE CONSTELLATION CANVAS
--------------------------------------------------------- */
function initParticleCanvas() {
    const canvas = document.getElementById("canvas3d");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let width, height;
    let particles = [];
    const particleCount = window.innerWidth < 768 ? 32 : 55;
    let mouse = { x: null, y: null, targetX: 0, targetY: 0 };

    // Reduced motion check
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // Particle Object
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.45;
            this.vy = (Math.random() - 0.5) * 0.45;
            this.radius = Math.random() * 1.8 + 0.8;
            this.color = Math.random() > 0.4 ? "rgba(6, 182, 212, " : "rgba(139, 92, 246, ";
            this.alpha = Math.random() * 0.5 + 0.2;
            this.depth = Math.random() * 0.6 + 0.4; // 3D depth layer
        }

        update() {
            if (!prefersReducedMotion) {
                // Parallax shift based on mouse position & depth
                const px = (mouse.targetX - width / 2) * 0.02 * this.depth;
                const py = (mouse.targetY - height / 2) * 0.02 * this.depth;

                this.x += this.vx + px * 0.02;
                this.y += this.vy + py * 0.02;

                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `${this.color}${this.alpha})`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = this.color.includes("6, 182") ? "#06b6d4" : "#8b5cf6";
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Connect particles with faint glowing lines
    function connect() {
        const maxDist = 120;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxDist) {
                    const opacity = (1 - dist / maxDist) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`;
                    ctx.lineWidth = 0.75;
                    ctx.stroke();
                }
            }
        }
    }

    window.addEventListener("mousemove", (e) => {
        mouse.targetX = e.clientX;
        mouse.targetY = e.clientY;
    });

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let p of particles) {
            p.update();
            p.draw();
        }
        connect();

        requestAnimationFrame(animate);
    }
    animate();
}

/* ---------------------------------------------------------
   2. INTERACTIVE 3D CARD TILT
--------------------------------------------------------- */
function init3DTilt() {
    // Avoid tilt on touch / mobile devices or reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) return;

    const cards = document.querySelectorAll(".tilt-card");

    cards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Compute subtle angles (-7deg to 7deg)
            const rotateX = ((y - centerY) / centerY) * -7;
            const rotateY = ((x - centerX) / centerX) * 7;

            card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
        });
    });
}

/* ---------------------------------------------------------
   3. AMBIENT MOUSE FOLLOWER
--------------------------------------------------------- */
function initMouseFollower() {
    const mouseGlow = document.getElementById("mouseGlow");
    if (!mouseGlow) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function render() {
        currentX += (mouseX - currentX) * 0.12;
        currentY += (mouseY - currentY) * 0.12;

        mouseGlow.style.left = `${currentX}px`;
        mouseGlow.style.top = `${currentY}px`;

        requestAnimationFrame(render);
    }
    render();
}

/* ---------------------------------------------------------
   4. SCROLLSPY ACTIVE NAVIGATION TRACKER
--------------------------------------------------------- */
function initNavbarScrollSpy() {
    const header = document.getElementById("mainHeader");
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll("nav a[href^='#'], #mobileMenu a[href^='#']");

    function updateActiveNav() {
        // Shrink header on scroll
        if (window.scrollY > 40) {
            header.classList.add("scrolled", "py-2.5");
            header.classList.remove("py-3", "sm:py-4");
        } else {
            header.classList.remove("scrolled", "py-2.5");
            header.classList.add("py-3", "sm:py-4");
        }

        // Active link tracking
        let currentSectionId = "hero";
        const scrollPosition = window.scrollY + 180;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            const target = link.getAttribute("href");
            if (target === `#${currentSectionId}`) {
                link.classList.add("nav-link-active");
            } else {
                link.classList.remove("nav-link-active");
            }
        });
    }

    window.addEventListener("scroll", updateActiveNav, { passive: true });
    updateActiveNav(); // Trigger on initial load
}

/* ---------------------------------------------------------
   5. MOBILE MENU WITH BUTTERY TRANSITION & ARIA ACCESSIBILITY
--------------------------------------------------------- */
function initMobileMenu() {
    const btn = document.getElementById("mobileMenuBtn");
    const menu = document.getElementById("mobileMenu");
    const menuIcon = document.getElementById("menuIcon");
    const closeIcon = document.getElementById("closeIcon");
    const links = document.querySelectorAll("#mobileMenu a");

    if (!btn || !menu) return;

    // Ensure menu starts with collapsed class
    menu.classList.add("menu-collapsed");
    menu.classList.remove("hidden");

    function toggleMenu(forceOpen) {
        const isOpen = typeof forceOpen === "boolean" 
            ? forceOpen 
            : menu.classList.contains("menu-collapsed");

        if (isOpen) {
            menu.classList.remove("menu-collapsed");
            menu.classList.add("menu-expanded");
            menuIcon.classList.add("hidden");
            closeIcon.classList.remove("hidden");
            btn.setAttribute("aria-expanded", "true");
        } else {
            menu.classList.remove("menu-expanded");
            menu.classList.add("menu-collapsed");
            menuIcon.classList.remove("hidden");
            closeIcon.classList.add("hidden");
            btn.setAttribute("aria-expanded", "false");
        }
    }

    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Close automatically when any link in mobile drawer is clicked
    links.forEach(link => {
        link.addEventListener("click", () => {
            toggleMenu(false);
        });
    });

    // Close on click outside header
    document.addEventListener("click", (e) => {
        const header = document.getElementById("mainHeader");
        if (header && !header.contains(e.target)) {
            toggleMenu(false);
        }
    });

    // Close on ESC key press
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && menu.classList.contains("menu-expanded")) {
            toggleMenu(false);
            btn.focus();
        }
    });
}

/* ---------------------------------------------------------
   6. CONTACT FORM SUBMISSION (FORMSUBMIT AJAX + FALLBACK)
--------------------------------------------------------- */
function initContactForm() {
    const form = document.getElementById("portfolioContactForm");
    if (!form) return;

    const submitBtn = document.getElementById("submitBtn");
    const submitBtnText = document.getElementById("submitBtnText");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("senderName").value.trim();
        const email = document.getElementById("senderEmail").value.trim();
        const subject = document.getElementById("messageSubject").value.trim() || "Portfolio Inquiry";
        const message = document.getElementById("senderMessage").value.trim();

        if (!name || !email || !message) {
            showToast("Please fill in all required fields.");
            return;
        }

        submitBtn.disabled = true;
        const originalText = submitBtnText.textContent;
        submitBtnText.textContent = "Sending Message...";

        try {
            // Send via FormSubmit AJAX endpoint
            const response = await fetch("https://formsubmit.co/ajax/dipanshukumar8075@gmail.com", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    _subject: `Portfolio Contact: ${subject}`,
                    message: message
                })
            });

            if (response.ok) {
                showToast("Message sent successfully! Thank you.");
                submitBtnText.textContent = "Message Sent ✓";
                form.reset();
            } else {
                // If endpoint blocked or CORS fails, trigger fallback mailto
                triggerMailtoFallback(name, email, subject, message);
            }
        } catch (err) {
            // Offline or network error fallback
            triggerMailtoFallback(name, email, subject, message);
        } finally {
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtnText.textContent = originalText;
            }, 3500);
        }
    });

    function triggerMailtoFallback(name, email, subject, message) {
        showToast("Opening default email client...");
        const body = `Hi Dipanshu,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
        window.location.href = `mailto:dipanshukumar8075@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
}

/* ---------------------------------------------------------
   7. WHATSAPP & CLIPBOARD HELPERS
--------------------------------------------------------- */
function sendViaWhatsApp() {
    const name = document.getElementById("senderName") ? document.getElementById("senderName").value.trim() : "";
    const email = document.getElementById("senderEmail") ? document.getElementById("senderEmail").value.trim() : "";
    const subject = document.getElementById("messageSubject") ? document.getElementById("messageSubject").value.trim() : "";
    const message = document.getElementById("senderMessage") ? document.getElementById("senderMessage").value.trim() : "";

    let text = "Hello Dipanshu! ";
    if (name) text += `I am ${name}. `;
    if (email) text += `(Email: ${email}). `;
    if (subject) text += `Regarding: ${subject}. `;
    if (message) text += `Message: ${message}`;
    else text += "I viewed your portfolio and would love to connect!";

    const url = `https://wa.me/918873384577?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
}

function copyToClipboard(text, customMessage = "Copied to clipboard!") {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => showToast(customMessage)).catch(() => fallbackCopy(text, customMessage));
    } else {
        fallbackCopy(text, customMessage);
    }
}

function fallbackCopy(text, msg) {
    const area = document.createElement("textarea");
    area.value = text;
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    document.body.removeChild(area);
    showToast(msg);
}

function showToast(message) {
    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toastMessage");
    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    toast.classList.remove("translate-y-20", "opacity-0", "pointer-events-none");
    toast.classList.add("translate-y-0", "opacity-100");

    setTimeout(() => {
        toast.classList.remove("translate-y-0", "opacity-100");
        toast.classList.add("translate-y-20", "opacity-0", "pointer-events-none");
    }, 3200);
}

function notifyComingSoon(project = "Full-Stack MERN Project") {
    showToast(`⚡ ${project} is in active development! Repo commits coming soon.`);
}

function handleResumeDownload(event) {
    // Graceful feedback when user clicks resume download
    showToast("Opening / Downloading Dipanshu's Resume (CV)...");
}