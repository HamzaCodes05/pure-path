"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function CityFilter({ value }: { value?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div className="px-5 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 pb-2">
        <label
          htmlFor="city-filter"
          className="text-sm font-bold uppercase text-[#075f42]"
        >
          City
        </label>
        <select
          id="city-filter"
          value={value ?? ""}
          onChange={(event) => {
            const params = new URLSearchParams(searchParams.toString());
            if (event.target.value) {
              params.set("city", event.target.value);
            } else {
              params.delete("city");
            }
            const query = params.toString();
            router.push(query ? `${pathname}?${query}` : pathname, {
              scroll: false,
            });
          }}
          className="rounded-lg border border-[#d9e3df] bg-white px-3 py-2 text-sm font-semibold text-[#17211f]"
        >
          <option value="">Both cities</option>
          <option value="makkah">Makkah</option>
          <option value="madinah">Madinah</option>
        </select>
      </div>
    </div>
  );
}
