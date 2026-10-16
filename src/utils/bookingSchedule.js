/**
 * Client-side mirror of the backend's recurring booking rules
 * (Tour.bookingRulesJsonb).
 *
 * The server is always authoritative — `POST /bookings` rejects with
 * BOOKINGS_CLOSED. This helper only powers the UI (hiding the booking form and
 * showing an explanatory message) so the visitor isn't allowed to fill in a
 * form that would fail at submit time.
 *
 * IMPORTANT: the daily cutoff and blocked weekdays are evaluated in the tour's
 * configured timezone (Africa/Cairo by default) using `Intl.DateTimeFormat`,
 * NOT in the visitor's local clock — so a traveller in another timezone sees
 * the same "closed" state as the back office.
 */

const DEFAULT_TIMEZONE = 'Africa/Cairo';

const WEEKDAYS = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

/** Current calendar date + minutes-since-midnight in the given IANA timezone. */
export function resolveNowInTimezone(timezone = DEFAULT_TIMEZONE) {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(new Date());

    const get = (type) => parts.find((part) => part.type === type)?.value ?? '';

    const hour = Number.parseInt(get('hour'), 10) % 24; // some runtimes report "24" at midnight
    const minute = Number.parseInt(get('minute'), 10);

    return {
      dateStr: `${get('year')}-${get('month')}-${get('day')}`,
      minutes:
        (Number.isFinite(hour) ? hour : 0) * 60 +
        (Number.isFinite(minute) ? minute : 0),
    };
  } catch {
    const now = new Date();
    return {
      dateStr: now.toISOString().split('T')[0],
      minutes: now.getUTCHours() * 60 + now.getUTCMinutes(),
    };
  }
}

/** 0=Sunday .. 6=Saturday for an ISO date interpreted in `timezone`. */
export function resolveWeekdayInTimezone(dateStr, timezone = DEFAULT_TIMEZONE) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr || '')) return null;
  try {
    const weekday = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'short',
    }).format(new Date(`${dateStr}T12:00:00Z`));
    return WEEKDAYS[weekday] ?? null;
  } catch {
    return null;
  }
}

/**
 * Evaluates a tour's booking rules.
 *
 * @param {object|null} rules  Tour.bookingRulesJsonb (or a tour object containing it)
 * @param {string} [arrivalDateStr]  Optional "YYYY-MM-DD" departure date to test
 * @returns {{ closed: boolean, reasonKey: string|null, reasonText: string|null }}
 */
export function getBookingScheduleStatus(rules, arrivalDateStr = '') {
  const normalized =
    rules && typeof rules === 'object' && rules.enabled === true ? rules : null;

  if (!normalized) {
    return { closed: false, reasonKey: null, reasonText: null };
  }

  const timezone =
    typeof normalized.cutoffTimezone === 'string' &&
    normalized.cutoffTimezone.trim()
      ? normalized.cutoffTimezone.trim()
      : DEFAULT_TIMEZONE;

  // 1. Explicit inclusive date ranges — most specific, checked first.
  const blockedRanges = Array.isArray(normalized.blockedRanges)
    ? normalized.blockedRanges
    : [];
  if (arrivalDateStr && blockedRanges.length > 0) {
    for (const range of blockedRanges) {
      const start = typeof range?.start === 'string' ? range.start.trim() : '';
      const end = typeof range?.end === 'string' ? range.end.trim() : '';
      if (!start || !end) continue;
      if (arrivalDateStr >= start && arrivalDateStr <= end) {
        const reason =
          typeof range?.reason === 'string' && range.reason.trim()
            ? range.reason.trim()
            : null;
        return {
          closed: true,
          reasonKey: 'booking.schedule.rangeBlocked',
          reasonText:
            reason || 'Bookings for this tour are unavailable for the selected date.',
        };
      }
    }
  }

  // 2. Blocked weekdays, evaluated in the configured timezone.
  const blockedWeekdays = Array.isArray(normalized.blockedWeekdays)
    ? normalized.blockedWeekdays
        .map((day) => Number(day))
        .filter((day) => Number.isInteger(day) && day >= 0 && day <= 6)
    : [];
  if (blockedWeekdays.length > 0 && arrivalDateStr) {
    const weekday = resolveWeekdayInTimezone(arrivalDateStr, timezone);
    if (weekday !== null && blockedWeekdays.includes(weekday)) {
      return {
        closed: true,
        reasonKey: 'booking.schedule.weekdayBlocked',
        reasonText:
          'This tour does not operate on the selected day. Please pick another date.',
      };
    }
  }

  // 3. Daily cutoff — blocks same-day departures after HH:mm in the configured timezone.
  const cutoffTime =
    typeof normalized.dailyCutoffTime === 'string'
      ? normalized.dailyCutoffTime.trim()
      : '';
  if (cutoffTime && arrivalDateStr) {
    const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(cutoffTime);
    if (match) {
      const cutoffMinutes =
        Number.parseInt(match[1], 10) * 60 + Number.parseInt(match[2], 10);
      const now = resolveNowInTimezone(timezone);

      if (arrivalDateStr === now.dateStr && now.minutes > cutoffMinutes) {
        return {
          closed: true,
          reasonKey: 'booking.schedule.cutoffPassed',
          reasonText: `Bookings for today close at ${cutoffTime} (${timezone}). Please select a later date.`,
        };
      }
    }
  }

  return { closed: false, reasonKey: null, reasonText: null };
}
