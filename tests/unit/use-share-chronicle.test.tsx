import { renderHook, act, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useShareChronicle } from "@/features/chronicles/hooks/use-share-chronicle";

const toastSuccessMock = vi.fn();
const toastErrorMock = vi.fn();

vi.mock("sonner", () => ({
  toast: {
    success: (...args: unknown[]) => toastSuccessMock(...args),
    error: (...args: unknown[]) => toastErrorMock(...args),
  },
}));

describe("useShareChronicle", () => {
  beforeEach(() => {
    toastSuccessMock.mockReset();
    toastErrorMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("uses navigator.share when available", async () => {
    const shareMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "share", {
      configurable: true,
      writable: true,
      value: shareMock,
    });

    const { result } = renderHook(() => useShareChronicle());

    await act(async () => {
      await result.current.share({ title: "Mi crónica", body: "Cuerpo" });
    });

    expect(shareMock).toHaveBeenCalledWith({
      title: "Mi crónica",
      text: "Mi crónica\n\nCuerpo",
    });
    expect(toastSuccessMock).not.toHaveBeenCalled();
    expect(toastErrorMock).not.toHaveBeenCalled();

    Reflect.deleteProperty(navigator, "share");
  });

  it("does not toast when the user cancels the native share sheet", async () => {
    const shareMock = vi.fn().mockRejectedValue(new DOMException("cancel", "AbortError"));
    Object.defineProperty(navigator, "share", {
      configurable: true,
      writable: true,
      value: shareMock,
    });

    const { result } = renderHook(() => useShareChronicle());

    await act(async () => {
      await result.current.share({ title: "Mi crónica", body: "Cuerpo" });
    });

    expect(shareMock).toHaveBeenCalled();
    expect(toastSuccessMock).not.toHaveBeenCalled();
    expect(toastErrorMock).not.toHaveBeenCalled();

    Reflect.deleteProperty(navigator, "share");
  });

  it("falls back to the clipboard when navigator.share is missing", async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      writable: true,
      value: { writeText: writeTextMock },
    });

    const { result } = renderHook(() => useShareChronicle());

    await act(async () => {
      await result.current.share({ title: "Mi crónica", body: "Cuerpo" });
    });

    expect(writeTextMock).toHaveBeenCalledWith("Mi crónica\n\nCuerpo");
    await waitFor(() => {
      expect(toastSuccessMock).toHaveBeenCalledTimes(1);
    });

    Reflect.deleteProperty(navigator, "clipboard");
  });

  it("shows an error toast when neither share nor clipboard are available", async () => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      writable: true,
      value: undefined,
    });

    const { result } = renderHook(() => useShareChronicle());

    await act(async () => {
      await result.current.share({ title: "Mi crónica", body: "Cuerpo" });
    });

    expect(toastErrorMock).toHaveBeenCalledTimes(1);
    expect(toastSuccessMock).not.toHaveBeenCalled();

    Reflect.deleteProperty(navigator, "clipboard");
  });
});
