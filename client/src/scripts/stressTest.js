import axios from "axios";

const API_URL =
  "https://athletic-meet-website-ba.vercel.app/api/v1/otp/registerOtpSender";

async function simulateUsers(count = 100) {
  console.log(`🚀 Simulating ${count} users with realistic delays...\n`);

  const requests = [];

  for (let i = 1; i <= count; i++) {
    const user = {
      username: `testuser${i}`,
      email: `testuser${i}@gmail.com`,
      password: "TestPass123",
    };

    // Human-like click delay (50–300 ms)
    await new Promise((r) => setTimeout(r, 50 + Math.random() * 250));

    requests.push(
      axios
        .post(API_URL, user, { timeout: 20000 })
        .then(() => {
          console.log(`✅ User ${i}: OTP SENT`);
        })
        .catch((err) => {
          if (err.code?.includes("SSL")) {
            console.log(`🔐 User ${i}: SSL ERROR`);
          } else if (err.code === "ECONNABORTED") {
            console.log(`⏱️ User ${i}: TIMEOUT`);
          } else {
            console.log(
              `❌ User ${i}:`,
              err.response?.data?.message || err.message,
            );
          }
        }),
    );
  }

  await Promise.all(requests);

  console.log("\n🎯 TEST COMPLETE");
}

simulateUsers(300);
