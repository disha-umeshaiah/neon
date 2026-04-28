function scanForPrice() {
  // Regex to find currency amounts like £25.00 or $25.00
  const priceRegex = /[£$](\d+\.\d{2})/;
  const match = document.body.innerText.match(priceRegex);

  if (match) {
    const price = parseFloat(match[1]);
    chrome.runtime.sendMessage({ type: "CHECK_BUDGET", price: price });
  }
}

// Only runs on checkout or basket pages to avoid spamming notifications
if (window.location.href.includes("checkout") || window.location.href.includes("cart") || window.location.href.includes("basket")) {
  setTimeout(scanForPrice, 2000); // Wait 2 seconds for page to load
}