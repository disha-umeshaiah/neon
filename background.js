chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "CHECK_BUDGET") {
    chrome.storage.local.get(['expenses', 'dailyBudget'], (data) => {
      const budget = data.dailyBudget || 0;
      if (budget === 0) return;

      const today = new Date().toLocaleDateString();
      const spentSoFar = (data.expenses || [])
        .filter(e => e.date === today)
        .reduce((a, b) => a + b.amount, 0);

      const potentialTotal = spentSoFar + message.price;

      if (potentialTotal > budget) {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icon.png',
          title: '🚨 BUDGET BREACH',
          message: `Warning! This £${message.price} purchase puts you over your £${budget} limit!`,
          priority: 2
        });
      }
    });
  }
});