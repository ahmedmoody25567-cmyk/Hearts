const heart = document.getElementById("heart");
const stars = document.getElementById("stars");
const message = document.getElementById("message");
const replay = document.getElementById("replay");

let resizeTimer;

// Create background stars
function createStars() {
  stars.innerHTML = "";

  for (let i = 0; i < 100; i++) {
    const star = document.createElement("span");

    star.className = "star";
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.animationDelay = Math.random() * 3 + "s";

    stars.appendChild(star);
  }
}

// Mathematical equation describing a heart
function heartEquation(x, y) {
  return Math.pow(x * x + y * y - 1, 3)
    - x * x * y * y * y;
}

function createHeart() {
  heart.innerHTML = "";
  message.classList.remove("show");

  const width = heart.clientWidth;
  const height = heart.clientHeight;

  if (!width || !height) return;

  const step = width < 400 ? 0.065 : 0.045;
  const outline = [];
  const rows = new Map();

  // Find points inside the heart
  for (let y = -1.2; y <= 1.2; y += step) {
    for (let x = -1.35; x <= 1.35; x += step) {
      if (heartEquation(x, y) > 0) continue;

      const boundary =
        heartEquation(x + step, y) > 0 ||
        heartEquation(x - step, y) > 0 ||
        heartEquation(x, y + step) > 0 ||
        heartEquation(x, y - step) > 0;

      if (boundary) {
        outline.push({ x, y });
      } else {
        const row = Math.round(y / step);

        if (!rows.has(row)) {
          rows.set(row, []);
        }

        rows.get(row).push({ x, y });
      }
    }
  }

  // Draw the outline first
  outline.sort((a, b) =>
    Math.atan2(a.y, a.x) - Math.atan2(b.y, b.x)
  );

  // Fill the heart row by row
  const fill = [];

  [...rows.keys()]
    .sort((a, b) => a - b)
    .forEach((row) => {
      const points = rows.get(row).sort((a, b) => a.x - b.x);

      if (Math.abs(row) % 2 === 1) {
        points.reverse();
      }

      fill.push(...points);
    });

  const allPoints = [...outline, ...fill];
  const fragment = document.createDocumentFragment();

  allPoints.forEach((point, index) => {
    const word = document.createElement("span");

    word.className = "word";
    word.textContent = "I LOVE YOU";

    if (index < outline.length) {
      word.classList.add("outline");
    }

    word.style.left =
      (width / 2 + point.x * width / 3.1) + "px";

    word.style.top =
      (height / 2 - point.y * height / 2.8) + "px";

    word.style.animationDelay = (index * 0.0035) + "s";

    fragment.appendChild(word);
  });

  heart.appendChild(fragment);

  // Show the message after the drawing finishes
  const duration = allPoints.length * 3.5 + 1800;

  setTimeout(() => {
    message.classList.add("show");
  }, duration);
}

replay.addEventListener("click", createHeart);

createStars();
createHeart();

window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);

  resizeTimer = setTimeout(() => {
    createHeart();
  }, 250);
});
