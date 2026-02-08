const axios = require('axios');

async function testStats() {
    try {
        console.log('Fetching stats...');
        const res = await axios.get('http://localhost:3000/api/transactions/stats');
        console.log('Stats Response:', JSON.stringify(res.data, null, 2));
    } catch (error) {
        console.error('Error fetching stats:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

testStats();
