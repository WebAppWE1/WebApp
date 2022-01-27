/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict";

const router = (function () {
    // Private Variable
    let mapRouteToHandler = new Map();

    // Oeffentliche Methoden
    return {
        // Fügt eine neue Route (URL, auszuführende Funktion) zu der Map hinzu
        addRoute(route, handler) {
            mapRouteToHandler.set(route, handler);
        },

        // Wird aufgerufen, wenn zu einer anderen Adresse navigiert werden soll
        navigateToPage(url) {
            history.pushState(null, "", url);
            this.handleRouting();
        },

        // Wird als Eventhandler an ein <a>-Element gebunden
        handleNavigationEvent(event) {
            event.preventDefault();
            let url = event.target.href;
            this.navigateToPage(url);
        },

        // Wird als EventHandler aufgerufen, sobald die Pfeiltasten des Browsers betätigt werden
        handleRouting() {
            console.log("Aufruf von router.handleRouting(): Navigation zu: " + window.location.pathname);
            const currentPage = window.location.pathname.split('/')[1];
            console.log(`current Page is ${currentPage}`);
            let routeHandler = mapRouteToHandler.get(currentPage);
            if (routeHandler === undefined)
                routeHandler = mapRouteToHandler.get(''); //Startseite
            routeHandler(window.location.pathname);
        }
    };
})();

// Selbsaufrufende Funktionsdeklaration: (function name(){..})();
(function initRouter() {
    // The "Startpage".
    router.addRoute('', () => {
        presenter.showStartPage();
    });
        
    // Blog-Info-Page
    router.addRoute("info", (url) => {
        let blogId = url.split("info/")[1].trim();
        presenter.showBlogInfo(blogId);
    });
    
    // Post-Overview-Page
    router.addRoute('overview', (url) => {
        let blogId = url.split("overview/")[1].trim();
        presenter.showPostOverview(blogId);
    });

    // post-detail-Page
    router.addRoute('detail', (url) => {
        let trimmedUrl = url.split('detail/')[1].trim();
        let postId = trimmedUrl.split('/ofBlog/')[0].trim();
        let blogId = trimmedUrl.split('/ofBlog/')[1].trim();
        presenter.showPostDetail(blogId, postId);
    });

    // new-Post-Page
    router.addRoute('new', (url) => {
        let blogId = url.split('new')[1].trim();
        console.log(`new Post of Blog ${blogId}`);
    });

    router.addRoute('edit', (url) => {
        let trimmedUrl = url.split('edit/')[1].trim();
        let postId = trimmedUrl.split('/ofBlog/')[0].trim();
        let blogId = trimmedUrl.split('/ofBlog/')[1].trim();
        console.log(`edit Post ${postId} of Blog ${blogId}`);
    });


    if (window) {
        window.addEventListener('popstate', (event) => {
            router.handleRouting(window.location.pathname);
        });
        router.handleRouting(window.location.pathname);
    }
})();


