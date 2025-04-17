let items = [];

function addItem() {
    const name = document.getElementById("itemName").value;
    const price = parseFloat(document.getElementById("itemPrice").value);
    const qty = parseInt(document.getElementById("itemQty").value);

    if (!name || isNaN(price) || isNaN(qty) || qty <= 0) return alert("Please enter valid item details.");

    items.push({ name, price, qty });
    document.getElementById("itemName").value = "";
    document.getElementById("itemPrice").value = "";
    document.getElementById("itemQty").value = 1;
    document.getElementById("ding").play();
    renderItems();
}

function renderItems() {
    const tbody = document.querySelector("#itemTable tbody");
    tbody.innerHTML = "";
    let subtotal = 0;

    items.forEach((item, index) => {
        const total = item.price * item.qty;
        subtotal += total;
        tbody.innerHTML += `<tr>
  <td>${item.name}</td>
  <td>${item.qty}</td>
  <td>₹${item.price}</td>
  <td>₹${total.toFixed(2)}</td>
  <td><button onclick="removeItem(${index})">Delete</button></td>
</tr>`;
    });

    document.getElementById("subtotal").innerText = subtotal.toFixed(2);
    applyDiscount(subtotal);
}

function removeItem(index) {
    items.splice(index, 1);
    renderItems();
}

function applyDiscount(subtotal) {
    const discountInput = document.getElementById("discount").value.trim();
    let discountAmount = 0;

    if (discountInput.endsWith("%")) {
        const percent = parseFloat(discountInput);
        if (!isNaN(percent)) discountAmount = subtotal * (percent / 100);
    } else {
        const flat = parseFloat(discountInput);
        if (!isNaN(flat)) discountAmount = flat;
    }

    const final = Math.max(0, subtotal - discountAmount);
    document.getElementById("finalAmount").innerText = final.toFixed(2);
}

function calculateChange() {
    const finalAmount = parseFloat(document.getElementById("finalAmount").innerText);
    const moneyGiven = parseFloat(document.getElementById("moneyGiven").value);

    if (isNaN(moneyGiven) || moneyGiven < finalAmount) {
        return alert("Insufficient or invalid money given.");
    }

    let change = Math.round(moneyGiven - finalAmount);
    const output = document.getElementById("changeOutput");
    const denominations = [2000, 500, 200, 100, 50, 20, 10, 5, 2, 1];
    let result = `<h3>Change: ₹${change}</h3>`;

    denominations.forEach(denom => {
        const count = Math.floor(change / denom);
        if (count > 0) {
            result += `<div>${denom}: ${count}</div>`;
            change -= count * denom;
        }
    });

    output.innerHTML = result;
    document.getElementById("ding").play();
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}

async function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let y = 10;
    doc.text("Supermarket Invoice", 80, y);
    y += 10;
    doc.text("------------------------------", 10, y);
    y += 10;

    items.forEach((item, i) => {
        doc.text(`${item.name} x${item.qty} @ ₹${item.price} = ₹${(item.qty * item.price).toFixed(2)}`, 10, y);
        y += 10;
    });

    const subtotal = parseFloat(document.getElementById("subtotal").innerText);
    const final = parseFloat(document.getElementById("finalAmount").innerText);
    const discount = document.getElementById("discount").value || "0";

    y += 10;
    doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`, 10, y);
    y += 10;
    doc.text(`Discount: ${discount}`, 10, y);
    y += 10;
    doc.text(`Final Amount: ₹${final.toFixed(2)}`, 10, y);

    doc.save("invoice.pdf");
}