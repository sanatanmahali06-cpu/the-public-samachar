import webpush from "web-push";
import { prisma } from "@/lib/prisma";

type PushPayload = {
  title: string;
  body: string;
  url: string;
};

export async function sendNewsPush(payload: PushPayload) {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT;

  if (!publicKey || !privateKey || !subject) {
    console.error("Push notifications are not configured.");
    return;
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);

  const subscriptions = await prisma.pushSubscription.findMany();

  await Promise.allSettled(
    subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth,
            },
          },
          JSON.stringify(payload)
        );
      } catch (error: unknown) {
        const statusCode =
          typeof error === "object" &&
          error !== null &&
          "statusCode" in error
            ? (error as { statusCode?: number }).statusCode
            : undefined;

        if (statusCode === 404 || statusCode === 410) {
          await prisma.pushSubscription.deleteMany({
            where: { endpoint: subscription.endpoint },
          });
        } else {
          console.error("Push delivery failed:", statusCode ?? error);
        }
      }
    })
  );
}