import Otp from "../models/Otp.js";
import crypto from "crypto";
import client from "../config/twilio.js";

const normalizeMobile = (mobile) => {
  mobile = mobile.replace(/\D/g, "");

  if (mobile.startsWith("91") && mobile.length === 12) {
    mobile = mobile.slice(2);
  }

  return mobile;
};

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOtp = async (mobile, role) => {
  mobile = normalizeMobile(mobile);

  const otp = generateOtp();

  const hashedOtp = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  await Otp.deleteMany({ mobile });

  await Otp.create({
    mobile,
    role,
    otp: hashedOtp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  await client.messages.create({
    body: `Your 37 Bites OTP is ${otp}`,
    from: process.env.TWILIO_PHONE,
    to: `+91${mobile}`,
  });

  console.log("Generated OTP:", otp);
};

export const verifyOtp = async (mobile, otp) => {
  mobile = normalizeMobile(mobile);
  otp = otp.trim();

  const record = await Otp.findOne({ mobile }).sort({ createdAt: -1 });

  console.log("DB Record:", record);

  if (!record) return false;

  if (record.expiresAt < new Date()) {
    await Otp.deleteMany({ mobile });
    return false;
  }

  const hashedOtp = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  console.log("Stored Hash:", record.otp);
  console.log("Generated Hash:", hashedOtp);

  if (record.otp !== hashedOtp) return false;

  const role = record.role;

  await Otp.deleteMany({ mobile });

  return role;
};