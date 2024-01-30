import { certifications, education } from "./data.js";

const educationSection = document.getElementById('education');
const certificationSection = document.getElementById('certifications');


function educationItem(data) {
	const { img, name, date, id, description, link } = data;
	return `
		<div class="item-ed__content">
			<div id=${id} class="item-ed__img" title="Click to open">
				<img src=${img} data-popup="#popup" />
			</div>
			<div class="item-ed__info">
				<h3 class="item-ed__title"><a href=${link || '#'}>${name}</a></h3>
				<div class="item-ed__date">${date}</div>
				<p class="item-ed__description">${description}</p>
			</div>
		</div>
	`
}
if (!!educationSection) {

	const itemContainer = document.createElement('div');
	itemContainer.classList.add('education__item');
	itemContainer.classList.add('item-ed');
	itemContainer.setAttribute('id', education.id)
	itemContainer.innerHTML = educationItem(education);
	educationSection.appendChild(itemContainer)

	document.getElementById(education.id).addEventListener('click', (e) => {
		let el = e.target
		if (!!el.src) {
			console.log(el);
			const popup = document.querySelector('.popup__text');
			popup.innerHTML = `<img src=${el.src}/>`

		}

	}
	)

}

if (!!certificationSection) {
	const popup = document.getElementById('popup');

	certifications.forEach(item => {
		const itemContainer = document.createElement('div');
		itemContainer.classList.add('education__item');
		itemContainer.classList.add('item-ed');
		itemContainer.innerHTML = educationItem(item);
		certificationSection.appendChild(itemContainer)


	})

	certificationSection.addEventListener('click', (e) => {
		if (e.target.closest('.item-ed__img')) {
			let imageId = e.target.closest('.item-ed__img').id;
			certifications.forEach(item => {
				if (item.id === imageId) {
					const popup = document.querySelector('.popup__text');
					popup.innerHTML = `<img src=${item.img}/>`
				}
			})
		}
	})
}

