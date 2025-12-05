document.addEventListener("DOMContentLoaded", () => {
    // UPI Constants
    const BLANKET_PRICE = 101; // ₹ per blanket

    // --- UPDATED UPI DETAILS ---
    const UPI_ID = "9729504524@upi"; 
    const UPI_NAME = "Kindera";
    const FALLBACK_PHONE = "+917678459202";
    // ---------------------------

    // Goal Tracking Constants
    const GOAL_BLANKETS = 500;
    let currentDonatedBlankets = 2; 

    // Static QR (Fallback QR, assumes image exists)
    const STATIC_QR_IMAGE_SRC = "qr.png"; 
    
    // Timer variables
    let qrTimer;
    let countdownInterval;
    const TIMER_DURATION = 60; // 60 seconds

    // --- Dynamic QR Generation FIX ---
    function generateDynamicQrUrl(amount, note) {
        // Using a reliable public QR code generator (e.g., QRServer.com)
        const pa = encodeURIComponent(UPI_ID);
        const pn = encodeURIComponent(UPI_NAME);
        const am = encodeURIComponent(amount);
        const tn = encodeURIComponent(note);
        const cu = "INR";
        const upiDeeplink = `upi://pay?pa=${pa}&pn=${pn}&am=${am}&tn=${tn}&cu=${cu}`;
        
        const encodedDeeplink = encodeURIComponent(upiDeeplink);
        // Using 300x300 for better scan reliability
        const qrApiBase = "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=";
        
        return qrApiBase + encodedDeeplink;
    }

    // --- Goal Tracker Logic (Unchanged) ---
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

    // --- Slider Logic (Unchanged) ---
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

    // --- Modal Quantity & Total Logic (Unchanged) ---
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
        
        if (modalDecrease) modalDecrease.disabled = (qty <= 1);
        if (modalIncrease) modalIncrease.disabled = (qty >= 100);

        const total = qty * BLANKET_PRICE;
        modalTotalSpan.textContent = `₹${total.toLocaleString()}`;
    }

    // Modal open/close logic (Unchanged)
    if (donateBtn && modalBackdrop && modalQtyInput && modalTotalSpan) {
        donateBtn.addEventListener("click", () => {
            modalBackdrop.classList.add("active");
            modalQtyInput.value = 1;
            updateModalTotal();
        });
    }
    if (modalClose && modalBackdrop) {
        modalClose.addEventListener("click", () => modalBackdrop.classList.remove("active"));
    }
    if (modalBackdrop) {
        modalBackdrop.addEventListener("click", (e) => {
            if (e.target === modalBackdrop) modalBackdrop.classList.remove("active");
        });
    }

    // Quantity buttons/input logic (Unchanged)
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
    const qrNote = document.getElementById("qr-note");
    const qrTimerText = document.getElementById("qr-timer-text");
    const qrAmountText = document.getElementById("qr-amount-text"); 
    
    // Function to close the QR modal
    function closeQrModal() {
        if (qrTimer) clearTimeout(qrTimer); 
        if (countdownInterval) clearInterval(countdownInterval);
        qrModalBackdrop.classList.remove("active");
    }

    // Function to start the 60-second countdown
    function startCountdown() {
        if (countdownInterval) clearInterval(countdownInterval);
        let seconds = TIMER_DURATION;
        qrTimerText.innerHTML = `This code is valid for <strong>${seconds}</strong> seconds.`;

        countdownInterval = setInterval(() => {
            seconds--;
            if (seconds > 0) {
                qrTimerText.innerHTML = `This code is valid for <strong>${seconds}</strong> seconds.`;
            } else {
                clearInterval(countdownInterval);
                qrTimerText.innerHTML = "Code **EXPIRED**. Please close and try again.";
            }
        }, 1000);
    }

    // QR Modal close logic
    if (closeQrModalBtn) {
        closeQrModalBtn.addEventListener("click", closeQrModal);
    }
    if (qrModalBackdrop) {
        qrModalBackdrop.addEventListener("click", (e) => {
            if (e.target === qrModalBackdrop) {
                closeQrModal();
            }
        });
    }

    // --- Pay Button Logic (Generates Dynamic QR and Timer) ---
    if (modalPayBtn && modalQtyInput && modalBackdrop && qrModalBackdrop && upiQrImage) {
        modalPayBtn.addEventListener("click", () => {
            let qty = parseInt(modalQtyInput.value) || 1;
            if (qty < 1) qty = 1;
            if (qty > 100) qty = 100;

            const total = qty * BLANKET_PRICE;
            if (total <= 0) {
                alert("Please select at least 1 blanket.");
                return;
            }

            // 1. Loading state ON
            modalPayBtn.disabled = true;
            modalPayBtn.innerHTML = "Generating QR...";
            
            // Close donation modal
            modalBackdrop.classList.remove("active");

            // 2. Generate Dynamic QR URL and Fallback Note
            const note = `Blanket donation (${qty} blankets) for Warm Hearts - ₹${total}`;
            const dynamicQrUrl = generateDynamicQrUrl(total, note);
            
            // 🟢 UPDATED FALLBACK CONTENT WITH TROUBLESHOOTING 🟢
            const fallbackContent = `
                <p>⚠️ Troubleshooting: If your scan fails (e.g., Google Pay), try these steps:</p>
                <ul class="qr-troubleshoot-list">
                    <li>Try scanning with a different app (PhonePe/Paytm).</li>
                    <li>Ensure your screen brightness is high and there's no glare.</li>
                    <li>**Manual Pay:** Use the UPI details below.</li>
                </ul>
                <p>
                    Manual UPI ID: <strong>${UPI_ID}</strong><br>
                    Contact: <strong>${FALLBACK_PHONE}</strong> (Call/WhatsApp)
                </p>
            `;

            // 3. Show QR Modal with Dynamic Image & Note
            upiQrImage.src = dynamicQrUrl;
            qrAmountText.innerHTML = `Amount: ₹${total.toLocaleString()}`; // Set prominent amount
            qrNote.innerHTML = fallbackContent;
            qrModalBackdrop.classList.add("active");
            
            // 4. Set 60-second timer and start countdown
            startCountdown(); // Start the visual timer

            if (qrTimer) clearTimeout(qrTimer); // Clear previous timer
            qrTimer = setTimeout(() => {
                closeQrModal();
                alert("The payment QR code has expired. Please click 'Donate Now' again to generate a new QR.");
            }, TIMER_DURATION * 1000);

            // 5. Loading state OFF
            setTimeout(() => {
                modalPayBtn.disabled = false;
                modalPayBtn.innerHTML = "Generate QR & Pay";
            }, 1000); 
        });
    }

    // --- Static QR Button Logic ---
    if (showQrBtn && qrModalBackdrop && upiQrImage) {
        showQrBtn.addEventListener("click", () => {
             // Set static QR and clear any existing timers.
            upiQrImage.src = STATIC_QR_IMAGE_SRC;
            closeQrModal(); // Ensure timers are stopped before showing static
            qrModalBackdrop.classList.add("active");
            qrTimerText.innerHTML = "This is a generic QR code.";
            qrAmountText.innerHTML = ``; // Clear amount display

            qrNote.innerHTML = `
                ⚠️ IMPORTANT: This is a generic QR. You MUST manually enter the amount. 
                <br>Manual UPI ID: <strong>${UPI_ID}</strong> 
                <br>Contact: <strong>${FALLBACK_PHONE}</strong>
            `;
        });
    }
});
