import { FocusTrap } from "./index";

const trapEl = document.getElementById("trap") as HTMLElement;
const trapEl2 = document.getElementById("trap2") as HTMLElement;
const disableBtn = document.getElementById("disable") as HTMLElement;

// ── helpers ───────────────────────────────────────────────────────────────────

const toggle = (target: HTMLElement, option: boolean) => {
    if (option) {
        target.innerText = "Enable";
        return false;
    } else {
        target.innerText = "Disable";
        return true;
    }
};

function updateStatus(active: boolean) {
    const indicator = document.getElementById("status-indicator") as HTMLElement;
    const statusText = document.getElementById("status-text") as HTMLElement;
    if (indicator && statusText) {
        indicator.classList.toggle("active", active);
        indicator.classList.toggle("inactive", !active);
        statusText.innerText = active ? "Active" : "Inactive";
    }
}

function appendLog(msg: string) {
    const log = document.getElementById("event-log") as HTMLElement;
    if (!log) return;
    const empty = log.querySelector(".log-empty");
    if (empty) empty.remove();
    const entry = document.createElement("li");
    entry.innerText = msg;
    log.prepend(entry);
    if (log.children.length > 20) log.lastElementChild?.remove();
}

// ── focus trap ────────────────────────────────────────────────────────────────

const focus = new FocusTrap([trapEl, trapEl2], {
    onEnable: () => {
        updateStatus(true);
        disableBtn.innerText = "Disable";
    },
    onDisable: () => {
        updateStatus(false);
        disableBtn.innerText = "Enable";
    },
    onMove: (e: KeyboardEvent, direction: number) => {
        const dir = direction === 1 ? "→" : "←";
        const tag = (e.target as HTMLElement).tagName.toLowerCase();
        appendLog(`move ${dir} from <${tag}>`);
    },
});

// ── controls ──────────────────────────────────────────────────────────────────

(document.getElementById("disable") as HTMLElement).addEventListener("click", () => {
    if (focus.options.active) {
        focus.disable();
    } else {
        focus.enable();
    }
});

(document.getElementById("disableOnEsc") as HTMLElement).addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    focus.options.disableOnEsc = toggle(target, focus.options.disableOnEsc);
    focus.focusFirst();
});

(document.getElementById("focusOnEnable") as HTMLElement).addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    focus.options.focusOnEnable = toggle(target, focus.options.focusOnEnable);
    focus.focusFirst();
});

(document.getElementById("blurOnDisable") as HTMLElement).addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    focus.options.blurOnDisable = toggle(target, focus.options.blurOnDisable);
    focus.focusFirst();
});

(document.getElementById("disableLoop") as HTMLElement).addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    focus.options.disableLoop = toggle(target, focus.options.disableLoop);
    focus.focusFirst();
});

(document.getElementById("log-clear") as HTMLElement)?.addEventListener("click", () => {
    const log = document.getElementById("event-log") as HTMLElement;
    log.innerHTML = '<li class="log-empty">No events yet</li>';
});

// ── external element demo ─────────────────────────────────────────────────────

const externalBtn = document.getElementById("external-btn") as HTMLElement;

const focusExternal = new FocusTrap(document.getElementById("external-trap") as HTMLElement, {
    active: false,
    disableLoop: true,
    onDisable: () => {
        externalBtn.focus();
        appendLog("disabled → returned focus to external button");
    },
});

externalBtn.addEventListener("click", () => {
    focusExternal.enable();
    appendLog("external trap enabled");
});
