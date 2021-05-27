var optionsArray = [
    "Headlines", "For you", "U.S.", "World", "Business",
    "Technology", "Entertainment", "Sports", "Science", "Health",
];

function reloadPage() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (arrayOfTabs) {
        var code = 'window.location.reload();';

        try {
            chrome.tabs.executeScript(arrayOfTabs[0].id, { code: code });
        } catch (ex) {
            showTabError();
        }
    });
}

function showTabError() {
    alert("News Section Hider has encountered an error.");
}

function initOptions() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (arrayOfTabs) {
        if (arrayOfTabs[0].url.indexOf("//news.google.com") > -1) {
            document.getElementById("btnReload").style.display = "block";
        } else {
            document.getElementById("btnReload").style.display = "none";
        }
    });

    for (i = 0; i < optionsArray.length; i++) {
        addOptionToUI(optionsArray[i]);
    }

    loadCurrentConfig();

    document.getElementById("btnReload").addEventListener("click", reloadPage);
}

function addOptionToUI(optionName) {
    var optionId = optionName.replace(" ", "");

    var listElem = document.getElementById("optionsList");
    var optionItem = document.createElement("li");

    var chkbox = document.createElement("input");
    chkbox.type = "checkbox";
    chkbox.name = optionName;
    chkbox.value = optionName;
    chkbox.id = "chk" + optionId;
    chkbox.addEventListener("click", saveOptions);

    var lbl = document.createElement("label");
    lbl.textContent = optionName;
    lbl.htmlFor = "chk" + optionId;

    optionItem.appendChild(chkbox);
    optionItem.appendChild(lbl);

    listElem.appendChild(optionItem);
}

function loadCurrentConfig() {
    chrome.storage.sync.get(["hiddenSections"], function (result) {
        var savedSections = result.hiddenSections.split(",");

        for (i = 0; i < optionsArray.length; i++) {
            var optionName = optionsArray[i];

            if (savedSections.indexOf(optionName) > -1) {
                var optionId = "chk" + optionName.replace(" ", "");
                document.getElementById(optionId).checked = true;
            }
        }
    });
}

function saveOptions() {
    var selectedOptionsArray = [];

    for (i = 0; i < optionsArray.length; i++) {
        var optionName = optionsArray[i];
        var optionId = "chk" + optionName.replace(" ", "");
        var isChecked = document.getElementById(optionId).checked;

        if (isChecked) {
            selectedOptionsArray.push(optionName);
        }
    }

    chrome.storage.sync.set({ hiddenSections: selectedOptionsArray.join() }, function () {
        console.log("Selections saved.");
    })
}

window.onload = initOptions();
