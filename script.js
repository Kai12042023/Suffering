const defaultText = "Hover over a contestant below to view their target and round score.";
let lockedPic = null;

function addTabFocus() {
  console.log("onload triggered: Initializing tabfocus for gallery images...");
  const previews = document.querySelectorAll(".preview");
  
  for (let i = 0; i < previews.length; i++) {
    previews[i].setAttribute("tabindex", "0");
  }
}

function upDate(previewPic) {
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

function toggleLock(previewPic) {
  if (lockedPic === previewPic) {
    lockedPic.classList.remove('selected-active');
    lockedPic = null;
    unDo();
  } else {
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

  lockedPic = tillImg;
  tillImg.classList.add('selected-active');
  upDate(tillImg);
}

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

  if (cleanName === "acorn") {
    responseElement.innerHTML = "🌰 <strong>SECRET UNLOCKED: ACORN FOUND!</strong><br><em>'The lost mascot of the Anakt Garden. Score Overloaded!'</em>";
    responseElement.classList.add('acorn-secret');

    imageDiv.style.backgroundImage = "url('https://64.media.tumblr.com/13f01bb4dd2d4a6f2bb406248da5049a/55fad39de770e269-80/s1280x1920/190895cae5f35b2a0fb1ee2b45e7e17cbdd129a0.gif')";
    imageDiv.innerHTML = "🌰 ACORN: 'Squeak... Transmission Hijacked!' <br><span style='font-size:0.85rem; color:#00f3ff;'>[Secret Guardian Detected]</span>";

    scoreFill.style.width = "100%";
    scoreNum.textContent = "100% (OVERLOAD)";
    scoreLabel.textContent = "🌰 SECRET REWARD LEVEL: MAXED OUT";
    return;
  }

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
