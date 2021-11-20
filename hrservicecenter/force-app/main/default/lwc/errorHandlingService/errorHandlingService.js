/**
 * @author  rkolasinski
 * @date    4/12/21
 * @description Service component responsible for handling
 * server-side action call errors.
 * @log
 * -----------------------------------------------------------------------------
 * Date        Developer            Description
 * -----------------------------------------------------------------------------
 * 4/12/21     rkolasinski          US-8 - created.
 */

// Core imports
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class ErrorHandlingService {
    /**
     * Handles server-side action error state.
     * @param {Object} context - Context of the service was instantiated from.
     * @param {String} errorDetails - An message containing error details.
     */
    handleError(context, errorDetails) {
        // log error details to the console
        console.log(errorDetails);

        // log error details on the UI
        context.dispatchEvent(
            new ShowToastEvent({
                title: "Error",
                message: errorDetails,
                variant: "error"
            })
        );
    }
}
