import type { Restaurant, RestaurantCity } from "@/lib/restaurants";

import { HotelCarousel } from "./HotelCarosal";
import { RestaurantCard } from "./RestaurantCard";

const RESTAURANT_CITY_ORDER: RestaurantCity[] = ["makkah", "madinah"];

const RESTAURANT_CITY_LABELS: Record<RestaurantCity, string> = {
  makkah: "Makkah",
  madinah: "Madinah",
};

function groupRestaurantsByCity(restaurants: Restaurant[]) {
  return RESTAURANT_CITY_ORDER.map((city) => ({
    city,
    title:
      restaurants.find((restaurant) => restaurant.city === city)?.displayCity ??
      RESTAURANT_CITY_LABELS[city],
    restaurants: restaurants.filter((restaurant) => restaurant.city === city),
  })).filter((group) => group.restaurants.length > 0);
}

export function RestaurantsSection({
  restaurants,
}: {
  restaurants: Restaurant[];
}) {
  const restaurantGroups = groupRestaurantsByCity(restaurants);

  return (
    <section className="bg-white px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-bold uppercase text-[#075f42]">
          Nearby Dining
        </p>
        <h2 className="mt-3 max-w-2xl font-serif text-4xl leading-tight text-[#202020] sm:text-5xl">
          Restaurants Near the Holy Mosques
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-7 text-[#40505a]">
          Browse nearby restaurant options in Makkah and Madinah with distance,
          category, rating, and review details.
        </p>

        {restaurantGroups.length > 0 ? (
          <div className="mt-10 space-y-8">
            {restaurantGroups.map((group) => (
              <div key={group.city}>
                <h3 className="text-lg font-black text-[#075f42]">
                  {group.title}
                </h3>
                <HotelCarousel>
                  {group.restaurants.map((restaurant) => (
                    <RestaurantCard
                      key={restaurant.id}
                      restaurant={restaurant}
                    />
                  ))}
                </HotelCarousel>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-8 text-base leading-7 text-[#40505a]">
            Restaurant options are coming soon.
          </p>
        )}
      </div>
    </section>
  );
}
