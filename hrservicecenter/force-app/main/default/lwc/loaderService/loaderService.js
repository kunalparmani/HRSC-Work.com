/**
 * @author  rkolasinski
 * @date    4/12/21
 * @description Service component responsible for handling
 * custom loader component-related method calls.
 * @log
 * -----------------------------------------------------------------------------
 * Date        Developer            Description
 * -----------------------------------------------------------------------------
 * 4/12/21     rkolasinski     US-8 - created.
 */

export default class LoaderService {
    /**
     * Invokes a loader LWC public method responsible for displaying standard lightning-spinner component.
     * @param {Object} context - Context of the service was instantiated from.
     */
    showLoader(context) {
        const loader = context.template.querySelector("c-loader");
        loader.showLoader();
    }

    /**
     * Invokes a loader LWC public method responsible for hiding standard lightning-spinner component.
     * @param {Object} context - Context of the service was instantiated from.
     */
    hideLoader(context) {
        const loader = context.template.querySelector("c-loader");
        loader.hideLoader();
    }
}
