"use client";

import { usePathname, useRouter } from "next/navigation";

import { DISTANCE_FILTER_OPTIONS } from "@/lib/distance";

export function DistanceFilter({ value }: { value?: number }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="px-5 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 pb-2">
        <label
          htmlFor="distance-filter"
          className="text-sm font-bold uppercase text-[#075f42]"
        >
          Distance from the Haram
        </label>
        <select
          id="distance-filter"
          value={value ?? ""}
          onChange={(event) => {
            const next = event.target.value;
            router.push(next ? `${pathname}?distance=${next}` : pathname);
          }}
          className="rounded-lg border border-[#d9e3df] bg-white px-3 py-2 text-sm font-semibold text-[#17211f]"
        >
          <option value="">Any distance</option>
          {DISTANCE_FILTER_OPTIONS.map((meters) => (
            <option key={meters} value={meters}>
              Within {meters} m
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
