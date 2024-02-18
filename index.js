const articles = document.getElementById("article");
const spinner = `<div id="spinner" class="spinner-border" role="status"></div>`;
const loadedPosts = {};

const loadPosts = async () => {
  articles.innerHTML = spinner;

  try {
    const response = await fetch(
      "https://api.nytimes.com/svc/topstories/v2/home.json?api-key=c2xkaEAZAe7puU1GPRR7cuLtVNGPchY0"
    );
    const data = await response.json();
    console.log(data);

    const articleFromApi = data.results || [];

    const spinnerId = document.getElementById("spinner");
    spinnerId.remove();

    articleFromApi.forEach((item, index) => {
      const articleId = item.id || `article_${index}`;
      loadedPosts[articleId] = item; // Сохраняем данные о загруженном посте
      const newArticle = `
          <div class="d-flex justify-content-between m-5 ">
            <div class="left_news">
              <div class="left_news_top">
                <div class="Authors">
                  <img src="${item.multimedia[2]?.url}" alt="img" />
                  <p id="Author">
                    ${item.byline}<span> in</span> ${item.section} ·
                    <span>${item.created_date}</span>
                  </p>
                </div>
                <a class="title_style" href="post.html?id=${articleId}">
                  <p id="title">${item.title}</p>
                </a>
                <p class="summary" id="summary">${item.abstract}</p>
                <div class="InfoBottom">
                  <button type="button" class="btnSecondary">Secondary</button>
                  <p class="text-muted opacity-50">12 min read</p>
                  <p>·</p>
                  <p class="text-muted opacity-50">Selected for you</p>
                  <div class="d-flex justify-content-space-between">
                    <img class="icon" src="assets/Icon.png" alt="img" />
                    <img class="icon1" src="assets/Icon.png" alt="img" />
                    <img class="icon2" src="assets/Icon.png" alt="img" />
                  </div>
                </div>
              </div>
            </div>
            <img class="photo" src="${item.multimedia[0]?.url}" alt="picture" />
          </div>
          <hr>
        `;
      articles.insertAdjacentHTML("beforeend", newArticle);
    });
  } catch (err) {
    const spinnerId = document.getElementById("spinner");
    spinnerId.remove();
    articles.innerHTML = `<h3>Error данные не загрузились</h3>`;
    console.error(err);
  }
};

const loadPostById = async (articleId) => {
  const articleContainer = document.getElementById("article");
  articleContainer.innerHTML = spinner;

  try {
    let post = loadedPosts[articleId]; // Проверяем, есть ли уже загруженные данные о посте
    if (!post) {
      // Если данных о посте нет, загружаем их с сервера
      const response = await fetch(
        `https://api.nytimes.com/svc/topstories/v2/home.json?api-key=c2xkaEAZAe7puU1GPRR7cuLtVNGPchY0`
      );
      const data = await response.json();
      post = data.results[0] || {};
      loadedPosts[articleId] = post; // Сохраняем загруженные данные о посте
    }

    const spinnerId = document.getElementById("spinner");
    spinnerId.remove();

    const newPost = `
        <div class="post">
          <div class="Newsnav">
            <div class="infoprof">
              <div class="infoLeftLogo">
                <img src="assets/LinkedIn.png" alt="LinkedIn" /><img
                  src="assets/Facebook Circled.png"
                  alt="Facebook"
                /><img src="assets/Twitter.png" alt="Twitter" />
              </div>
              <div class="infoleft">
                <img src="${post.multimedia[0]?.url}" alt="profil" />
                <div class="textinfoleft">
                  <p>${post.byline}</p>
                  <span>${post.created_date} · 12 min read · Member-only</span>
                </div>
              </div>
              <div class="TextPost">
                <p>${post.title}</p>
                <span>${post.abstract}</span>
              </div>
              <div class="TextPostIMG">
                <img src="${post.multimedia[0]?.url}" alt="IMG" />
              </div>
              <div class="TextPostlong">
                <p>${post.des_facet}</p>
                <span>${post.title}</span>
              </div>
              <div class="infobuttom">
                <div>
                  <img src="assets/Frame 1.png" alt="Frame" />
                  <img src="assets/Frame 1 (1).png" alt="Frame" />
                </div>
                <div class="Actions">
                  <img src="assets/Actions.png" alt="Actions" />
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

    articleContainer.innerHTML = newPost;
  } catch (err) {
    const spinnerId = document.getElementById("spinner");
    spinnerId.remove();
    articleContainer.innerHTML = `<h3>Error: Data could not be loaded</h3>`;
    console.error(err);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get("id");
  console.log(articles);
  if (articleId) {
    console.log("Article ID:", articleId);
    loadPostById(articleId);
  } else {
    loadPosts();
  }
});

articles.addEventListener("click", (event) => {
  if (event.target.matches(".title_style")) {
    event.preventDefault(); // Предотвращаем переход по ссылке
    const articleId = event.target.href.split("=")[1];
    loadPostById(articleId);
  }
});
