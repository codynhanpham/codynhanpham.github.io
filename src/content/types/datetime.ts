import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

type RegexMatchedString<Pattern extends RegExp> = string & { __regexPattern: Pattern };
const iso8601DateRegex = /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])T(?:[01]\d|2[0-3])(?::[0-5]\d(?::[0-5]\d(?:\.\d{3})?)?)?(?:[+-](?:[01]\d|2[0-4]):[0-5]\d|Z)?$/;
/**
 * A string that matches the ISO 8601 date-time format.
 * Including the time zone offset is recommended. If unzoned, the date will be interpreted as the local timezone client-side.
 * 
 * To quickly get this string, relative to UTC, use ```new Date().toISOString()```.
 * 
 * Some examples:
 * 
 * - `2025-12-25T00:00:00.000Z`
 * - `2025-12-25T06:00:00.000+09:00`
 * - `2025-12-25T06:09:40-06:00`
 * - `2025-12-25T06:09`
 */
export type Iso8601DateString = RegexMatchedString<typeof iso8601DateRegex>;
export function isIso8601DateString(value: unknown): value is Iso8601DateString {
    return typeof value === 'string' && iso8601DateRegex.test(value);
}


/**
 * Converts a string<DateTimeString> to a Date object.
 * 
 * If the string is not a valid date, an error is thrown.
 * 
 * @param value The string to convert to a Date object.
 * @returns A Date object representing the string.
 */
export function datetime(value: Iso8601DateString): Date {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
        throw new Error(`Invalid date: ${value}`);
    }
    return date;
}

/**
 *  Returns a human-readable string representing the current (client-side) time since/to the given datetime string.
 *  
 *  See more: https://day.js.org/docs/en/display/from-now
 */
export function humanTimeSince(value: Iso8601DateString): string {
    const date = datetime(value);
    return dayjs(date).fromNow();
}