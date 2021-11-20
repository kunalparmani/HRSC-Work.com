({
    rerender: function (cmp, helper) {
        this.superRerender();
        if (cmp.find("flowControl") && cmp.get("v.flowAPIName")) {
            helper.startFlow(cmp);
        }
    }
});
