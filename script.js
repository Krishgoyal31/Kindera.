document.addEventListener("DOMContentLoaded", () => {
    // UPI Constants
    const BLANKET_PRICE = 101; // ₹ per blanket

    // --- UPDATED UPI DETAILS BASED ON TRANSACTION IMAGE ---
    // ✅ Put YOUR mobile number here (10 digits)
    const UPI_MOBILE = "8299301945"; 

    // ✅ Put the correct suffix here (@upi / @ybl / @okhdfcbank / @axl / @paytm etc.)
    const UPI_HANDLE_SUFFIX = "@upi";

    // Auto-generated full UPI ID from mobile + suffix
    const UPI_ID = `${UPI_MOBILE}${UPI_HANDLE_SUFFIX}`;
    const UPI_NAME = "KRISH GOYAL";
    // ---------------------------------------------------

    // Goal Tracking Constants
    const GOAL_BLANKETS = 500;
    let currentDonatedBlankets = 0; 

    // Static QR
    const STATIC_QR_IMAGE_SRC = "qr.png";

    // UPI URL Helper (generic UPI link)
    function createUpiUrl(amount, note) {
        const pa = encodeURIComponent(UPI_ID);
        const pn = encodeURIComponent(UPI_NAME);
        const am = encodeURIComponent(amount);
        const tn = encodeURIComponent(note);
        const cu = "INR";
        return `upi://pay?pa=${pa}&pn=${pn}&am=${am}&tn=${tn}&cu=${cu}`;
    }

    // Open UPI / Google Pay (mobile only) - stable version
    function openUpiOnMobile(upiUrl) {
        const ua = navigator.userAgent || navigator.vendor || window.opera;
        const isAndroid = /Android/i.test(ua);
        const isIOS = /iPhone|iPad|iPod/i.test(ua);

        // Directly open UPI URL. GPay / PhonePe / Paytm will catch this.
        if (isAndroid || isIOS) {
            window.location.href = upiUrl;
            return;
        }

        // Non-mobile handled separately (desktop → show QR)
    }

    // --- Goal Tracker Logic ---
    const currentBlanketsSpan = document.getElementById("current-blankets");
    const goalBar = document.querySelector(".goal-bar");

    function updateGoalTracker() {
        if (!currentBlanketsSpan || !goalBar) return;

        currentBlanketsSpan.textContent = currentDonatedBlankets.toLocaleString();

        let percentage = (currentDonatedBlankets / GOAL_BLANKETS) * 100;
        percentage = Math.min(percentage, 100);

        goalBar.style.width = `${percentage}%`;
    }

    updateGoalTracker();

    // --- Image Slider Logic ---
    const sliderImagesSrc = [
        "https://media.istockphoto.com/id/476151350/photo/poor-children-sitting-in-winter-season.jpg?s=612x612&w=0&k=20&c=ZAiQrki3FLQNuDZ5MjpCGJ_Y3GjYeRI28gAg1ZiCspE=",
        "https://d1vdjc70h9nzd9.cloudfront.net/media/campaign/547000/547803/image/61a9f0789f1f9.jpeg",
        "https://media.istockphoto.com/id/1386022497/photo/poor-girl-warming-hands-using-fire-during-winter-season.jpg?s=612x612&w=0&k=20&c=Ne0JeQ8OajI3saM2jRqDNlPR1WVlDfISO76gLd2yVOI=",
        "https://www.aljazeera.com/wp-content/uploads/2023/01/AP23002159839888.jpg",
        "https://asf.org.in/wp-content/uploads/2022/12/dsc_6008_011316122445.webp",
        "https://sc0.blr1.digitaloceanspaces.com/large/778023-20c8e4b1-83fe-4bd1-9147-fd0fb59e6cdd.jpg",
        "https://islamic-relief.org/wp-content/uploads/2019/10/RS143926_3B0A9658.jpg",
        "https://www.globalgiving.org/pfil/22095/pict_original.jpg",
        "https://images.unsplash.com/photo-1607956744673-f75e67453620?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cG9vciUyMGtpZHN8ZW58MHx8MHx8fDA%3D",
        "https://images.csmonitor.com/csm/2022/01/0125%20afghanistan_poverty%20road.jpg?alias=standard_900x600"
    ];

    const sliderViewport = document.querySelector(".slider-viewport");
    if (sliderViewport && sliderImagesSrc.length > 0) {
        sliderImagesSrc.forEach((src, index) => {
            const img = document.createElement("img");
            img.src = src;
            img.alt = "Donation moment " + (index + 1);
            img.className = "slider-image" + (index === 0 ? " active" : "");
            sliderViewport.appendChild(img);
        });

        const sliderEls = sliderViewport.querySelectorAll(".slider-image");
        let currentSlide = 0;
        setInterval(() => {
            if (sliderEls.length === 0) return;
            sliderEls[currentSlide].classList.remove("active");
            currentSlide = (currentSlide + 1) % sliderEls.length;
            sliderEls[currentSlide].classList.add("active");
        }, 4500);
    }

    // --- Donate Modal Logic ---
    const donateBtn = document.getElementById("open-donate-modal");
    const modalBackdrop = document.getElementById("donate-modal");
    const modalClose = document.getElementById("close-modal");
    const modalQtyInput = document.getElementById("modal-quantity");
    const modalDecrease = document.getElementById("modal-decrease");
    const modalIncrease = document.getElementById("modal-increase");
    const modalTotalSpan = document.getElementById("modal-total");
    const modalPayBtn = document.getElementById("modal-pay-btn");

    function updateModalTotal() {
        if (!modalQtyInput || !modalTotalSpan) return;

        let qty = parseInt(modalQtyInput.value) || 1;
        
        // Ensure buttons reflect the correct boundaries
        if (modalDecrease) modalDecrease.disabled = (qty <= 1);
        if (modalIncrease) modalIncrease.disabled = (qty >= 100);

        const total = qty * BLANKET_PRICE;
        modalTotalSpan.textContent = `₹${total.toLocaleString()}`;
    }

    if (donateBtn && modalBackdrop && modalQtyInput && modalTotalSpan) {
        donateBtn.addEventListener("click", () => {
            modalBackdrop.classList.add("active");
            modalQtyInput.value = 1;
            updateModalTotal();
        });
    }

    if (modalClose && modalBackdrop) {
        modalClose.addEventListener("click", () => {
            modalBackdrop.classList.remove("active");
        });
    }

    if (modalBackdrop) {
        modalBackdrop.addEventListener("click", (e) => {
            if (e.target === modalBackdrop) {
                modalBackdrop.classList.remove("active");
            }
        });
    }

    if (modalDecrease && modalQtyInput) {
        modalDecrease.addEventListener("click", () => {
            modalQtyInput.value = Math.max(1, (parseInt(modalQtyInput.value) || 1) - 1);
            updateModalTotal();
        });
    }

    if (modalIncrease && modalQtyInput) {
        modalIncrease.addEventListener("click", () => {
            modalQtyInput.value = Math.min(100, (parseInt(modalQtyInput.value) || 1) + 1);
            updateModalTotal();
        });
    }

    // --- Input Validation ---
    if (modalQtyInput) {
        modalQtyInput.addEventListener("input", (e) => {
            let val = parseInt(e.target.value);
            if (isNaN(val) || val < 1) val = 1;
            if (val > 100) val = 100;
            e.target.value = val;
            updateModalTotal();
        });
    }

    // --- QR Modal Elements ---
    const showQrBtn = document.getElementById("show-qr");
    const qrModalBackdrop = document.getElementById("qr-modal");
    const closeQrModalBtn = document.getElementById("close-qr-modal");
    const upiQrImage = document.getElementById("upi-qr-image");

    // Pay Button Logic
    if (modalPayBtn && modalQtyInput && modalBackdrop) {
        modalPayBtn.addEventListener("click", () => {
            let qty = parseInt(modalQtyInput.value) || 1;
            if (qty < 1) qty = 1;
            if (qty > 100) qty = 100;

            const total = qty * BLANKET_PRICE;
            if (total <= 0) {
                alert("Please select at least 1 blanket.");
                return;
            }

            // Loading state ON
            modalPayBtn.disabled = true;
            modalPayBtn.innerHTML = "Opening payment app...";

            const note = `Blanket donation (${qty} blankets) for Warm Hearts`;
            const upiUrl = createUpiUrl(total, note);

            const ua = navigator.userAgent || navigator.vendor || window.opera;
            const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);

            if (isMobile) {
                // Mobile → open UPI (Google Pay / others)
                openUpiOnMobile(upiUrl);

                // Feedback - Updated to be less definitive about success
                setTimeout(() => {
                    alert(
                        "Redirecting to your UPI app! Please complete the payment of ₹" +
                        total.toLocaleString() +
                        ".\n\n" +
                        "If the payment fails (e.g., due to bank limits), please try again or use the static QR option on desktop."
                    );
                    modalBackdrop.classList.remove("active");
                }, 2000);
            } else {
                // Desktop → show QR fallback
                alert("UPI apps work only on mobile. Please scan this QR with your UPI app.");

                if (qrModalBackdrop && upiQrImage) {
                    upiQrImage.src = STATIC_QR_IMAGE_SRC;
                    qrModalBackdrop.classList.add("active");
                }
                
                modalBackdrop.classList.remove("active");
            }

            // Loading state OFF
            setTimeout(() => {
                modalPayBtn.disabled = false;
                modalPayBtn.innerHTML = "pay via upi";
            }, 3000);

            // Later you can update:
            // currentDonatedBlankets += qty;
            // updateGoalTracker();
        });
    }

    // --- QR Modal Logic ---
    if (showQrBtn && qrModalBackdrop && upiQrImage) {
        showQrBtn.addEventListener("click", () => {
            upiQrImage.src = STATIC_QR_IMAGE_SRC;
            qrModalBackdrop.classList.add("active");
        });
    }

    if (closeQrModalBtn && qrModalBackdrop) {
        closeQrModalBtn.addEventListener("click", () => {
            qrModalBackdrop.classList.remove("active");
        });
    }

    if (qrModalBackdrop) {
        qrModalBackdrop.addEventListener("click", (e) => {
            if (e.target === qrModalBackdrop) {
                qrModalBackdrop.classList.remove("active");
            }
        });
    }
});
