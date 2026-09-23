const GOOGLE_PLACE_ID = "ChIJ9XK3t-y1vJURCkX9eFYbcGY";
const GOOGLE_REVIEWS_REVALIDATE_SECONDS = 60 * 60 * 24;

type GoogleReview = {
    authorAttribution?: { displayName?: string };
    googleMapsUri?: string;
    rating?: number;
    relativePublishTimeDescription?: string;
    originalText?: { languageCode?: string; text?: string };
    text?: { languageCode?: string; text?: string };
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

    const placeUrl = new URL(`https://places.googleapis.com/v1/places/${GOOGLE_PLACE_ID}`);
    placeUrl.searchParams.set("languageCode", "es");
    placeUrl.searchParams.set("regionCode", "AR");

    const response = await fetch(placeUrl, {
        headers: {
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask": [
                "rating",
                "userRatingCount",
                "googleMapsUri",
                "reviews.authorAttribution",
                "reviews.googleMapsUri",
                "reviews.rating",
                "reviews.relativePublishTimeDescription",
                "reviews.originalText",
                "reviews.text",
            ].join(","),
        },
        next: { revalidate: GOOGLE_REVIEWS_REVALIDATE_SECONDS },
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
                .filter((review) => review.text?.text ?? review.originalText?.text)
                .map((review) => ({
                    author: review.authorAttribution?.displayName ?? "Cliente de ERA",
                    rating: review.rating ?? 5,
                    text: review.text?.text ?? review.originalText?.text ?? "",
                    time: review.relativePublishTimeDescription ?? "",
                    url: review.googleMapsUri,
                })),
        },
        {
            headers: {
                "Cache-Control": `public, s-maxage=${GOOGLE_REVIEWS_REVALIDATE_SECONDS}, stale-while-revalidate=604800`,
            },
        },
    );
}
