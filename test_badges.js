const fs = require('fs');
const username = 'SURIYA0212';
const url = `https://alfa-leetcode-api.onrender.com/${username}/badges`;

console.log(`Fetching badges from: ${url}`);

async function fetchBadges() {
    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        console.log('Badges Data received');
        fs.writeFileSync('badges_output.json', JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Error fetching badges:', err);
        fs.writeFileSync('badges_output.json', JSON.stringify({ error: err.message }, null, 2));
    }
}

fetchBadges();