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
  let overview = false;
  let detail = false;
  
  // Initialisiert die allgemeinen Teile der Seite
  function initPage() {
    console.log("Presenter: Aufruf von initPage()");

    // Nutzer abfragen und Anzeigenamen als owner setzen
    model.getSelf((result) => {
      owner = result.displayName;
      console.log(`Presenter: Nutzer*in ${owner} hat sich angemeldet.`);
      let element = loggedIn.render(result);
      replace("user-info", element);
    });

    presenter.showBlogOverview();

    let blogoverviewpart = document.getElementById("blog-overview");
    blogoverviewpart.addEventListener("click", handleClicks);
    let blogOverview = document.getElementById("blog-detail-info");
    blogOverview.addEventListener("click", handleClicks);
    let main = document.getElementById("main-section");
    main.addEventListener("click", handleClicks);

    init = true;
  }

  // Event Handler für alle Navigations-Events auf der Seite
  function handleClicks(event) {
    let source = null;
    // Behandelt werden clicks auf a-Tags, Buttons und Elemente,  
    // die in ein Li-Tag eingebunden sind.
    switch (event.target.tagName) {
        case "A":
            if(event.target.dataset.type === "extern") {
              break;
            } else {
              router.handleNavigationEvent(event);
              break;
            }
        case "BUTTON":
            source = event.target;
            break;
        default:
            source = event.target.closest("LI");
            break;
    }
    if (source) {
        let path = source.dataset.path;
        if (path)
            router.navigateToPage(path);
    }
}
  
  // Sorgt dafür, dass bei einem nicht-angemeldeten Nutzer nur noch der Name der Anwendung
  // und der Login-Button angezeigt wird.
  function loginPage() {
    console.log("Presenter: Aufruf von loginPage()");
    if (owner !== undefined)
      console.log(`Presenter: Nutzer*in ${owner} hat sich abgemeldet.`);
    replace("user-info")
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

      detail = false;
    },

    // Wird vom Router aufgerufen, wenn eine Blog-Übersicht angezeigt werden soll
    showBlogOverview() {
      console.log(`Aufruf von presenter.showBlogOverview()`);
      // if (!init) initPage();
      
      model.getAllBlogs(blogs => {
        console.log("Blog-Overview wird aufgerufen...");
        let element = blogOverview.render(blogs);
        replace("blog-overview", element);
      });
      detail = false;
      overview = false;
    },

    /** 
    showBlogInfo(blogId) {
      console.log(`Aufruf von presenter.showBlogInfo von Blog ${blogId}`);

      if(!init) initPage();

      model.getBlog(blogId, blog => {
        console.log("BlogInfo wird aufgerufen...");
        let element = blogInfo.render(blog);
        replace("blog-detail-info", element);
      });

      if(overview) {replace("main-section");}
      detail = false;

    },
    */

    showPostOverview(blogId) {
      console.log(`Aufruf von presenter.showPostOverview von Blog ${blogId}`);
      if (!init) initPage();

      model.getAllPostsOfBlog(blogId, (posts) => {
        let element = postOverview.render(posts);
        replace("main-section", element);
      });
      model.getBlog(blogId, blog => {
        console.log("BlogInfo wird aufgerufen...");
        let element = blogInfo.render(blog);
        replace("blog-detail-info", element);
      });

      detail = false;
      overview = true;
    },

    showPostDetail(blogId, postId) {
      console.log(`Aufruf von presenter.showPostDetail von Post ${postId}`);

      if (!init) initPage();

      // model-methods to render the content
      model.getPost(blogId, postId, (post) => {
        model.getAllCommentsOfPost(blogId, postId, (comments) => {
          let element = postDetail.render(post, comments);
          replace("main-section", element);
        });
      });

      detail = true;
      overview = true;
    },

    showEdit(blogId, postId) {
      console.log(`Aufruf von presenter.showEdit von Post ${postId} von Blog ${blogId}`)

      if(!init) initPage();

      model.getPost(blogId, postId, (post) => {
        let element = postEdit.render(post);
        replace("main-section", element);
      });
    },

    showNewPost(blogId) {
      console.log(`Aufruf von presenter.showNewPost von Blog ${blogId}`);

      if(!init) initPage();

      model.getBlog(blogId, (blog) => {
        let element = newPost.render(blog);
        replace("main-section", element);
      });
    },

    save(blogId, postId) {
      console.log(`Aufruf von presenter.save`);

      if (postId === undefined) {
        router.navigateToPage(`/overview/${blogId}`);
      } else {
        model.getPost(blogId, postId, (post) => {
          console.log(`Post ${post.id} wurde erfolgreich hinzugefügt`);
          router.navigateToPage(`/detail/${post.id}/ofBlog/${post.blogId}`);
        });
      }
    },

    cancle(blogId, postId) {
      console.log("Aufruf von presenter.cancle");

      if(detail) {
        router.navigateToPage(`/detail/${postId}/ofBlog/${blogId}`);
      } else {
        router.navigateToPage(`/overview/${blogId}`);
      }
    },

    deleteComment(blogId, postId, commentId) {
      console.log("Aufruf von presenter.deleteComment");

      model.deleteComment(blogId, postId, commentId, (result) => {
        console.log(`Comment ${commentId} wurde gelöscht`);
        this.showPostDetail(blogId, postId);
      });
    },

    deletePost(blogId, postId) {
      console.log("Aufruf von presenter.deletePost");

      model.deletePost(blogId, postId, (result) => {
        if(detail) {
          router.navigateToPage(`/overview/${blogId}`);
        } else {
          this.showPostOverview(blogId);
        }
      });
    }
  };
})();
