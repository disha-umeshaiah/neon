document.addEventListener('DOMContentLoaded', () => {
  const elements = {
    amount: document.getElementById('amount'),
    desc: document.getElementById('desc'),
    budget: document.getElementById('dailyBudget'),
    saveBtn: document.getElementById('saveBtn'),
    total: document.getElementById('total'),
    exportBtn: document.getElementById('exportBtn'),
    clearBtn: document.getElementById('clearBtn')
  };

  const render = () => {
    chrome.storage.local.get(['expenses', 'dailyBudget'], (data) => {
      const expenses = data.expenses || [];
      const today = new Date().toLocaleDateString();
      const sum = expenses.filter(e => e.date === today).reduce((a, b) => a + b.amount, 0);
      elements.total.textContent = `£${sum.toFixed(2)}`;
      if (data.dailyBudget) elements.budget.value = data.dailyBudget;
    });
  };

  elements.saveBtn.addEventListener('click', () => {
    const amount = parseFloat(elements.amount.value);
    const desc = elements.desc.value;
    if (amount && desc) {
      chrome.storage.local.get(['expenses'], (data) => {
        const expenses = data.expenses || [];
        expenses.push({ amount, desc, date: new Date().toLocaleDateString() });
        chrome.storage.local.set({ expenses }, () => {
          render();
          elements.amount.value = ''; elements.desc.value = '';
        });
      });
    }
  });

  elements.budget.addEventListener('change', () => {
    chrome.storage.local.set({ dailyBudget: parseFloat(elements.budget.value) });
  });

  elements.exportBtn.addEventListener('click', () => {
    chrome.storage.local.get(['expenses'], (data) => {
      const csv = "Date,Desc,Amount\n" + (data.expenses || []).map(e => `${e.date},${e.desc},${e.amount}`).join("\n");
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'finance.csv'; a.click();
    });
  });

  elements.clearBtn.addEventListener('click', () => {
    if(confirm("Delete all data?")) chrome.storage.local.set({ expenses: [] }, render);
  });

  render();
});