// import express from "express";
// import multer from "multer";
// import { SendMailClient } from "zeptomail";
// import dotenv from "dotenv";
// dotenv.config();

// const router = express.Router();
// const upload = multer({ storage: multer.memoryStorage() });

// const url = process.env.ZEPTO_URL;
// const token = process.env.ZEPTO_TOKEN;

// console.log("🔧 ZeptoMail Configuration:");
// console.log("   URL:", url);
// console.log("   Token exists:", !!token);

// if (!url || !token) {
//   console.error("❌ CRITICAL: Missing ZEPTO_URL or ZEPTO_TOKEN in .env");
//   process.exit(1);
// }

// let client = new SendMailClient({ url, token });

// router.post(
//   "/",
//   upload.fields([
//     { name: "excelFile", maxCount: 1 },
//     { name: "attachment", maxCount: 1 },
//   ]),
//   async (req, res) => {
//     console.log("\n===========================================");
//     console.log("📨 NEW EMAIL REQUEST RECEIVED");
//     console.log("===========================================");
    
//     try {
//       const { 
//         fromEmail, 
//         subject, 
//         body, 
//         footer, 
//         manualEmails,
//         ccEmails,
//         bccEmails,
//         replyTo 
//       } = req.body;

//       console.log("📧 Email Details:");
//       console.log("   From:", fromEmail);
//       console.log("   Subject:", subject);
//       console.log("   To:", manualEmails);

//       // Validation
//       if (!fromEmail || !subject || !body) {
//         console.log("❌ Validation failed: Missing required fields");
//         return res.status(400).json({ 
//           error: "Missing required fields: fromEmail, subject, or body" 
//         });
//       }

//       // Parse TO emails
//       let toEmails = [];
//       if (manualEmails && manualEmails.trim()) {
//         toEmails = manualEmails.split(",").map((email) => ({
//           email_address: { 
//             address: email.trim(), 
//             name: "Recipient" 
//           },
//         }));
//         console.log("✅ TO emails:", toEmails.length);
//       }

//       // Parse CC emails
//       let ccEmailsArray = [];
//       if (ccEmails && ccEmails.trim()) {
//         ccEmailsArray = ccEmails.split(",").map((email) => ({
//           email_address: { 
//             address: email.trim(), 
//             name: "CC Recipient" 
//           },
//         }));
//         console.log("✅ CC emails:", ccEmailsArray.length);
//       }

//       // Parse BCC emails
//       let bccEmailsArray = [];
//       if (bccEmails && bccEmails.trim()) {
//         bccEmailsArray = bccEmails.split(",").map((email) => ({
//           email_address: { 
//             address: email.trim(), 
//             name: "BCC Recipient" 
//           },
//         }));
//         console.log("✅ BCC emails:", bccEmailsArray.length);
//       }

//       // Check if at least one recipient exists
//       if (toEmails.length === 0 && ccEmailsArray.length === 0 && bccEmailsArray.length === 0) {
//         console.log("❌ No recipients provided");
//         return res.status(400).json({ 
//           error: "At least one recipient (TO, CC, or BCC) is required" 
//         });
//       }

//       // Handle attachments
//       let attachments = [];
      
//       if (req.files?.excelFile) {
//         const file = req.files.excelFile[0];
//         attachments.push({
//           content: file.buffer.toString("base64"),
//           name: file.originalname,
//         });
//         console.log("📎 Excel attached:", file.originalname);
//       }

//       if (req.files?.attachment) {
//         const file = req.files.attachment[0];
//         attachments.push({
//           content: file.buffer.toString("base64"),
//           name: file.originalname,
//         });
//         console.log("📎 File attached:", file.originalname);
//       }

//       // Build HTML body
//       const htmlBody = `
//         <div style="font-family: Arial, sans-serif;">
//           <div>${body}</div>
//           ${footer ? `<br/><div style="color: #666; font-size: 12px;">${footer}</div>` : ''}
//         </div>
//       `;

//       // Prepare mail payload
//       const mailPayload = {
//         from: {
//           address: fromEmail,
//           name: "Excerpt Technologies",
//         },
//         subject,
//         htmlbody: htmlBody,
//       };

//       // Add recipients conditionally
//       if (toEmails.length > 0) mailPayload.to = toEmails;
//       if (ccEmailsArray.length > 0) mailPayload.cc = ccEmailsArray;
//       if (bccEmailsArray.length > 0) mailPayload.bcc = bccEmailsArray;
//       if (replyTo && replyTo.trim()) {
//         mailPayload.reply_to = [{ address: replyTo.trim() }];
//       }
//       if (attachments.length > 0) mailPayload.attachments = attachments;

//       console.log("\n📤 Sending to ZeptoMail...");

//       // Send email via ZeptoMail
//       const response = await client.sendMail(mailPayload);

//       console.log("\n✅ ✅ ✅ SUCCESS! ✅ ✅ ✅");
//       console.log("Response:", JSON.stringify(response, null, 2));
//       console.log("===========================================\n");

//       res.status(200).json({ 
//         message: "Mail Sent Successfully!",
//         response 
//       });

//     } catch (error) {
//       console.log("\n❌ ❌ ❌ ERROR OCCURRED ❌ ❌ ❌");
//       console.log("Error:", error);
      
//       if (error.error) {
//         console.log("ZeptoMail Error:");
//         console.log("  Code:", error.error.code);
//         console.log("  Message:", error.error.message);
//         console.log("  Request ID:", error.error.request_id);
//       }
      
//       console.log("===========================================\n");
      
//       // Send detailed error response
//       let errorMessage = "Failed to send email";
//       let errorDetails = "";

//       if (error.error) {
//         errorMessage = error.error.message || errorMessage;
//         errorDetails = error.error.code || "";
        
//         if (error.error.code === "TM_4001") {
//           errorMessage = "Access Denied: Your sender domain is not verified";
//           errorDetails = "Please use noreply@excerptech.com as the FROM email";
//         }
//       }
      
//       res.status(500).json({ 
//         error: errorMessage,
//         details: errorDetails,
//         fullError: error.error || { message: error.message }
//       });
//     }
//   }
// );

// export default router;







import express from "express";
import multer from "multer";
import { SendMailClient } from "zeptomail";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const url = process.env.ZEPTO_URL;
const token = process.env.ZEPTO_TOKEN;

console.log("🔧 ZeptoMail Configuration:");
console.log("   URL:", url);
console.log("   Token exists:", !!token);

if (!url || !token) {
  console.error("❌ CRITICAL: Missing ZEPTO_URL or ZEPTO_TOKEN in .env");
  process.exit(1);
}

let client = new SendMailClient({ url, token });

router.post(
  "/",
  upload.fields([
    { name: "excelFile", maxCount: 1 },
    { name: "attachment", maxCount: 1 },
  ]),
  async (req, res) => {
    console.log("\n===========================================");
    console.log("📨 NEW EMAIL REQUEST RECEIVED");
    console.log("===========================================");
    
    try {
      const { 
        fromEmail, 
        subject, 
        body, 
        footer, 
        manualEmails,
        ccEmails,
        bccEmails,
        replyTo 
      } = req.body;

      console.log("📧 Email Details:");
      console.log("   From:", fromEmail);
      console.log("   Subject:", subject);
      console.log("   To:", manualEmails);

      // Validation
      if (!fromEmail || !subject || !body) {
        console.log("❌ Validation failed: Missing required fields");
        return res.status(400).json({ 
          error: "Missing required fields: fromEmail, subject, or body" 
        });
      }

      // Parse TO emails
      let toEmails = [];
      if (manualEmails && manualEmails.trim()) {
        toEmails = manualEmails.split(",").map((email) => ({
          email_address: { 
            address: email.trim(), 
            name: "Recipient" 
          },
        }));
        console.log("✅ TO emails:", toEmails.length);
      }

      // Parse CC emails
      let ccEmailsArray = [];
      if (ccEmails && ccEmails.trim()) {
        ccEmailsArray = ccEmails.split(",").map((email) => ({
          email_address: { 
            address: email.trim(), 
            name: "CC Recipient" 
          },
        }));
        console.log("✅ CC emails:", ccEmailsArray.length);
      }

      // Parse BCC emails
      let bccEmailsArray = [];
      if (bccEmails && bccEmails.trim()) {
        bccEmailsArray = bccEmails.split(",").map((email) => ({
          email_address: { 
            address: email.trim(), 
            name: "BCC Recipient" 
          },
        }));
        console.log("✅ BCC emails:", bccEmailsArray.length);
      }

      // Check if at least one recipient exists
      if (toEmails.length === 0 && ccEmailsArray.length === 0 && bccEmailsArray.length === 0) {
        console.log("❌ No recipients provided");
        return res.status(400).json({ 
          error: "At least one recipient (TO, CC, or BCC) is required" 
        });
      }

      // Handle attachments - FIXED VERSION
      let attachments = [];
      
      if (req.files?.excelFile) {
        const file = req.files.excelFile[0];
        const attachment = {
          content: file.buffer.toString("base64"),
          name: file.originalname,
        };
        
        // Add mime_type based on file extension
        const ext = file.originalname.toLowerCase().split('.').pop();
        if (ext === 'xlsx') {
          attachment.mime_type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        } else if (ext === 'xls') {
          attachment.mime_type = 'application/vnd.ms-excel';
        } else if (ext === 'csv') {
          attachment.mime_type = 'text/csv';
        }
        
        attachments.push(attachment);
        console.log("📎 Excel attached:", file.originalname, "Type:", attachment.mime_type);
      }

      if (req.files?.attachment) {
        const file = req.files.attachment[0];
        const attachment = {
          content: file.buffer.toString("base64"),
          name: file.originalname,
        };
        
        // Detect mime type from file extension or use provided mimetype
        const ext = file.originalname.toLowerCase().split('.').pop();
        
        // Common mime types
        const mimeTypes = {
          'pdf': 'application/pdf',
          'doc': 'application/msword',
          'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'gif': 'image/gif',
          'txt': 'text/plain',
          'zip': 'application/zip',
          'rar': 'application/x-rar-compressed',
          'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'xls': 'application/vnd.ms-excel',
          'csv': 'text/csv',
          'ppt': 'application/vnd.ms-powerpoint',
          'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        };
        
        attachment.mime_type = mimeTypes[ext] || file.mimetype || 'application/octet-stream';
        
        attachments.push(attachment);
        console.log("📎 File attached:", file.originalname, "Type:", attachment.mime_type);
      }

      // Build HTML body
      const htmlBody = `
        <div style="font-family: Arial, sans-serif;">
          <div>${body}</div>
          ${footer ? `<br/><div style="color: #666; font-size: 12px;">${footer}</div>` : ''}
        </div>
      `;

      // Prepare mail payload
      const mailPayload = {
        from: {
          address: fromEmail,
          name: "Excerpt Technologies",
        },
        subject,
        htmlbody: htmlBody,
      };

      // Add recipients conditionally
      if (toEmails.length > 0) mailPayload.to = toEmails;
      if (ccEmailsArray.length > 0) mailPayload.cc = ccEmailsArray;
      if (bccEmailsArray.length > 0) mailPayload.bcc = bccEmailsArray;
      if (replyTo && replyTo.trim()) {
        mailPayload.reply_to = [{ address: replyTo.trim() }];
      }
      if (attachments.length > 0) {
        mailPayload.attachments = attachments;
        console.log("📎 Total attachments:", attachments.length);
      }

      console.log("\n📤 Sending to ZeptoMail...");
      console.log("Payload structure:", {
        from: mailPayload.from,
        subject: mailPayload.subject,
        toCount: mailPayload.to?.length || 0,
        ccCount: mailPayload.cc?.length || 0,
        bccCount: mailPayload.bcc?.length || 0,
        attachmentCount: mailPayload.attachments?.length || 0
      });

      // Send email via ZeptoMail
      const response = await client.sendMail(mailPayload);

      console.log("\n✅ ✅ ✅ SUCCESS! ✅ ✅ ✅");
      console.log("Response:", JSON.stringify(response, null, 2));
      console.log("===========================================\n");

      res.status(200).json({ 
        message: "Mail Sent Successfully!",
        response 
      });

    } catch (error) {
      console.log("\n❌ ❌ ❌ ERROR OCCURRED ❌ ❌ ❌");
      console.log("Error:", error);
      
      if (error.error) {
        console.log("ZeptoMail Error:");
        console.log("  Code:", error.error.code);
        console.log("  Message:", error.error.message);
        console.log("  Details:", JSON.stringify(error.error.details, null, 2));
        console.log("  Request ID:", error.error.request_id);
      }
      
      console.log("===========================================\n");
      
      // Send detailed error response
      let errorMessage = "Failed to send email";
      let errorDetails = "";

      if (error.error) {
        errorMessage = error.error.message || errorMessage;
        errorDetails = error.error.code || "";
        
        if (error.error.code === "TM_4001") {
          errorMessage = "Access Denied: Your sender domain is not verified";
          errorDetails = "Please use noreply@excerptech.com as the FROM email";
        } else if (error.error.code === "TM_3201") {
          errorMessage = "Mandatory Field missing in attachment";
          errorDetails = "Check attachment mime_type is provided";
        }
      }
      
      res.status(500).json({ 
        error: errorMessage,
        details: errorDetails,
        fullError: error.error || { message: error.message }
      });
    }
  }
);

export default router;