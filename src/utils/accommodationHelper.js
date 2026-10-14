/**
 * Helpers for tour accommodation rows (`hotelInfo.accommodation` / `tour.accommodations`).
 *
 * Legacy tours carry seeded placeholder rows that only describe a generic stay,
 * for example `{ nights: 3, regime: 'Bed & Breakfast', destination: 'Cairo' }`.
 * Those rows have no hotel identity, pricing, category or boat data, so rendering
 * them produced an identical fake "Luxury Partner Hotel" card on every trip.
 *
 * Only rows that carry real, displayable hotel data are considered meaningful.
 */

export function isMeaningfulAccommodation(acc) {
  if (!acc || typeof acc !== 'object') return false;

  const hotel = acc.hotel || {};
  const room = acc.room || {};

  // A real hotel identity: a name (localized or plain) or a hotel slug.
  const hasIdentity = Boolean(
    acc.nameJsonb ||
      acc.hotelName ||
      acc.name ||
      hotel.nameJsonb ||
      hotel.name ||
      hotel.slug
  );

  // A manually entered category (e.g. "4" or "5_STAR").
  const hasCategory = Boolean(
    String(acc.categoryTier || acc.category || hotel.categoryTier || hotel.category || '').trim()
  );

  // A boat / Nile cruise assignment.
  const hasBoat =
    Boolean(acc.boatJsonb || acc.boatName) ||
    Number(acc.boatPriceUsd ?? acc.boatPrice) > 0;

  // Any rate entered in the dashboard rate sheet.
  const hasPrice = [
    acc.doubleRoomPriceUsd,
    acc.doubleRoomPrice,
    acc.singleRoomPriceUsd,
    acc.singleRoomPrice,
    acc.seasonSupplementUsd,
    acc.seasonSupplement,
    acc.priceSupplementUsd,
    acc.priceSupplement,
    hotel.ratePerNight,
    hotel.basePriceUsd,
  ].some((value) => Number(value) > 0);

  // A relational room assignment with usable data.
  const hasRoom = Boolean(
    room &&
      (room.slug ||
        room.name ||
        room.nameJsonb ||
        Number(room.ratePerNight ?? room.basePriceUsd) > 0)
  );

  return hasIdentity || hasCategory || hasBoat || hasPrice || hasRoom;
}

export function filterMeaningfulAccommodations(list) {
  return (Array.isArray(list) ? list : []).filter(isMeaningfulAccommodation);
}

export default { isMeaningfulAccommodation, filterMeaningfulAccommodations };
