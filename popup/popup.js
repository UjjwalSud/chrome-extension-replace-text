const PopupController = (function () {
  let uiHelper;
  let formHandler;

  function init() {
    uiHelper = new UIHelper();
    formHandler = new FormDataHandler("textReplacerForm");
    attachEventHandlers();
  }

  function attachEventHandlers() {
    document
      .getElementById("replaceButton")
      .addEventListener("click", handleReplaceButtonClick);
  }

  function handleReplaceButtonClick() {
    const searchText = formHandler.getValue("replaceFromText");
    const replaceText = formHandler.getValue("replaceWithText");
    const replaceDropdownValue = formHandler.getValue("replaceWithDropdown");

    if (!validateInput(searchText, replaceText, replaceDropdownValue)) {
      return; // Stop further execution if validation fails
    }

    const finalReplaceText = replaceText || replaceDropdownValue;
    replaceTextOnPage(searchText, finalReplaceText);
  }

  function validateInput(searchText, replaceText, replaceDropdownValue) {
    if (!searchText) {
      uiHelper.updateResults(
        "Error: Please enter the text you want to replace.",
        "error"
      );
      return false;
    }
    if (!replaceText && !replaceDropdownValue) {
      uiHelper.updateResults(
        "Error: Please enter or select the replacement text.",
        "error"
      );
      return false;
    }
    if (replaceText && replaceDropdownValue) {
      uiHelper.updateResults(
        "Error: Please enter replacement text OR select from the dropdown, not both.",
        "error"
      );
      return false;
    }
    return true;
  }

  function replaceTextOnPage(searchText, replaceText) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        {
          action: "replaceText",
          searchText: searchText,
          replaceText: replaceText,
        },
        responseHandler
      );
    });
  }

  function responseHandler(response) {
    if (chrome.runtime.lastError) {
      uiHelper.updateResults(
        `Error: ${chrome.runtime.lastError.message}`,
        "error"
      );
    } else if (response && response.count !== undefined) {
      uiHelper.updateResults(
        `Replace All: ${response.count} occurrences were replaced on the entire page.`,
        "success"
      );
    } else {
      uiHelper.updateResults("No replacements were made.", "info");
    }
  }

  return {
    init: init,
  };
})();

document.addEventListener("DOMContentLoaded", function () {
  PopupController.init();
});
