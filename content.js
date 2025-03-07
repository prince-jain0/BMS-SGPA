async function fetchcredits() {
  const url = 'https://raw.githubusercontent.com/prince-jain0/bms-gpa-credits/main/credits.json';
  try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
  } catch (error) {
      console.error("Error fetching subject credits:", error);
      return {};
  }
}

async function instb() {
  const tables = document.querySelectorAll('table');
  const credits = await fetchcredits();
  tables.forEach(table => {
    const rows = table.querySelectorAll('tr');
    const cols = table.querySelectorAll('th.text-center.text-dark');
    if (cols.length > 4) {
      for (let i = 3; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        const tb = cells[6].querySelector('input')
        const courseCode = cells[0]?.innerText.trim();
        let creditValue = credits[courseCode] || 0;
        tb.value=creditValue;
      }
      return;
    }
    for (let i = 0; i < rows.length; i++) {
      if (i == 2) {
        const row = rows[i];
        const cell = document.createElement('td');
        const cred = document.createElement('th');
        cred.className = "text-center text-dark";
        cred.innerHTML = 'Credits';
        cred.style.width = '30px';
        cell.appendChild(cred);
        row.insertCell(6);
        row.insertBefore(cell, row.cells[6]);
        row.deleteCell(7);
      }
      if (i < 3) continue;
      const row = rows[i];
      console.log(row);
      const cell = document.createElement('td');
      const textbox = document.createElement('input');
      textbox.type = 'text';
      textbox.style.width = '30px';
      const courseCode = row.cells[0]?.innerText.trim();
      let creditValue = credits[courseCode] || 0;
      console.log(courseCode,creditValue);
      textbox.value = creditValue;
      cell.appendChild(textbox);
      row.insertCell(6);
      row.insertBefore(cell, row.cells[6]);
      row.deleteCell(7);
    }
  });
}
function fetchdata() {
  const data = [];
  let tcgpa = 0;
  let acgpa = 0;
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    const rows = table.getElementsByTagName('tr');
    for (let i = 3; i < rows.length; i++) {
      let rowData = [];
      const cells = rows[i].getElementsByTagName('td');
      const textboxValue = cells[5].innerText;
      const tb = parseInt(cells[6].querySelector('input').value);
      
      let k;
      if (textboxValue === 'O') {
        k = 10;
        tcgpa = tcgpa + tb;
      } else if (textboxValue === 'A+') {
        k = 9;
        tcgpa = tcgpa + tb;
      } else if (textboxValue === 'A') {
        k = 8;
        tcgpa = tcgpa + tb;
      } else if (textboxValue === 'B+') {
        k = 7;
        tcgpa = tcgpa + tb;
      } else if (textboxValue === 'B') {
        k = 6;
        tcgpa = tcgpa + tb;
      } else if (textboxValue === 'C') {
        k = 5;
        tcgpa = tcgpa + tb;
      } else if (textboxValue === 'P') {
        k = 4;
        tcgpa = tcgpa + tb;
      } else {
        k = 0;
      }
      acgpa = acgpa + k * tb;
      rowData.push(k);
      data.push(rowData);
    }
  });
  console.log(data);
  console.log(tcgpa);
  console.log(acgpa);
  console.log(acgpa / tcgpa);
  let x = (acgpa / tcgpa);
  let sgpa = x.toFixed(2);
  return sgpa;
}
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action == "start") {
    instb(message.data);
  } else if (message.action == "calculate") {
    const fetchedData = fetchdata();
    chrome.runtime.sendMessage({ action: "display_data", data: fetchedData });
  }
});
