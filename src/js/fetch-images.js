import axios from 'axios';
const BASE_URL = 'https://pixabay.com/api/';
const KEY = '22776346-27604cb5f05d7a9bd9b9b05dd';



async function fetchImages(inputValue, pageNmb) {
    const responce = await axios.get(`${BASE_URL}?key=${KEY}&q=${inputValue}&page=${pageNmb}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40`);
    const hits = await responce;
    return hits.data;
}

export default {fetchImages};



// export default class pixabayApiService {
//     constructor() {
//       this.searchQuery = '';
//       this.page = 1;
//       this.perPage = 40;
//     }
  
//     async fetchImages() {
//       const responce = await axios.get(`${BASE_URL}?key=${KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&page=${this.page}&per_page=${this.perPage}`);
//       const hits = await responce;
//       this.incrementPage();
//       return hits.data;
//     }
  
//     incrementPage() {
//       this.page += 1;
//     }
  
//     resetPage() {
//       this.page = 1;
//     }
  
//     get query() {
//       return this.searchQuery;
//     }
  
//     set query(newQuery) {
//       this.searchQuery = newQuery;
//     }
//   }