
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Correct path based on user info
const filePath = path.join(__dirname, 'client', 'src', 'data', 'r7.json');

console.log(`Reading file from ${filePath} using Regex Stream...`);

const allKeys = new Map(); // Key -> count
const duplicates = [];
const componentTypes = new Set();

const keyRegex = /"key"\s*:\s*"([^"]+)"/g;
const typeRegex = /"type"\s*:\s*"([^"]+)"/g;

const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity
});

let lineNum = 0;

rl.on('line', (line) => {
    lineNum++;

    // Check keys
    let match;
    while ((match = keyRegex.exec(line)) !== null) {
        const key = match[1];
        if (allKeys.has(key)) {
            allKeys.set(key, allKeys.get(key) + 1);
            // Only capture the first duplicate occurrence per Key to keep list clean-ish, 
            // or we can allow multiple.
            duplicates.push({ key, line: lineNum });
        } else {
            allKeys.set(key, 1);
        }
    }

    // Check types
    while ((match = typeRegex.exec(line)) !== null) {
        componentTypes.add(match[1]);
    }
});

rl.on('close', () => {
    console.log('--- Analysis Complete ---');
    console.log(`Total Keys found: ${allKeys.size}`);
    console.log(`Component Types found: ${Array.from(componentTypes).join(', ')}`);

    if (duplicates.length > 0) {
        console.log(`Found ${duplicates.length} duplicate usage instances!`);

        // Group by key to see which ones are repeated
        const dupSummary = {};
        duplicates.forEach(d => {
            if (!dupSummary[d.key]) dupSummary[d.key] = 0;
            dupSummary[d.key]++;
        });

        console.log("Duplicate Keys Summary (Key: Extra Count):");
        Object.entries(dupSummary).slice(0, 50).forEach(([k, v]) => {
            console.log(`"${k}": ${v} extra times`);
        });
        if (Object.keys(dupSummary).length > 50) console.log("... and more.");

    } else {
        console.log('No duplicate keys found.');
    }
});

rl.on('error', (err) => {
    console.error('Error reading file:', err);
});
