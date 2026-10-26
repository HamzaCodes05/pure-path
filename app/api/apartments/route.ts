import { db } from "@/db";
import { normalizeMaxDistance } from "@/lib/distance";
import { apartments } from "@/db/schema";
import { getActiveApartments } from "@/lib/apartments";
import { normalizeHotelCity } from "@/lib/hotels";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = normalizeHotelCity(searchParams.get("city"));

    const maxDistance =
      normalizeMaxDistance(searchParams.get("maxDistance")) ?? undefined;

    const result = await getActiveApartments(city ?? undefined, maxDistance);

    return Response.json({
      success: true,
      data: result,
      apartments: result,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { success: false, message: "Failed to fetch apartments" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const apartment = await db.insert(apartments).values(body);

    return Response.json(
      { success: true, data: apartment[0] },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      { success: false, message: "Failed to create apartment" },
      { status: 500 },
    );
  }
}
