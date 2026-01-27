import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../db/index.js";
dotenv.config({ path: ".env" });

await connectDB();
const client = mongoose.connection.getClient();

try {
  const db = mongoose.connection.db;
  const command = "collMod";

  await db.command({
    [command]: "users",
    validator: {
      $jsonSchema: {
        bsonType: "object",

        required: [
          "_id",
          "username",
          "email",
          "password",
          "role",
          "isUserDetailsComplete",
        ],

        properties: {
          _id: { bsonType: "objectId" },

          username: {
            bsonType: "string",
            minLength: 3,
            maxLength: 20,
            pattern: "^[a-zA-Z0-9_]+$",
          },

          email: {
            bsonType: "string",
            description: "User email address",
          },

          password: {
            bsonType: "string",
            minLength: 8,
          },

          fullname: {
            bsonType: "string",
            minLength: 3,
            maxLength: 50,
          },

          gender: {
            enum: ["Male", "Female"],
          },

          course: {
            enum: [
              "B.Tech",
              "M.Tech",
              "MBA",
              "MCA",
              "B.Voc.",
              "B.Com",
              "BBA",
              "BCA",
              "B.Arch",
            ],
          },

          branch: { bsonType: ["string", "null"] },

          crn: { bsonType: ["int", "null"] },
          urn: { bsonType: ["int", "null"] },

          year: {
            enum: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
          },

          phone: { bsonType: ["double", "int", "null"] },
          jerseyNumber: { bsonType: ["int", "null"] },

          isUserDetailsComplete: {
            enum: ["false", "partial", "true"],
          },

          role: {
            enum: ["Student", "Admin", "Manager"],
          },

          selectedEvents: {
            bsonType: "array",
            description:
              "List of events selected by the user with attendance status",
            items: {
              bsonType: "object",
              required: ["eventId", "status"],
              additionalProperties: false,
              properties: {
                eventId: {
                  bsonType: "objectId",
                  description: "Referenced Event ID",
                },
                status: {
                  bsonType: "string",
                  enum: ["present", "absent", "notMarked"],
                  description: "Attendance status for the event",
                },
                position: {
                  bsonType: "int",
                  enum: [0, 1, 2, 3],
                  description: "Event result position (0 = no position)",
                },
              },
              additionalProperties: false,
            },
          },

          isEventsLocked: {
            bsonType: "bool",
            description:
              "Whether event selection or attendance is locked for the user",
          },

          createdAt: { bsonType: "date" },
          updatedAt: { bsonType: "date" },

          __v: { bsonType: "int" },
        },

        additionalProperties: false,
      },
    },
    validationLevel: "strict",
    validationAction: "error",
  });

  await db.command({
    [command]: "sessions",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["_id", "userId", "createdAt"],

        properties: {
          _id: { bsonType: "objectId" },
          userId: { bsonType: "objectId" },
          createdAt: { bsonType: "date" },
          __v: { bsonType: "int" },
        },

        additionalProperties: false,
      },
    },
    validationLevel: "strict",
    validationAction: "error",
  });

  await db.command({
    [command]: "systemconfigs",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["_id", "lastAssignedJerseyNumber", "freeJerseyNumbers"],

        properties: {
          _id: {
            bsonType: "string",
            description: "Counter identifier (GLOBAL)",
          },

          lastAssignedJerseyNumber: {
            bsonType: "int",
            minimum: 0,
            description: "Last assigned jersey number",
          },

          freeJerseyNumbers: {
            bsonType: "array",
            description: "List of reusable jersey numbers",
            items: {
              bsonType: "int",
              minimum: 1,
            },
          },
          areCertificatesLocked: {
            bsonType: "bool",
          },

          createdAt: {
            bsonType: "date",
          },

          updatedAt: {
            bsonType: "date",
          },

          __v: {
            bsonType: "int",
          },
        },

        additionalProperties: false,
      },
    },
    validationLevel: "strict",
    validationAction: "error",
  });

  await db.command({
    [command]: "otps",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["_id", "email", "otp", "createdAt"],

        properties: {
          _id: { bsonType: "objectId" },

          email: { bsonType: "string" },

          otp: {
            bsonType: "int",
            minimum: 0,
            maximum: 999999,
          },

          createdAt: { bsonType: "date" },

          __v: { bsonType: "int" },
        },

        additionalProperties: false,
      },
    },
    validationLevel: "strict",
    validationAction: "error",
  });

  await db.command({
    [command]: "events",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: [
          "_id",
          "name",
          "type",
          "category",
          "day",
          "isActive",
          "studentsCount",
        ],

        properties: {
          _id: {
            bsonType: "objectId",
          },

          name: {
            bsonType: "string",
            minLength: 1,
            description: "Event name is required",
          },

          type: {
            enum: ["Field", "Team", "Track"],
            description: "Event type must be Field, Team, or Track",
          },

          category: {
            enum: ["Boys", "Girls"],
            description: "Event category must be Boys or Girls",
          },

          day: {
            enum: ["Day 1", "Day 2", "Both"],
            description: "Event day must be Day 1, Day 2, or Both",
          },

          isActive: {
            bsonType: "bool",
            description: "Event active status",
          },

          studentsCount: {
            bsonType: "object",
            required: ["present", "absent", "notMarked"],
            properties: {
              present: {
                bsonType: "int",
                minimum: 0,
              },
              absent: {
                bsonType: "int",
                minimum: 0,
              },
              notMarked: {
                bsonType: "int",
                minimum: 0,
              },
            },
            additionalProperties: false,
          },

          __v: {
            bsonType: "int",
          },
        },

        additionalProperties: false,
      },
    },
    validationLevel: "strict",
    validationAction: "error",
  });

  await db.collection("users").createIndex({ username: 1 }, { unique: true });
  await db.collection("users").createIndex({ email: 1 }, { unique: true });
  await db
    .collection("users")
    .createIndex({ crn: 1 }, { unique: true, sparse: true });
  await db
    .collection("users")
    .createIndex({ urn: 1 }, { unique: true, sparse: true });
  await db
    .collection("users")
    .createIndex({ jerseyNumber: 1 }, { unique: true, sparse: true });

  await db
    .collection("sessions")
    .createIndex({ createdAt: 1 }, { expireAfterSeconds: 1 * 24 * 60 * 60 });

  await db
    .collection("otps")
    .createIndex({ createdAt: 1 }, { expireAfterSeconds: 300 });

  await db.collection("otps").createIndex({ email: 1 });

  console.log("✅ MongoDB setup completed successfully!");
} catch (error) {
  console.error("❌ Error setting up MongoDB:", error);
} finally {
  await client.close();
}
