// When the popup is loaded, get the current selection
document.addEventListener("DOMContentLoaded", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        function: getSelectedText,
      },
      (results) => {
        if (results[0].result.length > 0) {
          document.getElementById("replaceFromText").value = results[0].result;
        }
      }
    );
  });
});

// Function to be executed in the context of the web page
function getSelectedText() {
  return window.getSelection().toString();
}

// When the replace button is clicked
document.getElementById("replaceButton").addEventListener("click", function () {
  const uiHelper = new UIHelper();
  const searchText = document.getElementById("replaceFromText").value;
  let replaceText = document.getElementById("replaceWithText").value;
  const replaceDropdownValue = document.getElementById(
    "replaceWithDropdown"
  ).value;

  // Error handling
  if (!searchText) {
    uiHelper.updateResults(
      "Error: Please enter the text you want to replace.",
      "error"
    );
    //document.getElementById('results').textContent = ;
    return;
  }
  if (!replaceText && !replaceDropdownValue) {
    //document.getElementById('results').textContent = "";
    uiHelper.updateResults(
      "Error: Please enter or select the replacement text.",
      "error"
    );
    return;
  }
  if (replaceText && replaceDropdownValue) {
    uiHelper.updateResults(
      "Error: Please enter replacement text OR select from the dropdown, not both.",
      "error"
    );
    //document.getElementById('results').textContent = "";
    return;
  }

  let finalReplaceText = replaceText ? replaceText : replaceDropdownValue;

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      {
        action: "replaceText",
        searchText: searchText,
        replaceText: finalReplaceText,
      },
      function (response) {
        // Handle the response from the content script
        if (response && response.count !== undefined && response.count > 0) {
          uiHelper.updateResults(
            `Success: Replace All: ${response.count} occurrences were replaced on the entire page.`,
            "success"
          );
          //document.getElementById('results').textContent = ;
        } else if (chrome.runtime.lastError) {
          // Handle any errors that might occur
          uiHelper.updateResults(
            "Error: No replacements were made or an error occurred.",
            "error"
          );
          //document.getElementById('results').textContent = "";
        } else {
          uiHelper.updateResults("Result: No replacements were made.", "info");
          //document.getElementById('results').textContent = "No replacements were made.";
        }
      }
    );
  });
});
