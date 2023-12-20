// Scott JS Func
// *******************************************************************
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
  document.getElementById("categories_container").innerHTML = "";
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

function displayRecipes(category) {
  category_container.textContent = category;
  recipe_container.innerHTML = "";

  const API_URL = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
  fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
      const recipes = data.meals;

      if (!recipes) {
        console.error("No recipes found for the category:", category);
        return;
      }

      // Create an array of promises for fetching recipe details
      const promises = recipes.map((recipe) => {
        return fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipe.idMeal}`
        )
          .then((response) => response.json())
          .then((detailsData) => detailsData.meals[0])
          .catch((detailsError) => {
            console.error("Error fetching recipe details:", detailsError);
            return null;
          });
      });

      // Wait for all promises to resolve
      Promise.all(promises)
        .then((recipeDetailsArray) => {
          recipeDetailsArray.forEach((recipeDetails, index) => {
            const recipeDiv = document.createElement("div");
            recipeDiv.classList.add("recipe");

            // Display the name of the recipe
            const recipeName = document.createElement("h3");
            recipeName.textContent = recipes[index].strMeal; // Use recipes array directly
            recipeDiv.appendChild(recipeName);

            // Display the description of how to make the recipe
            const recipeDescription = document.createElement("p");
            recipeDescription.textContent = recipeDetails
              ? recipeDetails.strInstructions
              : "No instructions available";
            recipeDiv.appendChild(recipeDescription);

            // Append the recipeDiv to the recipe_container
            recipe_container.appendChild(recipeDiv);
          });
        })
        .catch((errors) => {
          console.error("Error fetching recipe details:", errors);
        });
    })
    .catch((errors) => {
      console.error("Error fetching recipes:", errors);
    });
}

nav_main.addEventListener("click", (evt) => {
  if (evt.target.classList.contains("recipe-category")) {
    createCategoryButtons();
    // displayRecipes(""); // Display recipes for an empty category initially
  }
});

categories_container.addEventListener("click", (evt) => {
  if (evt.target.classList.contains("category_btn")) {
    displayRecipes(evt.target.textContent);
  }
});

function displayRecipesByIngredient() {
  // Function code...
}

// *******************************************************************

var multipleCardCarousel = document.querySelector("#carouselExampleControls");
if (window.matchMedia("(min-width: 768px)").matches) {
  var carousel = new bootstrap.Carousel(multipleCardCarousel, {
    interval: false,
  });
  var carouselWidth = $(".carousel-inner")[0].scrollWidth;
  var cardWidth = $(".carousel-item").width();
  var scrollPosition = 0;
  $("#carouselExampleControls .carousel-control-next").on("click", function () {
    if (scrollPosition < carouselWidth - cardWidth * 4) {
      scrollPosition += cardWidth;
      $("#carouselExampleControls .carousel-inner").animate(
        { scrollLeft: scrollPosition },
        600
      );
    }
  });
  $("#carouselExampleControls .carousel-control-prev").on("click", function () {
    if (scrollPosition > 0) {
      scrollPosition -= cardWidth;
      $("#carouselExampleControls .carousel-inner").animate(
        { scrollLeft: scrollPosition },
        600
      );
    }
  });
} else {
  $(multipleCardCarousel).addClass("slide");
}

const header = document.querySelector("header");

window.addEventListener("scroll", function () {
  header.classList.toggle("sticky", window.scrollY > 0);
});

let menu = document.querySelector("#menu-icon");
let navbar = document.querySelector(".navbar");

menu.onclick = () => {
  menu.classList.toggle("bx-x");
  navbar.classList.toggle("open");
};

window.onscroll = () => {
  menu.classList.remove("bx-x");
  navbar.classList.remove("open");
};

const sr = ScrollReveal({
  distance: "60px",
  duration: 2500,
  reset: true,
});

sr.reveal(".home-text", { delay: 200, origin: "left" });
sr.reveal(".home-img", { delay: 200, origin: "right" });

sr.reveal(".container, .about, .menu, .contact", {
  delay: 200,
  origin: "bottom",
});
