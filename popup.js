
var optionsArray = [
    "Headlines", "For you", "U.S.", "World", "(City)", "Business",
    "Technology", "Entertainment", "Sports", "Science", "Health",
];

function reloadPage() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (arrayOfTabs) {
        var code = 'window.location.reload();';
        chrome.tabs.executeScript(arrayOfTabs[0].id, { code: code });
    });
}

function initOptions() {
    //console.log("opts", optionsArray);
    for (i = 0; i < optionsArray.length; i++) {
        addOptionToList(optionsArray[i]);
    }

    loadCurrentConfig();

    document.getElementById("btnReload").addEventListener("click", reloadPage);
}

function addOptionToList(optionName) {
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
        console.log("checked?", optionId, isChecked);
        if (isChecked) {
            selectedOptionsArray.push(optionName);
        }
    }

    chrome.storage.sync.set({ hiddenSections: selectedOptionsArray.join() }, function () {
        console.log("Selections saved.");
    })
}

window.onload = initOptions();
