const https = require('https');

const username = 'SURIYA0212';
const profileUrl = `https://alfa-leetcode-api.onrender.com/userProfile/${username}`;
const calendarUrl = `https://alfa-leetcode-api.onrender.com/${username}/calendar`;

function fetch(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    console.log('Error parsing JSON from', url);
                    resolve({});
                }
            });
        }).on('error', reject);
    });
}

async function check() {
    console.log('Fetching Profile Data...');
    try {
        const profile = await fetch(profileUrl);
        console.log('Total Solved:', profile.totalSolved);
        console.log('Easy:', profile.easySolved, 'Medium:', profile.mediumSolved, 'Hard:', profile.hardSolved);
        console.log('Total Questions:', profile.totalQuestions);
    } catch (e) {
        console.error('Error fetching profile:', e.message);
    }

    console.log('\nFetching Calendar Data...');
    try {
        const calendarData = await fetch(calendarUrl);
        let calendar = calendarData.submissionCalendar;
        if (typeof calendar === 'string') {
            try {
                calendar = JSON.parse(calendar);
                console.log('Calendar parsed from string.');
            } catch (e) {
                console.log('Failed to parse calendar string');
            }
        }
        console.log('Calendar Entries:', Object.keys(calendar || {}).length);
    } catch (e) {
        console.error('Error fetching calendar:', e.message);
    }
}

check();
