import axios from "axios";

const API_URL = "https://athletic-meet-website-ba.vercel.app/api/v1/otp/registerOtpSender";

async function simulateUsers(count = 100) {
  console.log(`🚀 Simulating ${count} users clicking OTP at SAME TIME...\n`);

  const requests = [];

  for (let i = 1; i <= count; i++) {
    const user = {
      username: `testuser${i}`,
      email: `testuser${i}@gmail.com`,
      password: "TestPass123"
    };

    requests.push(
      axios.post(API_URL, user, { timeout: 15000 })
        .then(res => {
          console.log(`✅ User ${i}: ${res.data?.message}`);
        })
        .catch(err => {
          console.log(`❌ User ${i}:`, err.response?.data?.message || err.message);
        })
    );
  }

  await Promise.all(requests);

  console.log("\n🎯 CONCURRENT OTP TEST COMPLETE");
}

simulateUsers(90);
