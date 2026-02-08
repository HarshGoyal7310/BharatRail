// --- 1. पेज लोड और इनिशियल सेटअप ---
window.onload = () => {
//    let savedLang = localStorage.getItem("selectedLanguage") || "hi";
//    switchLanguage(savedLang);

    // अगर पहली बार आए हैं तो पॉपअप दिखाएं (चेक लोकल स्टोरेज)
//    if(!localStorage.getItem("selectedLanguage")) {
        document.getElementById("welcomeModal").style.display = "flex";
//    }
//    else {
//        document.getElementById("welcomeModal").style.display = "none";
//
//    }


};

// --- 2. पॉपअप से भाषा और लोकेशन चुनना ---
function selectInitialLang(lang) {
    console.log("भाषा चुनी गई: " + lang);
    switchLanguage(lang); // भाषा बदलो

//    // पॉपअप को गायब करो
    document.getElementById("welcomeModal").style.display = "none";

    // ब्राउज़र से लोकेशन मांगो (Allow/Deny)
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
            alert("Location Access Granted");
                            console.log(position.coords.latitude, position.coords.longitude);

                // यहाँ आप यूजर के पास का स्टेशन फेच करने का लॉजिक डाल सकते हैं
            },
            (error) => {
               if (error.code === error.PERMISSION_DENIED) {
                alert("बिना लोकेशन के भीड़ की सटीक जानकारी नहीं मिल पाएगी।");
            }
            },
             { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }

        );
    }else{
    alert("आपके ब्राउज़र में Geolocation सपोर्ट नहीं है।");
    }
}

// --- 3. भाषा बदलने का लॉजिक ---
const translations = {
    hi: {
        title: "भारतरेल 🇮🇳",
        searchBtn: "कोच ढूँढें",
        placeholder: "ट्रेन नंबर या नाम डालें...",
        guideTitle: "हेल्प गाइड 📱",
        rushTitle: "भीड़ की स्थिति"
    },
    en: {
        title: "BharatRail 🚂",
        searchBtn: "Find Coach",
        placeholder: "Enter Train No or Name...",
        guideTitle: "Help Guide 📱",
        rushTitle: "Rush Status"
    }
};

function switchLanguage(lang) {
    document.getElementById("appTitle").innerText = translations[lang].title;
    document.querySelector(".btn-find").innerText = translations[lang].searchBtn;
    document.getElementById("trainInput").placeholder = translations[lang].placeholder;

    if (document.getElementById("guideHeader")) {
        document.getElementById("guideHeader").innerText = translations[lang].guideTitle;
    }
    localStorage.setItem("selectedLanguage", lang);
}

// --- 4. सर्च फंक्शन (Name और Number दोनों के लिए) ---
function findTrain() {
    let query = document.getElementById("trainInput").value;
    if (!query) {
        alert("कृपया ट्रेन नंबर या नाम डालें");
        return;
    }

    // suggest API का उपयोग जो नाम और नंबर दोनों हैंडल करता है
    fetch(`/api/trains/suggest?query=${query}`)
        .then(res => res.json())
        .then(data => {
            if (data && data.length > 0) {
                // अगर एरे आया है तो पहला रिजल्ट दिखाओ
                displayTrainData(data[0]);
            } else if (data && data.trainNumber) {
                // अगर सीधा ऑब्जेक्ट आया है
                displayTrainData(data);
            } else {
                alert("ट्रेन नहीं मिली!");
            }
        })
        .catch(err => {
            console.error("Search Error:", err);
            alert("सर्वर से संपर्क नहीं हो पाया।");
        });

//}
// --- 5. डेटा डिस्प्ले और विजुअल लेआउट ---
function displayTrainData(data) {
    console.log("Displaying Data:", data);
    let resultCard = document.getElementById("resultCard");
    resultCard.style.display = "block";

    // नाम और कोच मैपिंग
    document.getElementById("trainName").innerText = data.trainName || data.name || "N/A";
    document.getElementById("coachPos").innerText = "कोच पोजीशन: " + (data.generalPosition || "N/A");

    if (document.getElementById("platformTip")) {
        document.getElementById("platformTip").innerText = "टिप: " + (data.platformTip || "उपलब्ध नहीं");
    }

    // विजुअल मैप ड्रॉ करना
    drawTrainVisual(data.generalPosition || "");
}

function drawTrainVisual(pos) {
    const container = document.getElementById("trainVisual");
    if (!container) return;
    container.innerHTML = "";

    // इंजन
    let engine = document.createElement("div");
    engine.className = "coach engine";
    engine.innerText = "🚂";
    container.appendChild(engine);

    // 12 डिब्बे
    for (let i = 1; i <= 12; i++) {
        let coach = document.createElement("div");
        coach.className = "coach";
        let isGeneral = false;

        if (pos.includes("Front") && i <= 2) isGeneral = true;
        if (pos.includes("Back") && i >= 11) isGeneral = true;

        if (isGeneral) {
            coach.classList.add("general");
            coach.innerText = "GEN";
        } else {
            coach.innerText = i;
        }
        container.appendChild(coach);
    }
}
