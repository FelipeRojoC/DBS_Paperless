// Run this script with: node scripts/test_api.js
// Make sure the server is running on localhost:3000

const BASE_URL = 'http://localhost:3000/api';

async function testAPI() {
    console.log('🚀 Starting API Verification...');

    try {
        // 1. Health Check
        console.log('\nTesting Health Check...');
        const health = await fetch('http://localhost:3000/health').then(r => r.json());
        console.log('✅ Health:', health);

        // 2. Register User (if not exists)
        console.log('\nTesting Registration...');
        const regPayload = {
            email: `test.admin.${Date.now()}@dbs.com`,
            password: 'password123',
            full_name: 'Test Admin',
            role: 'Jefe SGI'
        };
        const registerRes = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(regPayload)
        });
        const registerData = await registerRes.json();
        console.log('✅ Register:', registerRes.status === 201 ? 'Success' : registerData);

        // 3. Login
        console.log('\nTesting Login...');
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: regPayload.email, password: 'password123' })
        });
        const loginData = await loginRes.json();

        if (!loginData.token) {
            throw new Error('Login failed, no token received');
        }
        console.log('✅ Login Success! Token received.');
        const token = loginData.token;

        // 4. Create Form Submission
        console.log('\nTesting Form Submission...');
        const formPayload = {
            template_id: null, // nullable in DB for now/test
            service_order_id: null,
            technician_id: loginData.user.id,
            form_data: {
                "q1": "Answer 1",
                "section_a": "Safe"
            }
        };

        const submitRes = await fetch(`${BASE_URL}/forms`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formPayload)
        });
        const submitData = await submitRes.json();
        console.log('✅ Submit Form:', submitRes.status === 201 ? 'Success' : submitData);

        // 5. Get Submissions
        console.log('\nTesting Get Submissions...');
        const getRes = await fetch(`${BASE_URL}/forms`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const getData = await getRes.json();
        console.log(`✅ Fetched ${getData.length} submissions.`);

    } catch (err) {
        console.error('❌ Test Failed:', err.message);
    }
}

testAPI();
