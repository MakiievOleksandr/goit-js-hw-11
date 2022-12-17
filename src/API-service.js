const axios = require('axios').default;

const URL = 'https:///pixabay.com/api';
const KEY = '32078323-17ec3356a58d20a3806b52452';
const BASE_PARAMS = 'image_type=photo&orientation=horizontal&safesearch=true';

export default class ImageService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.perPage = 40;
    this.totalHits = 0;
  }

  async fetchImages() {
    try {
      const fetch = await axios.get(
        `${URL}/?key=${KEY}&q=${this.searchQuery}&${BASE_PARAMS}&per_page=${this.perPage}&page=${this.page}`
      );
      return fetch;
    } catch (error) {
      console.log(error);
    }
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  resetPage() {
    this.page = 1;
  }
}
