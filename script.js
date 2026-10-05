const defaultText = "Hover over a contestant below to view their target and round score.";
let lockedPic = null;

// Coursera Assignment onload function: dynamically sets tabIndex for keyboard navigation
function addTabFocus() {
  console.log("onload triggered: Initializing tabfocus for gallery images...");
  const previews = document.querySelectorAll(".preview");
  
  for (let i = 0; i < previews.length; i++) {
    previews[i].setAttribute("tabindex", "0");
  }
}

function upDate(previewPic) {
  // If a character is currently locked by click and user hovers over another, ignore hover
  if (lockedPic && lockedPic !== previewPic) return;

  console.log("Updating display for: ", previewPic.alt);

  const imageDiv = document.getElementById('image');
  const quote = previewPic.getAttribute('data-quote');
  const targetId = previewPic.getAttribute('data-target');
  const targetName = previewPic.getAttribute('data-target-name');
  const scoreVal = previewPic.getAttribute('data-score');
  const scoreText = previewPic.getAttribute('data-score-text');

  imageDiv.style.backgroundImage = `url('${previewPic.src}')`;
  imageDiv.innerHTML = `${quote} <br><span style="font-size:0.85rem; color:#ffd700;">[Target Aimed At: ${targetName}]</span>`;

  document.getElementById('score-fill').style.width = scoreVal + "%";
  document.getElementById('score-num').textContent = scoreVal + "%";
  document.getElementById('score-label').textContent = scoreText;

  const roundToggle = document.getElementById('round-toggle');
  if (previewPic.id === 'char-till') {
    roundToggle.style.display = "flex";
  } else {
    roundToggle.style.display = "none";
  }

  // Clear previous target highlights before setting new target highlight
  const allPreviews = document.querySelectorAll('.preview');
  allPreviews.forEach(img => img.classList.remove('target-active'));

  if (targetId) {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.classList.add('target-active');
    }
  }
}

function unDo() {
  // Do not reset if character selection is locked via click
  if (lockedPic) return;

  const imageDiv = document.getElementById('image');
  imageDiv.style.backgroundImage = "url('')";
  imageDiv.innerHTML = defaultText;

  document.getElementById('score-fill').style.width = "0%";
  document.getElementById('score-num').textContent = "0%";
  document.getElementById('score-label').textContent = "Performance Power Meter";
  document.getElementById('round-toggle').style.display = "none";

  const allPreviews = document.querySelectorAll('.preview');
  allPreviews.forEach(img => img.classList.remove('target-active'));
}

// Click Handler: Toggle selection locking so round buttons can be interacted with smoothly
function toggleLock(previewPic) {
  if (lockedPic === previewPic) {
    // Unlock if clicking the same image again
    lockedPic.classList.remove('selected-active');
    lockedPic = null;
    unDo();
  } else {
    // Lock new image
    if (lockedPic) {
      lockedPic.classList.remove('selected-active');
    }
    lockedPic = previewPic;
    previewPic.classList.add('selected-active');
    upDate(previewPic);
  }
}

function setTillRound(roundNumber) {
  const tillImg = document.getElementById('char-till');
  if (roundNumber === 6) {
    tillImg.setAttribute('data-score', '89');
    tillImg.setAttribute('data-score-text', 'Round 6 Victory: 89 pts (vs. Ivan: 70)');
    tillImg.setAttribute('data-target', 'char-ivan');
    tillImg.setAttribute('data-target-name', 'Ivan');
  } else if (roundNumber === 7) {
    tillImg.setAttribute('data-score', '47.2');
    tillImg.setAttribute('data-score-text', 'Round 7 Final: 47.2% (vs. Luka: 52.8%)');
    tillImg.setAttribute('data-target', 'char-luka');
    tillImg.setAttribute('data-target-name', 'Luka');
  }

  // Ensure lock state is refreshed when clicking round buttons
  lockedPic = tillImg;
  tillImg.classList.add('selected-active');
  upDate(tillImg);
}

// Interactive Input Query with Acorn Easter Egg
function checkFavorite(name) {
  const responseElement = document.getElementById('vote-response');
  const imageDiv = document.getElementById('image');
  const scoreFill = document.getElementById('score-fill');
  const scoreNum = document.getElementById('score-num');
  const scoreLabel = document.getElementById('score-label');
  const cleanName = name.trim().toLowerCase();

  if (cleanName === "") {
    responseElement.textContent = "Hover over or click a character to inspect relationships.";
    responseElement.classList.remove('acorn-secret');
    unDo();
    return;
  }

  // SECRET EASTER EGG: ACORN
  if (cleanName === "acorn") {
    responseElement.innerHTML = "🌰 <strong>SECRET UNLOCKED: ACORN FOUND!</strong><br><em>'The lost mascot of the Anakt Garden. Score Overloaded!'</em>";
    responseElement.classList.add('acorn-secret');

    // Display Acorn Custom Image
    imageDiv.style.backgroundImage = "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0l6qIUWYOrtXvGCOwhlaIhOqEgXV4CHb2FTE5Lws78jbJ71hnZSI6Y04&s=10')";
    imageDiv.innerHTML = "🌰 ACORN: 'Transmission Hijacked!' <br><span style='font-size:0.85rem; color:#00f3ff;'>[Secret Guardian Detected]</span>";

    // Max Overdrive Meter
    scoreFill.style.width = "100%";
    scoreNum.textContent = "100% (OVERLOAD)";
    scoreLabel.textContent = "🌰 SECRET REWARD LEVEL: MAXED OUT";
    return;
  }

  // Reset Secret mode if typing another character name
  responseElement.classList.remove('acorn-secret');

  const responses = {
    "mizi": "Mizi selected. Aimed at Sua (Round 1).",
    "sua": "Sua selected. Aimed at Mizi (Round 1).",
    "till": "Till selected. Multi-round vocalist (Round 6 vs. Ivan / Round 7 vs. Luka).",
    "ivan": "Ivan selected. Aimed at Till (Round 6).",
    "luka": "Luka selected. Aimed at Hyuna (Round 7 Champion).",
    "hyuna": "Hyuna selected. Aimed at Luka (Rebel Disruption)."
  };

  responseElement.textContent = responses[cleanName] || `Vocalist "${name}" logged in terminal.`;
}
