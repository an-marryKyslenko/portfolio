const downloadButton = document.getElementById('downloadCV');

downloadButton.addEventListener('click', downloadCV)


function downloadCV(e) {
	e.preventDefault();
	// Створюємо посилання на ваш файл резюме
	var cvUrl = 'img/resume/AnnaMariia_Kyslenko_CV.pdf';

	// Створюємо елемент <a> (посилання) та налаштовуємо його атрибути
	var link = document.createElement('a');
	link.href = cvUrl;

	// Додаємо елемент <a> до документу
	document.body.appendChild(link);

	// Симулюємо клік на посилання, щоб запустити завантаження
	link.click();

	// Видаляємо елемент <a> з документу (необов'язково, але може бути корисно)
	document.body.removeChild(link);
}