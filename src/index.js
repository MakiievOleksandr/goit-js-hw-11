import ImageServiceAPI from './API-service';
import LoadMoreBtn from './load-more-btn';
import Notiflix from 'notiflix';
import { imageCardMarkup } from './murkup';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  formEl: document.querySelector('#search-form'),
  cardContainer: document.querySelector('.gallery'),
};

const imageService = new ImageServiceAPI();
const loadMoreBtn = new LoadMoreBtn({ selector: '.load-more', hidden: true });

refs.formEl.addEventListener('submit', onSearchBtn);
loadMoreBtn.refs.button.addEventListener('click', onLoadMoreBtn);

function onSearchBtn(evt) {
  evt.preventDefault();
  clearGallery();
  loadMoreBtn.hide();

  if (evt.currentTarget.elements.searchQuery.value.trim() !== '') {
    loadMoreBtn.show();
    loadMoreBtn.disable();

    imageService.resetPage();

    imageService.searchQuery = evt.currentTarget.elements.searchQuery.value;

    imageService
      .fetchImages()

      .then(({ data }) => {
        if (data.total !== 0) {
          renderGallery(data.hits);
          Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
          loadMoreBtn.enable();
        } else {
          loadMoreBtn.hide();
          Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        }
      });
  } else {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

function onLoadMoreBtn(evt) {
  loadMoreBtn.disable();
  imageService.page += 1;

  imageService.fetchImages().then(({ data }) => {
    renderGallery(data.hits);
    loadMoreBtn.enable();
  });
}

function renderGallery(images) {
  const renderedImagesMarkup = images
    .map(image => imageCardMarkup(image))
    .join('');
  refs.cardContainer.insertAdjacentHTML('beforeend', renderedImagesMarkup);

  endOfGallery();
}

function clearGallery() {
  refs.cardContainer.innerHTML = '';
}

function endOfGallery() {
  const totalPages = imageService.totalHits / imageService.perPage;

  if (totalPages <= imageService.page) {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
    loadMoreBtn.hide();
  }
}
