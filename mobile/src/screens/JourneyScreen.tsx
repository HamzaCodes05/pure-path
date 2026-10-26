import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { getFlights, type Flight } from "../api/flights";
import { getApartments, type Apartment } from "../api/apartments";
import { getHotels, type Hotel, type HotelCity } from "../api/hotels";
import {
  getRestaurants,
  type Restaurant,
  type RestaurantCity,
} from "../api/restaurants";
import { images } from "../data/purePath";
import {
  FlightTile,
  HotelTile,
  RestaurantTile,
} from "../components/PurePathCards";
import {
  PageHero,
  ScreenScroll,
  Section,
  SectionHeading,
} from "../components/ui";

const CITY_OPTIONS: { label: string; value: string | undefined }[] = [
  { label: "All cities", value: undefined },
  { label: "Makkah", value: "makkah" },
  { label: "Madinah", value: "madinah" },
];

// City dropdown; the backend filters hotels, apartments and restaurants by city.
function CityFilter({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (city: string | undefined) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = CITY_OPTIONS.find((option) => option.value === value);

  return (
    <View className="mb-5">
      <Text className="mb-2 text-[12px] font-extrabold uppercase text-pure-green">
        City
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="City filter"
        onPress={() => setOpen((c) => !c)}
        className="min-h-12 flex-row items-center justify-between rounded-lg border border-[#d9e3df] bg-pure-white px-3.5"
      >
        <Text className="text-[15px] font-bold text-pure-ink">
          {current?.label ?? "All cities"}
        </Text>
        <Text className="text-pure-muted">{open ? "▲" : "▼"}</Text>
      </Pressable>
      {open ? (
        <View className="mt-1 overflow-hidden rounded-lg border border-[#d9e3df] bg-pure-white">
          {CITY_OPTIONS.map((option) => (
            <Pressable
              key={option.label}
              onPress={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className="px-3.5 py-3"
            >
              <Text
                className={
                  option.value === value
                    ? "text-[15px] font-extrabold text-pure-green"
                    : "text-[15px] text-pure-ink"
                }
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const DISTANCE_OPTIONS = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];

// Dropdown for the distance-from-Haram filter; the backend does the filtering.
function DistanceFilter({
  value,
  onChange,
}: {
  value: number | undefined;
  onChange: (meters: number | undefined) => void;
}) {
  const [open, setOpen] = useState(false);
  const options: { label: string; meters: number | undefined }[] = [
    { label: "Any distance", meters: undefined },
    ...DISTANCE_OPTIONS.map((meters) => ({
      label: `Within ${meters} m`,
      meters,
    })),
  ];

  return (
    <View className="mb-5">
      <Text className="mb-2 text-[12px] font-extrabold uppercase text-pure-green">
        Distance from the Haram
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Distance filter"
        onPress={() => setOpen((current) => !current)}
        className="min-h-12 flex-row items-center justify-between rounded-lg border border-[#d9e3df] bg-pure-white px-3.5"
      >
        <Text className="text-[15px] font-bold text-pure-ink">
          {value ? `Within ${value} m` : "Any distance"}
        </Text>
        <Text className="text-pure-muted">{open ? "▲" : "▼"}</Text>
      </Pressable>
      {open ? (
        <View className="mt-1 overflow-hidden rounded-lg border border-[#d9e3df] bg-pure-white">
          {options.map((option) => (
            <Pressable
              key={option.label}
              onPress={() => {
                onChange(option.meters);
                setOpen(false);
              }}
              className="px-3.5 py-3"
            >
              <Text
                className={
                  option.meters === value
                    ? "text-[15px] font-extrabold text-pure-green"
                    : "text-[15px] text-pure-ink"
                }
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const FLIGHT_DATE_PRESETS: { label: string; value: string | undefined }[] = [
  { label: "All dates", value: undefined },
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Tomorrow", value: "tomorrow" },
];
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

// Flight date dropdown; the backend resolves today/yesterday/tomorrow or a YYYY-MM-DD date.
function FlightDateFilter({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (date: string | undefined) => void;
}) {
  const [open, setOpen] = useState(false);
  const [customMode, setCustomMode] = useState(false);
  const [customText, setCustomText] = useState("");
  const preset = FLIGHT_DATE_PRESETS.find((option) => option.value === value);
  const label = customMode
    ? "Select date"
    : (preset?.label ?? value ?? "All dates");

  return (
    <View className="mb-5">
      <Text className="mb-2 text-[12px] font-extrabold uppercase text-pure-green">
        Flight date
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Flight date filter"
        onPress={() => setOpen((current) => !current)}
        className="min-h-12 flex-row items-center justify-between rounded-lg border border-[#d9e3df] bg-pure-white px-3.5"
      >
        <Text className="text-[15px] font-bold text-pure-ink">{label}</Text>
        <Text className="text-pure-muted">{open ? "▲" : "▼"}</Text>
      </Pressable>
      {open ? (
        <View className="mt-1 overflow-hidden rounded-lg border border-[#d9e3df] bg-pure-white">
          {[
            ...FLIGHT_DATE_PRESETS,
            { label: "Select date…", value: "__custom" },
          ].map((option) => (
            <Pressable
              key={option.label}
              onPress={() => {
                setOpen(false);

                if (option.value === "__custom") {
                  setCustomMode(true);
                  return;
                }

                setCustomMode(false);
                setCustomText("");
                onChange(option.value);
              }}
              className="px-3.5 py-3"
            >
              <Text className="text-[15px] text-pure-ink">{option.label}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
      {customMode ? (
        <TextInput
          value={customText}
          onChangeText={(text) => {
            setCustomText(text);

            if (DATE_PATTERN.test(text)) {
              onChange(text);
            }
          }}
          placeholder="YYYY-MM-DD"
          keyboardType="numbers-and-punctuation"
          maxLength={10}
          className="mt-2 min-h-12 rounded-lg border border-[#d9e3df] bg-pure-white px-3.5 text-[15px] text-pure-ink"
        />
      ) : null}
    </View>
  );
}

const HOTEL_CITY_ORDER: HotelCity[] = ["makkah", "madinah"];
const HOTEL_CITY_LABELS: Record<HotelCity, string> = {
  makkah: "Makkah",
  madinah: "Madinah",
};

const RESTAURANT_CITY_ORDER: RestaurantCity[] = ["makkah", "madinah"];
const RESTAURANT_CITY_LABELS: Record<RestaurantCity, string> = {
  makkah: "Makkah",
  madinah: "Madinah",
};

const LISTING_SWIPER_STEP = 296;

function ListingSwiperButton({
  direction,
  label,
  onPress,
}: {
  direction: "left" | "right";
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className="h-10 w-10 items-center justify-center rounded-full border border-[#d9e3df] bg-pure-white active:opacity-70"
      style={[
        styles.swiperButton,
        direction === "left"
          ? styles.swiperButtonLeft
          : styles.swiperButtonRight,
      ]}
    >
      <View
        style={[
          styles.chevron,
          direction === "left" ? styles.chevronLeft : styles.chevronRight,
        ]}
      />
    </Pressable>
  );
}

function ListingSwiper({
  title,
  accessibilityLabel,
  children,
}: {
  title?: string;
  accessibilityLabel: string;
  children: ReactNode;
}) {
  const rowRef = useRef<ScrollView>(null);
  const scrollXRef = useRef(0);

  function scrollBy(direction: "left" | "right") {
    const directionOffset =
      direction === "left" ? -LISTING_SWIPER_STEP : LISTING_SWIPER_STEP;
    const nextOffset = Math.max(scrollXRef.current + directionOffset, 0);

    scrollXRef.current = nextOffset;
    rowRef.current?.scrollTo({
      x: nextOffset,
      animated: true,
    });
  }

  return (
    <View className="gap-3">
      {title ? (
        <Text
          numberOfLines={1}
          className="text-lg font-black leading-6 text-pure-green"
        >
          {title}
        </Text>
      ) : null}
      <View className="relative">
        <ScrollView
          ref={rowRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={LISTING_SWIPER_STEP}
          decelerationRate="fast"
          contentContainerClassName="gap-4 pr-5"
          onScroll={(event) => {
            scrollXRef.current = event.nativeEvent.contentOffset.x;
          }}
          scrollEventThrottle={16}
        >
          {children}
        </ScrollView>
        <ListingSwiperButton
          direction="left"
          label={`${accessibilityLabel} previous`}
          onPress={() => scrollBy("left")}
        />
        <ListingSwiperButton
          direction="right"
          label={`${accessibilityLabel} next`}
          onPress={() => scrollBy("right")}
        />
      </View>
    </View>
  );
}

export function JourneyScreen() {
  const [city, setCity] = useState<string | undefined>();
  const [maxDistance, setMaxDistance] = useState<number | undefined>();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isHotelsLoading, setIsHotelsLoading] = useState(true);
  const [hotelError, setHotelError] = useState<string | null>(null);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [isApartmentsLoading, setIsApartmentsLoading] = useState(true);
  const [apartmentError, setApartmentError] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isRestaurantsLoading, setIsRestaurantsLoading] = useState(true);
  const [restaurantError, setRestaurantError] = useState<string | null>(null);
  const [flightDate, setFlightDate] = useState<string | undefined>();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isFlightsLoading, setIsFlightsLoading] = useState(true);
  const [flightError, setFlightError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    setIsHotelsLoading(true);
    setHotelError(null);
    getHotels(maxDistance, city)
      .then((nextHotels) => {
        if (isMounted) {
          setHotels(nextHotels);
        }
      })
      .catch(() => {
        if (isMounted) {
          setHotelError("Hotel listings are unavailable right now.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsHotelsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [maxDistance, city]);

  useEffect(() => {
    let isMounted = true;

    setIsApartmentsLoading(true);
    setApartmentError(null);
    getApartments(maxDistance, city)
      .then((next) => isMounted && setApartments(next))
      .catch(
        () =>
          isMounted &&
          setApartmentError("Apartment listings are unavailable right now."),
      )
      .finally(() => isMounted && setIsApartmentsLoading(false));

    return () => {
      isMounted = false;
    };
  }, [maxDistance, city]);

  useEffect(() => {
    let isMounted = true;

    setIsRestaurantsLoading(true);
    setRestaurantError(null);
    getRestaurants(maxDistance, city)
      .then((nextRestaurants) => {
        if (isMounted) {
          setRestaurants(nextRestaurants);
        }
      })
      .catch(() => {
        if (isMounted) {
          setRestaurantError("Restaurant listings are unavailable right now.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsRestaurantsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [maxDistance, city]);

  useEffect(() => {
    let isMounted = true;

    setIsFlightsLoading(true);
    setFlightError(null);

    getFlights(flightDate)
      .then((nextFlights) => {
        if (isMounted) {
          setFlights(nextFlights);
        }
      })
      .catch(() => {
        if (isMounted) {
          setFlightError("Flight listings are unavailable right now.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsFlightsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [flightDate]);

  const hotelGroups = useMemo(() => {
    return HOTEL_CITY_ORDER.map((city) => ({
      city,
      title:
        hotels.find((hotel) => hotel.city === city)?.displayCity ??
        HOTEL_CITY_LABELS[city],
      hotels: hotels.filter((hotel) => hotel.city === city),
    })).filter((group) => group.hotels.length > 0);
  }, [hotels]);

  const apartmentGroups = useMemo(() => {
    return HOTEL_CITY_ORDER.map((city) => ({
      city,
      title:
        apartments.find((a) => a.city === city)?.displayCity ??
        HOTEL_CITY_LABELS[city],
      apartments: apartments.filter((a) => a.city === city),
    })).filter((group) => group.apartments.length > 0);
  }, [apartments]);

  const restaurantGroups = useMemo(() => {
    return RESTAURANT_CITY_ORDER.map((city) => ({
      city,
      title:
        restaurants.find((restaurant) => restaurant.city === city)
          ?.displayCity ?? RESTAURANT_CITY_LABELS[city],
      restaurants: restaurants.filter((restaurant) => restaurant.city === city),
    })).filter((group) => group.restaurants.length > 0);
  }, [restaurants]);

  return (
    <ScreenScroll className="bg-pure-softBg">
      <PageHero
        image={images.hero}
        title="Journey"
        body="Plan every step of your pilgrimage with hotels, restaurants, and flights close to the Holy Mosques."
      />

      <Section tone="paper">
        <CityFilter value={city} onChange={setCity} />
        <DistanceFilter value={maxDistance} onChange={setMaxDistance} />
        <SectionHeading eyebrow="Hotel Stays" title="Hotels" body="" />

        {isHotelsLoading ? (
          <Text className="text-[15px] leading-[22px] text-pure-muted">
            Loading hotels...
          </Text>
        ) : hotelError ? (
          <Text className="text-[15px] leading-[22px] text-pure-muted">
            {hotelError}
          </Text>
        ) : hotelGroups.length > 0 ? (
          <View className="gap-7">
            {hotelGroups.map((group) => (
              <View key={group.city}>
                <ListingSwiper
                  title={group.title}
                  accessibilityLabel={`${group.title} hotels`}
                >
                  {group.hotels.map((hotel) => (
                    <HotelTile key={hotel.id} item={hotel} />
                  ))}
                </ListingSwiper>
              </View>
            ))}
          </View>
        ) : (
          <Text className="text-[15px] leading-[22px] text-pure-muted">
            Hotel options are coming soon.
          </Text>
        )}
      </Section>

      <Section tone="soft">
        <SectionHeading
          eyebrow="Apartment Stays"
          title="Apartments"
          body="Spacious apartments in Makkah and Madinah, ideal for families and longer stays."
        />

        {isApartmentsLoading ? (
          <Text className="text-[15px] leading-[22px] text-pure-muted">
            Loading apartments...
          </Text>
        ) : apartmentError ? (
          <Text className="text-[15px] leading-[22px] text-pure-muted">
            {apartmentError}
          </Text>
        ) : apartmentGroups.length > 0 ? (
          <View className="gap-7">
            {apartmentGroups.map((group) => (
              <View key={group.city}>
                <ListingSwiper
                  title={group.title}
                  accessibilityLabel={`${group.title} apartments`}
                >
                  {group.apartments.map((apartment) => (
                    <HotelTile key={apartment.id} item={apartment} />
                  ))}
                </ListingSwiper>
              </View>
            ))}
          </View>
        ) : (
          <Text className="text-[15px] leading-[22px] text-pure-muted">
            Apartment options are coming soon.
          </Text>
        )}
      </Section>

      <Section tone="paper">
        <SectionHeading
          eyebrow="Nearby Dining"
          title="Restaurants Near the Holy Mosques"
          body="Browse nearby restaurant options in Makkah and Madinah with distance, category, rating, and review details."
        />

        {isRestaurantsLoading ? (
          <Text className="text-[15px] leading-[22px] text-pure-muted">
            Loading restaurants...
          </Text>
        ) : restaurantError ? (
          <Text className="text-[15px] leading-[22px] text-pure-muted">
            {restaurantError}
          </Text>
        ) : restaurantGroups.length > 0 ? (
          <View className="gap-7">
            {restaurantGroups.map((group) => (
              <View key={group.city}>
                <ListingSwiper
                  title={group.title}
                  accessibilityLabel={`${group.title} restaurants`}
                >
                  {group.restaurants.map((restaurant) => (
                    <RestaurantTile key={restaurant.id} item={restaurant} />
                  ))}
                </ListingSwiper>
              </View>
            ))}
          </View>
        ) : (
          <Text className="text-[15px] leading-[22px] text-pure-muted">
            Restaurant options are coming soon.
          </Text>
        )}
      </Section>

      <Section tone="soft">
        <FlightDateFilter value={flightDate} onChange={setFlightDate} />
        <SectionHeading
          eyebrow="Flight Options"
          title="Flights Ready for Your Journey"
          body="Browse active flight options with schedules, seats, fares, and direct booking links."
        />

        {isFlightsLoading ? (
          <Text className="text-[15px] leading-[22px] text-pure-muted">
            Loading flights...
          </Text>
        ) : flightError ? (
          <Text className="text-[15px] leading-[22px] text-pure-muted">
            {flightError}
          </Text>
        ) : flights.length > 0 ? (
          <ListingSwiper accessibilityLabel="Flights">
            {flights.map((flight) => (
              <FlightTile key={flight.id} item={flight} />
            ))}
          </ListingSwiper>
        ) : (
          <Text className="text-[15px] leading-[22px] text-pure-muted">
            Flight options are coming soon.
          </Text>
        )}
      </Section>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  swiperButton: {
    position: "absolute",
    top: "50%",
    marginTop: -20,
    zIndex: 2,
  },
  swiperButtonLeft: {
    left: 6,
  },
  swiperButtonRight: {
    right: 6,
  },
  chevron: {
    width: 10,
    height: 10,
    borderColor: "#075f42",
    borderTopWidth: 2,
    borderRightWidth: 2,
  },
  chevronLeft: {
    marginLeft: 4,
    transform: [{ rotate: "225deg" }],
  },
  chevronRight: {
    marginRight: 4,
    transform: [{ rotate: "45deg" }],
  },
});
