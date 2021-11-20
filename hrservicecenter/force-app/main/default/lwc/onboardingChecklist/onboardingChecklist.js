/**
 * @author  rkolasinski
 * @date    5/27/21
 * @description LWC responsible for displaying a list of onboarding tasks
 * assigned to a particular employee.
 * @log
 * -----------------------------------------------------------------------------
 * Date        Developer            Description
 * -----------------------------------------------------------------------------
 * 5/27/21     rkolasinski          W-000103 - created.
 */

// Core imports
import { LightningElement, track, wire } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import {
    APPLICATION_SCOPE,
    MessageContext,
    publish,
    subscribe,
    unsubscribe
} from "lightning/messageService";
import DFMC from "@salesforce/messageChannel/onboardingChecklist__c";

// Object imports
import userId from "@salesforce/user/Id";

// Custom label imports
import FLOW_ONBOARDING_CHECKLIST_HEADER from "@salesforce/label/c.Flow_Onboarding_Checklist_Header";

// Service imports
import TaskService from "c/taskService";

export default class OnboardingChecklist extends NavigationMixin(
    LightningElement
) {
    /**
     * Private properties.
     */
    hasOnboardingAccess;
    tasks = [];
    @track subscription = null;

    /**
     * Service instances.
     */
    _taskService;

    /**
     * Custom labels.
     */
    labels = {
        FLOW_ONBOARDING_CHECKLIST_HEADER
    };

    /* ******************************************************** */
    /* WIRED METHODS
	/* ******************************************************** */

    @wire(MessageContext) context;

    /* ******************************************************** */
    /* EVENT HANDLERS
	/* ******************************************************** */

    /**
     * Handles the component initialization event.
     */
    async connectedCallback() {
        this._taskService = new TaskService();

        this.subscribe();
        await this.checkOnboardingFeaturesAccess();
        if (this.hasOnboardingAccess) {
            await this.getTasks();
        }
    }

    /**
     * Handles the component destruction event.
     */
    disconnectedCallback() {
        this.unsubscribe();
    }

    /**
     * Handles the task click event.
     * @param {string} flowAPIName - Flow API name of the selected task.
     * @param {string} taskId - Id of the selected task.
     */
    handleTaskClick(flowAPIName, taskId) {
        publish(this.context, DFMC, {
            source: "OnboardingChecklist",
            type: "FlowRequest",
            taskDetails: {
                taskId,
                flowAPIName
            }
        });

        window.location.hash = taskId;
    }

    /**
     * Handles the "selecttask" event.
     * @param {Object} event - DOM event object.
     */
    handleSelectTask(event) {
        const params = event.detail;
        event.preventDefault();
        this.handleTaskClick(params.flowAPIName, params.taskId);
        this.updateTaskSelection(params.taskId);
    }

    /**
     * Subscribes to the message channel.
     */
    subscribe() {
        this.subscription = subscribe(
            this.context,
            DFMC,
            (event) => {
                if (event.type === "FlowStatusChange") {
                    this.getTasks();
                }
            },
            { scope: APPLICATION_SCOPE }
        );
    }

    /**
     * Unsubscribes from the message channel.
     */
    unsubscribe() {
        unsubscribe(this.subscription);
        this.subscription = undefined;
    }

    /* ******************************************************** */
    /* COMPONENT-SPECIFIC METHODS
	/* ******************************************************** */

    /**
     * Invokes the TaskService method responsible for checking onboarding features access.
     * @returns {Promise} A promise that will resolve/reject after records query is complete.
     */
    async checkOnboardingFeaturesAccess() {
        this.hasOnboardingAccess = await this._taskService.hasOnboardingAccess(
            this
        );
    }

    /**
     * Invokes the TaskService method responsible for fetching tasks data.
     * @returns {Promise} A promise that will resolve/reject after records query is complete.
     */
    async getTasks() {
        this.tasks = await this._taskService.getTasks(this, userId);

        // Disabling no-async-operation since setTimeout is required in order to wait for LWC framework
        // to reflect the updated view model properties before updating item selection
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(() => {
            const selectedTaskId = window.location.hash.split("#")[1];
            if (selectedTaskId) {
                this.updateTaskSelection(selectedTaskId);
            }
        });
    }

    /**
     * Iterates through the list of tasks and updates the selection flag.
     * @param {string} taskId - Id of the selected flow.
     */
    updateTaskSelection(taskId) {
        this.template
            .querySelectorAll("c-onboarding-checklist-task")
            .forEach((taskElement) => {
                taskElement.selected = taskElement.task.taskId === taskId;
            });
    }

    /* ******************************************************** */
    /* ACCESS METHODS
	/* ******************************************************** */

    /**
     * Getter for the visibility of the task list element.
     * @returns {boolean} A flag indicating whether the wrapper element
     * should be visible or not.
     */
    get hasTasks() {
        return this.tasks.length > 0;
    }
}
