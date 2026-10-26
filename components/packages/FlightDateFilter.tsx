"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const PRESETS = ["today", "yesterday", "tomorrow"];

export function FlightDateFilter({ value }: { value?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [customOpen, setCustomOpen] = useState(false);
  const isCustom =
    customOpen || (Boolean(value) && !PRESETS.includes(value as string));
  const selectValue = isCustom ? "custom" : (value ?? "");

  function update(next: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (next) {
      params.set("flightDate", next);
    } else {
      params.delete("flightDate");
    }

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return (
    <div className="bg-[#f8fbfb] px-5 pt-10 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3">
        <label
          htmlFor="flight-date-filter"
          className="text-sm font-bold uppercase text-[#075f42]"
        >
          Flight date
        </label>
        <select
          id="flight-date-filter"
          value={selectValue}
          onChange={(event) => {
            const next = event.target.value;

            // "custom" only reveals the date input; no navigation until a date is picked.
            if (next === "custom") {
              setCustomOpen(true);
              return;
            }

            setCustomOpen(false);
            update(next);
          }}
          className="rounded-lg border border-[#d9e3df] bg-white px-3 py-2 text-sm font-semibold text-[#17211f]"
        >
          <option value="">All dates</option>
          <option value="tomorrow">Tomorrow</option>
          <option value="custom">Select date…</option>
        </select>
        {isCustom ? (
          <input
            type="date"
            value={value && !PRESETS.includes(value) ? value : ""}
            onChange={(event) =>
              event.target.value && update(event.target.value)
            }
            className="rounded-lg border border-[#d9e3df] bg-white px-3 py-2 text-sm font-semibold text-[#17211f]"
          />
        ) : null}
      </div>
    </div>
  );
}
