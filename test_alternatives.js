const https = require('https');

const username = 'SURIYA0212';
const apis = [
    `https://leetcode-stats-api.herokuapp.com/${username}`,
    `https://leetcode-api-faisalshohag.vercel.app/${username}`
];

function fetchData(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve({ url, data: JSON.parse(data), status: res.statusCode });
                } catch (e) {
                    resolve({ url, error: 'JSON parse error or non-JSON response', raw: data.substring(0, 100), status: res.statusCode });
                }
            });
        }).on('error', (err) => resolve({ url, error: err.message }));
    });
}

async function check() {
    console.log('Testing APIs...');
    for (const url of apis) {
        console.log(`\nChecking: ${url}`);
        const result = await fetchData(url);
        if (result.error) {
            console.log('Failed:', result.error);
            if (result.raw) console.log('Raw start:', result.raw);
        } else {
            console.log('Success!', 'Status:', result.status);
            console.log('Keys:', Object.keys(result.data));
            // Check for specific fields we need
            console.log('Total:', result.data.totalSolved || result.data.total_problems_solved);
            console.log('Easy:', result.data.easySolved || result.data.easy_questions_solved);
        }
    }
}

check();
