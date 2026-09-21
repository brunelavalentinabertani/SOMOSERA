const GOOGLE_PLACE_ID = "ChIJ9XK3t-y1vJURCkX9eFYbcGY";

type GoogleReview = {
    authorAttribution?: { displayName?: string };
    googleMapsUri?: string;
    rating?: number;
    relativePublishTimeDescription?: string;
    text?: { text?: string };
};

type GooglePlace = {
    googleMapsUri?: string;
    rating?: number;
    reviews?: GoogleReview[];
    userRatingCount?: number;
};

export async function GET() {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
        return Response.json({ error: "Google Places API is not configured" }, { status: 503 });
    }

    const response = await fetch(`https://places.googleapis.com/v1/places/${GOOGLE_PLACE_ID}`, {
        headers: {
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask": "rating,userRatingCount,reviews,googleMapsUri",
        },
        next: { revalidate: 3600 },
    });

    if (!response.ok) {
        return Response.json({ error: "Google reviews are temporarily unavailable" }, { status: 502 });
    }

    const place = (await response.json()) as GooglePlace;

    return Response.json(
        {
            rating: place.rating ?? 0,
            total: place.userRatingCount ?? 0,
            mapsUrl: place.googleMapsUri,
            reviews: (place.reviews ?? [])
                .filter((review) => review.text?.text)
                .map((review) => ({
                    author: review.authorAttribution?.displayName ?? "Cliente de ERA",
                    rating: review.rating ?? 5,
                    text: review.text?.text ?? "",
                    time: review.relativePublishTimeDescription ?? "",
                    url: review.googleMapsUri,
                })),
        },
        { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } },
    );
}
