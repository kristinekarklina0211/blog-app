/* Переменная, которая хранит в себе пост от пользователя – массив из объектов */
const posts = [];


/* Получение элементов из HTML, чтобы дальше управлять ими в JavaScript */
const postTitleInputNode = document.querySelector(".js-post-title-input"); // Поле ввода заголовка поста
const postTextInputNode = document.querySelector(".js-post-text-input"); // Поле ввода текста поста
const publishBtnNode = document.querySelector(".js-publish-btn"); // Кнопка "Опубликовать"
const postsNode = document.querySelector(".js-posts"); // Лента, куда будут добавляться посты
const errorMessageNode = document.querySelector(".js-error-message"); // Сообщение об ошибке
const titleCounterNode = document.querySelector(".js-title-counter"); // Счётчик символов в заголовке
const textCounterNode = document.querySelector(".js-text-counter"); // Счётчик символов в описании


/* Лимиты заголовка и описания */
const TITLE_VALIDATION_LIMIT = 100;
const TEXT_VALIDATION_LIMIT = 200;


/* Основная функция – что будет происходить при клике на кнопку "Опубликовать" */
publishBtnNode.addEventListener("click", function() {

    // Получить данные из поля ввода
    const postFromUser = getPostFromUser(); // Создаю переменную, где хранится результат функции getPostFromUser()

    // Очистить поля ввода
    postTitleInputNode.value = "";
    postTextInputNode.value = "";
    resetCounters();

    // Сохранить пост (добавить пост в массив posts)
    addPost(postFromUser);

    // Отображение опубликованных постов в ленте в виде списка
    renderPosts();
});


/* Валидация */
postTitleInputNode.addEventListener("input", validation);

postTextInputNode.addEventListener("input", validation);


/* Счётчик символов */
postTitleInputNode.addEventListener("input", countTitleCharacters);

postTextInputNode.addEventListener("input", countTextCharacters);


/* Подфункции */

// Получить данные из поля ввода и собрать их в объект
function getPostFromUser() {
    const userPostTitle = postTitleInputNode.value;
    const userPostText = postTextInputNode.value;
    const postDate = getDate();

    return {
        date: postDate,
        title: userPostTitle,
        text: userPostText
    };
}

// Сохранить пост (добавить пост в массив posts)
function addPost({ date, title, text }) {
    posts.push({
        date: date,
        title: title,
        text: text
    });
}

// Вывести данные поста (чтобы получить посты и как-то их использовать)
function getPosts() {
    return posts;
}

// Отображение опубликованных постов в ленте в виде списка (преобразование массива объектов posts в HTML-разметку)
function renderPosts() {
    const posts = getPosts();

    let postsHTML = "";

    posts.forEach(post => {
        postsHTML += `
        <div class="post">
            <p class="post__date">${post.date}</p>
            <p class="post__title">${post.title}</p>
            <p class="post__text">${post.text}</p>
        </div>
        `
    });

    postsNode.innerHTML = postsHTML;
}


// Подфункция валидации
function validation() {
    const titleLength = postTitleInputNode.value.length;
    const textLength = postTextInputNode.value.length;

    if (!titleLength) {
        showError("Введите заголовок!");
        return;
    }

    if (!textLength) {
        showError("Введите описание!");
        return;
    }
    
    if (titleLength > TITLE_VALIDATION_LIMIT) {
        showError(`Длина заголовка не должна превышать ${TITLE_VALIDATION_LIMIT} символов!`);
        return;
    }

    if (textLength > TEXT_VALIDATION_LIMIT) {
        showError(`Длина описания не должна превышать ${TEXT_VALIDATION_LIMIT} символов!`);
        return;
    }

    // Если нет ошибок
    publishBtnNode.disabled = false;
    errorMessageNode.classList.add("error-message_hidden");
}

// Отображение ошибок
function showError(message) {
    errorMessageNode.innerText = message;
    errorMessageNode.classList.remove("error-message_hidden");
    publishBtnNode.disabled = true;
}

/* Универсальная функция для подсчёта символов */
function countCharacters(inputNode, counterNode, limit) {
    const numOfCharacters = inputNode.value.length;
    const counter = limit - numOfCharacters;

    // Отображение оставшихся символов
    counterNode.textContent = `${counter}/${limit}`;

    // Изменение цвета в зависимости от оставшихся символов
    if (counter < 0) {
        counterNode.style.color = "red";
    } else if (counter < limit * 0.2) {
        counterNode.style.color = "darkorange";
    } else {
        counterNode.style.color = "black";
    }
}

// Создание функций подсчёта символов в заголовке и тексте
function countTitleCharacters() {
    countCharacters(postTitleInputNode, titleCounterNode, TITLE_VALIDATION_LIMIT);
}

function countTextCharacters() {
    countCharacters(postTextInputNode, textCounterNode, TEXT_VALIDATION_LIMIT);
}

// Сброс счётчика после публикации поста
function resetCounters() {
    titleCounterNode.textContent = `${TITLE_VALIDATION_LIMIT}/${TITLE_VALIDATION_LIMIT}`;
    textCounterNode.textContent = `${TEXT_VALIDATION_LIMIT}/${TEXT_VALIDATION_LIMIT}`;

    titleCounterNode.style.color = "black";
    textCounterNode.style.color = "black";
}

// Формирование даты публикации
function getDate() {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");

    const formattedDate = `${day}.${month}.${year} ${hours}:${minutes}`;

    return formattedDate;
}