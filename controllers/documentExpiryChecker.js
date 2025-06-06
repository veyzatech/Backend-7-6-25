// src/scheduledJobs/documentExpiryChecker.js
import cron from "node-cron";
import DriverDocument from "../models/DriverDocument.js";
// Pseudo-code alert service functions – replace these with your actual alert implementations.
import { sendEmailAlert, sendWhatsAppAlert } from "../utils/alertService.js";

// Helper function to determine if the current time has reached (or passed) the reminder time.
// Expects reminderTimeStr in "HH:mm" 24-hour format.
const hasReachedReminderTime = (reminderTimeStr) => {
  if (!reminderTimeStr) return true; // No reminderTime set means no time filtering.
  const now = new Date();
  const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();
  const [reminderHour, reminderMinute] = reminderTimeStr.split(":").map(Number);
  const reminderTotalMinutes = reminderHour * 60 + reminderMinute;
  return currentTotalMinutes >= reminderTotalMinutes;
};

const checkExpiringDocuments = async () => {
  try {
    const now = new Date();
    // Find documents that haven't been alerted yet.
    const documents = await DriverDocument.find({ alertTriggered: false });
    documents.forEach(async (doc) => {
      const diffDays = (doc.expiryDate - now) / (1000 * 60 * 60 * 24);
      // Use alertBeforeDays from reminderSettings or default to 7.
      const threshold = doc.reminderSettings?.alertBeforeDays || 7;
      
      // If the document expires within the alert threshold...
      if (diffDays <= threshold) {
        // If a reminder time is set, only trigger if current time is at or past that time.
        const shouldAlert = hasReachedReminderTime(doc.reminderSettings?.reminderTime || "");
        if (shouldAlert) {
          // Send alert via email if configured.
          if (doc.reminderSettings && doc.reminderSettings.reminderEmail) {
            await sendEmailAlert(
              doc.reminderSettings.reminderEmail,
              "Document Expiry Alert",
              `Your document (${doc.documentType}) is due to expire on ${doc.expiryDate.toLocaleDateString()}.`
            );
          }
          // Send alert via WhatsApp if configured.
          if (doc.reminderSettings && doc.reminderSettings.reminderWhatsApp) {
            await sendWhatsAppAlert(
              doc.reminderSettings.reminderWhatsApp,
              `Your document (${doc.documentType}) is expiring on ${doc.expiryDate.toLocaleDateString()}. Please take action.`
            );
          }
          // Mark the document as alerted to avoid sending duplicate alerts.
          doc.alertTriggered = true;
          await doc.save();
        }
      }
    });
  } catch (error) {
    console.error("Error in document expiry checker:", error);
  }
};

// Schedule the job to run every minute.
cron.schedule("* * * * *", () => {
  console.log("Running document expiry check...");
  checkExpiringDocuments();
});
