import axios from "axios";

const API_URL = "http://athletic-meet-website-ba.vercel.app/api/v1/otp/registerOtpSender";

async function simulateUsers(count = 30) {
  console.log(`🚀 Starting stress test for ${count} users...\n`);

  for (let i = 1; i <= count; i++) {
    const user = {
      username: `testuser${i}`,
      email: `testuser${i}@gmail.com`,
      password: "TestPass123"
    };

    try {
      const res = await axios.post(API_URL, user, {
        timeout: 10000,
      });

      console.log(`✅ User ${i}: ${res.data?.message}`);
    } catch (err) {
      console.log(`❌ User ${i}:`, err.message);
      if (err.response) {
        console.log("   ↳ Server says:", err.response.data);
      }
    }
  }

  console.log("\n🎯 Stress test complete");
}

simulateUsers(40);
