import { DefaultOptions} from './interfaces';

const defaultOptions:DefaultOptions = {
    active: true,
    disableOnEsc: true,
    focusOnEnable: true,
    blurOnDisable: false,
    tabble: [
        'a[href]:not([style*="visibility:hidden"])',
        'input:not([disabled]):not([style*="visibility:hidden"])',
        'button:not([disabled]):not([style*="visibility:hidden"])',
        'textarea:not([disabled]):not([style*="visibility:hidden"])',
        'select:not([disabled]):not([style*="visibility:hidden"])',
        'details:not([disabled]):not([style*="visibility:hidden"])',
        '[tabindex]:not([tabindex="-1"]):not([style*="visibility:hidden"])'
    ]
}

export class FocusTrap {
    element: HTMLElement;
    options: DefaultOptions;

    eventHandlerKeydown: ($event:KeyboardEvent) => void = ($event:KeyboardEvent) => this.bindKeyDown($event);
    eventHandlerFocusIn: ($event:FocusEvent) => void = ($event:FocusEvent) =>  this.bindFocusIn($event);

   /**
   * Constructor
   *
   * @param element - HTML ELement to bind to
   * @param options - Configure the FocusTrap
   *
   */
    public constructor(element:HTMLElement, options:Object={}) {
        this.element = element;
        this.options = {
            ...defaultOptions,
            ...options
        };

        this.element.addEventListener('focusin', this.eventHandlerFocusIn);
        if(this.options.active === true)
            this.enable();
    } 

    /**
    * Enables the focustrap. When enabled you can only tab to our defined 'tabble' elements. 
    */
    public enable():void {
        this.options.active = true;
        this.addListener();
        if(this.options.focusOnEnable === true) {
            this.focusFirst();
        }
    }

    /**
    * Disables the focustrap
    */
    public disable():void {
        this.options.active = false;
        if(this.options.blurOnDisable)
            (document.activeElement as HTMLElement).blur();
        this.removeListener();
    }
    
    /**
    * Focus on the first element returned by getTabble()
    */
    private focusFirst():void {
        const tabble = this.getTabble();
        if(tabble)
            tabble[0].focus();
    }

    /**
    * Returns all tabble queries
    * @returns an array of queryable strings
    */
    public getOptionTabble(): string[] {
        return this.options.tabble;
    }

    /**
    * Add tabble query string to list of tabble items
    * @param query - Query string
    */
    public addOptionTabble(query:string): void {
        this.options.tabble.push(query);
    }

    /**
    * Remove a query string from the tabble options
    * @param query - Query string or index to remove
    */
    public removeOptionTabble(query:string|number): boolean {        
        let index:number;
        if(typeof query === 'string') {
            index = this.options.tabble.findIndex((x:string) => x === query);
        } else {
            index = query;
        }
        
        if(index === null)
            return false;
        
        this.options.tabble.splice(index, 1);
        return true;
    }
    
    /**
    * Add eventListener
    */
    private addListener():void {
        this.element.addEventListener('keydown', this.eventHandlerKeydown)
    }

    /**
    * Remove eventListener
    */
    private removeListener():void {
        this.element.removeEventListener('keydown', this.eventHandlerKeydown )
    }

    /**
    * Get all tabble children of the focustrap element
    * @return Array of HTML Elements
    */
    private getTabble():HTMLElement[] {
        const element:NodeListOf<HTMLElement> = this.element.querySelectorAll<HTMLElement>(this.options.tabble.join(','));
        return (Array.from(element)).filter((e:HTMLElement) => !e.hidden && ((e.offsetWidth > 0 && e.offsetHeight > 0 && e.offsetParent !== null)));
    }

    /**
    * Listen to keydown events
    */
    private bindKeyDown(e:KeyboardEvent):void {
        if(this.isEsc(e) && this.options.disableOnEsc === true)  return this.disable();
            
        const direction = this.isTab(e);
        if(direction !== 0) {
            e.preventDefault();
            this.moveFocus(e, direction);
        }
    }

    /**
    * Check to see if element focus is within our tabble elements
    */
    private bindFocusIn(e:FocusEvent): void {   
        const tabs = this.getTabble();
        if(this.options.active) {
            if(!tabs.find((q:HTMLElement) => (e.target as HTMLElement) === q)) {
                this.focusFirst();
            }        
        }
        
    }
    
    /**
    * Move focus to next or previous element in our tabble list
    * @param e - Keyboard event 
    * @param direction - "-1" for backwards "1" for forwards
    */
    private moveFocus(e:KeyboardEvent, direction:number):void {
        const children = this.getTabble();
        const index = children.findIndex((el:HTMLElement) => el === e.target);
        let moveTo = index + direction;

        if(moveTo > (children.length -1))
            moveTo = 0;
        if(moveTo < 0) {
            moveTo = children.length - 1;
        }
        children[moveTo].focus();
    }

    /**
    * Detect if escape is pressed
    * @param key - Keyboard event 
    * @return is "Escape" pressed?
    */
    private isEsc(key:KeyboardEvent):boolean {
        if(key.key === "Escape" || key.keyCode === 27)
            return true;
        return false;
    }

    /**
    * Get the tab direction
    * @param key - Keyboard event 
    * @return tab direction
    */
    private isTab(key:KeyboardEvent):number {
        const isTab = this.isTabKey(key);
        if(!isTab)
            return 0;
        if(key.shiftKey === true) {
            return -1;
        }
        return 1;        
    }
    
    /**
    * Detect if the tab key pressed
    * @param key - Keyboard event 
    * @return is "Tab" pressed?
    */
    private isTabKey(key:KeyboardEvent):boolean {
        if(key.key === "Tab" || key.keyCode === 9)
            return true;
        return false;
    }
}