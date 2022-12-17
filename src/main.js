import ImageServiceAPI from './API-service';
import LoadMoreBtn from './load-more-btn';
import Notiflix from 'notiflix';

const refs = {
  formEl: document.querySelector('#search-form'),

  inputEl: document.querySelector('input[type="text"]'),

  cardContainer: document.querySelector('.gallery'),

  // loadMoreBtn: document.querySelector('.load-more'),
};

// refs.inputEl.addEventListener('input', onInput);

// function onInput(evt) {
//   const targetValue = evt.currentTarget.value;
//   return targetValue;
// }

const imageServiceAPI = new ImageServiceAPI();
const loadMoreBtn = new LoadMoreBtn({ selector: '.load-more', hidden: true });

refs.formEl.addEventListener('submit', onSubmitForm);
loadMoreBtn.refs.button.addEventListener('click', onLoadMoreSubmit);

function onSubmitForm(evt) {
  evt.preventDefault();

  imageServiceAPI.resetPage();
  clearGallery();
  loadMoreBtn.disable();
  loadMoreBtn.show();

  imageServiceAPI.query = evt.currentTarget.elements.searchQuery.value;

  if (imageServiceAPI.query.trim() !== '' || imagesArray === []) {
    imageServiceAPI
      .fetchImages()
      // console.dir(imageServiceAPI.fetchImages());
      .then(({ hits, totalHits }) => {
        const imagesArray = hits;
        const totalHitsdata = totalHits;

        console.log(imagesArray);

        if (imageServiceAPI.page >= totalHitsdata / imageServiceAPI.perPage) {
          return;
        } else {
          imageServiceAPI.page += 1;
          renderGallery(imagesArray);
          loadMoreBtn.enable();
        }
      })

      .catch(error => {
        console.log(error);
        console.log(imageServiceAPI.fetchImages());
      });
    return;
  }
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
  loadMoreBtn.hide();
}

function onLoadMoreSubmit(evt) {
  loadMoreBtn.disable();

  imageServiceAPI.fetchImages().then(({ hits }) => {
    const imagesArray = hits;
    if (imagesArray) {
      imageServiceAPI.page += 1;
      renderGallery(imagesArray);
      loadMoreBtn.enable();
    } else {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  });
}

function imageCardMarkup({
  webformatURL,
  //   largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy"  />
  <div class="info">
    <p class="info-item">
      <b><span >Likes: </span> <span class="sub">${likes}</span></b>
    </p>
    <p class="info-item">
      <b><span  >Views: </span> <span class="sub">${views}</span></b>
    </p>
    <p class="info-item">
      <b><span >Comments: </span><span class="sub">${comments}</span></b>
    </p>
    <p class="info-item">
      <b><span  >Downloads: </span><span class="sub">${downloads}</span></b>
    </p>
  </div>
</div>`;
}

function renderGallery(images) {
  const renderedImagesMarkup = images
    .map(image => imageCardMarkup(image))
    .join('');
  refs.cardContainer.insertAdjacentHTML('beforeend', renderedImagesMarkup);
}

function clearGallery() {
  refs.cardContainer.innerHTML = '';
}

console.log(imageServiceAPI.page);
