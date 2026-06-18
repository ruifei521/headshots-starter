import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const captureException = vi.fn();
const withScope = vi.fn((cb: (scope: { setLevel: typeof vi.fn; setTag: typeof vi.fn; setUser: typeof vi.fn; setExtras: typeof vi.fn; setExtra: typeof vi.fn }) => void) => {
  cb({
    setLevel: vi.fn(),
    setTag: vi.fn(),
    setUser: vi.fn(),
    setExtras: vi.fn(),
    setExtra: vi.fn(),
  });
});
const setUser = vi.fn();

vi.mock("@sentry/nextjs", () => ({
  captureException,
  withScope,
  setUser,
}));

describe("report-error", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv, NODE_ENV: "production", NEXT_PUBLIC_SENTRY_DSN: "https://example@sentry.io/1" };
    captureException.mockClear();
    withScope.mockClear();
    setUser.mockClear();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("sends errors to Sentry in production when DSN is set", async () => {
    const { reportError } = await import("@/lib/report-error");
    const err = new Error("checkout failed");
    reportError(err, { area: "checkout", tags: { tier: "pro" } });
    expect(withScope).toHaveBeenCalled();
    expect(captureException).toHaveBeenCalledWith(err);
  });

  it("redacts secret keys in extra fields", async () => {
    const { reportError } = await import("@/lib/report-error");
    reportError("fail", {
      extra: { accessToken: "secret-value", route: "/api/creem/go" },
    });
    expect(withScope).toHaveBeenCalled();
  });

  it("setErrorReporterUser clears user when null", async () => {
    const { setErrorReporterUser } = await import("@/lib/report-error");
    setErrorReporterUser(null);
    expect(setUser).toHaveBeenCalledWith(null);
  });
});

describe("sentryBeforeSend", () => {
  it("scrubs bearer tokens from messages", async () => {
    const { sentryBeforeSend } = await import("@/sentry.shared");
    const event = sentryBeforeSend(
      { message: "Auth failed Bearer sk_live_abc123" },
      {} as any
    );
    expect(event?.message).not.toContain("sk_live_abc123");
  });
});
