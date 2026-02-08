function computeBudget() {
  const salary = Number(document.getElementById("salary").value);
  const expenses = document.querySelectorAll(".expense");
  const nextSalaryDate = new Date(document.getElementById("nextSalary").value);
  const today = new Date();

  let totalExpenses = 0;
  expenses.forEach(exp => totalExpenses += Number(exp.value || 0));

  const remainingSalary = salary - totalExpenses;
  const daysLeft = Math.ceil((nextSalaryDate - today) / (1000 * 60 * 60 * 24));
  const dailyBudget = daysLeft > 0 ? (remainingSalary / daysLeft).toFixed(2) : 0;

  document.getElementById("totalExpenses").textContent = totalExpenses;
  document.getElementById("remaining").textContent = remainingSalary;
  document.getElementById("dailyBudget").textContent = dailyBudget;
}

function saveArchive() {
  const salary = Number(document.getElementById("salary").value);
  const expenses = document.querySelectorAll(".expense");

  const labels = [
    "Field Work","Boarding House","Water Bill","Electric Bill",
    "Savings","Ipon Challenge","Wifi","Home Credit","Groceries","Additional Expense"
  ];

  let expenseData = [];
  let totalExpenses = 0;

  expenses.forEach((exp, i) => {
    const value = Number(exp.value || 0);
    totalExpenses += value;
    expenseData.push({ label: labels[i], value });
  });

  const remainingSalary = salary - totalExpenses;

  const nextSalaryDate = new Date(document.getElementById("nextSalary").value);
  const today = new Date();
  const daysLeft = Math.ceil((nextSalaryDate - today) / (1000 * 60 * 60 * 24));
  const dailyBudget = daysLeft > 0 ? (remainingSalary / daysLeft).toFixed(2) : 0;

  localStorage.setItem("archivedBudget", JSON.stringify({
    date: new Date().toLocaleDateString(),
    salary,
    expenses: expenseData,
    totalExpenses,
    remainingSalary,
    dailyBudget
  }));

  displayArchive();
}

function displayArchive() {
  const data = localStorage.getItem("archivedBudget");
  if (!data) return;

  const a = JSON.parse(data);
  const box = document.getElementById("savedInfo");

  let expenseHTML = "";
  a.expenses.forEach(e => {
    expenseHTML += `<div class="row"><span>${e.label}</span><span>₱${e.value}</span></div>`;
  });

  box.innerHTML = `
    <div class="archive-header">
      <div class="archive-title">
        <span class="pin">📌</span>
        <strong>Archived Plan</strong>
      </div>
      <button class="close-btn" onclick="closeArchive()">✕</button>
    </div>

    <div class="row"><span>Date</span><span>${a.date}</span></div>
    <div class="row"><span>Salary</span><span>₱${a.salary}</span></div>

    <hr>

    ${expenseHTML}

    <hr>

    <div class="row total"><span>Total Expenses</span><span>₱${a.totalExpenses}</span></div>
    <div class="row total"><span>Remaining Salary</span><span>₱${a.remainingSalary}</span></div>
    <div class="row total"><span>Daily Budget</span><span>₱${a.dailyBudget}</span></div>
  `;

  box.style.display = "block";
}

function closeArchive() {
  document.getElementById("savedInfo").style.display = "none";
}

function openArchive() {
  if (!localStorage.getItem("archivedBudget")) {
    alert("No archived data yet.");
    return;
  }
  displayArchive();
}

window.onload = displayArchive;
