#!/bin/bash

echo "Checking custom labels..."

labelNames=$(grep '<fullName>' ./force-app/main/default/labels/CustomLabels.labels-meta.xml | sed -E 's#^.*<fullName>(.+)</fullName>.*$#\1#g')
unusedLabels=()

echo "$labelNames" | {
    # Collect unused labels
    while read labelName; do
        resultsCount=$(grep -m 2 -r "$labelName" "./force-app" | wc -l)
        test $resultsCount -lt 2 && unusedLabels+=("$labelName")
    done

    # Show results
    if [ "${#unusedLabels[@]}" -gt 0 ]; then
        echo "Error: You have ${#unusedLabels[@]} unused label(s):"
        echo "=============================="
        printf '%s\n' "${unusedLabels[@]}"
        echo "=============================="
        exit 1
    else
        echo "You're all set. Nothing to worry about!"
    fi
}
