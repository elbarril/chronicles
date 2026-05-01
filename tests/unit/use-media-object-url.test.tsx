import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useBlobObjectUrl, useMediaObjectUrl } from "@/infra/media/use-media-object-url";

const { createMediaObjectUrlMock } = vi.hoisted(() => ({
  createMediaObjectUrlMock: vi.fn(),
}));

vi.mock("@/infra/media/store", () => ({
  createMediaObjectUrl: createMediaObjectUrlMock,
}));

describe("useMediaObjectUrl", () => {
  beforeEach(() => {
    createMediaObjectUrlMock.mockReset();
  });

  it("returns undefined while resolving and exposes the url once resolved", async () => {
    const revoke = vi.fn();
    createMediaObjectUrlMock.mockResolvedValue({ url: "blob:abc", revoke });

    const { result } = renderHook(() => useMediaObjectUrl("media-1"));

    expect(result.current).toBeUndefined();

    await waitFor(() => expect(result.current).toBe("blob:abc"));
    expect(revoke).not.toHaveBeenCalled();
  });

  it("revokes the previous url when mediaId changes and on unmount", async () => {
    const firstRevoke = vi.fn();
    const secondRevoke = vi.fn();

    createMediaObjectUrlMock
      .mockResolvedValueOnce({ url: "blob:first", revoke: firstRevoke })
      .mockResolvedValueOnce({ url: "blob:second", revoke: secondRevoke });

    const { result, rerender, unmount } = renderHook(
      ({ id }: { id: string }) => useMediaObjectUrl(id),
      { initialProps: { id: "media-1" } },
    );

    await waitFor(() => expect(result.current).toBe("blob:first"));

    rerender({ id: "media-2" });

    await waitFor(() => expect(firstRevoke).toHaveBeenCalledOnce());
    await waitFor(() => expect(result.current).toBe("blob:second"));

    unmount();

    expect(secondRevoke).toHaveBeenCalledOnce();
  });

  it("returns undefined and never resolves when mediaId is empty", () => {
    const { result } = renderHook(() => useMediaObjectUrl(undefined));

    expect(result.current).toBeUndefined();
    expect(createMediaObjectUrlMock).not.toHaveBeenCalled();
  });

  it("handles missing media rows gracefully", async () => {
    createMediaObjectUrlMock.mockResolvedValueOnce(null);

    const { result } = renderHook(() => useMediaObjectUrl("media-missing"));

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current).toBeUndefined();
  });
});

describe("useBlobObjectUrl", () => {
  const createSpy = vi.fn<(blob: Blob | MediaSource) => string>();
  const revokeSpy = vi.fn<(url: string) => void>();
  const originalCreate = URL.createObjectURL;
  const originalRevoke = URL.revokeObjectURL;

  beforeEach(() => {
    createSpy.mockReset();
    revokeSpy.mockReset();
    createSpy.mockImplementation(() => "blob:fake");
    URL.createObjectURL = createSpy as typeof URL.createObjectURL;
    URL.revokeObjectURL = revokeSpy as typeof URL.revokeObjectURL;
  });

  afterEach(() => {
    URL.createObjectURL = originalCreate;
    URL.revokeObjectURL = originalRevoke;
  });

  it("creates and revokes the url for a given blob", () => {
    const blob = new Blob(["hello"], { type: "audio/webm" });

    const { result, unmount } = renderHook(() => useBlobObjectUrl(blob));

    expect(createSpy).toHaveBeenCalledWith(blob);
    expect(result.current).toBe("blob:fake");

    unmount();

    expect(revokeSpy).toHaveBeenCalledWith("blob:fake");
  });

  it("returns undefined when blob is undefined", () => {
    const { result } = renderHook(() => useBlobObjectUrl(undefined));

    expect(result.current).toBeUndefined();
    expect(createSpy).not.toHaveBeenCalled();
  });
});
