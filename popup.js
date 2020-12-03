window.addEventListener("load", () => {
    
    //Check if we're on LightShot already
    chrome.tabs.getSelected(null, function(tab) {
        var string = tab.url;

        if (! string.includes("prnt.sc")) {
            document.querySelector("#leftButton").style.display = "none";
            document.querySelector("#rightButton").style.display = "none";
            document.querySelector("#goToLightShotButton").style.display = "inline";
        } else if (string == "https://prnt.sc/") {
            document.querySelector("#leftButton").style.display = "none";
            document.querySelector("#rightButton").style.display = "none";
            document.querySelector("#goToMostRecentButton").style.display = "inline";
        }
    });

    //Go to LightShot button
    document.querySelector("#goToLightShotButton").addEventListener("click", e => {
        goToLightShot();
    });
    
    document.querySelector("#goToMostRecentButton").addEventListener("click", e => {
        goToMostRecent();
    });

    //Left button
    document.querySelector("#leftButton").addEventListener("click", e => {
        chrome.tabs.getSelected(null, function(tab) {
            goLeft(tab.url);
        });
    });
    
    //Right button
    document.querySelector("#rightButton").addEventListener("click", e => {
        chrome.tabs.getSelected(null, function(tab) {
            goRight(tab.url);
        });
    });
});

function goToLightShot()
{
    chrome.tabs.create({url: "http://www.prnt.sc"});
}

function goToMostRecent() {
    chrome.storage.sync.get(['mostRecent'], function(data) {
        goToURL(data.mostRecent);
    });
}

function goLeft(tabLink)
{
    let urlEnd = getURLEnd(tabLink);
    urlEnd = updateURL(urlEnd, -1);
    let finalURL = constructURL(urlEnd);
    goToURL(finalURL);
}

function goRight(tabLink)
{
    let urlEnd = getURLEnd(tabLink);
    urlEnd = updateURL(urlEnd, +1);
    let finalURL = constructURL(urlEnd);
    goToURL(finalURL);
}

function getURLEnd(tabLink)
{
    let splitURL = tabLink.split("/");
    return splitURL[splitURL.length - 1];
}

function updateURL(urlEnd, amountToUpdate)
{
    let base10String = parseInt(urlEnd, 36);
    base10String += amountToUpdate;
    let finalString = base10String.toString(36);
    return finalString;
}

function constructURL(urlEnd)
{
    return "https://prnt.sc/" + urlEnd;
}

function goToURL(finalURL)
{
    chrome.tabs.update({
        url: finalURL
    });

    chrome.storage.sync.set({mostRecent: finalURL});
}