export const APPLICATION_SCOPE = Symbol("APPLICATION_SCOPE");
export const createMessageChannel = jest.fn();
export const createMessageContext = jest.fn();
export const MessageContext = jest.fn();
export const releaseMessageContext = jest.fn();
export const unsubscribe = jest.fn();

var _messageChannel = null;
var _messageHandler = null;
export const publish = jest.fn((messageContext, messageChannel, message) => {
    if (_messageHandler && _messageChannel === messageChannel) {
        _messageHandler(message);
    }
});
export const subscribe = jest.fn(
    (messageContext, messageChannel, messageHandler) => {
        _messageChannel = messageChannel;
        _messageHandler = messageHandler;
    }
);
