
/**
 * BrowserHelper.ts
 */
export class BrowserHelper {
    /**
     * Get the browser scrollbar height
     */
    public static GetSystemScrollbarHeight(): number {
        const outer = document.createElement('div');
        outer.style.visibility = 'hidden';
        outer.style.position = 'absolute';
        outer.style.top = '-9999px';
        outer.style.width = '200px';
        outer.style.height = '150px';
        outer.style.overflow = 'scroll';

        document.body.appendChild(outer);

        const inner = document.createElement('div');
        inner.style.width = '100%';
        inner.style.height = '100%';
        outer.appendChild(inner);

        const scrollbarHeight = outer.offsetHeight - outer.clientHeight;
        document.body.removeChild(outer);

        return scrollbarHeight;
    }
}
