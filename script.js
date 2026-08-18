/* ============================
   ELEMENT SELECTORS
============================ */

const convertBtn = document.getElementById("convert-btn");
const amountInput = document.getElementById("amount");
const fromCurrency = document.getElementById("from");
const toCurrency = document.getElementById("to");
const resultText = document.getElementById("result");
const historyTable = document.querySelector("#history-table tbody");

const fromFlag = document.getElementById("from-flag");
const toFlag = document.getElementById("to-flag");

/* ============================
   🖱️ CUSTOM CURSOR
=================================*/
const cursorDot = document.querySelector('.cursor-dot');
const cursorGlow = document.querySelector('.cursor-glow');

window.addEventListener('mousemove', (e) => {
    cursorDot.style.left = `${e.clientX}px`;
    cursorDot.style.top = `${e.clientY}px`;

    // Add a slight delay to the glow for a smooth trailing effect
    cursorGlow.animate({
        left: `${e.clientX}px`,
        top: `${e.clientY}px`
    }, { duration: 500, fill: "forwards" });
});

window.addEventListener('mousedown', () => cursorGlow.classList.add('active'));
window.addEventListener('mouseup', () => cursorGlow.classList.remove('active'));

/* ============================
   🌌 VANILLA TILT 3D EFFECT
=================================*/
VanillaTilt.init(document.querySelectorAll(".container, .history-panel"), {
    max: 5,
    speed: 400,
    glare: true,
    "max-glare": 0.2,
});

/* ============================
   FLAG UPDATE (FAST + LOCAL)
============================ */

const flagMap = {
  USD: "us",
  INR: "in",
  EUR: "eu",
  GBP: "gb",
  AUD: "au",
  CAD: "ca",
  JPY: "jp",
  CNY: "cn"
};

function updateFlags() {
  const from = fromCurrency.value;
  const to = toCurrency.value;

  if (flagMap[from]) {
    fromFlag.src = `https://flagcdn.com/48x36/${flagMap[from]}.png`;
  }

  if (flagMap[to]) {
    toFlag.src = `https://flagcdn.com/48x36/${flagMap[to]}.png`;
  }
}

fromCurrency.addEventListener("change", updateFlags);
toCurrency.addEventListener("change", updateFlags);

/* ============================
   SWAP BUTTON CLICK
============================ */

const swapBtn = document.getElementById("swap-btn");

swapBtn.addEventListener("click", () => {
  const temp = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = temp;
  updateFlags();
});

/* ============================
   CONVERT BUTTON CLICK
============================ */

convertBtn.addEventListener("click", async () => {

  const amount = amountInput.value;
  const from = fromCurrency.value;
  const to = toCurrency.value;

  if (!amount || amount <= 0) {
    resultText.innerText = "Enter valid amount";
    return;
  }

  resultText.innerText = "Converting...";

  try {

    // 🌐 Fetch directly from public API
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);

    if (!response.ok) {
      throw new Error("Server error");
    }

    const data = await response.json();
    const rate = data.rates[to];
    const finalResult = Number(amount) * rate;

    // 🔢 Number Counting Animation
    let startValue = 0;
    const duration = 1000; // 1 second
    const startTime = performance.now();

    function updateCount(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Easing function (easeOutExpo)
        const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentValue = startValue + (finalResult - startValue) * easeOut;

        resultText.innerText = `${to} ${currentValue.toFixed(2)}`;

        if (progress < 1) {
            requestAnimationFrame(updateCount);
        } else {
            resultText.innerText = `${to} ${finalResult.toFixed(2)}`;
            addToHistory(from, to, amount, finalResult);
        }
    }
    
    requestAnimationFrame(updateCount);

  } catch (err) {
    console.log(err);
    resultText.innerText = "Server Error";
  }
});

/* ============================
   HISTORY TABLE UPDATE
============================ */

function addToHistory(from, to, amount, result) {

  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${from}</td>
    <td>${to}</td>
    <td>${amount}</td>
    <td>${Number(result).toFixed(2)}</td>
  `;

  historyTable.prepend(row);
}

/* ============================
   INITIAL FLAGS LOAD
============================ */

updateFlags();
