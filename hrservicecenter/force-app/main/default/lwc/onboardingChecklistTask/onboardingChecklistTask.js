/**
 * @author  rkolasinski
 * @date    5/27/21
 * @description LWC responsible for displaying a single card with onboarding
 * task data.
 * @log
 * -----------------------------------------------------------------------------
 * Date        Developer            Description
 * -----------------------------------------------------------------------------
 * 5/27/21     rkolasinski          W-000103 - created.
 */

// Core imports
import { LightningElement, api } from "lwc";

export default class OnboardingChecklistTask extends LightningElement {
    /**
     * Public properties.
     */
    @api isLast;
    @api selected = false;
    @api task;

    /* ******************************************************** */
    /* EVENT HANDLERS
	/* ******************************************************** */

    /**
     * Handles the task click event.
     * @param {Object} event - DOM event object.
     */
    handleTaskClick(event) {
        event.preventDefault();
        this.fireSelectTaskEvent();
    }

    /* ******************************************************** */
    /* COMPONENT-SPECIFIC METHODS
	/* ******************************************************** */

    /**
     * Fires the 'selecttask' event.
     */
    fireSelectTaskEvent() {
        const selectTaskEvent = new CustomEvent("selecttask", {
            detail: {
                taskId: this.task.taskId,
                flowAPIName: this.task.flowAPIName
            }
        });
        this.dispatchEvent(selectTaskEvent);
    }

    /* ******************************************************** */
    /* COMPONENT-SPECIFIC METHODS
	/* ******************************************************** */

    /**
     * Getter for the CSS classes of task card body element.
     * @returns {string} A string representing CSS classes.
     */
    get taskBodyLabelCss() {
        return `task-card-body-label${
            this.task.description ? " slds-m-bottom_xx-small" : ""
        }${this.task.completed ? " completed" : ""}`;
    }

    /**
     * Getter for the CSS classes of task card element.
     * @returns {string} A string representing CSS classes.
     */
    get taskCardCss() {
        return `slds-card task-card${
            !this.isLast ? " slds-m-bottom_small" : ""
        }${this.selected ? " selected" : ""}`;
    }
}
