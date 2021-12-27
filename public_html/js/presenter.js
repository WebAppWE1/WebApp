/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";
const presenter = (function () {
  // Private Variablen und Funktionen
  let init = false;
  let owner = null;
  let blogId = 0;
  
  // Initialisiert die allgemeinen Teile der Seite
  function initPage() {
    console.log("Presenter: Aufruf von initPage()");

    model.getAllBlogs((blogs) => {
      console.log("Blog-Overview wird geladen...");
      let element = blogOverview.render(blogs);
      replace("blog-overview", element);

      blogId = blogs[0].id;
      model.getBlog(blogId, (blog) => {
        console.log("Blog-detail-info wird aufgerufen...");
        blog.setFormatDates(true);
        let element = blogInfo.render(blog);
        replace("blog-detail-info", element);
      });

      //uhz  presenter.showPostOverview(blogId);
      presenter.showPostDetail(blogId, "2673510346618126557");

      if (window.location.pathname === "/")
      router.navigateToPage("/blogOverview/" + blogId);
    });

    // Nutzer abfragen und Anzeigenamen als owner setzen
    model.getSelf((result) => {
      owner = result.displayName;
      console.log(`Presenter: Nutzer*in ${owner} hat sich angemeldet.`);
    });

    // Das muss später an geeigneter Stelle in Ihren Code hinein.
    init = true;
  }
  
  // Sorgt dafür, dass bei einem nicht-angemeldeten Nutzer nur noch der Name der Anwendung
  // und der Login-Button angezeigt wird.
  function loginPage() {
    console.log("Presenter: Aufruf von loginPage()");
    if (owner !== undefined)
      console.log(`Presenter: Nutzer*in ${owner} hat sich abgemeldet.`);
    replace("blog-overview");
    replace("blog-detail-info");
    replace("main-section");
    init = false;
  }
  // Tauscht Templates in Bereichen aus, die durch die id-Wert bestimmt werden
  function replace(id, newContent) {
    let section = document.getElementById(id);
    let oldContent = section.firstElementChild;
    if (oldContent) oldContent.remove();
    if (newContent) section.append(newContent);
  }

  //Oeffentliche Methoden
  return {
    // Wird vom Router aufgerufen, wenn die Startseite betreten wird
    showStartPage() {
      console.log("Aufruf von presenter.showStartPage()");
      // Wenn vorher noch nichts angezeigt wurde, d.h. beim Einloggen
      if (model.isLoggedIn()) {
        // Wenn der Nutzer eingeloggt ist
        initPage();
      }
      if (!model.isLoggedIn()) {
        // Wenn der Nuzter eingelogged war und sich abgemeldet hat
        //Hier wird die Seite ohne Inhalt angezeigt
        loginPage();
      }
    },

    // Wird vom Router aufgerufen, wenn eine Blog-Übersicht angezeigt werden soll
    showBlogOverview(bid) {
      console.log(`Aufruf von presenter.showBlogOverview(${blogId})`);
    },

    showPostOverview(bid) {
      console.log(`Aufruf von presenter.showPostOverview von Blog ${bid}`);

      // if (!init) initPage();
      model.getAllPostsOfBlog(bid, (posts) => {
        let element = postOverview.render(posts);
        replace("main-section", element);
      });
    },

    showPostDetail(bid, pid) {
      console.log(`Aufruf von presenter.showPostDetail von Post ${pid}`);

      // if (!init) initPage();
      model.getPost(bid, pid, (post) => {
        let element = postDetail.render(post);
        replace("main-section", element);
      });
    },

    showCommentSection(bid, pid) {
      console.log(`Aufuruf der presenter.showCommentSection von post ${pid}`);

      // if (!init) initPage();
      model.getAllCommentsOfPost(bid, pid, (comments) => {
        let element = commentSection.render(comments);
        replace("main-section", element);
      });
    }
  };
})();
