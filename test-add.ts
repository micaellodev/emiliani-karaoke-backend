
import axios from 'axios';

async function test() {
    try {
        console.log('Testing GET /queue...');
        const queue = await axios.get('http://localhost:3001/queue');
        console.log('GET /queue status:', queue.status);

        console.log('Testing POST /queue/add...');
        // We need a valid JWT token ideally, but let's see if we get 401 (meaning route exists) or 404 (route missing)
        try {
            await axios.post('http://localhost:3001/queue/add', {});
        } catch (e: any) {
            console.log('POST /queue/add status:', e.response?.status);
            console.log('POST /queue/add data:', e.response?.data);
        }

    } catch (e: any) {
        console.error('Error:', e.message);
    }
}

test();
