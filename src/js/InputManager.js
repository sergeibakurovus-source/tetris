import { ACTIONS } from './constants.js';

export class InputManager {
    constructor(actionCallback) {
        this.actionCallback = actionCallback;
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    bindKeys() {
        document.addEventListener('keydown', this.handleKeyDown);
    }

    unbindKeys() {
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown(event) {
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(event.code)) {
            event.preventDefault();
        }

        switch (event.code) {
            case 'ArrowLeft':
                this.actionCallback(ACTIONS.LEFT);
                break;
            case 'ArrowRight':
                this.actionCallback(ACTIONS.RIGHT);
                break;
            case 'ArrowDown':
                this.actionCallback(ACTIONS.DOWN);
                break;
            case 'ArrowUp':
                this.actionCallback(ACTIONS.ROTATE);
                break;
            case 'Space':
                this.actionCallback(ACTIONS.DROP);
                break;
            case 'Escape':
            case 'KeyP':
                this.actionCallback(ACTIONS.PAUSE);
                break;
        }
    }
}
