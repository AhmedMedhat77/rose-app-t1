// app/api/reviews/route.ts
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  const page = searchParams.get("page") ?? "1";
  const limit = searchParams.get("limit") ?? "10";

  const res = await fetch(
    `${process.env.API_URL}/reviews?productId=${productId}&page=${page}&limit=${limit}`,
    { cache: "no-store" },
  );

  return Response.json(await res.json(), { status: res.status });
}
