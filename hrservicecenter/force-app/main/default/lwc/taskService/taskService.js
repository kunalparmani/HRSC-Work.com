/**
 * @author  rkolasinski
 * @date    5/25/21
 * @description Service component responsible for handling server-side action calls
 *              related to Task object.
 * @log
 * -----------------------------------------------------------------------------
 * Date        Developer            Description
 * -----------------------------------------------------------------------------
 * 5/25/21     rkolasinski          W-000128 - created.
 */

// Service imports
import ErrorHandlingService from "c/errorHandlingService";

// Apex method imports
import getTasks from "@salesforce/apex/OnboardingChecklist.getTasks";
import hasOnboardingAccess from "@salesforce/apex/OnboardingFeatureAccess.hasOnboardingAccess";

export default class TaskService {
    _errorHandlingService = new ErrorHandlingService();

    /**
     * Invokes a server-side action call responsible for checking onboarding features access.
     * @param {Object} context - LightningElement context of the service was instantiated from.
     * @returns {Promise} A promise that will resolve/reject after query is complete.
     */
    async hasOnboardingAccess(context) {
        let result;
        try {
            result = await hasOnboardingAccess();
        } catch (error) {
            this._errorHandlingService.handleError(context, error.body.message);
        }
        return result;
    }

    /**
     * Invokes a server-side action call responsible for returning Task records data.
     * @param {Object} context - LightningElement context of the service was instantiated from.
     * @param {String} userId - id of the user Employee record is related to.
     * @returns {Promise} A promise that will resolve/reject after query is complete.
     */
    async getTasks(context, userId) {
        let result;
        try {
            result = (await getTasks({ userId })) || [];
        } catch (error) {
            this._errorHandlingService.handleError(context, error.body.message);
        }
        return result;
    }
}
