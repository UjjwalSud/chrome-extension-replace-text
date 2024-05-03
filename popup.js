// When the popup is loaded, get the current selection
document.addEventListener('DOMContentLoaded', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            function: getSelectedText
        }, (results) => {
            if (results[0].result.length > 0) {
                document.getElementById('replaceFromText').value = results[0].result;
            }
        });
    });
});

// Function to be executed in the context of the web page
function getSelectedText() {
    return window.getSelection().toString();
}

// When the replace button is clicked
document.getElementById('replaceButton').addEventListener('click', function() {
    const searchText = document.getElementById('replaceFromText').value;
    let  replaceText = document.getElementById('replaceWithText').value;
    const replaceDropdownValue = document.getElementById('replaceWithDropdown').value;
    // Use dropdown value if selected, otherwise use the text input
    if (replaceDropdownValue && replaceDropdownValue !== "") {
        replaceText = replaceDropdownValue;
    }

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            action: "replaceText",
            searchText: searchText,
            replaceText: replaceText
        }, function(response) {
            // Handle the response from the content script
            if (response && response.count !== undefined) {
                document.getElementById('results').textContent = `Replace All: ${response.count} occurrences were replaced on the entire page.`;
            } else if (chrome.runtime.lastError) {
                // Handle any errors that might occur
                document.getElementById('results').textContent = "No replacements were made or an error occurred.";
            } else {
                document.getElementById('results').textContent = "No replacements were made.";
            }
        });
    });
});
