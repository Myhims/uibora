
/**
 * ColorHelper.ts
 * Utility class for color conversions.
 */
export class ColorHelper {
    /**
     * Converts a HEX color string to an RGB string.
     * @param hex - The HEX color string (e.g., "#FFFFFF" or "FFFFFF").
     * @returns The RGB representation as a string (e.g., "rgb(255, 255, 255)").
     */
    public static HexToRgb(hex: string): string {
        // Remove the hash symbol if present
        hex = hex.replace(/^#/, '');

        // Validate hex format
        if (!/^([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(hex)) {
            throw new Error('Invalid HEX color format');
        }

        // Expand shorthand (e.g., "FFF" -> "FFFFFF")
        if (hex.length === 3) {
            hex = hex.split('').map(char => char + char).join('');
        }

        // Convert to RGB values
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        return `${r}, ${g}, ${b}`;
    }
}
