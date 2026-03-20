"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { bookingFilterOptions, type BookingFilterState } from "@/src/entities/booking";
import { Field, Select } from "@/src/shared/ui";

interface FilterBookingsByStateProps {
  value: BookingFilterState;
}

export function FilterBookingsByState({
  value,
}: FilterBookingsByStateProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <Field htmlFor="booking-state" label="Status">
      <Select
        id="booking-state"
        value={value}
        onChange={(event) => {
          const params = new URLSearchParams(searchParams.toString());
          params.set("state", event.target.value);
          params.set("from", "0");
          router.push(`${pathname}?${params.toString()}`);
        }}
      >
        {bookingFilterOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </Field>
  );
}
