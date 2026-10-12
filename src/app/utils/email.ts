import nodemailer from "nodemailer";
import { envVars } from "../../config/env";
import path from "path";
import ejs from "ejs";

const transporter = nodemailer.createTransport({
  host: envVars.EMAIL_SENDER_SMTP_HOST,
  port: Number(envVars.EMAIL_SENDER_SMTP_HOST),
  secure: false,
  auth: {
    user: envVars.EMAIL_SENDER_SMTP_USER,
    pass: envVars.EMAIL_SENDER_SMTP_PASS,
  },
});

interface senEmailOptions {
  to: string;
  subject: string;
  templateName: string;
  templateData: Record<string, any>;
  attachements?: {
    fileName: string;
    content: Buffer | string;
    contentType: string;
  }[];
}

export const sendMail = async ({
  subject,
  templateData,
  templateName,
  to,
  attachements,
}: senEmailOptions) => {
  try {
    const templatePath = path.resolve(
      process.cwd(),
      `src/app/template/${templateName}.ejs`,
    );

    const html = await ejs.renderFile(templatePath, templateData);
    const info = await transporter.sendMail({
      from: envVars.EMAIL_SENDER_SMTP_FROM,
      to: to,
      subject: subject,
      html: html,
      attachments: attachements?.map((attachement) => ({
        filename: attachement.fileName,
        conttent: attachement.content,
        contentType: attachement.contentType,
      })),
    });
    console.log(`email sent to ${to}:${info.message}`);
  } catch (error: any) {
    console.log("email Sending Fail", error.message);
  }
};
