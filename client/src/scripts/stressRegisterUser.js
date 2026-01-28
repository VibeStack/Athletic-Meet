import axios from "axios";

const BASE = "https://athletic-meet-website-ba.vercel.app/api/v1";
const REGISTER_USER = `${BASE}/user/register`;

async function simulateStep3(count = 90) {
  console.log(`🚀 Stress testing Step 3 for ${count} PARTIAL users...\n`);

  const assignedJerseys = new Set();
  const batchSize = 8; // safe concurrency window
  let success = 0;
  let failed = 0;
  let duplicates = 0;

  const users = Array.from({ length: count }, (_, i) => i + 1);

  for (let i = 1; i < users.length; i += batchSize) {
    const batch = users.slice(i, i + batchSize);

    await Promise.all(
      batch.map(async (num) => {
        // Random gender selection
        const gender = Math.random() < 0.5 ? "Male" : "Female";

        const payload = {
          username: `testuser${num}`,
          email: `testuser${num}@gmail.com`,
          fullname: `Test User ${num}`,
          gender,
          course: "B.Tech",
          branch: "CSE",
          crn: 100000 + num,
          urn: 200000 + num,
          year: "3rd Year",
          phone: `9${Math.floor(100000000 + Math.random() * 899999999)}`
        };

        try {
          const res = await axios.post(REGISTER_USER, payload, {
            timeout: 20000,
          });

          const jersey = res.data?.data?.jerseyNumber;

          if (!jersey) {
            console.log(`⚠️ User ${num}: No jersey returned`);
            failed++;
            return;
          }

          if (assignedJerseys.has(jersey)) {
            console.log(`❌ DUPLICATE JERSEY FOUND: ${jersey} (User ${num})`);
            duplicates++;
            failed++;
          } else {
            assignedJerseys.add(jersey);
            success++;
            console.log(`✅ User ${num} (${gender}) got jersey: ${jersey}`);
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

    // Cooldown to avoid hammering DB
    await new Promise((r) => setTimeout(r, 80 + Math.random() * 120));
  }

  console.log("\n🎯 STEP 3 TEST COMPLETE");
  console.log("────────────────────────────");
  console.log(`✅ Successful registrations: ${success}`);
  console.log(`❌ Failed registrations: ${failed}`);
  console.log(`🧮 Unique jerseys assigned: ${assignedJerseys.size}`);
  console.log(`🚨 Duplicate jerseys found: ${duplicates}`);

  if (duplicates === 0) {
    console.log("🎉 NO JERSEY COLLISION — SYSTEM IS SAFE");
  } else {
    console.log("⚠️ JERSEY COLLISION DETECTED — INVESTIGATE");
  }
}

simulateStep3(100);
