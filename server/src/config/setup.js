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
          "attendance",
          "isUserDetailsComplete",
          "createdAt",
          "updatedAt",
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
            enum: ["Male", "Female", "Other"],
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

          branch: { bsonType: "string" },

          crn: { bsonType: "string" },
          urn: { bsonType: "string" },

          year: {
            enum: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
          },

          phone: {
            bsonType: "string",
            pattern: "^[6-9][0-9]{9}$",
          },

          jerseyNumber: {
            bsonType: ["int", "double"],
            minimum: 1,
            maximum: 1000,
          },

          isUserDetailsComplete: {
            enum: ["false", "partial", "true"],
          },

          role: {
            enum: ["Student", "Admin", "Manager"],
          },

          selectedEvents: {
            bsonType: "array",
            items: {
              bsonType: "objectId",
            },
          },

          attendance: {
            enum: ["Absent", "Not Marked", "Present"],
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
    [command]: "jerseycounters",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: [
          "_id",
          "lastAssignedJerseyNumber",
          "freeJerseyNumbers",
          "createdAt",
          "updatedAt",
        ],

        properties: {
          _id: { bsonType: "objectId" },

          lastAssignedJerseyNumber: { bsonType: "int" },

          freeJerseyNumbers: {
            bsonType: "array",
            items: { bsonType: "int" },
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
        required: ["_id", "eventname", "eventType", "eventDay", "isActive"],

        properties: {
          _id: {
            bsonType: "objectId",
          },

          eventname: {
            bsonType: "string",
            minLength: 1,
            description: "Event name is required",
          },

          eventType: {
            enum: ["Field", "Team Events", "Track"],
            description: "Event type must be Field or Track",
          },

          eventDay: {
            enum: ["Day 1", "Day 2", "Both"],
            description: "Event day must be Day 1 or Day 2",
          },

          isActive: {
            bsonType: "bool",
            description: "Event active status",
          },
          enrolledStudentsStatus: {
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
