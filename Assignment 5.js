function rectangleArea(length = 5, width = 4) {
    return length * width;
}

console.log(
    `Standard Function Area (Default 5x4): ${rectangleArea()}`
);

const calculateArea = (length = 5, width = 4) => length * width;

console.log(
    `Arrow Function Area (Custom 10x3): ${calculateArea(10, 3)}`
);

try {
    if (true) {
        let blockVar = 100;
    }

    console.log(blockVar);

} catch (error) {
    console.log(`Scope Test Error: ${error}`);
}
