import { LightningElement, api } from "lwc";

export default class OnboardingChecklistTask extends LightningElement {
    @api isLast;
    @api selected;
    @api task;
}
