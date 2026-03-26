export interface DefaultOptions {
    active: boolean;
    disableOnEsc: boolean;
    focusOnEnable: boolean;
    blurOnDisable: boolean;
    disableLoop: boolean;
    onEnable?: () => void;
    onDisable?: () => void;
    onFocus?: () => void;
    onMove?: (e: KeyboardEvent, direction: number) => void;
}
