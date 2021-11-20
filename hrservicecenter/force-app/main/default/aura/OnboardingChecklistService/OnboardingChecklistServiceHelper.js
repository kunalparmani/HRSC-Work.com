({
    getFlowAPIName: function (cmp, taskId) {
        return new Promise(
            $A.getCallback((resolve, reject) => {
                const action = cmp.get("c.getFlowAPINameApex");
                action.setParams({ taskId: taskId });
                action.setCallback(this, function (response) {
                    const state = response.getState();
                    if (state === "SUCCESS") {
                        resolve(response.getReturnValue());
                    } else {
                        reject(
                            console.log(
                                "Failed to fetch flow API name: " + state
                            )
                        );
                    }
                });

                $A.enqueueAction(action);
            })
        );
    }
});
