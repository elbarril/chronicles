import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { WelcomeNamePrompt } from "@/features/onboarding/components/WelcomeNamePrompt";
import { onboardingStorageKey } from "@/features/onboarding/services/onboarding-service";
import {
  userNamePromptShownKey,
  userNameStorageKey,
} from "@/features/settings/services/user-name-service";

describe("WelcomeNamePrompt", () => {
  beforeEach(() => {
    window.localStorage.removeItem(onboardingStorageKey);
    window.localStorage.removeItem(userNamePromptShownKey);
    window.localStorage.removeItem(userNameStorageKey);
  });

  afterEach(() => {
    window.localStorage.removeItem(onboardingStorageKey);
    window.localStorage.removeItem(userNamePromptShownKey);
    window.localStorage.removeItem(userNameStorageKey);
  });

  it("does not render when the tour has not been completed yet", () => {
    render(<WelcomeNamePrompt />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders after the tour finishes (storage flag set + custom event)", async () => {
    render(<WelcomeNamePrompt />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    act(() => {
      window.localStorage.setItem(onboardingStorageKey, "true");
      window.dispatchEvent(new CustomEvent("chronicle:tour-finished"));
    });

    await waitFor(() => {
      expect(screen.getByRole("dialog", { name: /cómo te llamamos/i })).toBeInTheDocument();
    });
  });

  it("does not render when the prompt has already been shown", () => {
    window.localStorage.setItem(onboardingStorageKey, "true");
    window.localStorage.setItem(userNamePromptShownKey, "true");

    render(<WelcomeNamePrompt />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("does not render when the user already has a stored name", () => {
    window.localStorage.setItem(onboardingStorageKey, "true");
    window.localStorage.setItem(userNameStorageKey, "Emiliano");

    render(<WelcomeNamePrompt />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("persists the entered name and closes itself when saved", async () => {
    window.localStorage.setItem(onboardingStorageKey, "true");
    const user = userEvent.setup();

    render(<WelcomeNamePrompt />);

    const dialog = screen.getByRole("dialog", { name: /cómo te llamamos/i });
    const input = within(dialog).getByLabelText(/nombre/i);

    await user.clear(input);
    await user.type(input, "Emiliano");
    await user.click(within(dialog).getByRole("button", { name: /guardar y empezar/i }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    expect(window.localStorage.getItem(userNameStorageKey)).toBe("Emiliano");
    expect(window.localStorage.getItem(userNamePromptShownKey)).toBe("true");
  });

  it("marks the prompt as shown on skip without persisting a name", async () => {
    window.localStorage.setItem(onboardingStorageKey, "true");
    const user = userEvent.setup();

    render(<WelcomeNamePrompt />);

    const dialog = screen.getByRole("dialog", { name: /cómo te llamamos/i });
    await user.click(within(dialog).getByRole("button", { name: /después lo configuro/i }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    expect(window.localStorage.getItem(userNameStorageKey)).toBeNull();
    expect(window.localStorage.getItem(userNamePromptShownKey)).toBe("true");
  });
});
