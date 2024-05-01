import { getActiveTabURL } from "./utils.js";
console.log("guys.. i am in popup js");

const addNewBookmark=(bookmarkElement,bookmark)=>{
    const bookmarkTitleElement = document.createElement("div");
    const newBookmarkElement = document.createElement("div");
    const controlsElement=document.createElement("div");


    bookmarkTitleElement.textContent = bookmark.desc;
    bookmarkTitleElement.className = "bookmark-title";

    newBookmarkElement.id = "bookmark-" + bookmark.time;
    newBookmarkElement.className = "bookmark";
    newBookmarkElement.setAttribute("timestamp", bookmark.time);

    controlsElement.className='bookmark-controls';

    SetBookmarkAttribute(OnPlay,controlsElement);
    SetBookmarkAttribute(OnDelete,controlsElement);


    newBookmarkElement.appendChild(bookmarkTitleElement);
    newBookmarkElement.appendChild(controlsElement);
    document.body.appendChild(newBookmarkElement);
    // console.log('inside of the the addNewBookmakrs function in popup js ..thanks');
    // console.log(bookmarkTitleElement,newBookmarkElement);
    console.log('controls element is ',controlsElement);
    console.log('new bm element is ',newBookmarkElement);
}

const OnPlay=async (e) =>{
    const activeTab=await getActiveTabURL();
    const bookmarkTime=e.target.parentNode.parentNode.getAttribute("timestamp");

    chrome.tabs.sendMessage(activeTab.id,{
        type:"PLAY",
        value:bookmarkTime
    })
    console.log("value is ",bookmarkTime);
}
const OnDelete=async(e)=>{
    const activeTab=await getActiveTabURL();
    const bookmarkTime=e.target.parentNode.parentNode.getAttribute("timestamp");
    const bookmarkElement=document.getElementById('bookmark-'+bookmarkTime);

    bookmarkElement.parentNode.removeChild(bookmarkElement);

    chrome.tabs.sendMessage(activeTab.id,{
        type:"DELETE",
        value:bookmarkTime
    })
}
const SetBookmarkAttribute=(eventListener,controlParentElement)=>{
    const controlElement=document.createElement("img");
    // controlElement.src="assets/"+src+".png";
    if(eventListener==OnPlay){
        // console.log("play button welcome ");
        controlElement.src="assets/play.png";
    }
    else{
        controlElement.src="assets/delete.png";
    }
    controlParentElement.appendChild(controlElement);
    controlElement.addEventListener("click",eventListener);
    // controlParentElement.appendChild(controlElement);
}

const viewBookmarks=(currentBookmarks=[])=>{
    const items=document.getElementById('bookmarks');
    items.innerHTML="";
    if(currentBookmarks.length==0){
        items.innerHTML='<li>No Bookmarks to show as of now:</li>';
    }
    else if(currentBookmarks.length>0){
        for(let i=0;i<currentBookmarks.length;i++){
            const Bookmark=currentBookmarks[i];
            addNewBookmark(items,Bookmark);        
        }
    }
}
document.addEventListener("DOMContentLoaded",async()=>{
    const acitveTab=await getActiveTabURL();
    if(acitveTab.url.includes('?')){
        const queryParam=acitveTab.url.split("?")[1];
        const urlParam=new URLSearchParams(queryParam);
        console.log('my active tab right now is ',acitveTab);
        const currentVideo=urlParam.get("v");
        if(acitveTab.url.includes('youtube.com/watch')&&currentVideo){

            // const container=document.getElementsByClassName('title')[0];
            // container.innerHTML='Your bookmarks will be shown here: ';
            chrome.storage.sync.get([currentVideo],(data)=>{
                console.log('inside of storage sync in popup js');
                const currentVideoBookmarks=data[currentVideo]? JSON.parse(data[currentVideo]):[];
                viewBookmarks(currentVideoBookmarks)
            })
        }
        else{
            const container=document.getElementsByClassName('title')[0];
            container.innerHTML='Please choose a youtube video to mark Bookmarks';
        }
    }
    else {
        const container=document.getElementsByClassName('title')[0];
        container.innerHTML='Please choose a youtube video to mark Bookmarks';
        console.log(container);
    }
    
})


