import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { type Field } from "@/domain/field";
import { ObservationMediaList } from "@/features/observations/components/ObservationMediaList";

const { createMediaObjectUrlMock } = vi.hoisted(() => ({
  createMediaObjectUrlMock: vi.fn(),
}));

vi.mock("@/infra/media/store", () => ({
  createMediaObjectUrl: createMediaObjectUrlMock,
}));

const isoDate = "2026-04-30T12:00:00.000Z";

const audioField: Field = {
  id: "00000000-0000-4000-8000-000000000a01",
  type: "audio",
  key: "audio",
  label: "Audio de observación",
  required: false,
  helpText: "",
  config: { multiple: false },
  createdAt: isoDate,
  updatedAt: isoDate,
  archivedAt: "",
};

const textField: Field = {
  id: "00000000-0000-4000-8000-000000000b01",
  type: "longText",
  key: "nota",
  label: "Nota",
  required: false,
  helpText: "",
  config: {},
  createdAt: isoDate,
  updatedAt: isoDate,
  archivedAt: "",
};

const imageField: Field = {
  id: "00000000-0000-4000-8000-000000000c01",
  type: "image",
  key: "imagen",
  label: "Imagen",
  required: false,
  helpText: "",
  config: { multiple: false },
  createdAt: isoDate,
  updatedAt: isoDate,
  archivedAt: "",
};

describe("<ObservationMediaList />", () => {
  beforeEach(() => {
    createMediaObjectUrlMock.mockReset();
  });

  it("renders an audio player when the observation has an audio mediaId", async () => {
    createMediaObjectUrlMock.mockResolvedValue({
      url: "blob:audio-url",
      revoke: vi.fn(),
    });

    render(
      <ObservationMediaList
        fields={[textField, audioField]}
        values={{
          [textField.id]: "Una nota",
          [audioField.id]: { mediaId: "media-audio-1" },
        }}
      />,
    );

    const player = await screen.findByLabelText(/Reproducir Audio de observación/i);

    expect(player).toBeInTheDocument();
    expect(player.tagName).toBe("AUDIO");
    expect(player).toHaveAttribute("src", "blob:audio-url");
  });

  it("returns null when no media-typed field has a mediaId", () => {
    const { container } = render(
      <ObservationMediaList
        fields={[textField]}
        values={{ [textField.id]: "Una nota sin adjunto" }}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders one item per mediaId for multi-value fields", async () => {
    const multiImageField: Field = {
      ...imageField,
      config: { multiple: true },
    };

    createMediaObjectUrlMock
      .mockResolvedValueOnce({ url: "blob:image-1", revoke: vi.fn() })
      .mockResolvedValueOnce({ url: "blob:image-2", revoke: vi.fn() });

    render(
      <ObservationMediaList
        fields={[multiImageField]}
        values={{
          [multiImageField.id]: { mediaIds: ["media-img-1", "media-img-2"] },
        }}
      />,
    );

    await waitFor(() => {
      const images = screen.getAllByRole("img");
      expect(images).toHaveLength(2);
    });
  });
});
