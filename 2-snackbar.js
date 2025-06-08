import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector('.form');

// Функція для створення промісу
function createPromise(delay, state) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (state === "fulfilled") {
                resolve(delay);
            } else {
                reject(delay);
            }
        }, delay);
    });
}

// Обробник сабміту форми
form.addEventListener('submit', (event) => {
    event.preventDefault(); // Зупиняємо перезавантаження сторінки

    const delayInput = form.elements.delay;
    const stateInput = form.elements.state;

    const delay = Number(delayInput.value);
    const state = stateInput.value; // "fulfilled" або "rejected"

    createPromise(delay, state)
        .then((delayValue) => {
            iziToast.success({
                title: 'Успіх',
                message: `✅ Fulfilled promise in ${delayValue}ms`,
                position: 'topRight',
            });
        })
        .catch((delayValue) => {
            iziToast.error({
                title: 'Помилка',
                message: `❌ Rejected promise in ${delayValue}ms`,
                position: 'topRight',
            });
        });

    form.reset(); // Очищуємо форму після сабміту
});