import axios from 'axios';
import './sass/main.scss';
import getRefs from './js/refs';
import cardsTemplate from './partials/cards.hbs';
import Notiflix from 'notiflix';
import { debounce } from 'lodash';
import SimpleLightbox from 'simplelightbox';

const refs = getRefs();
const DEBOUNCE_DELAY = 300;
const BASE_URL = 'https://pixabay.com/api/';
const KEY = '22776346-27604cb5f05d7a9bd9b9b05dd';


var lightbox = new SimpleLightbox('.gallery a', { sourceAttr: 'href', overlay: true});


refs.searchBtn.setAttribute('disabled', true);
refs.loadMoreBtn.classList.add('invisible');
refs.searchForm.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));
refs.searchBtn.addEventListener('click', onSearch);
refs.loadMoreBtn.addEventListener('click', loadMore);




class PixabayApiService {
        constructor() {
          this.searchQuery = '';
          this.page = 1;
          this.perPage = 40;
        }
      
        async fetchImages() {
          const responce = await axios.get(`${BASE_URL}?key=${KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&page=${this.page}&per_page=${this.perPage}`);
          const hits = await responce;
          this.incrementPage();
          return hits.data;
        }
      
        incrementPage() {
          this.page += 1;
        }
      
        resetPage() {
          this.page = 1;
        }
      
        get query() {
          return this.searchQuery;
        }
      
        set query(newQuery) {
          this.searchQuery = newQuery;
        }
      }



      const API = new PixabayApiService()





function onInputChange(e) {
        API.query = e.target.value;
      
        if (API.query === '') {
          clearImagesContainer();
          refs.searchBtn.setAttribute('disabled', true);
          return;
        }
      
        refs.searchBtn.removeAttribute('disabled');
        API.resetPage();
        clearImagesContainer();
        API.fetchImages();
      }
    
      
      async function onSearch(e) {
        e.preventDefault();
        try {
            const responce = await API.fetchImages(API.query);
            const hits = responce.hits;
            const totalHits = responce.totalHits;
            refs.loadMoreBtn.classList.remove('invisible');
            console.log(responce);
            console.log(hits);
    
             if (hits.length === 0) {
                 Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
                 refs.loadMoreBtn.classList.add('invisible');
                 return;
            }
    
            if (API.query) {
                // refs.gallery.innerHTML = '';
                renderImages(hits);
                Notiflix.Notify.success(`Hooray! We found ${totalHits} images!`);
            }
    
            if (API.query.trim('') === '') {
                return;
            }
    
            if (hits.length < 40) {
                refs.loadMoreBtn.classList.add('invisible');
            }
    
            renderImages(hits);
            lightbox.refresh();
        } catch (error) {
            Notiflix.Notify.failure('OOOOPS, something went wrong');
        }
    }
    
    
    function renderImages(hit) {
        const markup = cardsTemplate(hit);
        refs.gallery.insertAdjacentHTML = ('beforeend', markup);
      }
    function clearImagesContainer() {
        refs.gallery.innerHTML = '';
      }
    
    async function loadMore() {
        API.incrementPage;
        const responce = await API.fetchImages(API.query);
        const hits = responce.hits;
        renderCardsTable(hits);
        lightbox.refresh();
    
        if (hits.length < 40) {
            refs.loadMoreBtn.classList.add('invisible');
            Notiflix.Notify.info('We`re sorry, but you`ve reached the end of search results.');
        }
        console.log(hits);}

