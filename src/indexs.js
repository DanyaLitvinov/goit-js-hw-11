import fetchImages from './js/fetchphoto';
import imageMarkup from './tempelates/image-markup.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let page = 1;
const per_page = 40;
let searchQuery = null;
let totalImages = 0;

searchForm.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();

  // Отримуємо значення з інпуту та видаляємо пробіли з початку та кінця рядка
  searchQuery = e.currentTarget.searchQuery.value.trim();

  // Перевіряємо, чи пошуковий запит не порожній
  if (searchQuery === "") {
    // Якщо інпут порожній, не відправляємо запит на сервер та виводимо повідомлення про помилку
    Notify.failure('Please enter a valid search query.');
    return;
  }

  gallery.innerHTML = '';
  console.log(searchQuery);
  page = 1;
  const response = await fetchImages(searchQuery, page, per_page);
  const images = response.data.hits;
  totalImages = response.data.totalHits;

  if (images.length > 0) {
    Notify.success(`Hooray! We found ${totalImages} images.`);
    updateLoadMoreButton();
  } else {
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    hideLoadMoreButton();
  }

  appendImagesMarkup(images);
}

async function onLoadMore() {
  page += 1;
  const response = await fetchImages(searchQuery, page, per_page);
  const images = response.data.hits;

  appendImagesMarkup(images);
  updateLoadMoreButton();
}

function appendImagesMarkup(images) {
  gallery.insertAdjacentHTML('beforeend', imageMarkup(images));

  new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
    close: false,
  });
}

function updateLoadMoreButton() {
  const totalPages = Math.ceil(totalImages / per_page);

  if (page >= totalPages) {
    hideLoadMoreButton();
  } else {
    showLoadMoreButton();
  }
}

function showLoadMoreButton() {
  loadMoreBtn.classList.remove('is-hidden');
}

function hideLoadMoreButton() {
  loadMoreBtn.classList.add('is-hidden');
}
