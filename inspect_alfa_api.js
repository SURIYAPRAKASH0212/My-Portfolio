const https = require('https');

const username = 'SURIYA0212';
const endpoints = [
    `https://alfa-leetcode-api.onrender.com/${username}`,
    `https://alfa-leetcode-api.onrender.com/${username}/solved`,
    `https://alfa-leetcode-api.onrender.com/userProfile/${username}`,
];

function fetch(url) {
    return new Promise((resolve) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try { resolve(JSON.parse(data)); } catch (e) { resolve({}); }
            });
        }).on('error', () => resolve({}));
    });
}

async function run() {
    for (const url of endpoints) {
        console.log(`\nChecking: ${url}`);
        const data = await fetch(url);
        const keys = Object.keys(data);
        console.log('Keys:', keys);
        // Look for totals
        for (const k of keys) {
            if (k.toLowerCase().includes('total') || k.toLowerCase().includes('count')) {
                console.log(`${k}:`, JSON.stringify(data[k]).substring(0, 50));
            }
        }
    }
}

run();
