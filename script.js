const CORRECT_PIN = "0508";

let currentPin = "";

/* ELEMENTS */

const loginScreen =
document.getElementById("login-screen");

const homeScreen =
document.getElementById("home-screen");

const pinDisplay =
document.getElementById("pin-display");

const numberButtons =
document.querySelectorAll(".num");

const deleteBtn =
document.getElementById("delete-btn");

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
    const thoiGianHieuUng = 1000; // Thời gian hiệu ứng (ms)
    const hoaMoiKhungHinh = 7;   // Số lượng hoa tạo ra mỗi khung hình
    let thoiGianBatDau = null;

    function vongLapHieuUng(thoiGianHienTai) {
        if (!thoiGianBatDau) {
            thoiGianBatDau = thoiGianHienTai;
        }

        const thoiGianDaTroiQua = thoiGianHienTai - thoiGianBatDau;

        if (thoiGianDaTroiQua < thoiGianHieuUng) {
            for (let i = 0; i < hoaMoiKhungHinh; i++) {
                createLoginFlower();
            }
            // Yêu cầu trình duyệt chạy lại hàm này ở khung hình tiếp theo
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
Gửi Bé Đức ❤️

Cảm ơn em đã xuất hiện
trong cuộc sống của anh.

Có những ngày rất bình thường,
nhưng chỉ cần được nói chuyện với em
thì ngày đó trở nên đặc biệt hơn.

Anh không biết tương lai sẽ thế nào.

Nhưng hiện tại,
anh rất trân trọng em.

Chúc em luôn vui vẻ,
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

setInterval(createHeart,400);

/* BALLOON EFFECT */

const balloonImages = [
    "images/1.jpg",
    "images/Messenger_creation_349652983849917.jpeg",
    "images/Messenger_creation_587886085858394.jpeg",
    "images/Messenger_creation_794349074908446.jpeg",
    "images/Messenger_creation_823486696153897.jpeg",
    "images/Messenger_creation_884630373179561.jpeg",
    "images/Messenger_creation_1630210337379056.jpeg",
    "images/Messenger_creation_2098406523853251.jpeg",
    "images/Messenger_creation_D83CB99C-E3DE-44BD-BD25-6E8AA8619574.jpeg"
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

    balloon.addEventListener('click', () => {
        const rect = img.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 12; i++) {
            createBurstingFlower(centerX, centerY);
        }
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
