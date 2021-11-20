// Core imports
import { LightningElement, track, api } from "lwc";

// Apex method imports
import getEmployeeTasks from "@salesforce/apex/TasksOnEmployee.searchTasksOnEmployees";

// Custom labels
import TASKS_ON_EMPLOYEE_RELATED_LIST_HEADER from "@salesforce/label/c.Tasks_On_Employee_Related_List_Header";
import TASKS_ON_EMPLOYEE_RELATED_LIST_NO_TASKS_FOUND from "@salesforce/label/c.Tasks_On_Employee_Related_List_No_Tasks_Found";

// Component-specific constants
const columnList = [
    {
        label: "Status",
        fieldName: "Status",
        sortable: true
    },
    {
        label: "Task Name",
        fieldName: "recordLink",
        sortable: true,
        type: "url",
        typeAttributes: {
            label: {
                fieldName: "Subject"
            },
            tooltip: "Task Name",
            target: "_blank"
        }
    },
    {
        label: "Description",
        fieldName: "Description",
        sortable: true
    },
    {
        label: "Suggested Start Date",
        fieldName: "ActivityDate",
        sortable: true
    }
];

export default class TasksOnEmployee extends LightningElement {
    /**
     * Public properties.
     */
    @api recordId;

    /**
     * Private properties.
     */
    @track taskList;
    @track columnList = columnList;
    @track sortBy = "ActivityDate";
    @track sortDirection = " asc";

    /**
     * Custom labels.
     */
    labels = {
        TASKS_ON_EMPLOYEE_RELATED_LIST_HEADER,
        TASKS_ON_EMPLOYEE_RELATED_LIST_NO_TASKS_FOUND
    };

    /* ******************************************************** */
    /* EVENT HANDLERS
	/* ******************************************************** */

    /**
     * Handles the component initialization event.
     */
    connectedCallback() {
        this.getEmployeeTasks();
    }

    /* ******************************************************** */
    /* COMPONENT-SPECIFIC METHODS
	/* ******************************************************** */

    /**
     * Invokes a server-side action call in order to query all tasks related to a given employee.
     * @returns {Promise} A promise that will resolve/reject after records query is complete.
     */
    getEmployeeTasks() {
        getEmployeeTasks({
            employeeID: this.recordId
        })
            .then((result) => {
                this.taskList = result.map((task) => {
                    let newTask = Object.assign({}, task);
                    newTask.recordLink = "/" + task.Id;
                    return newTask;
                });
            })
            .catch((error) => {
                console.log("Files not loaded", error);
            });
    }

    /**
     * Updates column sorting based on selected field name and sort direction.
     * @param {Object} event - DOM event object.
     */
    updateColumnSorting(event) {
        let fieldName = event.detail.fieldName;
        let sortDirection = event.detail.sortDirection;
        //assign the values
        this.sortBy = fieldName;
        this.sortDirection = sortDirection;
        //call the custom sort method.
        this.sortData(fieldName, sortDirection);
    }

    /**
     * Sorts the data based on selected field name and sort direction.
     * @param {string} fieldName - Name of the field to sort values by.
     * @param {string} sortDirection - Direction sort values by.
     */
    sortData(fieldName, sortDirection) {
        let sortResult = Object.assign([], this.taskList);
        let sortingValue = 0;
        this.taskList = sortResult.sort(function (a, b) {
            if (a[fieldName] < b[fieldName])
                sortingValue = sortDirection === "asc" ? -1 : 1;
            else if (a[fieldName] > b[fieldName])
                sortingValue = sortDirection === "asc" ? 1 : -1;
            return sortingValue;
        });
    }

    /* ******************************************************** */
    /* ACCESS METHODS
	/* ******************************************************** */

    /**
     * Getter for the visibility of task list.
     * @returns {boolean} A flag indicating whether the task list
     * should be visible or not.
     */
    get hasTasks() {
        return this.taskList && this.taskList.length > 0;
    }
}
