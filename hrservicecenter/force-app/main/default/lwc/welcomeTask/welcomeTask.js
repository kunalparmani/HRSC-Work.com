/**
 * @author  rkolasinski
 * @date    5/25/21
 * @description LWC responsible for displaying information around completed/not completed
 * onboarding tasks. The component has 3 states:
 * • hidden - when the Employee has no onboarding tasks,
 * • visible w/ # of tasks - when the Employee has 1+ not completed tasks,
 * • visible w/ no # of tasks - when the Employee has 1+ tasks, all with completed status.
 *
 * Component footer contains a link navigating to the community page with the full list
 * of available onboarding tasks.
 * @log
 * -----------------------------------------------------------------------------
 * Date        Developer            Description
 * -----------------------------------------------------------------------------
 * 5/25/21     rkolasinski          W-000128 - created.
 */

// Core imports
import { LightningElement } from "lwc";
import { NavigationMixin } from "lightning/navigation";

// Custom labels
import WELCOME_TASK_HEADER_TASKS_COMPLETED from "@salesforce/label/c.Welcome_Task_Header_Tasks_Completed";
import WELCOME_TASK_HEADER_TASKS_OPEN from "@salesforce/label/c.Welcome_Task_Header_Tasks_Open";
import WELCOME_TASK_OPEN_TASKS from "@salesforce/label/c.Welcome_Task_Open_Tasks";
import WELCOME_TASK_SEE_ALL_TASKS from "@salesforce/label/c.Welcome_Task_See_All_Tasks";
import WELCOME_TASK_SUBHEADER_TASKS_COMPLETED from "@salesforce/label/c.Welcome_Task_Subheader_Tasks_Completed";

// Service modules
import TaskService from "c/taskService";

// Object imports
import userId from "@salesforce/user/Id";

// Component-specific constants
const FLOW_CONTEXT = {
    TASK: "task"
};

export default class WelcomeTask extends NavigationMixin(LightningElement) {
    /**
     * Private properties.
     */
    _hasViewRendered = false;
    hasOnboardingAccess;
    tasks = [];

    /**
     * Custom labels.
     */
    labels = {
        WELCOME_TASK_HEADER_TASKS_COMPLETED,
        WELCOME_TASK_HEADER_TASKS_OPEN,
        WELCOME_TASK_OPEN_TASKS,
        WELCOME_TASK_SEE_ALL_TASKS,
        WELCOME_TASK_SUBHEADER_TASKS_COMPLETED
    };

    /**
     * Service modules.
     */
    _taskService;

    /* ******************************************************** */
    /* EVENT HANDLERS
	/* ******************************************************** */

    /**
     * Handles the component initialization event.
     */
    connectedCallback() {
        this._taskService = new TaskService();
    }

    /**
     * Handles the component post-render event.
     */
    async renderedCallback() {
        if (!this._hasViewRendered) {
            this._hasViewRendered = true;
            await this.checkOnboardingFeaturesAccess();
            if (this.hasOnboardingAccess) {
                await this.getTasks();
            }
        }
    }

    /**
     * Navigates to Onboarding Checklist community page.
     */
    openAllTasks() {
        this[NavigationMixin.Navigate]({
            type: "comm__namedPage",
            attributes: {
                name: "Onboarding_Checklist__c"
            },
            state: {
                context: FLOW_CONTEXT.TASK
            }
        });
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
     * Invokes the TaskService method responsible for fetching onboarding tasks data.
     * @returns {Promise} A promise that will resolve/reject after records query is complete.
     */
    async getTasks() {
        this.tasks = await this._taskService.getTasks(this, userId);
    }

    /* ******************************************************** */
    /* ACCESS METHODS
	/* ******************************************************** */

    /**
     * Getter for the number of open tasks.
     * @returns {number} Value representing number of open tasks.
     */
    get openTasks() {
        return this.tasks.filter((task) => !task.completed).length;
    }

    /**
     * Getter for the visibility of the content element.
     * @returns {boolean} A flag representing content element visibility.
     */
    get showContent() {
        return this.hasOnboardingAccess && this.tasks && this.tasks.length > 0;
    }

    /**
     * Getter for the card subheader visibility.
     * @returns {boolean} A flag representing card subheader visibility.
     */
    get showSubheader() {
        return this.tasks.filter((task) => !task.completed).length === 0;
    }

    /**
     * Getter for the card header.
     * @returns {string} A string representing card header.
     */
    get welcomeTaskHeader() {
        return this.tasks.some((task) => !task.completed)
            ? this.labels.WELCOME_TASK_HEADER_TASKS_OPEN
            : this.labels.WELCOME_TASK_HEADER_TASKS_COMPLETED;
    }
}
