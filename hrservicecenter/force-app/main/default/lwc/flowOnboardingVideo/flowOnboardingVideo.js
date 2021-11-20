/**
 * @author  rkolasinski
 * @date    4/8/21
 * @description Lightning Web Component component for HTML <video> element
 * designed to use in Screen Flows.
 * Allows to pass an URL through design parameters that video will be loaded from.
 * @log
 * -----------------------------------------------------------------------------
 * Date        Developer            Description
 * -----------------------------------------------------------------------------
 * 4/8/21      rkolasinski          US-16 - created.
 */

// Core imports
import { LightningElement, api } from "lwc";

export default class FlowOnboardingVideo extends LightningElement {
    /**
     * Public properties.
     */
    @api mediaURL;
}
