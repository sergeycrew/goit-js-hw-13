import './sass/main.scss';
import API from './js/fetch-images';
import getRefs from './js/refs';
import cardsTemplate from './partials/cards.hbs';
import Notiflix from 'notiflix';
import { debounce } from 'lodash';
import SimpleLightbox from 'simplelightbox';

const refs = getRefs();
const DEBOUNCE_DELAY = 300;
let inputValue = '';
let pageNmb = 1;
var lightbox = new SimpleLightbox('.gallery a', { sourceAttr: 'href', overlay: true});


refs.searchBtn.setAttribute('disabled', true);
refs.loadMoreBtn.classList.add('invisible');
refs.searchForm.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));
refs.searchBtn.addEventListener('click', onSearch);
refs.loadMoreBtn.addEventListener('click', loadMore);


function onInputChange(event) {
    pageNmb = 1;
    inputValue = event.target.value.trim('');
    refs.searchBtn.removeAttribute('disabled');
    if (!inputValue) {
        refs.searchBtn.setAttribute('disabled', true);
    }
};

async function onSearch(event) {
    event.preventDefault();
    try {
        const responce = await API.fetchImages(inputValue, pageNmb);
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

        if (inputValue) {
            refs.gallery.innerHTML = '';
            Notiflix.Notify.success(`Hooray! We found ${totalHits} images!`);
        }

        if (inputValue.trim('') === '') {
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

async function loadMore() {
    pageNmb += 1;
    const responce = await API.fetchImages(inputValue, pageNmb);
    const hits = responce.hits;
    renderImages(hits);
    lightbox.refresh();

    if (hits.length < 40) {
        refs.loadMoreBtn.classList.add('invisible');
        Notiflix.Notify.info('We`re sorry, but you`ve reached the end of search results.');
    }
}

function renderImages(hit) {
    const markup = cardsTemplate(hit);
    refs.gallery.insertAdjacentHTML('beforeend', markup);
}


