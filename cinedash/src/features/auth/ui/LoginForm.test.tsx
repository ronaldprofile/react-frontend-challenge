import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuthStore } from "@/features/auth/store/authStore";
import { LoginForm } from "@/features/auth/ui/LoginForm";
import { render, screen, userEvent, waitFor } from "@/test/test-utils";

const mocks = vi.hoisted(() => {
  const navigate = vi.fn();
  const search: { redirect?: string } = {};
  return { navigate, search };
});

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mocks.navigate,
  useSearch: () => mocks.search
}));

const ELEMENTS = {
  getEmailInput: () => screen.getByLabelText("E-mail"),
  getPasswordInput: () => screen.getByLabelText("Senha"),
  getSubmitButton: () => screen.getByRole("button", { name: "Entrar" }),

  getTitle: () => screen.getByRole("heading", { name: "CineDash" })
};

type UserSetup = ReturnType<typeof userEvent.setup>;

const ACTIONS = {
  signIn: async (
    user: UserSetup,
    { email, password }: { email: string; password: string }
  ) => {
    await user.type(ELEMENTS.getEmailInput(), email);
    await user.type(ELEMENTS.getPasswordInput(), password);

    await user.click(ELEMENTS.getSubmitButton());
  }
};

const setup = () => {
  const user = userEvent.setup();
  render(<LoginForm />);
  return { user };
};

describe("LoginForm", () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({ user: null, token: null });
    mocks.navigate.mockClear();
    mocks.search.redirect = undefined;
  });

  describe("rendering", () => {
    it("renders the essential login fields", () => {
      setup();

      expect(ELEMENTS.getTitle()).toBeInTheDocument();
      expect(ELEMENTS.getEmailInput()).toBeInTheDocument();
      expect(ELEMENTS.getPasswordInput()).toBeInTheDocument();
      expect(ELEMENTS.getSubmitButton()).toBeInTheDocument();
    });
  });

  describe("validation", () => {
    it("shows validation errors when submitting an empty form", async () => {
      const { user } = setup();

      await user.click(ELEMENTS.getSubmitButton());

      expect(
        await screen.findByText("Informe um e-mail válido")
      ).toBeInTheDocument();
      expect(screen.getByText("A senha é obrigatória")).toBeInTheDocument();
    });

    it("rejects an invalid email but accepts a valid password", async () => {
      const { user } = setup();

      await ACTIONS.signIn(user, {
        email: "nao-e-um-email",
        password: "segredo123"
      });

      expect(
        await screen.findByText("Informe um e-mail válido")
      ).toBeInTheDocument();
      expect(
        screen.queryByText("A senha deve ter mais de 6 caracteres")
      ).not.toBeInTheDocument();
      expect(mocks.navigate).not.toHaveBeenCalled();
    });
  });

  describe("authentication", () => {
    it("logs in, persists the session, shows the toast and navigates to the dashboard", async () => {
      const { user } = setup();

      await ACTIONS.signIn(user, {
        email: "curador@cine.com",
        password: "segredo123"
      });

      await waitFor(() => {
        expect(mocks.navigate).toHaveBeenCalledWith({ href: "/dashboard" });
      });
      expect(
        await screen.findByText("Login realizado com sucesso")
      ).toBeInTheDocument();
      expect(useAuthStore.getState().user).toEqual({ email: "curador@cine.com" });
      expect(useAuthStore.getState().token).toMatch(/^cinedash\./);

      const stored = JSON.parse(localStorage.getItem("cinedash.auth") ?? "{}");
      expect(stored.state.user).toEqual({ email: "curador@cine.com" });
    });

    it("navigates to the redirect informed in the URL when present", async () => {
      mocks.search.redirect = "/watchlist";

      const { user } = setup();

      await ACTIONS.signIn(user, {
        email: "curador@cine.com",
        password: "segredo123"
      });

      await waitFor(() => {
        expect(mocks.navigate).toHaveBeenCalledWith({ href: "/watchlist" });
      });
    });
  });
});