export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Learnist.co";

export const SHORT_DOMAIN =
  process.env.NEXT_PUBLIC_APP_SHORT_DOMAIN || "learnist.co";

export const HOME_DOMAIN = `https://${process.env.NEXT_PUBLIC_APP_DOMAIN}`;

export const APP_HOSTNAMES = new Set([
  `app.${process.env.NEXT_PUBLIC_APP_DOMAIN}`,
  `preview.${process.env.NEXT_PUBLIC_APP_DOMAIN}`,
  "localhost:8888",
  "localhost",
]);

export const APP_DOMAIN =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? `https://app.${process.env.NEXT_PUBLIC_APP_DOMAIN}`
    : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
      ? `https://preview.${process.env.NEXT_PUBLIC_APP_DOMAIN}`
      : "http://localhost:8888";

export const LEARNIST_LOGO = "/logo.png";
export const LEARNIST_QR_LOGO = "/logo.png";
export const LEARNIST_WORDMARK = "/wordmark.png";
export const LEARNIST_THUMBNAIL = "/thumbnail.jpg";
