// Simple script to test teacher registration
import axios from 'axios';

const registerTeacher = async () => {
  try {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJvbW9ub29hcmU0QGdtYWlsLmNvbSIsImVtYWlsIjoib21vbm9vYXJlNEBnbWFpbC5jb20iLCJqdGkiOiI1N2UyMDkzYy01Y2QwLTRhYWUtOThiYy1jMmQxODFlNGZhZWMiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImIwYWNiZDM1LTZjMzUtNGQxMS1hODMzLTVmNDkzYWZlZDQ2OCIsIlRlbmFudElkIjoiZWFlYmQyZmItMjVkMi00YjVjLWIyYzItMDRkZjBkZmQ5N2M3IiwidGVuYW50X2lkIjoiZWFlYmQyZmItMjVkMi00YjVjLWIyYzItMDRkZjBkZmQ5N2M3IiwiQWRtaW5JZCI6ImIwYWNiZDM1LTZjMzUtNGQxMS1hODMzLTVmNDkzYWZlZDQ2OCIsIlNjaG9vbE5hbWUiOiJvYWhpbWlyZSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiUm9sZSI6IkFkbWluIiwiSXNWZXJpZmllZCI6IlRydWUiLCJleHAiOjE3NDgwNzk4NTUsImlzcyI6IkNCVEFwcEFQSSIsImF1ZCI6IkNCVEFwcEFQSVVzZXJzIn0.tZNNG_tqWlAVW4lb3k-e4nRptMZjAiX3lVmAB4-ePVE';

    const data = {
      firstName: "John",
      middleName: "Doe",
      lastName: "Smith",
      email: "teacher20@example.com",
      phoneNumber: "08118222451",
      gender: "Male",
      classId: "f34d8185-4a20-43ed-b160-f431c062ca7e",
      armId: "3a78462f-f093-4c78-8522-76b9ba9839f4",
      campusId: "002533e4-1b08-4d0e-9d26-7d58eac4a387"
    };

    console.log('Sending data:', data);

    const response = await axios.post(
      'http://159.65.31.191/api/Tenant/register-teacher',
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error during teacher registration:');
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
    throw error;
  }
};

// Execute the registration
registerTeacher()
  .then(result => {
    console.log('Registration successful:', result);
  })
  .catch(err => {
    console.error('Registration failed:', err.message);
  }); 