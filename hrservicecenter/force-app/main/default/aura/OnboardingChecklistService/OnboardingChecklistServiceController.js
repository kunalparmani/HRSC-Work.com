({
    getFlowAPIName: function (component, event, helper) {
        var params = event.getParam("arguments");
        if (params) {
            return helper.getFlowAPIName(component, params.taskId);
        }
    }
});
