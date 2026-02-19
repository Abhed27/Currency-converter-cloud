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

    // ⭐ IMPORTANT — YOUR BACKEND URL
    const response = await fetch(
      `http://localhost:3000/convert?from=${from}&to=${to}&amount=${amount}`
    );

    if (!response.ok) {
      throw new Error("Server error");
    }

    const data = await response.json();

    resultText.innerText = `${to} ${Number(data.result).toFixed(2)}`;

    addToHistory(from, to, amount, data.result);

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
