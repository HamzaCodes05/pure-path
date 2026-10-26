import type { Hotel, HotelCity } from "@/lib/hotels";

import { HotelCard } from "./HotelCard";
import { HotelCarousel } from "./HotelCarosal";

const HOTEL_CITY_ORDER: HotelCity[] = ["makkah", "madinah"];

const HOTEL_CITY_LABELS: Record<HotelCity, string> = {
  makkah: "Makkah",
  madinah: "Madinah",
};

function groupHotelsByCity(hotels: Hotel[]) {
  return HOTEL_CITY_ORDER.map((city) => ({
    city,
    title:
      hotels.find((hotel) => hotel.city === city)?.displayCity ??
      HOTEL_CITY_LABELS[city],
    hotels: hotels.filter((hotel) => hotel.city === city),
  })).filter((group) => group.hotels.length > 0);
}

export function HotelsSection({
  hotels,
  title = "Hotels",
  body = "",
  empty = "Hotel options are coming soon.",
  tone = "white",
}: {
  hotels: Hotel[];
  title?: string;
  body?: string;
  empty?: string;
  tone?: "white" | "soft";
}) {
  const hotelGroups = groupHotelsByCity(hotels);

  return (
    <section
      className={`${tone === "soft" ? "bg-[#f8fbfb]" : "bg-white"} px-5 py-14 sm:px-8 sm:py-10 lg:px-12`}
    >
      <div className="mx-auto max-w-5xl">
        <h2 className="mt-3 max-w-2xl font-serif text-4xl leading-tight text-[#202020] sm:text-5xl">
          {title}
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-7 text-[#40505a]">
          {body}
        </p>

        {hotelGroups.length > 0 ? (
          <div className="mt-10 space-y-8">
            {hotelGroups.map((group) => (
              <div key={group.city}>
                <h3 className="text-lg font-black text-[#075f42]">
                  {group.title}
                </h3>
                <HotelCarousel>
                  {group.hotels.map((hotel) => (
                    <HotelCard key={hotel.id} hotel={hotel} />
                  ))}
                </HotelCarousel>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-8 text-base leading-7 text-[#40505a]">{empty}</p>
        )}
      </div>
    </section>
  );
}
