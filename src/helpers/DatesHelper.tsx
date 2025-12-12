export type TimeUnit = "minute" | "hour" | "day" | "date" | "now";

export interface HumanReadableTime {
  value: number | string;
  unit: TimeUnit;
}


export default class DatesHelper {
    public static isCurrentDay(isoDate: string | null, day: Date): boolean {
        let iso = DatesHelper.isoToDate(isoDate);
        let result = (iso?.getFullYear() === day.getFullYear() && iso?.getMonth() === day.getMonth() && iso?.getDate() === day.getDate());
        return result;
    }

    public static isSameDay(source: Date | null, compare: Date | null): boolean {
        if (source === null || compare === null) return false;

        let result = (source.getFullYear() === compare.getFullYear() && source.getMonth() === compare.getMonth() && source.getDate() === compare.getDate());
        return result;
    }

    /**
     * Convertit une chaîne ISO 8601 en Date, ou retourne null si invalide.
     * - Pour "YYYY-MM-DD" (date-only), crée une Date à minuit en heure locale.
     * - Pour les ISO avec heure (et éventuellement timezone), utilise le parser natif.
     */
    public static isoToDate(isoDate: string | null): Date | null {
        if (!isoDate) return null;

        const s = isoDate.trim();
        if (s.length === 0) return null;

        // Cas "date-only" : YYYY-MM-DD (sans heure ni timezone)
        const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/;
        const m = s.match(dateOnly);
        if (m) {
            const year = Number(m[1]);
            const month = Number(m[2]); // 1-12
            const day = Number(m[3]);   // 1-31

            // Validation basique
            if (
                Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day) ||
                month < 1 || month > 12 || day < 1 || day > 31
            ) {
                return null;
            }

            // Interpréter en LOCAL TIME (évite un décalage d’un jour selon timezone)
            return new Date(year, month - 1, day, 0, 0, 0, 0);
        }

        // Sinon, utiliser le parseur natif pour les ISO avec heure et/ou timezone
        const d = new Date(s);
        return Number.isNaN(d.getTime()) ? null : d;
    }

    public static utc(date: Date): Date {
        return new Date(date.getTime());
    }

    public static addMinutes(date: Date, minutes: number): Date {
        const newDate = new Date(date.getTime());
        newDate.setMinutes(newDate.getMinutes() + minutes);
        return newDate;
    }

    public static addHours(date: Date, hours: number): Date {
        const newDate = new Date(date.getTime());
        newDate.setHours(newDate.getHours() + hours);
        return newDate;
    }

    public static addDays(date: Date, days: number): Date {
        const newDate = new Date(date.getTime());
        newDate.setDate(newDate.getDate() + days);
        return newDate;
    }

    public static addMonth(date: Date, month: number): Date {
        const newDate = new Date(date.getTime());
        newDate.setMonth(newDate.getMonth() + month);
        return newDate;
    }

    public static isBefore(left: Date, right: Date): boolean {
        return left.getTime() < right.getTime();
    }

    public static isAfter(left: Date, right: Date): boolean {
        return left.getTime() > right.getTime();
    }

    public static isSameOrBefore(left: Date, right: Date): boolean {
        return left.getTime() <= right.getTime();
    }

    public static isSameOrAfter(left: Date, right: Date): boolean {
        return left.getTime() >= right.getTime();
    }


    /**
      * Checks if a date is between two other dates.
      * @param date The date to check
      * @param start The start date
      * @param end The end date
      * @param inclusive Whether the comparison should include start and end (default: false)
      * @returns True if date is between start and end
      */
    public static isBetween(date: Date, start: Date, end: Date, inclusive: boolean = false): boolean {
        const time = date.getTime();
        const startTime = start.getTime();
        const endTime = end.getTime();

        if (inclusive) {
            return time >= startTime && time <= endTime;
        }
        return time > startTime && time < endTime;
    }

    /*

   * Returns a new Date set to the end of the specified unit.
   * Supported units: 'day', 'month', 'year'.
   * @param date The base date
   * @param unit The unit to set to its end
   */
    public static endOf(date: Date, unit: 'day' | 'month' | 'year'): Date {
        const d = new Date(date.getTime());

        switch (unit) {
            case 'day':
                // Set time to the last millisecond of the day
                d.setHours(23, 59, 59, 999);
                break;

            case 'month':
                // Move to the last day of the month and set time to the end of the day
                d.setMonth(d.getMonth() + 1, 0);
                d.setHours(23, 59, 59, 999);
                break;

            case 'year':
                // Move to December 31st and set time to the end of the day
                d.setMonth(11, 31);
                d.setHours(23, 59, 59, 999);
                break;

            default:
                throw new Error(`Unit "${unit}" is not supported`);
        }

        return d;
    }

    /**
       * Checks if two dates are the same for the given unit.
       * Supported units: 'millisecond', 'second', 'minute', 'hour', 'day', 'month', 'year'.
       * @param left First date
       * @param right Second date
       * @param unit The unit to compare
       */
    public static isSame(left: Date, right: Date, unit: 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year'): boolean {
        switch (unit) {
            case 'millisecond':
                return left.getTime() === right.getTime();

            case 'second':
                return Math.floor(left.getTime() / 1000) === Math.floor(right.getTime() / 1000);

            case 'minute':
                return Math.floor(left.getTime() / (1000 * 60)) === Math.floor(right.getTime() / (1000 * 60));

            case 'hour':
                return Math.floor(left.getTime() / (1000 * 60 * 60)) === Math.floor(right.getTime() / (1000 * 60 * 60));

            case 'day':
                return (
                    left.getFullYear() === right.getFullYear() &&
                    left.getMonth() === right.getMonth() &&
                    left.getDate() === right.getDate()
                );

            case 'month':
                return (
                    left.getFullYear() === right.getFullYear() &&
                    left.getMonth() === right.getMonth()
                );

            case 'year':
                return left.getFullYear() === right.getFullYear();

            default:
                throw new Error(`Unit "${unit}" is not supported`);
        }
    }


    /**
     * Returns the number of days in the month of the given date.
     * @param date The base date
     */
    public static daysInMonth(date: Date): number {
        const year = date.getFullYear();
        const month = date.getMonth(); // 0-based
        // Create a date for the first day of the next month, then go back one day
        return new Date(year, month + 1, 0).getDate();
    }

    /**
     * Returns a human readable date formated from local browser configuration
     * @param date The base date
     */
    public static toShortLocale(date: Date): string {
        return new Intl.DateTimeFormat(undefined, {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(date);
    }

    /**
   * Returns an object containing a value and a unit representing the elapsed time.
   * Rules:
   * - < 1 minute or future date => { value: 0, unit: "now" }
   * - < 60 minutes => { value: minutes, unit: "minute" }
   * - < 24 hours   => { value: hours, unit: "hour" }
   * - <= 10 days   => { value: days, unit: "day" }
   * - > 10 days    => { value: localized date string, unit: "date" }
   *
   * @param date The past date to compare to now.
   * @param locale Optional locale used when unit is "date" (default: "fr-FR").
   */
  public static toHumanReadableTime(date: Date): HumanReadableTime {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    // Handle future dates or sub-minute deltas
    if (diffMs <= 0) {
      return { value: 0, unit: "now" };
    }

    const minuteMs = 60 * 1000;
    const hourMs = 60 * minuteMs;
    const dayMs = 24 * hourMs;

    const diffMinutes = Math.floor(diffMs / minuteMs);
    const diffHours = Math.floor(diffMs / hourMs);
    const diffDays = Math.floor(diffMs / dayMs);

    // < 1 minute
    if (diffMinutes < 1) {
      return { value: 0, unit: "now" };
    }

    // Minutes
    if (diffMinutes < 60) {
      return { value: diffMinutes, unit: "minute" };
    }

    // Hours
    if (diffHours < 24) {
      return { value: diffHours, unit: "hour" };
    }

    // Days up to and including 10
    if (diffDays <= 10) {
      return { value: diffDays, unit: "day" };
    }

    // More than 10 days: return localized date string
    const formatted = date.toLocaleDateString();
    return { value: formatted, unit: "date" };
  }

}