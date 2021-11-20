export const FlowNavigationBackEventName = "lightning__flownavigationback";
export const FlowNavigationFinishEventName = "lightning__flownavigationfinish";
export const FlowNavigationNextEventName = "lightning__flownavigationnext";
export const FlowNavigationPauseEventName = "lightning__flownavigationpause";

export class FlowNavigationBackEvent extends CustomEvent {
    constructor(attributeName, attributeValue) {
        super(FlowNavigationBackEventName, {
            composed: true,
            cancelable: true,
            bubbles: true,
            detail: {
                attributeName,
                attributeValue
            }
        });
    }
}

export class FlowNavigationFinishEvent extends CustomEvent {
    constructor(attributeName, attributeValue) {
        super(FlowNavigationFinishEventName, {
            composed: true,
            cancelable: true,
            bubbles: true,
            detail: {
                attributeName,
                attributeValue
            }
        });
    }
}

export class FlowNavigationNextEvent extends CustomEvent {
    constructor(attributeName, attributeValue) {
        super(FlowNavigationNextEventName, {
            composed: true,
            cancelable: true,
            bubbles: true,
            detail: {
                attributeName,
                attributeValue
            }
        });
    }
}

export class FlowNavigationPauseEvent extends CustomEvent {
    constructor(attributeName, attributeValue) {
        super(FlowNavigationPauseEventName, {
            composed: true,
            cancelable: true,
            bubbles: true,
            detail: {
                attributeName,
                attributeValue
            }
        });
    }
}
