import { tabbable } from "tabbable";
import { DefaultOptions } from "./interfaces";

const defaultOptions: DefaultOptions = {
    active: true,
    disableOnEsc: true,
    focusOnEnable: true,
    blurOnDisable: false,
    disableLoop: false,
};

export class FocusTrap {
    private elements: HTMLElement[];
    public options: DefaultOptions;

    eventHandlerKeydown: ($event: KeyboardEvent) => void = ($event: KeyboardEvent) => this.bindKeyDown($event);
    eventHandlerFocusIn: ($event: FocusEvent) => void = ($event: FocusEvent) => this.bindFocusIn($event);

    /**
     * Constructor
     *
     * @param element - HTML Element or array of HTML Elements to bind to, tab order follows array order
     * @param options - Configure the FocusTrap
     */
    public constructor(element: HTMLElement | HTMLElement[], options: object = {}) {
        if (!element) throw new Error("HTMLElement must be provided");

        // normalize to array, validate each entry
        this.elements = Array.isArray(element) ? element : [element];
        if (this.elements.length === 0) throw new Error("At least one HTMLElement must be provided");
        this.elements.forEach((el, i) => {
            if (!(el instanceof HTMLElement)) throw new Error(`Element at index ${i} is not a valid HTMLElement`);
        });

        this.options = {
            ...defaultOptions,
            ...options,
        };

        this.elements.forEach((el) => el.addEventListener("focusin", this.eventHandlerFocusIn));
        if (this.options.active === true) this.enable();
    }

    /**
     * Enables the focustrap. When enabled you can only tab to tabbable elements.
     */
    public enable(): void {
        this.options.active = true;
        this.addListener();
        if (this.options.focusOnEnable === true) {
            this.focusFirst();
        }
        this.options.onEnable?.();
    }

    /**
     * Disables the focustrap
     */
    public disable(): void {
        this.options.active = false;
        if (this.options.blurOnDisable) (document.activeElement as HTMLElement).blur();
        this.removeListener();
        this.options.onDisable?.();
    }

    /**
     * Focus on the first element returned by getTabble()
     */
    public focusFirst(): void {
        const tabble = this.getTabble();
        if (tabble.length) {
            tabble[0].focus();
        }
        this.options.onFocus?.();
    }

    /**
     * Add eventListener
     */
    private addListener(): void {
        this.elements.forEach((el) => el.addEventListener("keydown", this.eventHandlerKeydown));
    }

    /**
     * Remove eventListener
     */
    private removeListener(): void {
        this.elements.forEach((el) => el.removeEventListener("keydown", this.eventHandlerKeydown));
    }

    /**
     * Get all tabbable children across all elements, in the order elements were provided
     * @return Array of HTML Elements
     */
    public getTabble(): HTMLElement[] {
        return this.elements.flatMap((el) => tabbable(el) as HTMLElement[]);
    }

    /**
     * Listen to keydown events
     */
    private bindKeyDown(e: KeyboardEvent): void {
        if (this.isEsc(e) && this.options.disableOnEsc === true) return this.disable();

        const direction = this.isTab(e);
        if (direction !== 0) {
            e.preventDefault();
            this.moveFocus(e, direction);
        }
    }

    /**
     * Check to see if element focus is within our tabbable elements
     */
    private bindFocusIn(e: FocusEvent): void {
        const tabs = this.getTabble();
        if (this.options.active) {
            if (!tabs.find((q: HTMLElement) => (e.target as HTMLElement) === q)) {
                this.focusFirst();
            }
        }
    }

    /**
     * Move focus to next or previous element in our tabbable list
     * @param e - Keyboard event
     * @param direction - "-1" for backwards "1" for forwards
     */
    private moveFocus(e: KeyboardEvent, direction: number): void {
        const children = this.getTabble();
        const index = children.findIndex((el: HTMLElement) => el === e.target);
        if (index === -1) return;

        const moveTo = index + direction;

        if ((moveTo < 0 || moveTo > children.length - 1) && this.options.disableLoop) return;

        const next = ((moveTo % children.length) + children.length) % children.length;
        children[next].focus();

        this.options.onMove?.(e, direction);
    }

    /**
     * Detect if escape is pressed
     * @param key - Keyboard event
     * @return is "Escape" pressed?
     */
    private isEsc(key: KeyboardEvent): boolean {
        if (key.key === "Escape" || key.keyCode === 27) return true;
        return false;
    }

    /**
     * Get the tab direction
     * @param key - Keyboard event
     * @return tab direction
     */
    private isTab(key: KeyboardEvent): number {
        const isTab = this.isTabKey(key);
        if (!isTab) return 0;
        if (key.shiftKey === true) return -1;
        return 1;
    }

    /**
     * Detect if the tab key pressed
     * @param key - Keyboard event
     * @return is "Tab" pressed?
     */
    private isTabKey(key: KeyboardEvent): boolean {
        if (key.key === "Tab" || key.keyCode === 9) return true;
        return false;
    }
}
