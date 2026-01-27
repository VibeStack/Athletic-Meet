import axios from "axios";

const BASE = "https://athletic-meet-website-ba.vercel.app/api/v1";
const REGISTER_USER = `${BASE}/user/register`;

async function simulateStep3(count = 40) {
  console.log(`🚀 Stress testing Step 3 for ${count} PARTIAL users...\n`);

  const assignedJerseys = new Set();
  const batchSize = 8; // safe concurrency
  let success = 0;
  let failed = 0;

  const users = Array.from({ length: count }, (_, i) => i + 1);

  for (let i = 0; i < users.length; i += batchSize) {
    const batch = users.slice(i, i + batchSize);

    await Promise.all(
      batch.map(async (num) => {
        const payload = {
          username: `testuser${num}`,
          email: `testuser${num}@gmail.com`,
          fullname: `Test User ${num}`,
          gender: "Male",
          course: "B.Tech",
          branch: "CSE",
          crn: 100000 + num,
          urn: 200000 + num,
          year: "3rd Year",
          phone: `9${Math.floor(100000000 + Math.random() * 899999999)}`
        };

        try {
          const res = await axios.post(REGISTER_USER, payload, {
            timeout: 20000
          });

          const jersey = res.data?.data?.jerseyNumber;

          if (!jersey) {
            console.log(`⚠️ User ${num}: No jersey returned`);
            failed++;
            return;
          }

          if (assignedJerseys.has(jersey)) {
            console.log(`❌ DUPLICATE JERSEY FOUND: ${jersey}`);
            failed++;
          } else {
            assignedJerseys.add(jersey);
            success++;
            console.log(`✅ User ${num} got jersey: ${jersey}`);
          }

        } catch (err) {
          failed++;
          console.log(
            `❌ User ${num} error:`,
            err.response?.data?.message || err.message
          );
        }
      })
    );
  }

  console.log("\n🎯 TEST COMPLETE");
  console.log(`✅ Successful registrations: ${success}`);
  console.log(`❌ Failed registrations: ${failed}`);
  console.log(`🧮 Unique jerseys assigned: ${assignedJerseys.size}`);
}

simulateStep3(90);
