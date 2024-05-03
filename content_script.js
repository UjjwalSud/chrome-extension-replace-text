// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "replaceText") {
        const count = replaceTextInPage(request.searchText, request.replaceText);
		sendResponse({count: count});  // Send the count back to the popup
    }
	 return true;  // Indicate that the response is asynchronous
});

// Main function to replace text
function replaceTextInPage(searchText, replaceText) {
    const regex = new RegExp(escapeRegExp(searchText), 'gi');
	let totalReplacements = 0;

    // Function to handle replacing text
    function handleText(node) {
        switch (node.nodeType) {
            case Node.ELEMENT_NODE:
                // Handle special attributes
                if (node.hasAttributes()) {
                    const attrs = node.attributes;
                    for (let i = 0; i < attrs.length; i++) {
                        if (['placeholder', 'value', 'alt', 'title'].includes(attrs[i].name)) {
							const matches  = attrs[i].value.match(regex);
							if(matches){
                                  attrs[i].value = attrs[i].value.replace(regex, replaceText);
							      totalReplacements += matches.length;
							}
                        }
                    }
                }
                node.childNodes.forEach(child => handleText(child));
                break;
            case Node.TEXT_NODE:
                const matches = node.nodeValue.match(regex);
                // Replace content in text node
                if (matches) {
                    node.nodeValue = node.nodeValue.replace(regex, replaceText);
					totalReplacements += matches.length;
                }
                break;
        }
    }

    // Escape special characters for the regex
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Start replacing text
    document.querySelectorAll('body, body *').forEach(el => {
        handleText(el);
    });
	return totalReplacements;
}
