import accomodations from "./data.json";

export const dynamic = "force-dynamic"; // defaults to auto
export async function GET() {
  console.log("Fetching listings...");
  try {
    const result = accomodations;
    return Response.json(result);
  } catch (error) {
    console.log(error);
    return Response.error();
  }
}
