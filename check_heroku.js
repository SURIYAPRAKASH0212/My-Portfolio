const https = require('https');

const username = 'SURIYA0212';
const url = `https://leetcode-stats-api.herokuapp.com/${username}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log(JSON.stringify(json, null, 2));
        } catch (e) {
            console.log('Error:', e.message);
        }
    });
});
