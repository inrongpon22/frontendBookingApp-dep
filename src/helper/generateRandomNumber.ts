export function generateUniqueRandomNumber() {
    let randomNumber;
    const generatedNumbers = new Set();

    do {
        randomNumber = Math.floor(10000 + Math.random() * 90000); // Generate a random 5-digit number
    } while (generatedNumbers.has(randomNumber)); // Check if the number has been generated before

    generatedNumbers.add(randomNumber); // Add the generated number to the set of generated numbers
    return randomNumber;
}