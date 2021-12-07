/**
 * View-Komponenten der einzelnen Templates aus index.html mit den dazugehörigen render()-Funktionen
 */
'use strict';

    const loggedIn = {
      render(data) {
        console.log("Model: render() von LoggedIn");

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
        console.log("Model: render() von blogOverview");

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
        console.log("Model: render() von blogInfo");

        let page = document
            .getElementById("blog-info-scheme")
            .cloneNode(true);
        page.removeAttribute("id");
        helper.setDataInfo(page, data);

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
            let rexp = new RegExp('%' + key, 'g');
            content = content.replace(rexp, object[key]);
        }
        element.innerHTML = content;
    }
};