const $form = document.getElementById('form')
const $date = document.getElementById('date')
const $description = document.getElementById('description')
const $favs = document.getElementById('favs')
const $delete = document.getElementById('delete')
const $save = document.getElementById('save')

$form.addEventListener('submit', async function (e) {
	e.preventDefault()
	$description.innerHTML = ''

	const selectedDate = new Date($date.value)
	const currentDate = new Date()

	if (selectedDate > currentDate) {
		alert('Please select a date equal to or before the current date.')
		$date.value = ''
		return
	}

	const apiKey = 'MJ4hOWB9I48bnhRtwNL58rX6zZm2PD05GUXRxv4U'
	const url = `https://api.nasa.gov/planetary/apod?date=${$date.value}&api_key=${apiKey}`
	const response = await fetch(url)
	const json = await response.json()

	createLog(json)
	$date.value = ''
})

function createLog(json) {
	const $info = document.createElement('div')
	$info.classList.add('info')
	const $photo = document.createElement('div')
	$photo.classList.add('photoMain')

	$info.innerHTML = `
    <h2 class="subtitle">${json.title}</h2>
    <p class="pickedDate"><em>${json.date}</em></p>
    <p>${json.explanation}</p>
    <button class="save">Save To Favorites</button>
  	`

	$photo.innerHTML = `
    <a href="${json.hdurl}" onclick="openImagePopup(event, '${json.hdurl}')"><img class="imgMain" src="${json.url}" alt="" /></a>
  	`

	const $saveButton = $info.querySelector('.save')
	$saveButton.addEventListener('click', function () {
		addToFavorites(json)
	})

	$description.appendChild($photo)
	$description.appendChild($info)
}

function addToFavorites(json) {
	let favorites = localStorage.getItem('favorites')
	favorites = favorites ? JSON.parse(favorites) : []
	const isDuplicate = favorites.some((item) => item.title === json.title)

	if (!isDuplicate) {
		favorites.push(json)
		localStorage.setItem('favorites', JSON.stringify(favorites))
		renderFavorites()
	}
}

function removeFromFavorites(json) {
	let favorites = localStorage.getItem('favorites')
	favorites = favorites ? JSON.parse(favorites) : []
	const updatedFavorites = favorites.filter((item) => item.title !== json.title)
	localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
	renderFavorites()
}

function renderFavorites() {
	$favs.innerHTML = ''
	const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')

	favorites.forEach((item) => {
		const $fav = document.createElement('div')
		$fav.classList.add('fav')
		$fav.innerHTML = `
      <div class="photoFav">
        <img class="imgFav" src="${item.url}" alt="" />
      </div>
      <div class="details">
        <h4>${item.title}</h4>
        <p><em>${item.date}</em></p>
        <button class="delete">Delete</button>
      </div>
    `

		const $deleteButton = $fav.querySelector('.delete')
		$deleteButton.addEventListener('click', function () {
			$fav.remove()
			removeFromFavorites(item)
		})

		$favs.appendChild($fav)
	})
}

function openImagePopup(event, imageUrl) {
	event.preventDefault()

	const modal = document.createElement('div')
	modal.classList.add('modal')

	const modalContent = document.createElement('img')
	modalContent.src = imageUrl
	modalContent.classList.add('modal-content')

	modal.appendChild(modalContent)

	modal.addEventListener('click', function () {
		modal.remove()
	})

	document.body.appendChild(modal)
}

window.addEventListener('DOMContentLoaded', function () {
	renderFavorites()
})
