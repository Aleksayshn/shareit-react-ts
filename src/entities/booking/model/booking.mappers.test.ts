import { describe, expect, it } from "vitest";
import {
  mapBookingDraftToCreateBookingRequest,
  normalizeBookingFilterState,
  normalizeBookingStatus,
} from "./booking.mappers";

describe("booking.mappers", () => {
  it("normalizes unknown statuses and filter states to safe defaults", () => {
    expect(normalizeBookingStatus("WAITING")).toBe("WAITING");
    expect(normalizeBookingStatus("SOMETHING_ELSE")).toBe("UNKNOWN");
    expect(normalizeBookingStatus(null)).toBe("UNKNOWN");

    expect(normalizeBookingFilterState("APPROVED")).toBe("APPROVED");
    expect(normalizeBookingFilterState("NOT_A_REAL_FILTER")).toBe("ALL");
    expect(normalizeBookingFilterState(undefined)).toBe("ALL");
  });

  it("maps booking drafts into backend request payloads", () => {
    expect(
      mapBookingDraftToCreateBookingRequest({
        itemId: "14",
        startAt: "2026-04-10T09:30",
        endAt: "2026-04-11T17:15",
      }),
    ).toEqual({
      itemId: 14,
      start: new Date("2026-04-10T09:30").toISOString(),
      end: new Date("2026-04-11T17:15").toISOString(),
    });
  });
});
