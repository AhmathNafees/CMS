import axios from 'axios';

const verify = async () => {
  const token = "your_access_token_here";

  try {
    const res = await axios.get('http://localhost:3000/api/auth/verify', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log("Verified:", res.data);
  } catch (err) {
    console.error("Verification failed:", err.response?.data || err.message);
  }
};

verify();
