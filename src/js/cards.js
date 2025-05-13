import { projectsList } from "./data.js";

const cards = document.getElementById('cards');
let count = 0;

if (!!cards) {
	projectsList.forEach((elem) => {

		count += 1;
		const card = document.createElement('div');
		card.classList.add('cards__element');
		card.classList.add('card');

		card.innerHTML += cardHTML(elem);

		if (count < 5) {
			cards.appendChild(card)
		}

	})

}

const projectsPage = document.getElementById('projectsPage');
if (!!projectsPage) {
	projectsList.forEach((elem) => {
		const card = document.createElement('div');
		card.classList.add('project__card');
		card.classList.add('card');
		card.innerHTML += cardHTML(elem);


		const description = document.createElement('div');
		description.classList.add('project__description');
		description.classList.add('description');
		description.innerHTML += describeProject(elem);

		const project = document.createElement('div');
		project.classList.add('projects-page__project');
		project.classList.add('project');


		project.appendChild(card);
		project.appendChild(description)

		const languages = document.createElement("div");
		languages.classList.add('description__languages')
		languages.classList.add('languages')
		const listOne = languagesItems(elem.languages, 'tp-one');
		const listTwo = languagesItems(elem.languages, 'tp-two');
		languages.appendChild(listOne);
		languages.appendChild(listTwo)

		description.appendChild(languages)
		projectsPage.appendChild(project)

	})

}

function cardHTML(elem) {
	let description = elem.description.slice(0,100);
	let threeDots = elem.description.length > 100 ? '...': '';
	const cardHTML = `
		<div class="card__content">
			<div class="card__img-ibg">
				<img src=${elem.image} alt="project ${elem.id}"/>
			</div>
			<div class="card__status ${elem.status ? '_status' : ''}"> In process</div>
			<h3 class="card__name">${elem.name}</h3>
			<p class="card__description">${description}${threeDots}</p>
			<a target="_blank" href=${elem.link} class="card__button shiny-btn">Look it up</a>
		</div>
	`
	return cardHTML
}

function describeProject(elem) {
	const describeHTML = `
		<div class="description__content">
			<h3 class="description__title">${elem.name}</h3>
			<p class="description__text"><span>Started:</span> ${elem.started}</p>
			<p class="description__text">
				<span>Link to GitHub:</span> 
				<a href="${elem.linkToGit}" target="_blank">
					See code here 
					<span class="icon-link"></span>
				</a>
			</p>
			<div class="description__text">${elem.description}</div>
		</div>
	`
	return describeHTML
}


function languagesItems(elem, classN) {
	const list = document.createElement('ul');
	list.classList.add('languages__list')
	list.classList.add(classN)
	elem.forEach(item => {
		list.innerHTML += `<li class="languages__item icon-${item}"></li>`
	})
	return list;
}