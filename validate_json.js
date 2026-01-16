
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'client', 'src', 'data', 'r7.json');

console.log(`Validating ${filePath}...`);

try {
    const data = fs.readFileSync(filePath, 'utf8');
    try {
        JSON.parse(data);
        console.log("JSON is valid.");
    } catch (e) {
        console.error("JSON Parse Error:", e.message);
        // Try to extract line number from error message if possible, or just look at the weird position
        // "Unexpected token ... at position X"
        const match = /at position (\d+)/.exec(e.message);
        if (match) {
            const pos = parseInt(match[1]);
            const start = Math.max(0, pos - 100);
            const end = Math.min(data.length, pos + 100);
            console.log("Context around error:");
            console.log(data.substring(start, end));
            console.log("-".repeat(100));
            console.log("Cursor at position " + (pos - start));

            // Also try to calculate line number manually
            const lines = data.substring(0, pos).split('\n');
            console.log(`Approximate Line: ${lines.length}`);
            console.log(`Column: ${lines[lines.length - 1].length + 1}`);
        }
    }
} catch (err) {
    console.error("File Read Error:", err.message);
}
