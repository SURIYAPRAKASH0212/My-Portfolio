const https = require('https');

const username = 'SURIYA0212';
const solvedUrl = `https://alfa-leetcode-api.onrender.com/${username}/solved`;
const calendarUrl = `https://alfa-leetcode-api.onrender.com/${username}/calendar`;

function fetchData(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    console.log(`Error parsing JSON for ${url}:`, data);
                    resolve(data);
                }
            });
        }).on('error', (err) => reject(err));
    });
}

async function check() {
    console.log('Fetching Solved Data...');
    try {
        const solved = await fetchData(solvedUrl);
        console.log('Solved Data:', JSON.stringify(solved, null, 2));
    } catch (e) {
        console.error('Error fetching solved data:', e.message);
    }

    console.log('\nFetching Calendar Data...');
    try {
        const calendar = await fetchData(calendarUrl);
        // Calendar data might be huge, so just print a snippet or summary
        if (calendar.submissionCalendar) {
            console.log('Calendar Data (summary):', "Submission calendar present");
            // console.log('Calendar Data:', JSON.stringify(calendar, null, 2));
        } else {
            console.log('Calendar Data:', JSON.stringify(calendar, null, 2));
        }
    } catch (e) {
        console.error('Error fetching calendar data:', e.message);
    }
}

check();
