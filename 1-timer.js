import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css"; // Стилі flatpickr
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css"; // Стилі iziToast

const datetimePicker = document.getElementById('datetime-picker');
const startButton = document.querySelector('[data-start]');
const daysSpan = document.querySelector('[data-days]');
const hoursSpan = document.querySelector('[data-hours]');
const minutesSpan = document.querySelector('[data-minutes]');
const secondsSpan = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let countdownInterval = null;

// Функція для додавання ведучого нуля
function addLeadingZero(value) {
    return String(value).padStart(2, '0');
}

// Функція для конвертації мілісекунд у дні, години, хвилини, секунди
function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}

// Опції для flatpickr
const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        const selectedDateTime = selectedDates[0];
        const now = new Date();

        if (selectedDateTime.getTime() <= now.getTime()) {
            iziToast.error({
                title: 'Помилка',
                message: 'Будь ласка, оберіть дату в майбутньому',
                position: 'topRight',
            });
            startButton.disabled = true;
        } else {
            userSelectedDate = selectedDateTime;
            startButton.disabled = false;
        }
    },
};

flatpickr(datetimePicker, options);

// Функція оновлення інтерфейсу таймера
function updateTimerDisplay(ms) {
    const { days, hours, minutes, seconds } = convertMs(ms);
    daysSpan.textContent = addLeadingZero(days);
    hoursSpan.textContent = addLeadingZero(hours);
    minutesSpan.textContent = addLeadingZero(minutes);
    secondsSpan.textContent = addLeadingZero(seconds);
}

// Обробник кліку на кнопку "Start"
startButton.addEventListener('click', () => {
    if (!userSelectedDate) {
        iziToast.warning({
            title: 'Увага',
            message: 'Спочатку оберіть дату!',
            position: 'topRight',
        });
        return;
    }

    // Блокуємо кнопку та інпут
    startButton.disabled = true;
    datetimePicker.disabled = true;

    countdownInterval = setInterval(() => {
        const now = new Date();
        const timeLeft = userSelectedDate.getTime() - now.getTime();

        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            updateTimerDisplay(0); // Встановлюємо 00:00:00:00
            iziToast.success({
                title: 'Таймер завершено!',
                message: 'Зворотний відлік закінчено.',
                position: 'topRight',
            });
            datetimePicker.disabled = false; // Розблоковуємо інпут після завершення
            return;
        }
        updateTimerDisplay(timeLeft);
    }, 1000);
});

// Перевірка стану кнопки при завантаженні сторінки
startButton.disabled = true;