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

const audio =
document.getElementById("audio");

const songCards =
document.querySelectorAll(".song-card");

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

    currentSongIndex = index;

    currentCover.src =
    card.dataset.cover;

    currentTitle.innerHTML =
    card.dataset.title;

    if(audio.src !== new URL(card.dataset.src, window.location.href).href){

        audio.src =
        card.dataset.src;
    }

    resetSongCards();

    card.classList.add("active");
}

function playCurrentSong(){

    const card =
    songCards[currentSongIndex];

    audio.play();

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

    audio.pause();

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

songCards.forEach((card,index)=>{

    card.addEventListener("click",()=>{

        toggleSong(index);
    });
});

mainPlayBtn.addEventListener("click",()=>{

    if(!audio.src){

        loadSong(currentSongIndex);
    }

    if(audio.paused){

        playCurrentSong();

    }else{

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

    durationTime.innerHTML =
    formatTime(audio.duration);
});

audio.addEventListener("timeupdate",()=>{

    currentTime.innerHTML =
    formatTime(audio.currentTime);

    if(audio.duration){

        progressFill.style.width =
        `${audio.currentTime / audio.duration * 100}%`;
    }
});

audio.addEventListener("ended",()=>{

    const nextIndex =
    (currentSongIndex + 1) % songCards.length;

    loadSong(nextIndex);

    playCurrentSong();
});

loadSong(currentSongIndex);

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

    function hideHint(){
        if(modalBackdrop){
            modalBackdrop.classList.remove('show');
        }
        hintPopup.classList.remove('show');
        // wait for animation to finish then hide
        setTimeout(()=>{
            hintPopup.classList.add('hidden');
            if(modalBackdrop){
                modalBackdrop.classList.add('hidden');
            }
        }, 420);
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

    document.addEventListener('click', ()=>{
        if(!hintPopup.classList.contains('hidden')){
            hideHint();
        }
    });

    if(modalBackdrop){
        modalBackdrop.addEventListener('click',(e)=>{
            e.stopPropagation();
            hideHint();
        });
    }

    // Ensure popup initially hidden (in case)
    if(!hintPopup.classList.contains('hidden')){
        hintPopup.classList.add('hidden');
    }
    if(modalBackdrop && !modalBackdrop.classList.contains('hidden')){
        modalBackdrop.classList.add('hidden');
    }
}