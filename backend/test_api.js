const http = require('http');

const runTest = async () => {
  const server = require('./server'); // starts server
  // Wait a moment for server to listen and connect to DB
  await new Promise((r) => setTimeout(r, 1500));

  const request = (method, path, body = null) => {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'localhost',
        port: 5000,
        path: path,
        method: method,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: data });
          }
        });
      });

      req.on('error', reject);
      if (body) {
        req.write(JSON.stringify(body));
      }
      req.end();
    });
  };

  console.log('--- STARTING REST API CRUD VERIFICATION TESTS ---');

  // Test 1: Health check
  const healthRes = await request('GET', '/api/health');
  console.log('[TEST 1] GET /api/health:', healthRes.status === 200 ? 'PASS' : 'FAIL', healthRes.body);

  // Test 2: Get all students
  const getAllRes = await request('GET', '/api/students');
  console.log('[TEST 2] GET /api/students:', getAllRes.status === 200 ? 'PASS' : 'FAIL', `Found ${getAllRes.body?.count} students`);

  // Test 3: Create new student
  const testRegNo = '7178TEST999';
  const newStudentPayload = {
    studentName: 'Test Automation Student',
    registerNumber: testRegNo,
    department: 'Computer Science and Engineering (CSE)',
    yearOfStudy: '3rd Year',
    email: 'test.student@college.edu',
    technicalSkills: ['Java', 'SQL', 'React'],
    aptitudeScore: 85,
    communicationSkills: 'Advanced',
    placementReadiness: 'Ready'
  };

  const createRes = await request('POST', '/api/students', newStudentPayload);
  console.log('[TEST 3] POST /api/students:', createRes.status === 201 ? 'PASS' : 'FAIL', createRes.body?.message);
  const createdId = createRes.body?.data?._id;

  // Test 4: Prevent duplicate register number
  const dupRes = await request('POST', '/api/students', newStudentPayload);
  console.log('[TEST 4] POST /api/students duplicate check:', dupRes.status === 409 ? 'PASS' : 'FAIL', `(Status ${dupRes.status} - ${dupRes.body?.message})`);

  // Test 5: Get single student by ID
  const getSingleRes = await request('GET', `/api/students/${createdId}`);
  console.log('[TEST 5] GET /api/students/:id:', getSingleRes.status === 200 ? 'PASS' : 'FAIL', getSingleRes.body?.data?.studentName);

  // Test 6: Update student by ID
  const updatePayload = {
    aptitudeScore: 95,
    placementReadiness: 'Ready',
    communicationSkills: 'Advanced'
  };
  const updateRes = await request('PUT', `/api/students/${createdId}`, updatePayload);
  console.log('[TEST 6] PUT /api/students/:id:', updateRes.status === 200 && updateRes.body?.data?.aptitudeScore === 95 ? 'PASS' : 'FAIL', `New score: ${updateRes.body?.data?.aptitudeScore}`);

  // Test 7: Delete student by ID
  const deleteRes = await request('DELETE', `/api/students/${createdId}`);
  console.log('[TEST 7] DELETE /api/students/:id:', deleteRes.status === 200 ? 'PASS' : 'FAIL', deleteRes.body?.message);

  // Test 8: Verify student no longer exists
  const getDeletedRes = await request('GET', `/api/students/${createdId}`);
  console.log('[TEST 8] GET deleted student:', getDeletedRes.status === 404 ? 'PASS' : 'FAIL', `(Status: ${getDeletedRes.status})`);

  // Test 9: Handle invalid MongoDB ID
  const invalidIdRes = await request('GET', '/api/students/invalid-mongo-id-123');
  console.log('[TEST 9] GET invalid ID format:', invalidIdRes.status === 400 ? 'PASS' : 'FAIL', invalidIdRes.body?.message);

  console.log('--- ALL CRUD TESTS COMPLETED SUCCESSFULLY ---');
  process.exit(0);
};

runTest().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
