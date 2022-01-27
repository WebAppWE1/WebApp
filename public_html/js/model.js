/* 
 * 
 /*
 * Adresse über die man auf die Webschnittstelle meines Blogs zugreifen kann:
 */
"use strict";
const model = (function () {
  // Private Variablen
  let loggedIn = false;

  let pathGetBlogs = "blogger/v3/users/self/blogs";
  let pathBlogs = "blogger/v3/blogs";

  // Private Funktionen

  // Formatiert den Datum-String in date in zwei mögliche Datum-Strings:
  // long = false: 24.10.2018
  // long = true: Mittwoch, 24. Oktober 2018, 12:21
  function formatDate(date, long) {
    // Hier kommt Ihr Code hin
    const optLong = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    };
    
    const optShort = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    };

    let useDate = new Date(date);
    if (!long) {
        return useDate.toLocaleDateString('de-DE', optShort);
    } else {
        return useDate.toLocaleDateString('de-DE', optLong);
    }
  }

  // Konstruktoren für Daten-Objekte

  function Blog(id, blogname, postCount, creationDate, alterationDate, url) {
    this.id = id;
    this.blogname = blogname;
    this.postCount = postCount;
    this.creationDate = creationDate;
    this.alterationDate = alterationDate;
    this.url = url;
    this.formatedCreationDate = null;
    this.formatedAlterationDate = null;
  }

  Blog.prototype = {
    constructor: Blog,
    setFormatDates: function(long) {
      this.formatedCreationDate = formatDate(this.creationDate, long);
      this.formatedAlterationDate = formatDate(this.alterationDate, long);
    }
  }

  function Post(id, blogId, postname, creationDate, alterationDate, postText, commentCount) {
    this.id = id;
    this.blogId = blogId;
    this.postname = postname;
    this.creationDate = creationDate;
    this.alterationDate = alterationDate;
    this.postText = postText;
    this.commentCount = commentCount;
    this.formatedCreationDate = null;
    this.formatedAlterationDate = null;
  }

  Post.prototype = {
    constructor: Post,
    setFormatDates: function(long) {
      this.formatedCreationDate = formatDate(this.creationDate, long);
      this.formatedAlterationDate = formatDate(this.alterationDate, long);
    }
  };

  function Comment(id, blogId, postId, creatorName, creationDate, alterationDate, commentText) {
    this.id = id;
    this.blogId = blogId;
    this.postId = postId;
    this.creatorName = creatorName;
    this.creationDate = creationDate;
    this.alterationDate = alterationDate;
    this.commentText = commentText;
    this.formatedCreationDate = null;
    this.formatedAlterationDate = null;
  }

  Comment.prototype = {
    constructor: Comment,
    setFormatDates: function(long) {
      this.formatedCreationDate = formatDate(this.creationDate, long);
      this.formatedAlterationDate = formatDate(this.alterationDate, long);
    }
  };

  // Oeffentliche Methoden
  return {
    // Setter für loggedIn
    setLoggedIn(b) {
      loggedIn = b;
    },
    // Getter für loggedIn
    isLoggedIn() {
      return loggedIn;
    },
    // Liefert den angemeldeten Nutzer mit allen Infos
    getSelf(callback) {
      var request = gapi.client.request({
        method: "GET",
        path: "blogger/v3/users/self",
      });
      // Execute the API request.
      request.execute((result) => {
        callback(result);
      });
    },

    // Liefert alle Blogs des angemeldeten Nutzers
    getAllBlogs(callback) {
      var request = gapi.client.request({
        method: "GET",
        path: pathGetBlogs,
      });
      // Execute the API request.
      request.execute((result) => {
        const blogs = [];
        for (let val in result.items) {
          blogs.push(
            new Blog(
              result.items[val].id,
              result.items[val].name,
              result.items[val].posts.totalItems,
              result.items[val].published,
              result.items[val].updated,
              result.items[val].url
            )
          );
        }
        callback(blogs);
      });
    },

    // Liefert den Blog mit der Blog-Id bid
    getBlog(bid, callback) {
      var request = gapi.client.request({
        method: "GET",
        path: pathBlogs + "/" + bid,
      });
      // Execute the API request.
      request.execute((result) => {
        callback(new Blog(
          result.id,
          result.name,
          result.posts.totalItems,
          result.published,
          result.updated,
          result.url
        ));
      });
    },

    // Liefert alle Posts zu der  Blog-Id bid
    getAllPostsOfBlog(bid, callback) {
      var request = gapi.client.request({
        method: "GET",
        path: pathBlogs + "/" + bid + "/posts",
      });

      request.execute((result) => {
        const posts = [];
        for (let val in result.items) {
          posts.push(
            new Post(
              result.items[val].id,
              result.items[val].blog.id,
              result.items[val].title,
              result.items[val].published,
              result.items[val].updated,
              result.items[val].content,
              result.items[val].replies.totalItems
            )
          );
        }
        callback(posts);
      });
    },

    // Liefert den Post mit der Post-Id pid im Blog mit der Blog-Id bid
    getPost(bid, pid, callback) {
      var request = gapi.client.request({
        method: "GET",
        path: pathBlogs + "/" + bid + "/posts/" + pid,
      });

      request.execute((result) => {
        callback( new Post(
          result.id,
          result.blog.id,
          result.title,
          result.published,
          result.updated,
          result.content,
          result.replies.totalItems
        ));
      });
    },

    // Liefert alle Kommentare zu dem Post mit der Post-Id pid
    // im Blog mit der Blog-Id bid
    getAllCommentsOfPost(bid, pid, callback) {
      var request = gapi.client.request({
        method: "GET",
        path: pathBlogs + "/" + bid + "/posts/" + pid + "/comments",
      });

      request.execute((result) => {
        const comments = [];
        for (let val in result.items) {
          comments.push(new Comment(
            result.items[val].id,
            result.items[val].blog.id,
            result.items[val].post.id,
            result.items[val].author.displayName,
            result.items[val].published,
            result.items[val].updated,
            result.items[val].content
          ));
        }
        callback(comments);
      });
    },

    // Löscht den Kommentar mit der Id cid zu Post mit der Post-Id pid
    // im Blog mit der Blog-Id bid
    // Callback wird ohne result aufgerufen
    deleteComment(bid, pid, cid, callback) {
      var path = pathBlogs + "/" + bid + "/posts/" + pid + "/comments/" + cid;
      console.log(path);
      var request = gapi.client.request({
        method: "DELETE",
        path: path,
      });

      request.execute(callback);
    },

    // Fügt dem Blog mit der Blog-Id bid einen neuen Post
    // mit title und content hinzu, Callback wird mit neuem Post aufgerufen
    addNewPost(bid, title, content, callback) {
      var body = {
        kind: "blogger#post",
        title: title,
        blog: {
          id: bid,
        },
        content: content,
      };

      var request = gapi.client.request({
        method: "POST",
        path: pathBlogs + "/" + bid + "/posts",
        body: body,
      });

      request.execute(callback);
    },

    // Aktualisiert title und content im geänderten Post
    // mit der Post-Id pid im Blog mit der Blog-Id bid
    updatePost(bid, pid, title, content, callback) {
      var body = {
        kind: "blogger#post",
        title: title,
        id: pid,
        blog: {
          id: bid,
        },
        content: content,
      };

      var request = gapi.client.request({
        method: "PUT",
        path: pathBlogs + "/" + bid + "/posts/" + pid,
        body: body,
      });

      request.execute(callback);
    },

    // Löscht den Post mit der Post-Id pid im Blog mit der Blog-Id bid,
    // Callback wird ohne result aufgerufen
    deletePost(bid, pid, callback) {
      var path = pathBlogs + "/" + bid + "/posts/" + pid;
      console.log(path);
      var request = gapi.client.request({
        method: "DELETE",
        path: path,
      });

      request.execute(callback);
    },
  };
})();
