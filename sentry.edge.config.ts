import * as Sentry from "@sentry/nextjs";
import { sentrySharedOptions } from "./sentry.shared";

Sentry.init({
  ...sentrySharedOptions,
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.05 : 1.0,
});
