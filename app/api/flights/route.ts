import { db } from "@/db";
import { flights } from "@/db/schema";
import { getActiveFlights, resolveFlightDate } from "@/lib/flights";

type FlightRequestBody = Record<string, unknown>;

function getValue(body: FlightRequestBody, ...keys: string[]) {
  for (const key of keys) {
    if (body[key] !== undefined) {
      return body[key];
    }
  }

  return undefined;
}

function normalizeString(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();

  return normalized.length > 0 ? normalized : null;
}

function normalizeDate(value: unknown) {
  if (value instanceof Date) {
    return Number.isFinite(value.getTime()) ? value : null;
  }

  if (typeof value !== "string" && typeof value !== "number") {
    return null;
  }

  const date = new Date(value);

  return Number.isFinite(date.getTime()) ? date : null;
}

function normalizeDecimal(value: unknown) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return null;
  }

  return amount.toString();
}

function normalizeInteger(value: unknown, fallback = 0) {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  const integer = Number(value);

  if (!Number.isFinite(integer) || integer < 0) {
    return null;
  }

  return Math.round(integer);
}

function normalizeBoolean(value: unknown) {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (normalized === "true") {
      return true;
    }

    if (normalized === "false") {
      return false;
    }
  }

  return null;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateRange = resolveFlightDate(searchParams.get("date"));

    const result = await getActiveFlights(dateRange ?? undefined);

    return Response.json({
      success: true,
      data: result,
      flights: result,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch flights",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as FlightRequestBody;
    const airline = normalizeString(body.airline);
    const departureCity = normalizeString(
      getValue(body, "departureCity", "departure_city"),
    );
    const arrivalCity = normalizeString(
      getValue(body, "arrivalCity", "arrival_city"),
    );
    const departureTime = normalizeDate(
      getValue(body, "departureTime", "departure_time"),
    );
    const arrivalTime = normalizeDate(
      getValue(body, "arrivalTime", "arrival_time"),
    );
    const fare = normalizeDecimal(body.fare);
    const seatsAvailable = normalizeInteger(
      getValue(body, "seatsAvailable", "seats_available"),
    );
    const rating = normalizeDecimal(body.rating);
    const bookingLink = normalizeString(
      getValue(body, "bookingLink", "booking_link"),
    );
    const isActive = normalizeBoolean(getValue(body, "isActive", "is_active"));

    if (
      !airline ||
      !departureCity ||
      !arrivalCity ||
      !departureTime ||
      !arrivalTime ||
      !fare ||
      seatsAvailable === null ||
      !rating ||
      !bookingLink ||
      isActive === null
    ) {
      return Response.json(
        {
          success: false,
          message:
            "airline, departureCity, arrivalCity, departureTime, arrivalTime, fare, rating, and bookingLink are required. Send departureTime and arrivalTime as valid date strings.",
        },
        { status: 400 },
      );
    }

    const flight = await db.insert(flights).values({
      airline,
      departureCity,
      arrivalCity,
      departureTime,
      arrivalTime,
      fare,
      seatsAvailable,
      rating,
      bookingLink,
      ...(isActive === undefined ? {} : { isActive }),
    });

    return Response.json(
      {
        success: true,
        data: flight[0],
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to create flight",
      },
      { status: 500 },
    );
  }
}
