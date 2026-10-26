import { db } from "@/db";
import { flights } from "@/db/schema";
import { and, asc, eq, gte, lt } from "drizzle-orm";

export type Flight = {
  id: number;
  airline: string;
  departureCity: string;
  arrivalCity: string;
  departureLabel: string;
  arrivalLabel: string;
  durationLabel: string;
  fare: string;
  fareLabel: string;
  seatsAvailable: number;
  rating: string;
  bookingLink: string;
};

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function toDate(value: Date | string) {
  return value instanceof Date ? value : new Date(value);
}

function formatDateTime(value: Date | string) {
  const date = toDate(value);

  if (!Number.isFinite(date.getTime())) {
    return "Schedule pending";
  }

  return DATE_TIME_FORMATTER.format(date);
}

function formatDuration(departureTime: Date | string, arrivalTime: Date | string) {
  const departure = toDate(departureTime);
  const arrival = toDate(arrivalTime);
  const durationMs = arrival.getTime() - departure.getTime();

  if (!Number.isFinite(durationMs) || durationMs <= 0) {
    return "Duration TBD";
  }

  const totalMinutes = Math.round(durationMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes}m`;
  }

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}m`;
}

function formatFare(value: string) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return value;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
}

function formatRating(value: string) {
  const rating = Number(value);

  if (!Number.isFinite(rating)) {
    return value;
  }

  return rating.toFixed(1);
}

function toFlightPayload(row: typeof flights.$inferSelect): Flight {
  const departureTime = toDate(row.departureTime);
  const arrivalTime = toDate(row.arrivalTime);

  return {
    id: row.id,
    airline: row.airline,
    departureCity: row.departureCity,
    arrivalCity: row.arrivalCity,
    departureLabel: formatDateTime(departureTime),
    arrivalLabel: formatDateTime(arrivalTime),
    durationLabel: formatDuration(departureTime, arrivalTime),
    fare: row.fare,
    fareLabel: formatFare(row.fare),
    seatsAvailable: row.seatsAvailable,
    rating: formatRating(row.rating),
    bookingLink: row.bookingLink,
  };
}

// Accepts "today", "yesterday", "tomorrow" or a YYYY-MM-DD date and returns that
// calendar day (server time) as a [start, end) range, or null when unrecognised.
export function resolveFlightDate(value: unknown): { start: Date; end: Date } | null {
  if (typeof value !== "string") {
    return null;
  }

  const input = value.trim().toLowerCase();
  const day = new Date();
  day.setHours(0, 0, 0, 0);

  if (input === "yesterday") {
    day.setDate(day.getDate() - 1);
  } else if (input === "tomorrow") {
    day.setDate(day.getDate() + 1);
  } else if (input !== "today") {
    const match = input.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (!match) {
      return null;
    }

    day.setFullYear(Number(match[1]), Number(match[2]) - 1, Number(match[3]));

    if (!Number.isFinite(day.getTime())) {
      return null;
    }
  }

  const end = new Date(day);
  end.setDate(end.getDate() + 1);

  return { start: day, end };
}

export async function getActiveFlights(
  dateRange?: { start: Date; end: Date },
): Promise<Flight[]> {
  try {
    const rows = await db
      .select()
      .from(flights)
      .where(
        dateRange
          ? and(
              eq(flights.isActive, true),
              gte(flights.departureTime, dateRange.start),
              lt(flights.departureTime, dateRange.end),
            )
          : eq(flights.isActive, true),
      )
      .orderBy(
        asc(flights.departureCity),
        asc(flights.arrivalCity),
        asc(flights.departureTime),
        asc(flights.airline),
      );

    return rows.map(toFlightPayload);
  } catch (error) {
    console.error("GET_ACTIVE_FLIGHTS_ERROR:", error);
    return [];
  }
}
