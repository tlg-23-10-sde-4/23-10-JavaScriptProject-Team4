$(document).ready(function () {
  $("nav ul li a:not(:only-child)").click(function (e) {
    $(this).siblings(".nav-dropdown").toggle();
    e.stopPropagation();
  });

  $("html").click(function () {
    $(".nav-dropdown").hide();
  });
  $("#nav-toggle").click(function () {
    $("nav ul").slideToggle();
  });
  $("#nav-toggle").on("click", function () {
    this.classList.toggle("active");
  });
});

function createCategoryButtons() {
  fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
    .then((response) => response.json())
    .then((data) => {
      const categories = data.categories;
      categories.forEach((category) => {
        const btn = document.createElement("button");
        btn.textContent = category.strCategory;
        btn.classList.add("category_btn");
        categories_container.appendChild(btn);
      });
    })
    .catch((error) => {
      console.error("Error fetching categories:", error);
    });
}

nav_main.addEventListener("click", (evt) => {
  if (evt.target.classList.contains("recipe-category")) {
    createCategoryButtons();
    category_name.textContent = evt.target.textContent;
    const API_URL = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${evt.target.textContent}`;
    fetch(API_URL)
      .then((response) => response.json())
      .then((strMeal) => showRecipes(strMeal))
      .catch((errors) => {
        console.log(errors);
      });
  }
});
