export interface DefaultOptions {
    active: boolean;
    disableOnEsc: boolean;
    focusOnEnable: boolean;
    blurOnDisable: boolean;
    disableLoop: boolean;
    onEnable?: () => void;
    onDisable?: () => void;
    onFocus?: () => void;
    onFocusOut?: (e: FocusEvent) => void;
    onMove?: (e: HTMLElement, direction: number) => void;
}
