import { techSkills } from "./data.js";
const techBlock = document.getElementById('ranges');

if (!!techBlock) {
	techSkills.forEach(elem => {
		const range = document.createElement('div');
		range.classList.add('ranges__element')
		range.classList.add('range')
		range.innerHTML = `
			<div class="range__contant">
				<h4 class="range__title">${elem.name}</h4>
				<p class="range__level">${elem.level}</p>
				<div class="range__line ${elem.level}"></div>
			</div>
		`
		techBlock.appendChild(range)
	})
}