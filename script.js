const CORRECT_PIN = "1505";
const MAX_ACTIVE_HEARTS = 30;
const MAX_FALLING_FLOWERS = 18;
const MAX_LOGIN_FLOWERS = 40;

let currentPin = "";

/* ELEMENTS */

const loginScreen =
document.getElementById("login-screen");

const homeScreen =
document.getElementById("home-screen");

const loginCard =
document.querySelector(".login-card");

const pinDisplay =
document.getElementById("pin-display");

const numberButtons =
document.querySelectorAll(".num");

const deleteBtn =
document.getElementById("delete-btn");

const modalBackdrop =
document.getElementById('modal-backdrop');

/* PIN DISPLAY */

function updatePinDisplay(){

    let dots = "";

    for(let i = 0; i < 4; i++){

        if(i < currentPin.length){

            dots += "● ";
        }
        else{

            dots += "○ ";
        }
    }

    pinDisplay.innerHTML = dots;
}

/* OPEN HOME */

function unlock(){

    loginScreen.classList.add("hidden");

    homeScreen.classList.remove("hidden");
    homeScreen.classList.add('screen-fade-in');
    setTimeout(()=>{
        homeScreen.classList.remove('screen-fade-in');
    }, 540);
}

/* LOGIN FLOWER EXPLOSION */

function createLoginFlower() {
    const flowers = ["🌸", "🌺", "💮", "🌹", "💗", "💕"];
    const flower = document.createElement("div");

    flower.classList.add("login-flower");
    flower.innerHTML = flowers[Math.floor(Math.random() * flowers.length)];
    
    flower.style.left = Math.random() * 100 + 'vw';
    flower.style.top = Math.random() * 100 + 'vh';
    flower.style.fontSize = Math.random() * 40 + 30 + "px";

    document.body.appendChild(flower);

    setTimeout(() => {
        flower.remove();
    }, 1800);
}

function triggerLoginFlowerExplosion() {
    const thoiGianHieuUng = 800; // Thời gian hiệu ứng (ms)
    const hoaMoiKhungHinh = 2;   // Số lượng hoa tạo ra mỗi khung hình
    let thoiGianBatDau = null;
    let flowersCreated = 0;

    function vongLapHieuUng(thoiGianHienTai) {
        if (!thoiGianBatDau) {
            thoiGianBatDau = thoiGianHienTai;
        }

        const thoiGianDaTroiQua = thoiGianHienTai - thoiGianBatDau;

        if (thoiGianDaTroiQua < thoiGianHieuUng && flowersCreated < MAX_LOGIN_FLOWERS) {
            for (let i = 0; i < hoaMoiKhungHinh; i++) {
                createLoginFlower();
                flowersCreated += 1;
            }
            requestAnimationFrame(vongLapHieuUng);
        }
    }

    requestAnimationFrame(vongLapHieuUng);
    setTimeout(unlock, 1800); // Giữ nguyên tổng thời gian chuyển cảnh
}

/* INPUT NUMBER */

numberButtons.forEach(btn=>{

    btn.addEventListener("click",()=>{

        if(currentPin.length >= 4){
            return;
        }

        currentPin += btn.innerText;

        updatePinDisplay();

        if(currentPin.length === 4){

            setTimeout(()=>{

                if(currentPin === CORRECT_PIN){

                    triggerLoginFlowerExplosion();

                }else{

                    if(loginCard){
                        loginCard.classList.add('shake');
                        setTimeout(()=>loginCard.classList.remove('shake'),520);
                    }
                    alert("Sai mật khẩu ❤️");

                    currentPin = "";

                    updatePinDisplay();
                }

            },200);
        }
    });
});

/* DELETE */

deleteBtn.addEventListener("click",()=>{

    currentPin =
    currentPin.slice(0,-1);

    updatePinDisplay();
});

updatePinDisplay();

/* PAGE CONTROL */

let giftInterval;

function openPage(id){

    document
    .getElementById(id)
    .classList
    .remove("hidden");

    if(id === "letter"){

        startTyping();
    }

    if(id === "gift"){

        startBalloonEffect();
    }
}

function closePage(id){

    document
    .getElementById(id)
    .classList
    .add("hidden");

    if(id === "gift"){

        clearInterval(giftInterval);
    }
}

/* MUSIC PLAYER */

const YOUTUBE_API_KEY = "AIzaSyChRK2-zrpIMUtxpHjNxlhL9AQ1nSEkIfU"; // <-- PASTE YOUR NEW KEY HERE
const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3/search";

const audio =
document.getElementById("audio");

let songCards =
document.querySelectorAll(".song-card");

const musicSearchForm =
document.getElementById("music-search-form");

const musicSearchInput =
document.getElementById("music-search-input");

const musicSearchButton = musicSearchForm ? musicSearchForm.querySelector('button') : null;

const currentCover =
document.getElementById("current-cover");

const currentTitle =
document.getElementById("current-title");

const currentTime =
document.getElementById("current-time");

const durationTime =
document.getElementById("duration-time");

const progressFill =
document.getElementById("progress-fill");

const mainPlayBtn =
document.getElementById("mainPlayBtn");

const prevBtn =
document.getElementById("prevBtn");

const nextBtn =
document.getElementById("nextBtn");

let currentSongIndex = 0;

// --- YOUTUBE IFRAME PLAYER SETUP ---
let ytPlayer;
let ytPlayerReady = false;
let ytTimeInterval = null;
let activePlayerType = 'audio'; // Can be 'audio' or 'youtube'
let videoToPlayOnReady = null;

function onYouTubeIframeAPIReady() {
    ytPlayer = new YT.Player('youtube-player', {
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    ytPlayerReady = true;
    if (videoToPlayOnReady) {
        ytPlayer.loadVideoById(videoToPlayOnReady);
        videoToPlayOnReady = null;
    }
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        const nextIndex = (currentSongIndex + 1) % songCards.length;
        loadSong(nextIndex);
        playCurrentSong();
    }
    if (event.data === YT.PlayerState.PLAYING) {
        startYouTubeTimeUpdater();
        durationTime.innerHTML = formatTime(ytPlayer.getDuration());
    }
    if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
        stopYouTubeTimeUpdater();
    }
}

const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function resetSongCards(){

    songCards.forEach(card=>{

        card.classList.remove("active");

        card.classList.remove("playing");

        card
        .querySelector(".song-icon")
        .className = "fa-solid fa-play song-icon";
    });

    currentCover.classList.remove("spinning");
}

function formatTime(seconds){

    if(Number.isNaN(seconds)){
        return "0:00";
    }

    const minutes =
    Math.floor(seconds / 60);

    const remainingSeconds =
    Math.floor(seconds % 60)
    .toString()
    .padStart(2,"0");

    return `${minutes}:${remainingSeconds}`;
}

function loadSong(index){

    const card =
    songCards[index];

    // Stop any currently playing media from both players
    stopYouTubeTimeUpdater();
    audio.pause();
    if (ytPlayerReady) {
        ytPlayer.stopVideo();
    }

    currentSongIndex = index;

    resetSongCards();
    card.classList.add("active");

    currentCover.src =
    card.dataset.cover || "images/731147341_1538994267804714_5516651451943610122_n.jpg";

    currentCover.alt = `Bìa nhạc cho bài ${card.dataset.title}`;

    currentTitle.innerHTML =
    card.dataset.title;
    
    // Check if it's a YouTube song or a local file
    if (card.dataset.youtubeId) {
        activePlayerType = 'youtube';
        audio.src = ""; // Clear audio source
        currentTime.innerHTML = "0:00";
        durationTime.innerHTML = "0:00";
        progressFill.style.width = "0%";
        
        if (ytPlayerReady) {
            ytPlayer.loadVideoById(card.dataset.youtubeId);
        } else {
            videoToPlayOnReady = card.dataset.youtubeId;
        }
    } else { // It's a local audio file
        activePlayerType = 'audio';
        audio.src = card.dataset.src;
    }
}

function playCurrentSong(){

    const card =
    songCards[currentSongIndex];

    if (activePlayerType === 'youtube' && ytPlayerReady) {
        ytPlayer.playVideo();
    } else if (activePlayerType === 'audio') {
        audio.play();
    }

    card.classList.add("playing");

    currentCover.classList.add("spinning");

    card
    .querySelector(".song-icon")
    .className = "fa-solid fa-pause song-icon";

    mainPlayBtn.innerHTML =
    '<i class="fa-solid fa-pause"></i>';
}

function pauseCurrentSong(){

    const card =
    songCards[currentSongIndex];

    if (activePlayerType === 'youtube' && ytPlayerReady) {
        ytPlayer.pauseVideo();
    } else if (activePlayerType === 'audio') {
        audio.pause();
    }

    card.classList.remove("playing");

    currentCover.classList.remove("spinning");

    card
    .querySelector(".song-icon")
    .className = "fa-solid fa-play song-icon";

    mainPlayBtn.innerHTML =
    '<i class="fa-solid fa-play"></i>';
}

function toggleSong(index){

    if(currentSongIndex === index && !audio.paused){

        pauseCurrentSong();

        return;
    }

    loadSong(index);

    playCurrentSong();
}

const playlistEl = document.querySelector('#music .playlist');
if (playlistEl) {
    playlistEl.addEventListener('click', (e) => {
        const card = e.target.closest('.song-card');
        if (card && playlistEl.contains(card)) {
            // Re-query to get the current list of cards in the DOM
            const allCards = Array.from(document.querySelectorAll(".song-card"));
            const index = allCards.indexOf(card);
            if (index > -1) {
                toggleSong(index);
            }
        }
    });
}

mainPlayBtn.addEventListener("click",()=>{

    let isPaused;
    if (activePlayerType === 'youtube' && ytPlayerReady) {
        const state = ytPlayer.getPlayerState();
        isPaused = (state !== YT.PlayerState.PLAYING);
    } else {
        if (!audio.src) {
            loadSong(currentSongIndex);
        }
        isPaused = audio.paused;
    }

    if (isPaused) {
        playCurrentSong();
    } else {
        pauseCurrentSong();
    }
});

prevBtn.addEventListener("click",()=>{

    const nextIndex =
    (currentSongIndex - 1 + songCards.length) % songCards.length;

    loadSong(nextIndex);

    playCurrentSong();
});

nextBtn.addEventListener("click",()=>{

    const nextIndex =
    (currentSongIndex + 1) % songCards.length;

    loadSong(nextIndex);

    playCurrentSong();
});

audio.addEventListener("loadedmetadata",()=>{

    if (activePlayerType === 'audio') {
        durationTime.innerHTML =
        formatTime(audio.duration);
    }
});

audio.addEventListener("timeupdate",()=>{

    if (activePlayerType === 'audio') {
        currentTime.innerHTML =
        formatTime(audio.currentTime);

        if(audio.duration){

            progressFill.style.width =
            `${audio.currentTime / audio.duration * 100}%`;
        }
    }
});

audio.addEventListener("ended",()=>{

    if (activePlayerType === 'audio') {
        const nextIndex =
        (currentSongIndex + 1) % songCards.length;

        loadSong(nextIndex);

        playCurrentSong();
    }
});

loadSong(currentSongIndex);

/* --- YOUTUBE SEARCH & PLAY LOGIC --- */

function startYouTubeTimeUpdater() {
    stopYouTubeTimeUpdater();
    ytTimeInterval = setInterval(() => {
        if (ytPlayer && typeof ytPlayer.getCurrentTime === 'function') {
            const current = ytPlayer.getCurrentTime();
            const duration = ytPlayer.getDuration();
            currentTime.innerHTML = formatTime(current);
            if (duration > 0) {
                progressFill.style.width = `${(current / duration) * 100}%`;
            }
        }
    }, 500);
}

function stopYouTubeTimeUpdater() {
    clearInterval(ytTimeInterval);
}

async function searchYouTube(query) {
    const params = new URLSearchParams({
        part: 'snippet',
        q: query,
        key: YOUTUBE_API_KEY,
        type: 'video',
        maxResults: 10 // Lấy nhiều kết quả hơn
    });

    try {
        const response = await fetch(`${YOUTUBE_API_URL}?${params}`);
        if (!response.ok) {
            const errorData = await response.json();
            console.error("YouTube API Error:", errorData);
            throw new Error(`YouTube API error: ${errorData.error.message}`);
        }

        const data = await response.json();
        if (data.items && data.items.length > 0) {
            return data.items; // Trả về toàn bộ danh sách kết quả
        }
    } catch (error) {
        console.error("Failed to fetch from YouTube API:", error);
        alert("Lỗi khi tìm kiếm trên YouTube. Vui lòng kiểm tra API Key và kết nối mạng.");
    }
    return []; // Trả về mảng rỗng nếu có lỗi hoặc không có kết quả
}

function addSongToPlaylist({ videoId, title, coverUrl }) {
    const playlist = document.querySelector("#music .playlist");
    if (!playlist) return;

    const fallbackCover = "images/731147341_1538994267804714_5516651451943610122_n.jpg";
    const coverSrc = coverUrl || fallbackCover;

    const newCard = document.createElement("div");
    newCard.className = "song-card";
    newCard.dataset.cover = coverSrc;
    newCard.dataset.title = title;
    newCard.dataset.youtubeId = videoId;

    newCard.innerHTML = `
        <img src="${coverSrc}" alt="Cover for ${title}" onerror="this.src='${fallbackCover}'">
        <span>${title}</span>
        <i class="fa-solid fa-play song-icon"></i>
    `;

    playlist.appendChild(newCard);
    songCards = document.querySelectorAll(".song-card");
}

const searchResultsPopup = document.getElementById('search-results-popup');
const searchResultsBody = document.getElementById('search-results-body');
const searchResultsClose = document.getElementById('search-results-close');

function hideSearchResults() {
    if (!searchResultsPopup || searchResultsPopup.classList.contains('hidden')) return;

    if (modalBackdrop) {
        // Chỉ ẩn lớp nền nếu popup gợi ý cũng đang ẩn
        if (!hintPopup || hintPopup.classList.contains('hidden')) {
            modalBackdrop.classList.remove('show');
        }
    }
    searchResultsPopup.classList.remove('show');

    setTimeout(() => {
        searchResultsPopup.classList.add('hidden');
        if (modalBackdrop && (!hintPopup || hintPopup.classList.contains('hidden'))) {
            modalBackdrop.classList.add('hidden');
        }
    }, 420);
}

function displaySearchResults(results) {
    searchResultsBody.innerHTML = ''; // Xóa kết quả cũ

    if (results.length === 0) {
        searchResultsBody.innerHTML = '<p style="padding: 1rem; text-align: center;">Không tìm thấy kết quả nào.</p>';
    } else {
        const resultsList = document.createElement('div');
        resultsList.className = 'playlist'; // Tái sử dụng style của playlist

        results.forEach(item => {
            const videoId = item.id.videoId;
            const title = item.snippet.title;
            const thumbnails = item.snippet.thumbnails || {};
            const thumbnailUrl =
                (thumbnails.medium && thumbnails.medium.url) ||
                (thumbnails.default && thumbnails.default.url) ||
                "images/730948705_1334483012113826_7963450557296195364_n.jpg";
            const fallbackCover = "images/730948705_1334483012113826_7963450557296195364_n.jpg";

            const resultItem = document.createElement('div');
            resultItem.className = 'song-card'; // Tái sử dụng style của song-card
            resultItem.style.cursor = 'pointer';
            resultItem.innerHTML = `
                <img src="${thumbnailUrl}" alt="Cover for ${title}" onerror="this.src='${fallbackCover}'">
                <span>${title}</span>
                <i class="fa-solid fa-plus song-icon"></i>
            `;
            const addSongHandler = function() {
                addSongToPlaylist({ videoId, title, coverUrl: thumbnailUrl });

                // Cập nhật giao diện để báo hiệu bài hát đã được thêm
                const icon = this.querySelector('.song-icon');
                icon.className = 'fa-solid fa-check song-icon';
                this.style.cursor = 'default';
                this.style.opacity = '0.7';
                this.removeEventListener('click', addSongHandler);
            };
            resultItem.addEventListener('click', addSongHandler);
            resultsList.appendChild(resultItem);
        });
        searchResultsBody.appendChild(resultsList);
    }

    // Hiển thị popup
    if (modalBackdrop) {
        modalBackdrop.classList.remove('hidden');
        modalBackdrop.classList.add('show');
    }
    searchResultsPopup.classList.remove('hidden');
    void searchResultsPopup.offsetWidth; // force reflow
    searchResultsPopup.classList.add('show');
}

if (musicSearchForm) {
    musicSearchForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const query = musicSearchInput.value.trim();
        if (!query) return;
 
        // IMPORTANT: Replace the old key!
        if (YOUTUBE_API_KEY.startsWith("YOUR_") || YOUTUBE_API_KEY.includes("za-za448") || YOUTUBE_API_KEY.includes("qvKGJNM") || YOUTUBE_API_KEY.includes("R5foTk8") || YOUTUBE_API_KEY.includes("2eAo96A")) {
            alert("API Key đã bị lộ hoặc chưa được thay! Vui lòng tạo và sử dụng một YouTube API Key MỚI trong file script.js.");
            return;
        }
 
        // --- Start Loading State ---
        musicSearchInput.placeholder = "Đang tìm kiếm...";
        musicSearchInput.disabled = true;
        if (musicSearchButton) {
            musicSearchButton.disabled = true;
            musicSearchButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        }
 
        try {
            const results = await searchYouTube(query);
            if (results) {
                displaySearchResults(results);
                musicSearchInput.value = ""; // Xóa input sau khi tìm kiếm
            }
        } finally {
            // --- End Loading State ---
            musicSearchInput.placeholder = "Gõ tên bài hát để phát nhạc...";
            musicSearchInput.disabled = false;
            if (musicSearchButton) {
                musicSearchButton.disabled = false;
                musicSearchButton.innerHTML = '<i class="fa-solid fa-search"></i>';
            }
        }
    });
}

if (searchResultsClose) {
    searchResultsClose.addEventListener('click', (e) => {
        e.stopPropagation();
        hideSearchResults();
    });
}
if (searchResultsPopup) {
    searchResultsPopup.addEventListener('click', (e) => {
        // Ngăn việc đóng popup khi nhấn vào bên trong
        e.stopPropagation();
    });
}

/* LETTER */

const message = `
Gửi NiNi ❤️

Cảm ơn cậu đã xuất hiện
trong cuộc sống của tớ.

Có những ngày rất bình thường,
nhưng chỉ cần được nói chuyện với cậu
thì ngày đó trở nên đặc biệt hơn.

Tớ không biết tương lai sẽ thế nào.

Nhưng hiện tại,
tớ rất trân trọng cậu.

Chúc cậu luôn vui vẻ,
luôn hạnh phúc
và luôn mỉm cười thật nhiều.

❤️
`;

let typingStarted = false;

function startTyping(){

    if(typingStarted){
        return;
    }

    typingStarted = true;

    const typing =
    document.getElementById("typing");

    let i = 0;

    function write(){

        if(i < message.length){

            typing.innerHTML +=
            message.charAt(i);

            i++;

            setTimeout(write,35);
        }
    }

    write();
}

/* HEART EFFECT */

function createHeart(){

    if (document.querySelectorAll('.heart').length >= MAX_ACTIVE_HEARTS) {
        return;
    }

    const heart =
    document.createElement("div");

    heart.classList.add("heart");

    heart.innerHTML = "💕";

    heart.style.left =
    Math.random()*100 + "vw";

    heart.style.fontSize =
    Math.random()*20 + 15 + "px";

    heart.style.animationDuration =
    Math.random()*5 + 4 + "s";

    document.body.appendChild(heart);

    setTimeout(()=>{

        heart.remove();

    },9000);
}

setInterval(createHeart,600);

/* BALLOON EFFECT */

const balloonImages = [
     "images/730948705_1334483012113826_7963450557296195364_n.jpg", 
    "images/IMG_7520.JPG",
    "images/IMG_7522.JPG", 
    "images/IMG_7527.JPG", 
    "images/IMG_7530.JPG", 
    "images/IMG_7534.JPG", 
    "images/IMG_7536.JPG", 
    "images/IMG_7538.JPG", 
    "images/IMG_7542.JPG", 
    "images/IMG_7548.JPG", 
    "images/IMG_7555.JPG", 
    "images/IMG_7563.JPG", 
    "images/IMG_7591.JPG", 
    "images/IMG_7601.JPG"
    
];

let lastBalloonImageIndex = -1;

function createImageBalloon() {
    const giftWindow = document.querySelector("#gift .window");
    if (!giftWindow) return;

    const balloon = document.createElement("div");
    balloon.classList.add("balloon");

    const img = document.createElement("img");

    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * balloonImages.length);
    } while (balloonImages.length > 1 && randomIndex === lastBalloonImageIndex);
    lastBalloonImageIndex = randomIndex;

    img.src = balloonImages[randomIndex];
    balloon.appendChild(img);

    balloon.addEventListener('click', (event) => {
        event.stopPropagation();
        const rect = img.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 12; i++) {
            createBurstingFlower(centerX, centerY);
        }
        createLoveYouText(balloon);
    });

    balloon.style.left = Math.random() * 80 + 10 + "%";
    const duration = Math.random() * 8 + 8;
    balloon.style.animationDuration = duration + "s";
    balloon.style.setProperty('--sway', (Math.random() * 100 - 50) + 'px');

    giftWindow.appendChild(balloon);

    setTimeout(() => {
        balloon.remove();
    }, duration * 1000);
}

function createLoveYouText(balloon){
    const loveText = document.createElement('div');
    loveText.classList.add('balloon-love-text');
    loveText.textContent = 'love you';

    balloon.appendChild(loveText);

    setTimeout(()=>{
        loveText.remove();
    }, 1400);
}

function startBalloonEffect() {
    clearInterval(giftInterval);
    const existingBalloons = document.querySelectorAll("#gift .balloon");
    existingBalloons.forEach(b => b.remove());

    createImageBalloon();
    giftInterval = setInterval(createImageBalloon, 1800);
}

function createBurstingFlower(x, y) {
    const flowers = ["🌸", "🌺", "💮", "🌹", "💗", "💕"];
    const flower = document.createElement("div");

    flower.classList.add("bursting-flower");
    flower.innerHTML = flowers[Math.floor(Math.random() * flowers.length)];
    flower.style.fontSize = Math.random() * 20 + 15 + "px";

    flower.style.left = x + 'px';
    flower.style.top = y + 'px';

    const burstX = (Math.random() - 0.5) * 250;
    const burstY = (Math.random() - 0.5) * 250;

    flower.style.setProperty('--burst-x', `calc(-50% + ${burstX}px)`);
    flower.style.setProperty('--burst-y', `calc(-50% + ${burstY}px)`);

    document.body.appendChild(flower);

    setTimeout(() => {
        flower.remove();
    }, 1200);
}

/* IMAGE CLICK ZOOM */

const images =
document.querySelectorAll(".gallery-grid img");

images.forEach(img=>{

    img.addEventListener("click",()=>{

        const overlay =
        document.createElement("div");

        overlay.classList.add("image-overlay");

        const big =
        document.createElement("img");

        big.src = img.src;

        big.classList.add("zoomed-image");

        big.addEventListener("click",event=>{

            event.stopPropagation();
        });

        overlay.appendChild(big);

        const loveBtn = document.createElement('button');
        loveBtn.classList.add('overlay-love-btn');
        loveBtn.innerHTML = '❤️';
        loveBtn.setAttribute('aria-label','Thả tim');

        loveBtn.addEventListener('click',(event)=>{
            event.stopPropagation();
            createOverlayHeart(overlay, loveBtn);
        });

        overlay.appendChild(loveBtn);
        document.body.appendChild(overlay);

        const flowerInterval =
        setInterval(()=>{

            for(let i = 0; i < 4; i++){

                createFallingFlower(overlay);
            }

        },260);

        overlay.addEventListener("click",()=>{

            clearInterval(flowerInterval);

            overlay.remove();
        });
    });
});

function createFallingFlower(parent){

    if (parent.querySelectorAll('.falling-flower').length >= MAX_FALLING_FLOWERS) {
        return;
    }

    const flowers =
    ["🌸","🌺","💮","🌹","💗","💕"];

    const flower =
    document.createElement("div");

    flower.classList.add("falling-flower");

    flower.innerHTML =
    flowers[Math.floor(Math.random()*flowers.length)];

    flower.style.left =
    Math.random()*100 + "vw";

    flower.style.fontSize =
    Math.random()*22 + 16 + "px";

    flower.style.animationDuration =
    Math.random()*3 + 3 + "s";

    flower.style.animationDelay =
    Math.random()*0.4 + "s";

    flower.style.setProperty(
        "--drift",
        Math.random()*120 - 60 + "px"
    );

    parent.appendChild(flower);

    setTimeout(()=>{

        flower.remove();

    },6500);
}

function createOverlayHeart(parent, button){
    const heart = document.createElement('div');
    heart.classList.add('overlay-heart');
    heart.textContent = '💕';

    const btnRect = button.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();

    heart.style.left = (btnRect.left - parentRect.left + btnRect.width / 2) + 'px';
    heart.style.top = (btnRect.top - parentRect.top + btnRect.height / 2) + 'px';

    parent.appendChild(heart);

    setTimeout(()=>{
        heart.remove();
    }, 1000);
}

/* HINT POPUP BEHAVIOR (centered with jump animation) */
const hintBtn = document.getElementById('hint-btn');
const hintPopup = document.getElementById('hint-popup');
const hintClose = document.getElementById('hint-close');

function hideHint(){
    if(!hintPopup || hintPopup.classList.contains('hidden')) return;

    if(modalBackdrop){
        // Chỉ ẩn lớp nền nếu popup kết quả tìm kiếm cũng đang ẩn
        if (!searchResultsPopup || searchResultsPopup.classList.contains('hidden')) {
            modalBackdrop.classList.remove('show');
        }
    }
    hintPopup.classList.remove('show');
    // đợi animation chạy xong rồi mới ẩn hẳn
    setTimeout(()=>{
        hintPopup.classList.add('hidden');
        if(modalBackdrop){
            if (!searchResultsPopup || searchResultsPopup.classList.contains('hidden')) {
                modalBackdrop.classList.add('hidden');
            }
        }
    }, 420);
}

if(hintBtn && hintPopup){
    function showHint(){
        if(modalBackdrop){
            modalBackdrop.classList.remove('hidden');
            modalBackdrop.classList.add('show');
        }
        hintPopup.classList.remove('hidden');
        // force reflow so animation reliably plays when adding .show
        void hintPopup.offsetWidth;
        hintPopup.classList.add('show');
    }

    hintBtn.addEventListener('click',(e)=>{
        e.stopPropagation();
        if(hintPopup.classList.contains('hidden')){
            showHint();
        }else{
            hideHint();
        }
    });

    if(hintClose){
        hintClose.addEventListener('click',(e)=>{
            e.stopPropagation();
            hideHint();
        });
    }

    hintPopup.addEventListener('click', (e)=>{
        e.stopPropagation();
    });

    // Ensure popup initially hidden (in case)
    if(!hintPopup.classList.contains('hidden')){
        hintPopup.classList.add('hidden');
    }
}

// Logic chung để đóng các popup
function hideActiveModal() {
    hideHint();
    hideSearchResults();
}

document.addEventListener('click', hideActiveModal);

if(modalBackdrop){
    modalBackdrop.addEventListener('click', (e) => {
        e.stopPropagation();
        hideActiveModal();
    });
}

if(modalBackdrop && !modalBackdrop.classList.contains('hidden')){
    modalBackdrop.classList.add('hidden');
}