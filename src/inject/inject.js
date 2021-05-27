var sectionsToHide = [];

const storiesDivClassName = "lBwEZb";
const sectionHeaderClassName = "dSva6b";
const sectionTitleClassName = "wmzpFf";

var storiesDiv;
var observer;

chrome.extension.sendMessage({}, function (response) {
	var readyStateCheckInterval = setInterval(function () {
		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);

			// ----------------------------------------------------------
			// This part of the script triggers when page is done loading
			// ----------------------------------------------------------
			chrome.storage.sync.get(["hiddenSections"], function (result) {
				sectionsToHide = result.hiddenSections.split(",");

				startWatcher();
			});
		}
	}, 5);
});

startWatcher = () => {
	storiesDiv = document.getElementsByClassName(storiesDivClassName)[0];

	addMutationObserver(storiesDiv);
}

addMutationObserver = (targetNode) => {
	if (targetNode instanceof HTMLElement) {
		const obsOptions = { childList: true, attributes: true, subtree: false };
		observer = new MutationObserver(mutationCallback);
		observer.observe(targetNode, obsOptions);
	} else {
		console.log("targetNode is not a DOM element", targetNode);
	}
}

mutationCallback = (mutationList, observer) => {
	for (i = 0; i < sectionsToHide.length; i++) {
		var titleElement = findElementByClassNameAndContent(sectionTitleClassName, sectionsToHide[i]);
		console.log("titleElement", titleElement);
		if (titleElement != undefined) {
			var sectionHeader = titleElement.parentElement.parentElement.parentElement.parentElement;

			//	observer.disconnect();
			//	observer = null;
			removeSiblingUntilNextHeader(sectionHeader, true);
			sectionHeader.style.display = "none";
		}
	}
}

removeSiblingUntilNextHeader = (element, skipMe) => {
	var sibling = element.nextElementSibling;

	if (sibling) {
		if (!skipMe && sibling.classList.contains(sectionHeaderClassName)) {
			return;
		} else {
			sibling.style.visibility = "hidden";
			sibling.style.display = "none";
			removeSiblingUntilNextHeader(sibling, false);
		}
	}
}



findElementByClassNameAndContent = (className, content) => {
	var elements = document.getElementsByClassName(className);
	var found;

	for (var i = 0; i < elements.length; i++) {
		if (elements[i].textContent == content) {
			found = elements[i];
			break;
		}
	}

	return found;
}