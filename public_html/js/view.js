/**
 * View-Komponenten der einzelnen Templates aus index.html mit den dazugehörigen render()-Funktionen
 */
"use strict";

const loggedIn = {
  render(data) {
    console.log("View: render() von LoggedIn");

    let page = document
      .getElementById("user-info-loggedIn-scheme")
      .cloneNode(true);
    page.removeAttribute("id");
    helper.setDataInfo(page, data);

    return page;
  },
};

const blogOverview = {
  render(data) {
    console.log("View: render() von blogOverview");

    let page = document
      .getElementById("blog-overview-scheme")
      .cloneNode(true);
    page.removeAttribute("id");
    let list = page.querySelector("ul");
    let listEleTemp = list.firstElementChild;
    listEleTemp.remove();
    for (let value of data) {
      let listElement = listEleTemp.cloneNode(true);
      list.appendChild(listElement);
      helper.setDataInfo(list, value);
    }

    return page;
  },
};

const blogInfo = {
  render(data) {
    console.log("View: render() von blogInfo");

    let page = document
      .getElementById("blog-info-scheme")
      .cloneNode(true);
    page.removeAttribute("id");
    helper.setDataInfo(page, data);

    return page;
  },
};

const postOverview = {
  render(data) {
    console.log("View: render() von postOverview");

    let page = document
      .getElementById("post-overview-scheme")
      .cloneNode(true);
    page.addEventListener("click", handleDelete);
    page.removeAttribute("id");
    
    let article = page.querySelector("article");
    article.remove();
    for (let value of data) {
      let content = article.cloneNode(true);
      page.append(content); 
      value.setFormatDates(false);
      helper.setDataInfo(page, value);
    }

    return page;
  },
};

const postDetail = {
  render(data) {
    console.log("View: render() von postDetail");
    
    let page = document
      .getElementById("post-detail-scheme")
      .cloneNode(true);
    page.removeAttribute("id");
    page.addEventListener("click", handleDelete);
    
    let article = page.querySelector("article");
    article.remove();
    let content = article.cloneNode(true);
    page.append(content);
    data.setFormatDates(false);
    helper.setDataInfo(page, data);

    return page;
  }
};

const commentSection = {
  render(data) {
    console.log("View: render() von commentSection");

    let page = document
      .getElementById("comment-section-scheme")
      .cloneNode(true);
    page.removeAttribute("id");
    page.addEventListener("click", handleDelete);
    
    let article = page.querySelector("article");
    article.remove();
    for (let value of data) {
      let content = article.cloneNode(true);
      page.append(content);
      value.setFormatDates(true);
      helper.setDataInfo(page, value);
    }

    return page;
  }
};

const newPost = {
    render(data) {
    
        let page = document
            .getElementById("new-post-scheme")
            .cloneNode(true);
        page.removeAttribute("id");
        helper.setDataInfo(page, data);    //addNewPost(bid, title, content, callback)
        
        page.addEventListener("submit", (event) => {
            event.preventDefault();
            let form = page.querySelector("form");
            console.log("BID: "+data.blogId);
            
            console.log("TITLE: "+form.titel.value);
            console.log("CONTENT: "+data.postText);
            model.addNewPost(data.blogId, form.titel.value, data.postText, (update) => {
                // data-path = "/postDetail/%id/ofblog/%blogId"
                router.navigateToPage("/postDetail/"+data.id+"/ofblog/"+data.blogId);
            });
        }); 

        return page;
  }
    
};

const editPost = {
    render(data){
        let page = document
            .getElementById("post-edit-scheme")
            .cloneNode(true);
        page.removeAttribute("id");
        page.addEventListener("submit", (event) => {
            event.preventDefault();
            let form = page.querySelector("form");
            console.log("BID: "+data.blogId);
            console.log("PID: "+data.id);
            console.log("TITLE: "+form.titel.value);
            console.log("CONTENT: "+data.postText);
            model.updatePost(data.blogId, data.id, form.titel.value, page.querySelector("div").innerHTML, (update) => {
                // data-path = "/postDetail/%id/ofblog/%blogId"
                router.navigateToPage("/postDetail/"+data.id+"/ofblog/"+data.blogId);
            });
        }); 
        
        helper.setDataInfo(page, data);

        return page;
    }
};

/**
 * helper-Funktion für das Einfügen von Values in die Seiten-Templates
 */
const helper = {
  setDataInfo(element, object) {
    let content = element.innerHTML;
    for (let key in object) {
      let rexp = new RegExp("%" + key, "g");
      content = content.replace(rexp, object[key]);
    }
    element.innerHTML = content;
  },
};

function handleDelete(event){
    let source = null;
    switch(event.target.tagName){
        
            case "BUTTON":
                source = event.target;
                console.log("SOURCE: "+source);
                if(source){
                    let action = source.dataset.action;
                    console.log("ACTION: "+action);
                    if(action == "commentdelete" && confirm("Wirklich löschen?")){
                        let obj = source.parentElement.closest("ARTICLE");
                        obj.remove();
                        let cid = source.dataset.cid;
                        let bid = source.dataset.bid;
                        let id = source.dataset.id;
                        console.log("CID: "+cid);
                        presenter[action](bid,id,cid);
                    }
                    if(action == "postdelete" && confirm("Wirklich löschen?")){
                        let obj = source.parentElement.closest("ARTICLE");
                        obj.remove();
                        let pid = source.dataset.id;
                        let bid = source.dataset.bid;
                        
                        presenter[action](bid,pid);
                        
                        //presenter.showPostsOverview(bid);
                    }
                }
                break;
        }
}
