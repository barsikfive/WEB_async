import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const searchForm = document.querySelector('.search-form');
const galleryContainer = document.querySelector('.gallery');
const loader = document.querySelector('.loader');

// ключ API Pixabay
const PIXABAY_API_KEY = '50749011-d51965a80ce4461f44943baa5';

let lightbox; // Змінна для екземпляра SimpleLightbox

// Функція для відображення індикатора завантаження
function showLoader() {
    loader.classList.remove('is-hidden');
}

// Функція для приховування індикатора завантаження
function hideLoader() {
    loader.classList.add('is-hidden');
}

// Функція для створення розмітки однієї картки зображення
function createImageCardMarkup(image) {
    return `
        <div class="photo-card">
            <a href="${image.largeImageURL}">
                <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
            </a>
            <div class="info">
                <p class="info-item">
                    <b>Likes</b>
                    ${image.likes}
                </p>
                <p class="info-item">
                    <b>Views</b>
                    ${image.views}
                </p>
                <p class="info-item">
                    <b>Comments</b>
                    ${image.comments}
                </p>
                <p class="info-item">
                    <b>Downloads</b>
                    ${image.downloads}
                </p>
            </div>
        </div>
    `;
}

// Функція для рендерингу галереї
function renderGallery(images) {
    const markup = images.map(image => createImageCardMarkup(image)).join('');
    galleryContainer.innerHTML = markup;

    // Ініціалізуємо або оновлюємо SimpleLightbox після додавання елементів
    if (lightbox) {
        lightbox.refresh();
    } else {
        lightbox = new SimpleLightbox('.gallery a', {
            captionsData: 'alt',
            captionDelay: 250,
        });
    }
}

// Обробник сабміту форми
searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const searchQuery = event.currentTarget.elements.searchQuery.value.trim();

    if (searchQuery === '') {
        iziToast.warning({
            title: 'Увага',
            message: 'Будь ласка, введіть щось для пошуку.',
            position: 'topRight',
        });
        return;
    }

    // Очищаємо галерею перед новим пошуком
    galleryContainer.innerHTML = '';
    showLoader(); // Показуємо лоадер

    try {
        const response = await fetch(
            `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(searchQuery)}&image_type=photo&orientation=horizontal&safesearch=true`
        );

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const data = await response.json();

        if (data.hits.length === 0) {
            iziToast.info({
                title: 'Без результатів',
                message: 'На жаль, за вашим запитом зображень не знайдено. Спробуйте інший запит.',
                position: 'topRight',
            });
        } else {
            renderGallery(data.hits);
        }
    } catch (error) {
        iziToast.error({
            title: 'Помилка',
            message: `Виникла помилка під час запиту: ${error.message}`,
            position: 'topRight',
        });
    } finally {
        hideLoader(); // Приховуємо лоадер в будь-якому випадку
        searchForm.reset(); // Очищаємо форму
    }
});