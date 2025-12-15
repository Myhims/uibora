import { NumberHelper } from "./NumberHelper";
import { StringHelper } from "./StringHelper";

/**
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

    /**
     * Computes an HSL color going from red (0%) through yellow (50%) to green (100%).
     * This uses hue 0..120 with fixed saturation and lightness for good legibility.
     */

    public static valueToAutoColor(value: number): string {
        const clamped = NumberHelper.clamp(value, 0, 100);
        const t = clamped / 100;

        // Hardcoded gamma values
        const gammaStart = 2; // controls early curve
        const gammaEnd = 2.5;   // controls late curve
        const mid = 1;       // pivot point (yellow zone)

        let hueFrac: number;
        if (t <= mid) {
            // Early segment: ease-in with gammaStart
            const normalized = t / mid;
            hueFrac = Math.pow(normalized, gammaStart) * mid;
        } else {
            // Late segment: ease-out with gammaEnd
            const normalized = (t - mid) / (1 - mid);
            hueFrac = mid + (1 - Math.pow(1 - normalized, gammaEnd)) * (1 - mid);
        }

        const hue = 120 * hueFrac; // 0° = red, 120° = green
        return `hsl(${hue}deg 80% 45%)`;
    }

    /** Pick contrasting text color based on lightness */
    public static hslToTextColor({ l }: { h: number; s: number; l: number }): string {
        return l >= 60 ? "#1a1a1a" : "#ffffff";
    }

    /** Generate HSL color textes */
    public static textsToHsl(text: string): { h: number; s: number; l: number } {
        const base = StringHelper.stringHash(text);
        const h = base % 360;
        const s = 55;
        const l = 55;
        return { h, s, l };
    }
}
