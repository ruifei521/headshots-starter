import * as Sentry from "@sentry/nextjs";
import { sentrySharedOptions } from "./sentry.shared";

Sentry.init({
  ...sentrySharedOptions,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,
});
