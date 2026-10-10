/* ========================================================
   DIPANSHU PORTFOLIO — INTERACTIVE JAVASCRIPT
======================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initMouseFollower();
    initMobileMenu();
    initNavbarScroll();
    initContactForm();
});

/* ---------------------------------------------------------
   1. AMBIENT MOUSE FOLLOWER
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
        // Smooth interpolation
        currentX += (mouseX - currentX) * 0.12;
        currentY += (mouseY - currentY) * 0.12;

        mouseGlow.style.left = `${currentX}px`;
        mouseGlow.style.top = `${currentY}px`;

        requestAnimationFrame(render);
    }
    render();
}

/* ---------------------------------------------------------
   2. MOBILE MENU TOGGLE
--------------------------------------------------------- */
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const mobileMenu = document.getElementById("mobileMenu");
    const menuIcon = document.getElementById("menuIcon");
    const closeIcon = document.getElementById("closeIcon");
    const navLinks = document.querySelectorAll(".mobile-nav-link");

    if (!mobileMenuBtn || !mobileMenu) return;

    function toggleMenu() {
        const isHidden = mobileMenu.classList.contains("hidden");
        if (isHidden) {
            mobileMenu.classList.remove("hidden");
            mobileMenu.classList.add("flex");
            menuIcon.classList.add("hidden");
            closeIcon.classList.remove("hidden");
        } else {
            mobileMenu.classList.add("hidden");
            mobileMenu.classList.remove("flex");
            menuIcon.classList.remove("hidden");
            closeIcon.classList.add("hidden");
        }
    }

    mobileMenuBtn.addEventListener("click", toggleMenu);

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            mobileMenu.classList.add("hidden");
            mobileMenu.classList.remove("flex");
            menuIcon.classList.remove("hidden");
            closeIcon.classList.add("hidden");
        });
    });
}

/* ---------------------------------------------------------
   3. NAVBAR SHRINK ON SCROLL
--------------------------------------------------------- */
function initNavbarScroll() {
    const mainHeader = document.getElementById("mainHeader");
    if (!mainHeader) return;

    window.addEventListener("scroll", () => {
        if (window.scrollY > 40) {
            mainHeader.classList.add("scrolled");
        } else {
            mainHeader.classList.remove("scrolled");
        }
    });
}

/* ---------------------------------------------------------
   4. CONTACT FORM LOGIC
--------------------------------------------------------- */
function initContactForm() {
    const form = document.getElementById("portfolioContactForm");
    if (!form) return;

    const submitBtn = document.getElementById("submitBtn");
    const submitBtnText = document.getElementById("submitBtnText");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("senderName").value.trim();
        const email = document.getElementById("senderEmail").value.trim();
        const subject = document.getElementById("messageSubject").value.trim() || "Portfolio Inquiry";
        const message = document.getElementById("senderMessage").value.trim();

        if (!name || !email || !message) {
            showToast("Please fill in all required fields.");
            return;
        }

        // Visual feedback
        submitBtn.disabled = true;
        const originalText = submitBtnText.textContent;
        submitBtnText.textContent = "Opening Email Client...";

        // Generate mailto link
        const emailBody = `Hi Dipanshu,\n\nMy name is ${name} (${email}).\n\nMessage:\n${message}\n\nBest regards,\n${name}`;
        const mailtoUrl = `mailto:dipanshukumar8075@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

        // Open user's default email client
        window.location.href = mailtoUrl;

        showToast("Opening email client! Thanks for reaching out.");

        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtnText.textContent = "Message Prepared ✓";
            form.reset();

            setTimeout(() => {
                submitBtnText.textContent = originalText;
            }, 3000);
        }, 1000);
    });
}

/* ---------------------------------------------------------
   5. SEND VIA WHATSAPP HELPER
--------------------------------------------------------- */
function sendViaWhatsApp() {
    const name = document.getElementById("senderName") ? document.getElementById("senderName").value.trim() : "";
    const email = document.getElementById("senderEmail") ? document.getElementById("senderEmail").value.trim() : "";
    const subject = document.getElementById("messageSubject") ? document.getElementById("messageSubject").value.trim() : "";
    const message = document.getElementById("senderMessage") ? document.getElementById("senderMessage").value.trim() : "";

    let whatsappText = "Hello Dipanshu! ";
    if (name) {
        whatsappText += `I am ${name}. `;
    }
    if (email) {
        whatsappText += `(Email: ${email}). `;
    }
    if (subject) {
        whatsappText += `Regarding: ${subject}. `;
    }
    if (message) {
        whatsappText += `Message: ${message}`;
    } else {
        whatsappText += "I checked your portfolio and would like to connect!";
    }

    const waUrl = `https://wa.me/918873384577?text=${encodeURIComponent(whatsappText)}`;
    window.open(waUrl, "_blank");
}

/* ---------------------------------------------------------
   6. COPY TO CLIPBOARD & TOAST
--------------------------------------------------------- */
function copyToClipboard(text, customMessage = "Copied to clipboard!") {
    navigator.clipboard.writeText(text).then(() => {
        showToast(customMessage);
    }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        showToast(customMessage);
    });
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