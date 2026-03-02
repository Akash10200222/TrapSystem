import fetch from "node-fetch";
import { Count } from "../models/Count.js";

const CHANNEL_ID = process.env.THINGSPEAK_CHANNEL_ID;
const READ_KEY = process.env.THINGSPEAK_READ_KEY;
const INTERVAL = Number(process.env.THINGSPEAK_POLL_INTERVAL || 30000);

let lastEntryId = null;

/**
 * Fetch latest data from ThingSpeak
 */
async function fetchFromThingSpeak() {
  try {
    const url = `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds/last.json?api_key=${READ_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data.field1 || !data.entry_id) return;

    // Prevent duplicates
    if (data.entry_id === lastEntryId) return;
    lastEntryId = data.entry_id;

    const value = Number(data.field1);
    if (isNaN(value)) return;

    await Count.create({ value });

    console.log("📥 ThingSpeak → MongoDB:", value);
  } catch (err) {
    console.error("❌ ThingSpeak fetch error:", err.message);
  }
}

/**
 * Start polling
 */
export function startThingSpeakPolling() {
  console.log("⏱ ThingSpeak polling started");
  setInterval(fetchFromThingSpeak, INTERVAL);
}