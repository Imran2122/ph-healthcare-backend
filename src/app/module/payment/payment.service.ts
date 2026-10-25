import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { PaymentStatus } from "../../../generated/prisma/enums";
const handleStripeWebHookEvent = async (event: Stripe.Event) => {
  const existingPayment = await prisma.payment.findFirst({
    where: {
      stripeEventId: event.id,
    },
  });

  if (existingPayment) {
    console.log(`Event{event.id} already processes`);
    return { message: `Event{event.id} already processes` };
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const appointmentId = session.metadata?.appointmentId;
      const paymentId = session.metadata?.paymentId;

      if (!appointmentId && !paymentId) {
        console.error("messing appointid or payment id in the session");

        return {
          message: "messing appointid or payment id in the session",
        };
      }

      const appointment = await prisma.appointment.findUnique({
        where: {
          id: appointmentId,
        },
      });

      if (!appointment) {
        console.error(`messing appointid ${appointmentId}`);

        return {
          message: `messing appointid ${appointmentId}`,
        };
      }

      await prisma.$transaction(async (tx) => {
        await tx.appointment.update({
          where: {
            id: appointmentId,
          },
          data: {
            paymentStatus:
              session.payment_status === "paid"
                ? PaymentStatus.PAID
                : PaymentStatus.UNPAID,
          },
        });

        await tx.payment.update({
          where: {
            id: paymentId,
          },
          data: {
            stripeEventId: event.id,
            status:
              session.payment_status === "paid"
                ? PaymentStatus.PAID
                : PaymentStatus.UNPAID,

            paymentGatewayData: session as any,
          },
        });
      });
      console.log(
        `process checkout .session.complete for appointment ${appointmentId} and payment ${paymentId}`,
      );
      break;
    }
    case "checkout.session.expired": {
      const session = event.data.object;

      console.log(
        `chekcout session ${session.id} expire.making axxociate payment as failed`,
      );
      break;
    }
    case "payment_intent.payment_failed": {
      const session = event.data.object;
      console.log(
        `payment intent failed  ${session.id} .marking accosiate payment as failed`,
      );
      break;
    }
    default:
      console.log(`unhandle event type ${event.type}`);

      return { message: `unhandle event type ${event.type}` };
  }

  return { message: `Event ${event.id} processed successfully` };
};

export const paymentService = {
  handleStripeWebHookEvent,
};
