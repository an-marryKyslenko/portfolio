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
    class Popup {
        constructor(options) {
            let config = {
                logging: true,
                init: true,
                attributeOpenButton: "data-popup",
                attributeCloseButton: "data-close",
                fixElementSelector: "[data-lp]",
                youtubeAttribute: "data-popup-youtube",
                youtubePlaceAttribute: "data-popup-youtube-place",
                setAutoplayYoutube: true,
                classes: {
                    popup: "popup",
                    popupContent: "popup__content",
                    popupActive: "popup_show",
                    bodyActive: "popup-show"
                },
                focusCatch: true,
                closeEsc: true,
                bodyLock: true,
                hashSettings: {
                    location: true,
                    goHash: true
                },
                on: {
                    beforeOpen: function() {},
                    afterOpen: function() {},
                    beforeClose: function() {},
                    afterClose: function() {}
                }
            };
            this.youTubeCode;
            this.isOpen = false;
            this.targetOpen = {
                selector: false,
                element: false
            };
            this.previousOpen = {
                selector: false,
                element: false
            };
            this.lastClosed = {
                selector: false,
                element: false
            };
            this._dataValue = false;
            this.hash = false;
            this._reopen = false;
            this._selectorOpen = false;
            this.lastFocusEl = false;
            this._focusEl = [ "a[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "button:not([disabled]):not([aria-hidden])", "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "area[href]", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])' ];
            this.options = {
                ...config,
                ...options,
                classes: {
                    ...config.classes,
                    ...options?.classes
                },
                hashSettings: {
                    ...config.hashSettings,
                    ...options?.hashSettings
                },
                on: {
                    ...config.on,
                    ...options?.on
                }
            };
            this.bodyLock = false;
            this.options.init ? this.initPopups() : null;
        }
        initPopups() {
            this.popupLogging(`Прокинувся`);
            this.eventsPopup();
        }
        eventsPopup() {
            document.addEventListener("click", function(e) {
                const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
                if (buttonOpen) {
                    e.preventDefault();
                    this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : "error";
                    this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ? buttonOpen.getAttribute(this.options.youtubeAttribute) : null;
                    if ("error" !== this._dataValue) {
                        if (!this.isOpen) this.lastFocusEl = buttonOpen;
                        this.targetOpen.selector = `${this._dataValue}`;
                        this._selectorOpen = true;
                        this.open();
                        return;
                    } else this.popupLogging(`Йой, не заповнено атрибут у ${buttonOpen.classList}`);
                    return;
                }
                const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
                if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
            }.bind(this));
            document.addEventListener("keydown", function(e) {
                if (this.options.closeEsc && 27 == e.which && "Escape" === e.code && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
                if (this.options.focusCatch && 9 == e.which && this.isOpen) {
                    this._focusCatch(e);
                    return;
                }
            }.bind(this));
            if (this.options.hashSettings.goHash) {
                window.addEventListener("hashchange", function() {
                    if (window.location.hash) this._openToHash(); else this.close(this.targetOpen.selector);
                }.bind(this));
                window.addEventListener("load", function() {
                    if (window.location.hash) this._openToHash();
                }.bind(this));
            }
        }
        open(selectorValue) {
            if (bodyLockStatus) {
                this.bodyLock = document.documentElement.classList.contains("lock") && !this.isOpen ? true : false;
                if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) {
                    this.targetOpen.selector = selectorValue;
                    this._selectorOpen = true;
                }
                if (this.isOpen) {
                    this._reopen = true;
                    this.close();
                }
                if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
                if (!this._reopen) this.previousActiveElement = document.activeElement;
                this.targetOpen.element = document.querySelector(this.targetOpen.selector);
                if (this.targetOpen.element) {
                    if (this.youTubeCode) {
                        const codeVideo = this.youTubeCode;
                        const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
                        const iframe = document.createElement("iframe");
                        iframe.setAttribute("allowfullscreen", "");
                        const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
                        iframe.setAttribute("allow", `${autoplay}; encrypted-media`);
                        iframe.setAttribute("src", urlVideo);
                        if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
                            this.targetOpen.element.querySelector(".popup__text").setAttribute(`${this.options.youtubePlaceAttribute}`, "");
                        }
                        this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
                    }
                    if (this.options.hashSettings.location) {
                        this._getHash();
                        this._setHash();
                    }
                    this.options.on.beforeOpen(this);
                    document.dispatchEvent(new CustomEvent("beforePopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.targetOpen.element.classList.add(this.options.classes.popupActive);
                    document.documentElement.classList.add(this.options.classes.bodyActive);
                    if (!this._reopen) !this.bodyLock ? bodyLock() : null; else this._reopen = false;
                    this.targetOpen.element.setAttribute("aria-hidden", "false");
                    this.previousOpen.selector = this.targetOpen.selector;
                    this.previousOpen.element = this.targetOpen.element;
                    this._selectorOpen = false;
                    this.isOpen = true;
                    setTimeout((() => {
                        this._focusTrap();
                    }), 50);
                    this.options.on.afterOpen(this);
                    document.dispatchEvent(new CustomEvent("afterPopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.popupLogging(`Відкрив попап`);
                } else this.popupLogging(`Йой, такого попапу немає. Перевірте коректність введення. `);
            }
        }
        close(selectorValue) {
            if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) this.previousOpen.selector = selectorValue;
            if (!this.isOpen || !bodyLockStatus) return;
            this.options.on.beforeClose(this);
            document.dispatchEvent(new CustomEvent("beforePopupClose", {
                detail: {
                    popup: this
                }
            }));
            if (this.youTubeCode) if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = "";
            this.previousOpen.element.classList.remove(this.options.classes.popupActive);
            this.previousOpen.element.setAttribute("aria-hidden", "true");
            if (!this._reopen) {
                document.documentElement.classList.remove(this.options.classes.bodyActive);
                !this.bodyLock ? bodyUnlock() : null;
                this.isOpen = false;
            }
            this._removeHash();
            if (this._selectorOpen) {
                this.lastClosed.selector = this.previousOpen.selector;
                this.lastClosed.element = this.previousOpen.element;
            }
            this.options.on.afterClose(this);
            document.dispatchEvent(new CustomEvent("afterPopupClose", {
                detail: {
                    popup: this
                }
            }));
            setTimeout((() => {
                this._focusTrap();
            }), 50);
            this.popupLogging(`Закрив попап`);
        }
        _getHash() {
            if (this.options.hashSettings.location) this.hash = this.targetOpen.selector.includes("#") ? this.targetOpen.selector : this.targetOpen.selector.replace(".", "#");
        }
        _openToHash() {
            let classInHash = document.querySelector(`.${window.location.hash.replace("#", "")}`) ? `.${window.location.hash.replace("#", "")}` : document.querySelector(`${window.location.hash}`) ? `${window.location.hash}` : null;
            const buttons = document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) ? document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) : document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash.replace(".", "#")}"]`);
            this.youTubeCode = buttons.getAttribute(this.options.youtubeAttribute) ? buttons.getAttribute(this.options.youtubeAttribute) : null;
            if (buttons && classInHash) this.open(classInHash);
        }
        _setHash() {
            history.pushState("", "", this.hash);
        }
        _removeHash() {
            history.pushState("", "", window.location.href.split("#")[0]);
        }
        _focusCatch(e) {
            const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
            const focusArray = Array.prototype.slice.call(focusable);
            const focusedIndex = focusArray.indexOf(document.activeElement);
            if (e.shiftKey && 0 === focusedIndex) {
                focusArray[focusArray.length - 1].focus();
                e.preventDefault();
            }
            if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
                focusArray[0].focus();
                e.preventDefault();
            }
        }
        _focusTrap() {
            const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
            if (!this.isOpen && this.lastFocusEl) this.lastFocusEl.focus(); else focusable[0].focus();
        }
        popupLogging(message) {
            this.options.logging ? functions_FLS(`[Попапос]: ${message}`) : null;
        }
    }
    modules_flsModules.popup = new Popup({});
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
    const education = {
        id: "ed-1",
        name: "Vinnytsia National Agrarian University",
        img: "img/education/IMG_2505.jpeg",
        link: "",
        description: '<strong>Bachelor</strong> Degree Field of study <strong>"Acounting and audit"</strong>  <br> Professional qualification <strong>accountant and cashier expert</strong>',
        date: "2014-2017"
    };
    const certifications = [ {
        id: "cer-1",
        name: "Responsive Web Design",
        school: "freeCodeCamp",
        img: "img/education/Screenshot_1.png",
        link: "https://www.freecodecamp.org/certification/fccc1dcb7f9-5c49-4fd0-a164-dc8471380155/responsive-web-design",
        description: "",
        date: "November 22, 2022"
    }, {
        id: "cer-2",
        name: "JavaScript Algorithms and Data Structures",
        school: "freeCodeCamp",
        img: "img/education/Screenshot_2.png",
        link: "https://www.freecodecamp.org/certification/fccc1dcb7f9-5c49-4fd0-a164-dc8471380155/javascript-algorithms-and-data-structures",
        description: "",
        date: "Novemper 3, 2022"
    }, {
        id: "cer-3",
        name: "Become a JavaScript Developer",
        school: "LinkedInLearning",
        img: "img/education/Screenshot_12.png",
        link: "https://www.linkedin.com/learning/certificates/424fb1b7fbfb2b1831dcd94956c497ed3c85f7ccd20ccf83b05c706afc2627a7",
        description: "Learning Path - 28 hours",
        date: "October 7, 2023"
    }, {
        id: "cer-4",
        name: "Became a Full-Stack Web Developer",
        school: "LinkedInLearning",
        img: "img/education/Screenshot_3.png",
        link: "https://www.linkedin.com/learning/certificates/f0348c67876946d0077b25f6a7f7546c990f0becef4148ab47d885c1783d0e63",
        description: "Learning Path - 30 hours",
        date: "October 24, 2023"
    }, {
        id: "cer-5",
        name: "Explore React.js Development",
        school: "LinkedInLearning",
        img: "img/education/Screenshot_4.png",
        link: "https://www.linkedin.com/learning/certificates/f0348c67876946d0077b25f6a7f7546c990f0becef4148ab47d885c1783d0e63",
        description: "Learning Path - 20 hours 20 minutes",
        date: "October 29, 2023"
    }, {
        id: "cer-6",
        name: "SQL Essential Training",
        school: "LinkedInLearning",
        img: "img/education/Screenshot_5.png",
        link: "https://www.linkedin.com/learning/certificates/f0348c67876946d0077b25f6a7f7546c990f0becef4148ab47d885c1783d0e63",
        description: "Course - 4 hours 26 minutes",
        date: "October 11, 2023"
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
    const educationSection = document.getElementById("education");
    const certificationSection = document.getElementById("certifications");
    function educationItem(data) {
        const {img, name, date, id, description, link} = data;
        return `\n\t\t<div class="item-ed__content">\n\t\t\t<div id=${id} class="item-ed__img" title="Click to open">\n\t\t\t\t<img src=${img} data-popup="#popup" />\n\t\t\t</div>\n\t\t\t<div class="item-ed__info">\n\t\t\t\t<h3 class="item-ed__title"><a href=${link || "#"}>${name}</a></h3>\n\t\t\t\t<div class="item-ed__date">${date}</div>\n\t\t\t\t<p class="item-ed__description">${description}</p>\n\t\t\t</div>\n\t\t</div>\n\t`;
    }
    if (!!educationSection) {
        const itemContainer = document.createElement("div");
        itemContainer.classList.add("education__item");
        itemContainer.classList.add("item-ed");
        itemContainer.setAttribute("id", education.id);
        itemContainer.innerHTML = educationItem(education);
        educationSection.appendChild(itemContainer);
        document.getElementById(education.id).addEventListener("click", (e => {
            let el = e.target;
            if (!!el.src) {
                console.log(el);
                const popup = document.querySelector(".popup__text");
                popup.innerHTML = `<img src=${el.src}/>`;
            }
        }));
    }
    if (!!certificationSection) {
        document.getElementById("popup");
        certifications.forEach((item => {
            const itemContainer = document.createElement("div");
            itemContainer.classList.add("education__item");
            itemContainer.classList.add("item-ed");
            itemContainer.innerHTML = educationItem(item);
            certificationSection.appendChild(itemContainer);
        }));
        certificationSection.addEventListener("click", (e => {
            if (e.target.closest(".item-ed__img")) {
                let imageId = e.target.closest(".item-ed__img").id;
                certifications.forEach((item => {
                    if (item.id === imageId) {
                        const popup = document.querySelector(".popup__text");
                        popup.innerHTML = `<img src=${item.img}/>`;
                    }
                }));
            }
        }));
    }
    window["FLS"] = true;
    isWebp();
    menuInit();
    //! Робота зі слайдером (Swiper) ========================================================================================================================================================================================================================================================
    //! Динамічний адаптив */
})();