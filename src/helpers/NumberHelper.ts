export class NumberHelper {
    /**
     * Clamp a numeric value between min and max boundaries
     */
    public static clamp(value: number, min: number, max: number): number {
        // Handle NaN explicitly to avoid returning NaN silently
        if (Number.isNaN(value)) return min;
        if (min > max) [min, max] = [max, min]; // swap if boundaries are inverted
        return Math.min(Math.max(value, min), max);
    }
}
