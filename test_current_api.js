const https = require('https');

const username = 'SURIYA0212';
const url = `https://leetcode-stats-api.herokuapp.com/${username}`;

console.log(`Fetching from: ${url}`);

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            console.log('Response Status:', res.statusCode);
            const parsed = JSON.parse(data);
            console.log('Data:', JSON.stringify(parsed, null, 2));
        } catch (e) {
            console.log('Error parsing JSON:', e.message);
            console.log('Raw Data:', data);
        }
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
});
