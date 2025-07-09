const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns with currency codes
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    // Set defaults
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = true;
    }

    select.appendChild(newOption);
  }

  // Update flag on currency change
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Update flag based on selected currency
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let img = element.parentElement.querySelector("img");
  img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
};

// Fetch and update exchange rate
const updateExchangeRate = async () => {
    const amount = document.querySelector(".amount input");
    let amtVal = amount.value;
  
    if (amtVal === "" || amtVal <= 0) {
      amtVal = 1;
      amount.value = "1";
    }
  
    const url = `https://open.er-api.com/v6/latest/${fromCurr.value}`;
    console.log("Fetching:", url);
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      if (!data || !data.rates || !data.rates[toCurr.value]) {
        throw new Error("Rate not available");
      }
  
      const rate = data.rates[toCurr.value];
      const finalAmount = (amtVal * rate).toFixed(2);
      msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    } catch (err) {
      msg.innerText = "Could not fetch exchange rate.";
      console.error("API Error:", err);
    }
  };
  
  

// Button click handler
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// Auto-update on page load
window.addEventListener("load", () => {
  updateExchangeRate();
});
