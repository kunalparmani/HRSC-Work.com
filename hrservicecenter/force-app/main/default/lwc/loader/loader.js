/**
 * @author  rkolasinski
 * @date    4/12/21
 * @description Wrapper component for standard lightning-spinner component.
 * Allows to increment a loading indicator counter which prevents
 * the lightning-spinner component from hiding in between queued backend calls
 * and/or any other asynchronous operations.
 * @log
 * -----------------------------------------------------------------------------
 * Date        Developer            Description
 * -----------------------------------------------------------------------------
 * 4/12/21     rkolasinski      US-8 - created.
 */

// Core imports
import { LightningElement, api } from "lwc";

export default class Loader extends LightningElement {
    /**
     * Private properties.
     */
    _loadingIndicatorCounter = 0;

    /* ******************************************************** */
    /* COMPONENT-SPECIFIC METHODS
	/* ******************************************************** */

    /**
     * Increments the loading indicator counter.
     */
    @api
    showLoader() {
        this._loadingIndicatorCounter += 1;
    }

    /**
     * Decrements the loading indicator counter.
     */
    @api
    hideLoader() {
        this._loadingIndicatorCounter -= 1;
    }

    /* ******************************************************** */
    /* ACCESS METHODS
	/* ******************************************************** */

    /**
     * Getter method for lighting-spinner component visibility.
     * @returns {boolean} - A flag indicating whether lightning-spinner component should be displayed or not.
     */
    get isLoaderVisible() {
        return this._loadingIndicatorCounter > 0;
    }
}
