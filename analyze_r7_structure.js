
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'client', 'src', 'data', 'r7.json');

console.log(`Analyzing ${filePath} for Sidebar Structure...`);

try {
    const rawData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(rawData);

    console.log("Root Type:", Array.isArray(data) ? "Array" : typeof data);

    let components = [];
    if (Array.isArray(data)) {
        components = data;
    } else if (data.components) {
        components = data.components;
    }

    console.log(`Found ${components.length} top-level components.`);

    // We are looking for "Panels" that should be in the sidebar.
    // Usually these are type: 'panel' at the top level.

    console.log("Top-Level Components:");
    components.forEach((comp, index) => {
        console.log(`[${index}] Type: ${comp.type}, Key: ${comp.key}, Title: ${comp.title || comp.label || "No Title"}`);
        // If it's a panel, maybe peak inside to see if it has children or if it IS a step
        if (comp.type === 'panel') {
            console.log(`    -> Components count: ${comp.components ? comp.components.length : 0}`);
        }
    });

} catch (err) {
    console.error("Error:", err.message);
}
