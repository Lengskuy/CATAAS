let currentCat = 0;
const totalCats = 10;
let likedCats = [];
let likedCount = 0;
let dislikedCount = 0;

const card = document.getElementById("catCard");
const catImg = document.getElementById("catImg");

function updateProgress() {
  const percent = (currentCat / totalCats) * 100;
  document.getElementById("progressBar").style.width = percent + "%";
  document.getElementById(
    "progressText"
  ).textContent = `${currentCat} / ${totalCats}`;
}

function loadNextCat() {
  const newUrl =
    "https://cataas.com/cat?type=square&timestamp=" +
    new Date().getTime();
  catImg.src = newUrl;
  return newUrl;
}

function showSummary() {
  card.style.display = "none";
  document.querySelector(".buttons").style.display = "none";
  document.querySelector(".progress-wrapper").style.display = "none";
  document.getElementById("progressText").style.display = "none";
  document.querySelector(".instructions").style.display = "none";

  const summary = document.getElementById("summary");
  let html = `<h3>🎉 Done! Here's your summary</h3>`;
  html += `<p>🐱 Liked: ${likedCount} | 😿 Disliked: ${dislikedCount}</p>`;

  if (likedCats.length > 0) {
    html += `<h4>Your liked cats 🐱:</h4><div class="liked-cats">`;
    likedCats.forEach(
      (url) => (html += `<img src="${url}" alt="Liked Cat"/>`)
    );
    html += `</div>`;
  } else {
    html += `<p>You didn't like any cats 😿</p>`;
  }

  summary.innerHTML = html;
  summary.style.display = "block";
}

function reactCat(type) {
  if (currentCat >= totalCats) return;
  const emoji = document.getElementById("emoji");
  const currentImg = catImg.src;

  if (type === "like") {
    likedCount++;
    likedCats.push(currentImg);
    emoji.textContent = "😺";
  } else {
    dislikedCount++;
    emoji.textContent = "😿";
  }

  emoji.classList.add("show");

  emoji.addEventListener(
    "transitionend",
    () => {
      currentCat++;
      updateProgress();

      if (currentCat < totalCats) {
        loadNextCat();
      } else {
        showSummary();
      }
      emoji.classList.remove("show");
    },
    { once: true }
  );
}

// --- Swipe functionality ---
let startX,
  currentX,
  isDragging = false;

function startDrag(x) {
  startX = x;
  isDragging = true;
  card.style.transition = "none";
}

function moveDrag(x) {
  if (!isDragging) return;
  currentX = x - startX;
  const rotate = Math.max(Math.min(currentX / 10, 20), -20); // clamp rotation ±20deg
  card.style.transform = `translateX(${currentX}px) rotate(${rotate}deg)`;
}

function endDrag() {
  if (!isDragging) return;
  isDragging = false;
  card.style.transition = "transform 0.3s ease";

  if (currentX > 100) {
    // Swiped right
    card.style.transform = "translateX(500px) rotate(20deg)";
    setTimeout(() => {
      reactCat("like");
      resetCard();
    }, 300);
  } else if (currentX < -100) {
    // Swiped left
    card.style.transform = "translateX(-500px) rotate(-20deg)";
    setTimeout(() => {
      reactCat("dislike");
      resetCard();
    }, 300);
  } else {
    // Snap back
    card.style.transform = "translateX(0) rotate(0)";
  }
}

function resetCard() {
  card.style.transition = "none";
  card.style.transform = "translateX(0) rotate(0)";
}

// Desktop
card.addEventListener("mousedown", (e) => startDrag(e.clientX));
document.addEventListener("mousemove", (e) => moveDrag(e.clientX));
document.addEventListener("mouseup", endDrag);

// Mobile
card.addEventListener("touchstart", (e) =>
  startDrag(e.touches[0].clientX)
);
card.addEventListener("touchmove", (e) => moveDrag(e.touches[0].clientX));
card.addEventListener("touchend", endDrag);