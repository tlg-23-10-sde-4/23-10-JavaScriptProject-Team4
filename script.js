const header = document.querySelector("header");
const currentUser = userIcon.textContent;
const favorites = [];
window.addEventListener("scroll", function () {
  header.classList.toggle("sticky", window.scrollY > 0);
});

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
            recipeDiv.innerHTML = `<button type="button" class="btn_fav">Add to favorites</button>`;

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
  if (evt.target.classList.contains("recipe-area")) {
    createAreaButtons();
  }
  if (evt.target.classList.contains("random-recipe")) {
    generateRandomRecipe();
  }
});
// event listener for category BTNs
categories_container.addEventListener("click", (evt) => {
  if (evt.target.classList.contains("category_btn")) {
    displayRecipes(evt.target.textContent);
  }
});
// event listener for area BTNs
area_container.addEventListener("click", (evt) => {
  if (evt.target.classList.contains("area_btn")) {
    const selectedArea = evt.target.textContent;
    displayRecipesByArea(selectedArea);
  }
});

function createAreaButtons() {
  document.getElementById("area_container").innerHTML = "";
  fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list")
    .then((response) => response.json())
    .then((data) => {
      const areas = data.meals;
      areas.forEach((area) => {
        const area_btn = document.createElement("button");
        area_btn.textContent = area.strArea;
        area_btn.classList.add("area_btn");
        area_container.appendChild(area_btn);
      });
    })
    .catch((error) => {
      console.error("Error fetching areas:", error);
    });
}

function displayRecipesByArea(area) {
  document.getElementById("area_name").textContent = area;
  document.getElementById("area_recipes").innerHTML = "";

  const API_URL = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`;
  fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
      const recipes = data.meals;

      if (!recipes) {
        console.error("No recipes found for the area:", area);
        return;
      }

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

      Promise.all(promises)
        .then((recipeDetailsArray) => {
          recipeDetailsArray.forEach((recipeDetails, index) => {
            const recipeDiv = document.createElement("div");
            recipeDiv.classList.add("recipe");
            recipeDiv.innerHTML = `<button type="button" class="fav_btn">Add to favorites</button>`;
            const recipeName = document.createElement("h3");
            recipeName.textContent = recipes[index].strMeal;
            recipeDiv.appendChild(recipeName);

            const recipeDescription = document.createElement("p");
            recipeDescription.textContent = recipeDetails
              ? recipeDetails.strInstructions
              : "No instructions available";
            recipeDiv.appendChild(recipeDescription);

            document.getElementById("area_recipes").appendChild(recipeDiv);
          });
        })
        .catch((errors) => {
          console.error("Error fetching recipe details:", errors);
        });
    })
    .catch((errors) => {
      console.error("Error fetching recipes by area:", errors);
    });
}
// *******************************************************************

document.querySelector("#btn-random").addEventListener("click", function () {
  fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    .then((response) => response.json())
    .then((data) => {
      const recipe = data.meals[0]; // Get the first meal from the response
      updateModal(recipe);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

function updateModal(recipe) {
  // Update the modal title with the recipe name
  document.getElementById("exampleModalCenterTitle").textContent =
    recipe.strMeal;

  // Build the modal body content
  const modalBodyContent = `
    <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" class="img-fluid" />
    <p>${recipe.strInstructions}</p><button type="button" class="fav_btn">Add to favorites</button>
  `;

  // Update the modal body with the new content
  document.getElementById("modal_body").innerHTML = modalBodyContent;
  exampleModalCenter.addEventListener("click", (evt) => {
    if (evt.target.classList.contains("fav_btn")) {
      favorites.push(exampleModalCenter);
      addFavorite();
    }

    // Bootstrap's way to show the modal using jQuery
    $("#exampleModalCenter").modal("show");
  });
}
function addFavorite() {
  const currentUser = userIcon.textContent;
  console.log(currentUser);
  const userFav = { userId: currentUser, fav: favorites };
  console.log(userFav);
  fetch(`http://localhost:3001/addfavorites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userFav),
  })
    .then((response) => response.json())
    .then((responsestate) => console.log(responsestate[currentUser]))
    .catch((err) => {
      console.log(err);
    });
}
addFavorite();
