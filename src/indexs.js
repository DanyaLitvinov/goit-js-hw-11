
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
let searchQery = null;

searchForm.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();

  gallery.innerHTML = '';
  searchQery = e.currentTarget.searchQuery.value;
  console.log(searchQery);
  page = 1;
  const response = await fetchImages(searchQery, page, per_page);
  const images = response.data.hits;
  const totalImages = response.data.totalHits;

  if (images.length > 0) {
    Notify.success(`Hooray! We found ${totalImages} images.`);
  } else {
    loadMoreBtn.classList.add('is-hidden');
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
   
  }
  appendImagesMarkup(images);
  loadMoreBtn.classList.remove('is-hidden');
}

async function onLoadMore() {
  const response = await fetchImages(searchQery, page, per_page);
  const images = response.data.hits;
  const totalImages = response.data.totalHits;
  const totalPages = page * per_page;
  if (totalImages <= totalPages) {
    Notify.info("We're sorry, but you've reached the end of search results.");
    loadMoreBtn.classList.add('is-hidden');
  }
  appendImagesMarkup(images);
  page += 1;
  console.log(page);
}

function appendImagesMarkup(images) {
  gallery.insertAdjacentHTML('beforeend', imageMarkup(images));

   new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
    close: false,
  });
}