const billInput = prompt("Enter bill amount:");
const tipInput = prompt("Enter tip percentage:");
let subtotal = Number(billInput);
let tipPercentage = Number(tipInput);
let calculatedTip = subtotal * (tipPercentage / 100);

let totalAmount = subtotal + calculatedTip;

console.log(`Subtotal: $${subtotal}`);
console.log(`Tip Percentage: ${tipPercentage}%`);
console.log(`Calculated Tip: $${calculatedTip.toFixed(2)}`);
console.log(`Total Amount to Pay: $${totalAmount.toFixed(2)}`);