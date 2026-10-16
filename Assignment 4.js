
console.log("-- Multiplication Table of 5 --");

for (let i = 1; i <= 5; i++) {
    console.log(`5 x ${i} = ${5 * i}`);
}

console.log("-- First number > 10 divisible by 6 --");

let num = 11;

while (true) {
    if (num > 10 && num % 6 === 0) {
        console.log(`Found: ${num}`);
        break;
    }
    num++;
}

console.log("-- do...while loop with continue --");

let n = 0;

do {
    n++;

    if (n === 3) {
        continue;
    }

    console.log(n);

} while (n < 5);
