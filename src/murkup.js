export function imageCardMarkup({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `
  <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy"  />
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
</a>`;
}
