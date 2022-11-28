import {FocusTrap} from './index';

const trap = (document.getElementById('trap') as HTMLElement);
const focus = new FocusTrap(trap);


const toggle = (target:HTMLElement, option:boolean) => {
	if(option) {
		target.innerText = 'Enable';
		return false;
	} else {
		target.innerText = 'Disable';
		return true;
	}
};

(document.getElementById('disable') as HTMLElement).addEventListener("click", (e) => {
	const target = e.target as HTMLElement;
	if(focus.options.active) {
		target.innerText = 'Enable';
		focus.disable();        
	} else {
		target.innerText = 'Disable';
		focus.enable();
	}
	focus.focusFirst();
});


(document.getElementById('disableOnEsc') as HTMLElement).addEventListener("click", (e) => {
	const target = e.target as HTMLElement;
	focus.options.disableOnEsc = toggle(target, focus.options.disableOnEsc);
	focus.focusFirst();
});

(document.getElementById('focusOnEnable') as HTMLElement).addEventListener("click", (e) => {
	const target = e.target as HTMLElement;
	focus.options.focusOnEnable = toggle(target, focus.options.focusOnEnable);
	focus.focusFirst();
});

(document.getElementById('disableLoop') as HTMLElement).addEventListener("click", (e) => {
	const target = e.target as HTMLElement;
	console.log(focus.options.disableLoop);
	focus.options.disableLoop = toggle(target, focus.options.disableLoop);
	focus.focusFirst();
})

