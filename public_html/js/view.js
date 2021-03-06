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

    let page = document.getElementById("blog-overview-scheme").cloneNode(true);
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

    let page = document.getElementById("blog-info-scheme").cloneNode(true);
    page.removeAttribute("id");
    data.setFormatDates(false);
    helper.setDataInfo(page, data);

    return page;
  },
};

const postOverview = {
  render(data) {
    console.log("View: render() von postOverview");

    let page = document.getElementById("post-overview-scheme").cloneNode(true);
    page.removeAttribute("id");
    let article = page.querySelector("article");
    article.removeAttribute("id");
    article.remove();
    for (let value of data) {
      let content = article.cloneNode(true);
      page.append(content);
      value.setFormatDates(false);
      helper.setDataInfo(page, value);
    }
    page.addEventListener("click", helper.handleDelete);

    return page;
  },
};

const postDetail = {
  render(dataPost, dataComment) {
    console.log("View: render() von postDetail");

    let page = document.getElementById("post-detail-scheme").cloneNode(true);
    page.removeAttribute("id");
    let articlePost = page.querySelector("article");
    articlePost.remove();
    let contentPost = articlePost.cloneNode(true);
    page.append(contentPost);
    dataPost.setFormatDates(true);
    helper.setDataInfo(page, dataPost);

    let comments = document
      .getElementById("comment-section-scheme")
      .cloneNode(true);
    comments.removeAttribute("id");
    let articleComment = comments.querySelector("article");
    articleComment.remove();
    for (let value of dataComment) {
      let contentComment = articleComment.cloneNode(true);
      comments.append(contentComment);
      value.setFormatDates(true);
      helper.setDataInfo(comments, value);
    }
    page.append(comments);
    page.addEventListener("click", helper.handleDelete);

    return page;
  },
};

const postEdit = {
  render(data) {
    let handleOption = (event) => {
      event.preventDefault();
      let action = event.target.dataset.action;
      if (action === "save" && confirm("Wollen Sie die Änderung speichern?")) {
        let form = page.querySelector("form");
        model.updatePost(
          data.blogId,
          data.id,
          form.title.value,
          page.querySelector("div").innerHTML,
          (result) => {
            presenter[action](data.blogId, data.id);
          }
        );
      } else if (action === "cancle") {
        presenter[action](data.blogId, data.id);
      }
    };

    console.log("View: render() von postEdit");

    let page = document.getElementById("edit-scheme").cloneNode(true);
    page.removeAttribute("id");
    helper.setDataInfo(page, data);
    page.addEventListener("click", handleOption);

    return page;
  },
};

const newPost = {
  render(data) {
    let handleOption = (event) => {
      event.preventDefault();
      let action = event.target.dataset.action;
      if (action === "save" && confirm("Wollen Sie die Änderung speichern?")) {
        let form = page.querySelector("form");
        model.addNewPost(data.id, form.title.value, form.content.value, () => {
          presenter[action](data.id);
        });
      } else if (action === "cancle") {
        presenter[action](data.id);
      }
    };

    console.log("View: render() von newPost");

    let page = document.getElementById("new-Post-scheme").cloneNode(true);
    page.removeAttribute("id");
    helper.setDataInfo(page, data);
    page.addEventListener("click", handleOption);

    return page;
  },
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

  handleDelete(event) {
    event.preventDefault();
    let action = event.target.dataset.action;
    let source = event.target.closest("ARTICLE");
    if (
      action === "postDelete" &&
      confirm("Wollen Sie den Post wirklich löschen?")
    ) {
      presenter.deletePost(source.dataset.blogid, source.dataset.postid);
    } else if (
      action === "commentDelete" &&
      confirm("Wollen Sie den Kommentar wirklich löschen?")
    ) {
      presenter.deleteComment(
        source.dataset.blogid,
        source.dataset.postid,
        source.dataset.commentid
      );
    }
  },
};
