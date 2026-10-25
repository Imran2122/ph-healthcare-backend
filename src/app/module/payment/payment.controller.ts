import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { envVars } from "../../../config/env";
import status from "http-status";
import { stripe } from "../../../config/stripe.config";
import { paymentService } from "./payment.service";
import { sendResnponse } from "../../../shared/sendResponse";

const handleStripeWebHookEvent = catchAsync(
  async (req: Request, res: Response) => {
    const signature = req.headers["stripe-signature"] as string | undefined;
    const webHookSecret = envVars.STRIPE_WEBHOOK_SECRET;

    if (!signature || !webHookSecret) {
      console.log("missing signature or webhooksecret");

      return res
        .status(status.BAD_REQUEST)
        .json({ message: "missing signature or webhooksecret" });
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        webHookSecret,
      );
    } catch (error) {
      console.error("Error processing stripe webhook", error);

      return res
        .status(status.BAD_REQUEST)
        .json({ message: "error peocesing" });
    }

    try {
      const result = await paymentService.handleStripeWebHookEvent(event);

      return sendResnponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: "Stripe webhook processed successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error handling stripe webhook event", error);

      return res
        .status(status.INTERNAL_SERVER_ERROR)
        .json({ message: "Failed to process stripe webhook event" });
    }
  },
);

export const paymentController = {
  handleStripeWebHookEvent,
};
