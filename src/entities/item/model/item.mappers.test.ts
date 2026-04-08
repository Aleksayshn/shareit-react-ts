import { describe, expect, it } from "vitest";
import {
  mapItemDraftToCreateItemRequest,
  mapItemDraftToUpdateItemRequest,
  mapItemDtoToItem,
} from "./item.mappers";

describe("item.mappers", () => {
  it("maps item DTOs into the frontend item shape", () => {
    const item = mapItemDtoToItem({
      id: 42,
      name: "Projector",
      description: "Portable HD projector.",
      available: true,
      ownerId: 7,
      requestId: 13,
      lastBooking: {
        id: 1,
        bookerId: 2,
        start: "2026-04-10T09:00:00.000Z",
        end: "2026-04-11T09:00:00.000Z",
        status: "APPROVED",
      },
      nextBooking: null,
      comments: [
        {
          id: 9,
          text: "Worked well in a bright room.",
          authorName: "Jamie",
          created: "2026-04-03T12:00:00.000Z",
        },
      ],
    });

    expect(item).toEqual({
      id: "42",
      name: "Projector",
      description: "Portable HD projector.",
      isAvailable: true,
      ownerId: "7",
      requestId: 13,
      lastBooking: {
        id: "1",
        bookerId: "2",
        startAt: "2026-04-10T09:00:00.000Z",
        endAt: "2026-04-11T09:00:00.000Z",
        status: "APPROVED",
      },
      nextBooking: null,
      comments: [
        {
          id: "9",
          text: "Worked well in a bright room.",
          authorName: "Jamie",
          createdAt: "2026-04-03T12:00:00.000Z",
        },
      ],
    });
  });

  it("trims whitespace when mapping item drafts for create and update requests", () => {
    const draft = {
      name: "  Folding Table  ",
      description: "  Seats four people comfortably.  ",
      available: false,
    };

    expect(mapItemDraftToCreateItemRequest(draft)).toEqual({
      name: "Folding Table",
      description: "Seats four people comfortably.",
      available: false,
    });

    expect(mapItemDraftToUpdateItemRequest(draft)).toEqual({
      name: "Folding Table",
      description: "Seats four people comfortably.",
      available: false,
    });
  });
});
