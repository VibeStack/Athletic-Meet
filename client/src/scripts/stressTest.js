import axios from "axios";

const API_URL =
  "https://athletic-meet-website-ba.vercel.app/api/v1/otp/registerOtpSender";

async function simulateUsers(count = 100) {
  console.log(`🚀 Simulating ${count} users clicking OTP at SAME TIME...\n`);

  const requests = [];

  let success = 0;
  let rateLimited = 0;
  let conflicts = 0;
  let failures = 0;
  let timeouts = 0;

  for (let i = 1; i <= count; i++) {
    const user = {
      username: `testuser${i}`,
      email: `testuser${i}@gmail.com`,
      password: "TestPass123",
    };

    requests.push(
      axios
        .post(API_URL, user, { timeout: 20000 })
        .then((res) => {
          const msg = res.data?.message;
          const extra = res.data?.data;

          // OTP success
          if (msg === "OTP sent successfully! Please verify your email.") {
            console.log(`✅ User ${i}: OTP SENT`);
            success++;
            return;
          }

          // Rate limited
          if (msg?.includes("You can request a new OTP")) {
            const mins = extra?.remainingMinutes || "?";
            console.log(`⏳ User ${i}: RATE LIMITED — wait ${mins} min`);
            rateLimited++;
            return;
          }

          // Account exists
          if (msg === "Account already exists. Please log in.") {
            console.log(`🔒 User ${i}: ACCOUNT EXISTS`);
            conflicts++;
            return;
          }

          // Username/email conflict
          if (msg?.includes("already")) {
            console.log(`⚠️ User ${i}: ${msg}`);
            conflicts++;
            return;
          }

          // Unknown
          console.log(`❓ User ${i}: ${msg}`);
          failures++;
        })
        .catch((err) => {
          const msg = err.response?.data?.message || err.message;

          if (msg.includes("timeout")) {
            console.log(`⏱️ User ${i}: TIMEOUT`);
            timeouts++;
          } else if (msg.includes("SSL") || msg.includes("tls")) {
            console.log(`🔐 User ${i}: SSL ERROR`);
            failures++;
          } else {
            console.log(`❌ User ${i}: ${msg}`);
            failures++;
          }
        }),
    );
  }

  await Promise.all(requests);

  console.log("\n🎯 CONCURRENT OTP TEST COMPLETE\n");

  console.log("📊 RESULTS SUMMARY:");
  console.log("────────────────────────────");
  console.log(`✅ OTP Sent:        ${success}`);
  console.log(`⏳ Rate Limited:   ${rateLimited}`);
  console.log(`⚠️ Conflicts:      ${conflicts}`);
  console.log(`❌ Failures:       ${failures}`);
  console.log(`⏱️ Timeouts:       ${timeouts}`);
}

simulateUsers(90);
