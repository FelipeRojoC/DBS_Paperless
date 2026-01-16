
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'client', 'src', 'data', 'r7.json');

console.log(`Fixing ${filePath}...`);

try {
    let data = fs.readFileSync(filePath, 'utf8');
    data = data.trim();

    // Check if already valid array
    if (data.startsWith('[') && data.endsWith(']')) {
        try {
            JSON.parse(data);
            console.log("File is already valid JSON.");
            return;
        } catch (e) {
            console.log("File has brackets but is invalid. Attempting repairs...");
            // Strip existing brackets to re-process? Or just process inside?
            // If it's huge and invalid, maybe safer to strip and rebuild.
            if (data.length > 2) {
                data = data.substring(1, data.length - 1).trim();
            }
        }
    }

    console.log("Converting concatenated JSON values to JSON Array...");

    // Improved Regex:
    // Capture closing brace/bracket: ([}\]])
    // Capture whitespace: (\s*)
    // Capture opening brace/bracket: ([{\[])
    // Replace with: $1,$2$3
    // This inserts a comma between any two JSON structures separated only by whitespace.
    // It ignores cases where a comma already exists (because ',' is not matched by \s).

    // We only execute `replace` once on the whole string.
    const fixedBody = data.replace(/([}\]])(\s*)([{\[])/g, '$1,$2$3');

    const fixedData = '[' + fixedBody + ']';

    console.log("Verifying fix...");
    try {
        // Test parsing a substring around the previous error point to be sure, 
        // but really we have to parse the whole thing to be safe.
        JSON.parse(fixedData);
        console.log("Fix verified! Writing to file...");
        fs.writeFileSync(filePath, fixedData, 'utf8');
        console.log("Successfully updated r7.json");
    } catch (e) {
        console.error("Fix FAILED verification. Not writing.");
        console.error("Error:", e.message);

        const match = /at position (\d+)/.exec(e.message);
        if (match) {
            const pos = parseInt(match[1]);
            // Show cleaner context
            const context = fixedData.substring(pos - 100, pos + 100);
            console.log("Error context (cleaned):");
            console.log(JSON.stringify(context));
        }
    }

} catch (err) {
    console.error("Error:", err.message);
}
