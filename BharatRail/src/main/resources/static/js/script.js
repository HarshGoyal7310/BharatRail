/* =====================================================
   1. LANGUAGE DATA (Hindi & English)
===================================================== */
const translations = {
    hi: {
        title: "भारतरेल 🇮🇳",
        searchBtn: "कोच ढूँढें",
        placeholder: "ट्रेन नंबर या नाम डालें...",
        guideTitle: "हेल्प गाइड 📱",
        locationPrompt: "सटीक जानकारी के लिए लोकेशन परमिशन ज़रूरी है।",
        noTrain: "ट्रेन नहीं मिली!",
        enterTrain: "कृपया ट्रेन नंबर या नाम डालें"
    },
    en: {
        title: "BharatRail 🚂",
        searchBtn: "Find Coach",
        placeholder: "Enter Train No or Name...",
        guideTitle: "Help Guide 📱",
        locationPrompt: "Location permission is required for accurate info.",
        noTrain: "Train not found!",
        enterTrain: "Please enter train number or name"
    }
};

/* =====================================================
   2. PAGE LOAD – INITIAL SETUP
===================================================== */
document.addEventListener("DOMContentLoaded", () => {

    const savedLang = localStorage.getItem("selectedLanguage");

    if (!savedLang) {
        document.getElementById("welcomeModal").style.display = "flex";
    } else {
        switchLanguage(savedLang);
        document.getElementById("welcomeModal").style.display = "none";
        requestLocationPermission();
    }
//});

/* =====================================================
   3. LANGUAGE SELECTION FROM MODAL
===================================================== */
function selectInitialLang(lang) {

    // 1️ language set
    switchLanguage(lang);
    localStorage.setItem("selectedLanguage", lang);

    // 2 popup FORCE hide
    const modal = document.getElementById("welcomeModal");
    modal.style.display = "none";
    modal.style.visibility = "hidden";
    modal.style.opacity = "0";
    modal.style.pointerEvents = "none";

     // 🔓 BODY UNLOCK (MOST IMPORTANT)
        document.body.style.overflow = "auto";

    // 3️ location modal (optional)
    setTimeout(() => {
        const locModal = document.getElementById("locationModal");
        if (locModal) locModal.style.display = "flex";
    }, 300);

    // 4️ location permission ONLY if function exists
    if (typeof requestLocationPermission === "function") {
        requestLocationPermission();
    }
}










/* =====================================================
   4. SWITCH LANGUAGE FUNCTION
===================================================== */
function switchLanguage(lang) {
    document.getElementById("appTitle").innerText = translations[lang].title;
    document.querySelector(".btn-find").innerText = translations[lang].searchBtn;
    document.getElementById("trainInput").placeholder = translations[lang].placeholder;

    if (document.getElementById("guideHeader")) {
        document.getElementById("guideHeader").innerText = translations[lang].guideTitle;
    }

    if (document.getElementById("locationPrompt")) {
        document.getElementById("locationPrompt").innerText =
            translations[lang].locationPrompt;
    }
}

/* =====================================================
   5. LOCATION PERMISSION
===================================================== */
function requestLocationPermission() {
    if (!navigator.geolocation) {
        alert("Geolocation not supported");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (pos) => {
            console.log("Location Granted:", pos.coords.latitude, pos.coords.longitude);
        },
        (err) => {
            console.warn("Location Denied");
        },
        { enableHighAccuracy: true, timeout: 5000 }
    );
}

/* =====================================================
   6. TRAIN SEARCH FUNCTION
===================================================== */
function findTrain() {
    const query = document.getElementById("trainInput").value.trim();
    const lang = localStorage.getItem("selectedLanguage") || "hi";

    if (!query) {
        alert(translations[lang].enterTrain);
        return;
    }

    fetch(`/api/trains/suggest?query=${query}`)
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                displayTrainData(data[0]);
            } else if (data && data.trainNumber) {
                displayTrainData(data);
            } else {
                alert(translations[lang].noTrain);
            }
        })
        .catch(err => {
            console.error("Search Error:", err);
            alert("Server error");
        });
}

/* =====================================================
   7. DISPLAY TRAIN DATA
===================================================== */
function displayTrainData(data) {
    const resultCard = document.getElementById("resultCard");
    resultCard.style.display = "block";

    document.getElementById("trainName").innerText =
        data.trainName || data.name || "N/A";

    document.getElementById("coachPos").innerText =
        "Coach Position: " + (data.generalPosition || "N/A");

    if (document.getElementById("platformTip")) {
        document.getElementById("platformTip").innerText =
            "Tip: " + (data.platformTip || "Not Available");
    }

    drawTrainVisual(data.generalPosition || "");
}

/* =====================================================
   8. TRAIN VISUAL (GENERAL COACH HIGHLIGHT)
===================================================== */
function drawTrainVisual(position) {
    const container = document.getElementById("trainVisual");
    if (!container) return;

    container.innerHTML = "";

    // Engine
    const engine = document.createElement("div");
    engine.className = "coach engine";
    engine.innerText = "🚂";
    container.appendChild(engine);

    // Coaches
    for (let i = 1; i <= 12; i++) {
        const coach = document.createElement("div");
        coach.className = "coach";

        let isGeneral = false;
        if (position.includes("Front") && i <= 2) isGeneral = true;
        if (position.includes("Back") && i >= 11) isGeneral = true;

        if (isGeneral) {
            coach.classList.add("general");
            coach.innerText = "GEN";
        } else {
            coach.innerText = i;
        }

        container.appendChild(coach);
    }
}
});
