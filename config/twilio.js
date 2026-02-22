import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);
console.log("SID length:", process.env.TWILIO_SID?.length);
console.log("TOKEN length:", process.env.TWILIO_AUTH_TOKEN?.length);
export default client;