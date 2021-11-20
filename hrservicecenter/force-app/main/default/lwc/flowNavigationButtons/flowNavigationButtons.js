/**
 * @author  rkolasinski
 * @date    4/6/21
 * @description Navigation buttons component designed to use in Screen Flows.
 * Uses default Flow events available in lightning-flow-support bundle.
 * @log
 * -----------------------------------------------------------------------------
 * Date        Developer            Description
 * -----------------------------------------------------------------------------
 * 4/6/21      rkolasinski          US-5 - created.
 */

// Core imports
import { LightningElement, api } from "lwc";
import {
    FlowNavigationBackEvent,
    FlowNavigationFinishEvent,
    FlowNavigationNextEvent,
    FlowNavigationPauseEvent
} from "lightning/flowSupport";

// Component-specific constants
const FLOW_CONTEXT = {
    TASK: "task"
};

export default class FlowNavigationButtons extends LightningElement {
    /**
     * Public properties.
     */
    @api disableNext;
    @api labelFinish;
    @api labelMarkTaskAsComplete;
    @api labelNext;
    @api labelPause;
    @api labelPrevious;

    /* ******************************************************** */
    /* EVENT HANDLERS
	/* ******************************************************** */

    /**
     * Handles the "Finish" button click event.
     */
    handleFinish() {
        this.fireNavigationFinishEvent();
    }

    /**
     * Handles the "Mark task as complete" button click event.
     */
    handleMarkTaskAsComplete() {
        this.fireNavigationNextEvent();
    }

    /**
     * Handles the "Next" button click event.
     */
    handleNext() {
        this.fireNavigationNextEvent();
    }

    /**
     * Handles the "Pause" button click event.
     */
    handlePause() {
        this.fireNavigationPauseEvent();
    }

    /**
     * Handles the Previous button click event.
     */
    handlePrevious() {
        this.fireNavigationBackEvent();
    }

    /* ******************************************************** */
    /* COMPONENT-SPECIFIC METHODS
	/* ******************************************************** */

    /**
     * Fires the FlowNavigationBackEvent in order to move to the previous flow step.
     */
    fireNavigationBackEvent() {
        this.dispatchEvent(new FlowNavigationBackEvent());
    }

    /**
     * Fires the FlowNavigationFinishEvent in order to terminate and exit the flow.
     */
    fireNavigationFinishEvent() {
        this.dispatchEvent(new FlowNavigationFinishEvent());
    }

    /**
     * Fires the FlowNavigationNextEvent in order to move to the next flow step.
     */
    fireNavigationNextEvent() {
        this.dispatchEvent(new FlowNavigationNextEvent());
    }

    /**
     * Fires the FlowNavigationPauseEvent in order to pause the flow and store the flow state.
     */
    fireNavigationPauseEvent() {
        this.dispatchEvent(new FlowNavigationPauseEvent());
    }

    /* ******************************************************** */
    /* COMPONENT-SPECIFIC METHODS
	/* ******************************************************** */

    /**
     * Getter for 'Mark task as complete' button visibility.
     * @returns {boolean} A flag indicating whether or not 'Finish' button should be visible.
     */
    get showMarkTaskAsCompleteButton() {
        return (
            this.labelMarkTaskAsComplete &&
            !this.labelNext &&
            new URLSearchParams(window.location.search).get("context") ===
                FLOW_CONTEXT.TASK
        );
    }

    /**
     * Getter for 'Next' button visibility.
     * @returns {boolean} A flag indicating whether or not 'Finish' button should be visible.
     */
    get showNextButton() {
        return !this.labelMarkTaskAsComplete && this.labelNext;
    }

    /**
     * Getter for 'Finish' button visibility.
     * @returns {boolean} A flag indicating whether or not 'Finish' button should be visible.
     */
    get showFinishButton() {
        return !this.labelMarkTaskAsComplete && this.labelFinish;
    }
}
