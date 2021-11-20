/**
 * @author  rkolasinski
 * @date    5/24/21
 * @description Hero banner component consisting of a background image and a
 * welcome title. Designed to use within communities.
 * @log
 * -----------------------------------------------------------------------------
 * Date        Developer            Description
 * -----------------------------------------------------------------------------
 * 5/24/21     rkolasinski          W-000220 - created.
 */

// Core imports
import { LightningElement } from "lwc";

// Static resource imports
import Welcome_Hero_Banner from "@salesforce/resourceUrl/Welcome_Hero_Banner";

// Service modules
import EmployeeService from "c/employeeService";
import LoaderService from "c/loaderService";

// Object imports
import userId from "@salesforce/user/Id";

// Custom labels
import WELCOME_HERO_BANNER_HEADER from "@salesforce/label/c.Welcome_Hero_Banner_Header";

export default class WelcomeHeroBanner extends LightningElement {
    /**
     * Private properties.
     */
    firstName;

    /**
     * Service instances;
     */
    _employeeService;
    _loaderService;

    /**
     * Custom labels.
     */
    labels = {
        WELCOME_HERO_BANNER_HEADER
    };

    /* ******************************************************** */
    /* EVENT HANDLERS
	/* ******************************************************** */

    /**
     * Handles the component initialization event.
     */
    connectedCallback() {
        this._employeeService = new EmployeeService();
        this._loaderService = new LoaderService();
    }

    /**
     * Handles the component post-render event.
     */
    renderedCallback() {
        this.setBannerImage();
        this.getEmployeeData();
    }

    /* ******************************************************** */
    /* COMPONENT-SPECIFIC METHODS
	/* ******************************************************** */

    /**
     * Invokes the EmployeeService method responsible for fetching employee data.
     * @returns {Promise} A promise that will resolve/reject after query is complete.
     */
    async getEmployeeData() {
        this._loaderService.showLoader(this);

        try {
            const employeeData = await this._employeeService.getEmployee(
                this,
                userId
            );
            if (employeeData && employeeData.firstName) {
                const firstName = employeeData.firstName;
                this.firstName = firstName;
                this.setBannerHeader(firstName);
            }
        } finally {
            this._loaderService.hideLoader(this);
        }
    }

    /**
     * Sets the background image for the banner wrapper element.
     */
    setBannerImage() {
        const wrapperElement = this.template.querySelector(
            "div.banner-wrapper"
        );
        wrapperElement.style.backgroundImage = `url('${Welcome_Hero_Banner}/welcome_hero_banner_image.jpg')`;
        wrapperElement.style.backgroundPosition = "50%";
        wrapperElement.style.backgroundRepeat = "no-repeat";
        wrapperElement.style.backgroundSize = "cover";
    }

    /**
     * Sets the banner header content.
     * @param {string} employeeFirstName - First name of the employee.
     */
    setBannerHeader(employeeFirstName) {
        const headerElement = this.template.querySelector(
            "div.banner-wrapper h1"
        );
        if (headerElement) {
            headerElement.textContent = this.labels.WELCOME_HERO_BANNER_HEADER.replace(
                `{{firstName}}`,
                employeeFirstName
            );
        }
    }
}
