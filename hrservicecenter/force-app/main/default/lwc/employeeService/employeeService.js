/**
 * @author  rkolasinski
 * @date    4/12/21
 * @description Service component responsible for handling server-side action calls
 *              related to Employee workspace flows.
 * @log
 * -----------------------------------------------------------------------------
 * Date        Developer            Description
 * -----------------------------------------------------------------------------
 * 4/12/21     rkolasinski          US-8 - created.
 */

// Service imports
import ErrorHandlingService from "c/errorHandlingService";

// Apex method imports
import getEmployee from "@salesforce/apex/EmployeeCtrl.getEmployee";

export default class EmployeeService {
    _errorHandlingService = new ErrorHandlingService();

    /**
     * Invokes a server-side action call responsible for returning Employee record data.
     * @param {Object} context - LightningElement context of the service was instantiated from.
     * @param {String} userId - id of the user Employee record is related to.
     * @returns {Promise} A promise that will resolve/reject after query is complete.
     */
    async getEmployee(context, userId) {
        let result;
        try {
            result = await getEmployee({ userId });
        } catch (error) {
            this._errorHandlingService.handleError(context, error.body.message);
        }
        return result;
    }
}
