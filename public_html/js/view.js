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
    let article = page.querySelector("article");
    article.remove();
    for (let value in data) {
      let content = article.cloneNode(true);
      page.append(content);
      value.setFormatDates(false);
      helper.setDataInfo(page, value);
    }
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
