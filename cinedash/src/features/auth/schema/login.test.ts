import { describe, expect, it } from "vitest";

import { loginSchema } from "./login";

describe("loginSchema", () => {
  it("accepts valid credentials", () => {
    const result = loginSchema.safeParse({
      email: "curador@cine.com",
      password: "secret123"
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({
      email: "nao-e-um-email",
      password: "secret123"
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty email", () => {
    const result = loginSchema.safeParse({
      email: "",
      password: "secret123"
    });
    expect(result.success).toBe(false);
  });

  it("rejects password shorter than or equal to 6 characters", () => {
    const short = loginSchema.safeParse({
      email: "curador@cine.com",
      password: "12345"
    });
    const boundary = loginSchema.safeParse({
      email: "curador@cine.com",
      password: "123456"
    });

    expect(short.success).toBe(false);
    expect(boundary.success).toBe(false);
  });

  it("rejects empty password", () => {
    const result = loginSchema.safeParse({
      email: "curador@cine.com",
      password: ""
    });
    expect(result.success).toBe(false);
  });
});
