export class StringHelper {
    /** Compute a simple deterministic hash from a string */
    public static stringHash(input: string): number {
        let hash = 0;
        for (let i = 0; i < input.length; i++) {
            hash = (hash << 5) - hash + input.charCodeAt(i);
            hash |= 0; // 32-bit int
        }
        return Math.abs(hash);
    }
}