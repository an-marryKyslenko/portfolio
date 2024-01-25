const downloadButton = document.getElementById('downloadCV');

downloadButton.addEventListener('click', openPdf)



function openPdf(){
	var cvUrl = 'img/resume/annamariia_kyslenko_cv.pdf';

	window.open(cvUrl, '_blank')
}
function  downloadCV() {
	// Створюємо посилання на ваш файл резюме
	var cvUrl = 'img/resume/annamariia_kyslenko_cv.pdf';

	// Створюємо елемент <a> (посилання) та налаштовуємо його атрибути
	var link = document.createElement('a');
	link.href = cvUrl;
	link.setAttribute('download', 'annamariia_kyslenko_cv.pdf')

	// Додаємо елемент <a> до документу
	document.body.appendChild(link);

	// Симулюємо клік на посилання, щоб запустити завантаження
	link.click();

	// Видаляємо елемент <a> з документу (необов'язково, але може бути корисно)
	link.remove()
}