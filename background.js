// chrome.tabs.onUpdated.addListener((tabId,tab)=>{
//     if(tab.url && tab.url.includes("youtube.com/watch")){
//         console.log("this is me ")
//         const query=tab.url.split("?")[1];
//         const URLParam=new URLSearchParams(query);

//         chrome.tabs.sendMessage(tabId,{
//             "type":"NEW",
//             "videoId":URLParam.get("v"),
//         });
//     }
// })


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && tab.url.includes("youtube.com/watch")) {
        console.log("Tab updated: ", tab.url);
        const query = tab.url.split("?")[1];
        const URLParam = new URLSearchParams(query);

        chrome.tabs.sendMessage(tabId, {
            type: "NEW",
            videoId: URLParam.get("v"),
        }, (response) => {
            if (chrome.runtime.lastError) {
                console.error("error occured");
            } else {
                console.log("Message sent successfully");
            }
        });
    }
});




  
