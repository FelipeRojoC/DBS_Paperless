
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'client', 'src', 'data', 'r7.json');

console.log(`Analyzing Types in ${filePath}...`);

try {
    const rawData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(rawData);

    const types = new Set();
    const signatureKeys = [];

    function traverse(components) {
        if (!components || !Array.isArray(components)) return;

        components.forEach(comp => {
            if (!comp) return;

            if (comp.type) types.add(comp.type);

            if (comp.type === 'signature' || (comp.key && typeof comp.key === 'string' && comp.key.toLowerCase().includes('firma'))) {
                signatureKeys.push({ key: comp.key, label: comp.label, type: comp.type });
            }

            // Recursion
            if (comp.components) traverse(comp.components);
            if (comp.columns && Array.isArray(comp.columns)) {
                comp.columns.forEach(col => traverse(col.components));
            }
            // Only traverse rows if it's a table
            if (comp.type === 'table' && comp.rows && Array.isArray(comp.rows)) {
                comp.rows.forEach(row => {
                    if (Array.isArray(row)) {
                        row.forEach(cell => traverse(cell.components));
                    }
                });
            }
            // Panels often have `components`
        });
    }

    traverse(Array.isArray(data) ? data : data.components);

    console.log("Unique Component Types:", Array.from(types));
    console.log("Potential Signatures Found:", signatureKeys.length);
    if (signatureKeys.length > 0) {
        console.log("Sample Signatures:", signatureKeys.slice(0, 10));
    }

} catch (err) {
    console.error("Error:", err.message);
}
