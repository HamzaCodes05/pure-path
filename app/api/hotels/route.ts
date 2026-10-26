import { db } from "@/db";
import { normalizeMaxDistance } from "@/lib/distance";
import { hotels } from "@/db/schema";
import { getActiveHotels, normalizeHotelCity } from "@/lib/hotels";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = normalizeHotelCity(searchParams.get("city"));

    const maxDistance =
      normalizeMaxDistance(searchParams.get("maxDistance")) ?? undefined;

    const result = await getActiveHotels(city ?? undefined, maxDistance);

    return Response.json({
      success: true,
      data: result,
      hotels: result,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch hotels",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const hotel = await db.insert(hotels).values(body);

    return Response.json(
      {
        success: true,
        data: hotel[0],
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to create hotel",
      },
      { status: 500 },
    );
  }
}
