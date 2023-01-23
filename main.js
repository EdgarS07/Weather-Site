import conditions from "./conditions.js";

const apiKey = "42b2b67bee1744e2a6681646232101";

/* ЭЛЕМЕНТЫ НА СТРАНИЦЕ*/
const header = document.querySelector(".header");
const form = document.querySelector("#form");
const input = document.querySelector("#inputCity");

// ПИШЕМ ОТДЕЛЬНЫЕ ФУНКЦИИ НА ПОВЕДЕНИЕ

// ФУНКЦИЯ ДЛЯ УДАЛЕНИЯ ПРЕДЫДУЩЕЙ КАРТОЧКИ
function removeCard() {
  const prevCard = document.querySelector(".card");
  if (prevCard) prevCard.remove();
}

// ФУНКЦИЯ ДЛЯ ОТОБРАЖЕНИЯ ОШИБКИ
function showError(errorMessage) {
  // ОТОБРАЗИТЬ КАРТОЧКУ С ОШИБКОЙ
  const html = `<div class="card">${errorMessage}</div>`;

  // ОТОБРАЖАЕМ КАРТОЧКУ НА СТРАНИЦЕ
  header.insertAdjacentHTML("afterend", html);
}

//   ФУНКЦИЯ ДЛЯ ОТОБРАЖЕНИЯ КАРТОЧКИ
function showCard({ name, country, temp, condition, imgPath }) {
  // РАЗМЕТКА ДЛЯ КАРТОЧКИ

  const html = `<div class="card">
    
                            <h2 class="card-city">${name} <span>${country}</span></h2>
                    <div class="card-weather">
                             <div class="card-value">${temp}<sup>°с</sup> </div>
                             <img class="card-img" src="${imgPath}" alt="">
                    </div>
                    <div class="card-description">${condition}</div>
    
                        </div>`;
  // ОТОБРАЖАЕМ НА СТРАНИЦЕ КАРТОЧКУ
  header.insertAdjacentHTML("afterend", html);
}

// ФУНКЦИЯ ДЛЯ ПОЛУЧЕНИЯ ПОГОДЫ

async function getWeather(city) {
  // АДРЕС ЗАПРОСА
  const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
  return data;
}

// СЛУШАЕМ ОТПРАВКУ ФОРМЫ
form.onsubmit = async function (e) {
  // ОТМЕНЯЕМ ОТПРАВКУ ФОРМЫ
  e.preventDefault();

  // БЕРЁМ ЗНАЧЕНИЯ ИЗ ИНПУТА,ОБРЕЗАЕМ ПРОБЕЛЫ С ПОМОЩЬЮ ТРИМ
  let city = input.value.trim();

  //   ПОЛУЧАЕМ ДАННЫЕ С СЕРВЕРА
  const data = await getWeather(city);

  // ПРОВЕРКА НА ОШИБКУ
  if (data.error) {
    // если есть ошибка, выводим её
    removeCard();
    showError(data.error.message);
  } else {
    // если ошибки нет, выводим карточку
    // ОТОБРАЖАЕМ ПОЛУЧЕННЫЕ ДАННЫЕ В КАРТОЧКЕ
    // УДАЛЯЕМ ПРЕДЫДУЩУЮ КАРТОЧКУ
    removeCard();

    console.log(data.current.condition.code);

    const info = conditions.find(
      (obj) => obj.code === data.current.condition.code
    );
    console.log(info);
    console.log(info.languages[23]["day_text"]);

    const filePath = "./img/" + (data.current.is_day ? "day" : "night") + "/";
    const fileName = (data.current.is_day ? info.day : info.night) + ".png";
    const imgPath = filePath + fileName;
    console.log("filePath", filePath + fileName);

    const weatherData = {
      name: data.location.name,
      country: data.location.country,
      temp: data.current.temp_c,
      condition: data.current.is_day
        ? info.languages[23]["day_text"]
        : info.languages[23]["night_text"],
      imgPath,
    };

    showCard(weatherData);
  }
};
