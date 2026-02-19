const https = require('https');
// plain node script

// Mock fetch
function fetch(url) {
    return new Promise((resolve) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve({
                        ok: true,
                        json: () => Promise.resolve(JSON.parse(data))
                    });
                } catch (e) {
                    resolve({ ok: false });
                }
            });
        }).on('error', () => resolve({ ok: false }));
    });
}

const username = 'SURIYA0212';

async function verify() {
    console.log('Starting verification...');
    try {
        const [profileRes, calendarRes] = await Promise.all([
            fetch(`https://alfa-leetcode-api.onrender.com/userProfile/${username}`),
            fetch(`https://alfa-leetcode-api.onrender.com/${username}/calendar`)
        ]);

        if (!profileRes.ok || !calendarRes.ok) {
            throw new Error('One or more API requests failed');
        }

        const profileData = await profileRes.json();
        const calendarData = await calendarRes.json();

        console.log('Profile Data Loaded.');
        console.log('Total Solved:', profileData.totalSolved);

        let calendar = calendarData.submissionCalendar;
        if (typeof calendar === 'string') {
            try {
                calendar = JSON.parse(calendar);
                console.log('Calendar parsed from string.');
            } catch (e) {
                console.error('Failed to parse submissionCalendar', e);
                calendar = {};
            }
        } else {
            console.log('Calendar is already object (or undefined). Type:', typeof calendar);
        }

        const timestampCount = Object.keys(calendar).length;
        console.log(`Calendar has ${timestampCount} entries.`);

        if (profileData.totalSolved !== undefined && timestampCount > 0) {
            console.log('SUCCESS: Data fetched and parsed correctly.');
        } else {
            console.log('FAILURE: Missing data fields.');
        }

    } catch (error) {
        console.error('Error during verification:', error);
    }
}

verify();
