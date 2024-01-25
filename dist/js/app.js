(() => {
    "use strict";
    const modules_flsModules = {};
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(2 == webP.height);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = true === support ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        }));
    }
    function functions_FLS(message) {
        setTimeout((() => {
            if (window.FLS) console.log(message);
        }), 0);
    }
    function uniqArray(array) {
        return array.filter((function(item, index, self) {
            return self.indexOf(item) === index;
        }));
    }
    class ScrollWatcher {
        constructor(props) {
            let defaultConfig = {
                logging: true
            };
            this.config = Object.assign(defaultConfig, props);
            this.observer;
            !document.documentElement.classList.contains("watcher") ? this.scrollWatcherRun() : null;
        }
        scrollWatcherUpdate() {
            this.scrollWatcherRun();
        }
        scrollWatcherRun() {
            document.documentElement.classList.add("watcher");
            this.scrollWatcherConstructor(document.querySelectorAll("[data-watch]"));
        }
        scrollWatcherConstructor(items) {
            if (items.length) {
                this.scrollWatcherLogging(`Прокинувся, стежу за об'єктами (${items.length})...`);
                let uniqParams = uniqArray(Array.from(items).map((function(item) {
                    return `${item.dataset.watchRoot ? item.dataset.watchRoot : null}|${item.dataset.watchMargin ? item.dataset.watchMargin : "0px"}|${item.dataset.watchThreshold ? item.dataset.watchThreshold : 0}`;
                })));
                uniqParams.forEach((uniqParam => {
                    let uniqParamArray = uniqParam.split("|");
                    let paramsWatch = {
                        root: uniqParamArray[0],
                        margin: uniqParamArray[1],
                        threshold: uniqParamArray[2]
                    };
                    let groupItems = Array.from(items).filter((function(item) {
                        let watchRoot = item.dataset.watchRoot ? item.dataset.watchRoot : null;
                        let watchMargin = item.dataset.watchMargin ? item.dataset.watchMargin : "0px";
                        let watchThreshold = item.dataset.watchThreshold ? item.dataset.watchThreshold : 0;
                        if (String(watchRoot) === paramsWatch.root && String(watchMargin) === paramsWatch.margin && String(watchThreshold) === paramsWatch.threshold) return item;
                    }));
                    let configWatcher = this.getScrollWatcherConfig(paramsWatch);
                    this.scrollWatcherInit(groupItems, configWatcher);
                }));
            } else this.scrollWatcherLogging("Сплю, немає об'єктів для стеження. ZzzZZzz");
        }
        getScrollWatcherConfig(paramsWatch) {
            let configWatcher = {};
            if (document.querySelector(paramsWatch.root)) configWatcher.root = document.querySelector(paramsWatch.root); else if ("null" !== paramsWatch.root) this.scrollWatcherLogging(`Эмм... батьківського об'єкта ${paramsWatch.root} немає на сторінці`);
            configWatcher.rootMargin = paramsWatch.margin;
            if (paramsWatch.margin.indexOf("px") < 0 && paramsWatch.margin.indexOf("%") < 0) {
                this.scrollWatcherLogging(`йой, налаштування data-watch-margin потрібно задавати в PX або %`);
                return;
            }
            if ("prx" === paramsWatch.threshold) {
                paramsWatch.threshold = [];
                for (let i = 0; i <= 1; i += .005) paramsWatch.threshold.push(i);
            } else paramsWatch.threshold = paramsWatch.threshold.split(",");
            configWatcher.threshold = paramsWatch.threshold;
            return configWatcher;
        }
        scrollWatcherCreate(configWatcher) {
            this.observer = new IntersectionObserver(((entries, observer) => {
                entries.forEach((entry => {
                    this.scrollWatcherCallback(entry, observer);
                }));
            }), configWatcher);
        }
        scrollWatcherInit(items, configWatcher) {
            this.scrollWatcherCreate(configWatcher);
            items.forEach((item => this.observer.observe(item)));
        }
        scrollWatcherIntersecting(entry, targetElement) {
            if (entry.isIntersecting) {
                !targetElement.classList.contains("_watcher-view") ? targetElement.classList.add("_watcher-view") : null;
                this.scrollWatcherLogging(`Я бачу ${targetElement.classList}, додав клас _watcher-view`);
            } else {
                targetElement.classList.contains("_watcher-view") ? targetElement.classList.remove("_watcher-view") : null;
                this.scrollWatcherLogging(`Я не бачу ${targetElement.classList}, прибрав клас _watcher-view`);
            }
        }
        scrollWatcherOff(targetElement, observer) {
            observer.unobserve(targetElement);
            this.scrollWatcherLogging(`Я перестав стежити за ${targetElement.classList}`);
        }
        scrollWatcherLogging(message) {
            this.config.logging ? functions_FLS(`[Спостерігач]: ${message}`) : null;
        }
        scrollWatcherCallback(entry, observer) {
            const targetElement = entry.target;
            this.scrollWatcherIntersecting(entry, targetElement);
            targetElement.hasAttribute("data-watch-once") && entry.isIntersecting ? this.scrollWatcherOff(targetElement, observer) : null;
            document.dispatchEvent(new CustomEvent("watcherCallback", {
                detail: {
                    entry
                }
            }));
        }
    }
    modules_flsModules.watcher = new ScrollWatcher({});
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    class DynamicAdapt {
        constructor(type) {
            this.type = type;
        }
        init() {
            this.оbjects = [];
            this.daClassname = "_dynamic_adapt_";
            this.nodes = [ ...document.querySelectorAll("[data-da]") ];
            this.nodes.forEach((node => {
                const data = node.dataset.da.trim();
                const dataArray = data.split(",");
                const оbject = {};
                оbject.element = node;
                оbject.parent = node.parentNode;
                оbject.destination = document.querySelector(`${dataArray[0].trim()}`);
                оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
                оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
                оbject.index = this.indexInParent(оbject.parent, оbject.element);
                this.оbjects.push(оbject);
            }));
            this.arraySort(this.оbjects);
            this.mediaQueries = this.оbjects.map((({breakpoint}) => `(${this.type}-width: ${breakpoint}px),${breakpoint}`)).filter(((item, index, self) => self.indexOf(item) === index));
            this.mediaQueries.forEach((media => {
                const mediaSplit = media.split(",");
                const matchMedia = window.matchMedia(mediaSplit[0]);
                const mediaBreakpoint = mediaSplit[1];
                const оbjectsFilter = this.оbjects.filter((({breakpoint}) => breakpoint === mediaBreakpoint));
                matchMedia.addEventListener("change", (() => {
                    this.mediaHandler(matchMedia, оbjectsFilter);
                }));
                this.mediaHandler(matchMedia, оbjectsFilter);
            }));
        }
        mediaHandler(matchMedia, оbjects) {
            if (matchMedia.matches) оbjects.forEach((оbject => {
                this.moveTo(оbject.place, оbject.element, оbject.destination);
            })); else оbjects.forEach((({parent, element, index}) => {
                if (element.classList.contains(this.daClassname)) this.moveBack(parent, element, index);
            }));
        }
        moveTo(place, element, destination) {
            element.classList.add(this.daClassname);
            if ("last" === place || place >= destination.children.length) {
                destination.append(element);
                return;
            }
            if ("first" === place) {
                destination.prepend(element);
                return;
            }
            destination.children[place].before(element);
        }
        moveBack(parent, element, index) {
            element.classList.remove(this.daClassname);
            if (void 0 !== parent.children[index]) parent.children[index].before(element); else parent.append(element);
        }
        indexInParent(parent, element) {
            return [ ...parent.children ].indexOf(element);
        }
        arraySort(arr) {
            if ("min" === this.type) arr.sort(((a, b) => {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) return 0;
                    if ("first" === a.place || "last" === b.place) return -1;
                    if ("last" === a.place || "first" === b.place) return 1;
                    return 0;
                }
                return a.breakpoint - b.breakpoint;
            })); else {
                arr.sort(((a, b) => {
                    if (a.breakpoint === b.breakpoint) {
                        if (a.place === b.place) return 0;
                        if ("first" === a.place || "last" === b.place) return 1;
                        if ("last" === a.place || "first" === b.place) return -1;
                        return 0;
                    }
                    return b.breakpoint - a.breakpoint;
                }));
                return;
            }
        }
    }
    const da = new DynamicAdapt("max");
    da.init();
    const techSkills = [ {
        name: "HTML",
        level: "advanced"
    }, {
        name: "CSS, SaSS",
        level: "advanced"
    }, {
        name: "JavaScript",
        level: "regular"
    }, {
        name: "React",
        level: "regular"
    }, {
        name: "NodeJs/ExpressJs",
        level: "beginner"
    }, {
        name: "RESTful API, graphQl, MangoDB",
        level: "beginner"
    } ];
    const projectsList = [ {
        id: 1,
        name: "Leaf store",
        image: "../img/Screenshot_4.png",
        description: "In this project I practice with ReactJs, ExpressJs and MongoDB. It must be real web site with products list , filter, bascet and authorizatin. All changes have saved in MongoDB.",
        link: "https://leaf-store.vercel.app/",
        status: "in process",
        languages: [ "html", "react", "css", "mongodb", "node", "javascript" ],
        started: "Jun, 2023",
        linkToGit: "https://github.com/an-marryKyslenko/leaf-store"
    }, {
        id: 10,
        name: "Gostro",
        status: "in process",
        image: "../img/Screenshot_10.png",
        description: "Lending page compiled with React, React Router Dom",
        link: "https://gostro-knife.vercel.app/",
        languages: [ "html", "javascript", "css", "react" ],
        started: "Dec, 2023",
        linkToGit: "https://github.com/an-marryKyslenko/khife-react-app"
    }, {
        id: 11,
        name: "Vanlife",
        image: "../img/Screenshot_11.png",
        description: "Project was created by React. In this project I tred to practic React Router Dom",
        link: "https://vanlife-an-marrykyslenko.vercel.app/",
        languages: [ "html", "javascript", "css", "react" ],
        started: "Jun, 2023",
        linkToGit: "https://github.com/an-marryKyslenko/vanlife?tab=readme-ov-file"
    }, {
        id: 2,
        name: "Food mood",
        image: "../img/Screenshot_3.png",
        description: "Lending page compiled with Gulp",
        link: "https://an-marrykyslenko.github.io/foodmood/",
        languages: [ "html", "javascript", "css", "gulp" ],
        started: "Dec, 2022",
        linkToGit: "https://github.com/an-marryKyslenko/foodmood"
    }, {
        id: 3,
        name: "Guitar Store",
        image: "../img/Screenshot_1.png",
        description: "Lending page compiled with Gulp",
        link: "https://an-marrykyslenko.github.io/guitar-page/",
        languages: [ "html", "javascript", "css", "gulp" ],
        started: "Jan, 2023",
        linkToGit: "https://github.com/an-marryKyslenko/guitar-page"
    }, {
        id: 5,
        name: "Travellian",
        image: "../img/Screenshot_5.png",
        description: "Lending page compiled with Gulp",
        link: "https://an-marrykyslenko.github.io/trave-page/",
        status: "in process",
        languages: [ "html", "css", "javascript", "gulp" ],
        linkToGit: "https://github.com/an-marryKyslenko/trave-page",
        started: "Oct, 2022"
    }, {
        id: 6,
        name: "Delivery",
        image: "../img/Screenshot_6.png",
        description: "Lending page compiled with Gulp",
        link: "https://an-marrykyslenko.github.io/delivery/",
        status: "in process",
        languages: [ "html", "css", "javascript", "gulp" ],
        started: "Feb, 2023",
        linkToGit: "https://github.com/an-marryKyslenko/delivery"
    }, {
        id: 7,
        name: "Jadnoo",
        image: "../img/Screenshot_7.png",
        description: "Lending page compiled with Gulp",
        link: "https://an-marrykyslenko.github.io/jaggo/",
        languages: [ "html", "css", "javascript", "gulp" ],
        started: "Jan, 2023",
        linkToGit: "https://github.com/an-marryKyslenko/jaggo"
    }, {
        id: 8,
        name: "NFT",
        image: "../img/Screenshot_8.png",
        description: "Lending page compiled with Gulp",
        link: "https://an-marrykyslenko.github.io/nft-page/",
        languages: [ "html", "javascript", "css", "gulp" ],
        started: "Dec, 2022",
        linkToGit: "https://github.com/an-marryKyslenko/nft-page"
    } ];
    const cards = document.getElementById("cards");
    let count = 0;
    if (!!cards) projectsList.forEach((elem => {
        count += 1;
        const card = document.createElement("div");
        card.classList.add("cards__element");
        card.classList.add("card");
        card.innerHTML += cardHTML(elem);
        if (count < 5) cards.appendChild(card);
    }));
    const projectsPage = document.getElementById("projectsPage");
    if (!!projectsPage) projectsList.forEach((elem => {
        const card = document.createElement("div");
        card.classList.add("project__card");
        card.classList.add("card");
        card.innerHTML += cardHTML(elem);
        const description = document.createElement("div");
        description.classList.add("project__description");
        description.classList.add("description");
        description.innerHTML += describeProject(elem);
        const project = document.createElement("div");
        project.classList.add("projects-page__project");
        project.classList.add("project");
        project.appendChild(card);
        project.appendChild(description);
        const languages = document.createElement("div");
        languages.classList.add("description__languages");
        languages.classList.add("languages");
        const listOne = languagesItems(elem.languages, "tp-one");
        const listTwo = languagesItems(elem.languages, "tp-two");
        languages.appendChild(listOne);
        languages.appendChild(listTwo);
        description.appendChild(languages);
        projectsPage.appendChild(project);
    }));
    function cardHTML(elem) {
        let description = elem.description.slice(0, 100);
        let threeDots = elem.description.length > 100 ? "..." : "";
        const cardHTML = `\n\t\t<div class="card__content">\n\t\t\t<div class="card__img-ibg">\n\t\t\t\t<img src=${elem.image} alt="project ${elem.id}"/>\n\t\t\t</div>\n\t\t\t<div class="card__status ${elem.status ? "_status" : ""}"> In process</div>\n\t\t\t<h3 class="card__name">${elem.name}</h3>\n\t\t\t<p class="card__description">${description}${threeDots}</p>\n\t\t\t<a href=${elem.link} class="card__button shiny-btn">Look it up</a>\n\t\t</div>\n\t`;
        return cardHTML;
    }
    function describeProject(elem) {
        const describeHTML = `\n\t\t<div class="description__content">\n\t\t\t<h3 class="description__title">${elem.name}</h3>\n\t\t\t<p class="description__text"><span>Started:</span> ${elem.started}</p>\n\t\t\t<p class="description__text">\n\t\t\t\t<span>Link to GitHub:</span> \n\t\t\t\t<a href="${elem.linkToGit}" target="_blank">\n\t\t\t\t\tSee code here \n\t\t\t\t\t<span class="icon-link"></span>\n\t\t\t\t</a>\n\t\t\t</p>\n\t\t\t<div class="description__text">${elem.description}</div>\n\t\t</div>\n\t`;
        return describeHTML;
    }
    function languagesItems(elem, classN) {
        const list = document.createElement("ul");
        list.classList.add("languages__list");
        list.classList.add(classN);
        elem.forEach((item => {
            list.innerHTML += `<li class="languages__item icon-${item}"></li>`;
        }));
        return list;
    }
    const techBlock = document.getElementById("ranges");
    if (!!techBlock) techSkills.forEach((elem => {
        const range = document.createElement("div");
        range.classList.add("ranges__element");
        range.classList.add("range");
        range.innerHTML = `\n\t\t\t<div class="range__contant">\n\t\t\t\t<h4 class="range__title">${elem.name}</h4>\n\t\t\t\t<p class="range__level">${elem.level}</p>\n\t\t\t\t<div class="range__line ${elem.level}"></div>\n\t\t\t</div>\n\t\t`;
        techBlock.appendChild(range);
    }));
    const downloadButton = document.getElementById("downloadCV");
    downloadButton.addEventListener("click", downloadCV);
    function downloadCV() {
        var cvUrl = "../img/resume/AnnaMariia_Kyslenko_CV.pdf";
        var link = document.createElement("a");
        link.href = cvUrl;
        link.download = "AnnaMariia_Kyslenko_CV.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log("work download");
    }
    window["FLS"] = true;
    isWebp();
    menuInit();
    //! Робота зі слайдером (Swiper) ========================================================================================================================================================================================================================================================
    //! Динамічний адаптив */
})();