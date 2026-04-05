const API_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

document.addEventListener("DOMContentLoaded", () => {

  const mealsContainer = document.getElementById("mealsContainer");
  const searchInput = document.getElementById("searchInput");
  const sortOption = document.getElementById("sortOption");
  const themeToggle = document.getElementById("themeToggle");
  const showFavoritesBtn = document.getElementById("showFavorites");
  const logo = document.querySelector(".navbar h1");

  let allMeals = [];
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  let showingFavorites = false;

  // 🔥 FETCH MEALS
  async function fetchMeals(query = "chicken") {
    mealsContainer.innerHTML = "<p>Loading...</p>";
    showingFavorites = false;

    try {
      const res = await fetch(API_URL + query);

      if (!res.ok) throw new Error("Network error");

      const data = await res.json();

      allMeals = data.meals || [];
      displayMeals(allMeals);

    } catch (error) {
      console.error(error);
      mealsContainer.innerHTML = "<p>No meals found</p>";
    }
  }

  // 🔥 DISPLAY MEALS
  function displayMeals(meals) {
    mealsContainer.innerHTML = "";

    if (!meals || meals.length === 0) {
      mealsContainer.innerHTML = "<p>No meals found</p>";
      return;
    }

    meals.forEach(meal => {
      const isFav = favorites.includes(meal.idMeal);

      const card = document.createElement("div");
      card.classList.add("meal-card");

      card.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
        <h3>${meal.strMeal}</h3>
        <div style="display:flex; gap:10px;">
          <button onclick="toggleFavorite('${meal.idMeal}')">
            ${isFav ? "💖" : "🤍"}
          </button>
        </div>
      `;

      mealsContainer.appendChild(card);
    });
  }

  // 🔥 DEBOUNCED SEARCH
  let timeout;

  searchInput.addEventListener("input", () => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      const query = searchInput.value.trim();

      if (query === "") {
        fetchMeals("chicken");
      } else {
        fetchMeals(query);
      }
    }, 400);
  });

  // 🔥 SORTING (HOF)
  sortOption.addEventListener("change", () => {
    if (showingFavorites) return;

    let sortedMeals = [...allMeals];

    if (sortOption.value === "asc") {
      sortedMeals.sort((a, b) =>
        a.strMeal.localeCompare(b.strMeal)
      );
    }

    if (sortOption.value === "desc") {
      sortedMeals.sort((a, b) =>
        b.strMeal.localeCompare(a.strMeal)
      );
    }

    displayMeals(sortedMeals);
  });

  // 🔥 FAVORITES TOGGLE (HOF: filter)
  window.toggleFavorite = function (id) {
    if (favorites.includes(id)) {
      favorites = favorites.filter(item => item !== id);
    } else {
      favorites.push(id);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));

    if (showingFavorites) {
      showFavorites();
    } else {
      displayMeals(allMeals);
    }
  };

  // 🔥 SHOW FAVORITES
  function showFavorites() {
    const favMeals = allMeals.filter(meal =>
      favorites.includes(meal.idMeal)
    );

    showingFavorites = true;
    displayMeals(favMeals);
  }

  showFavoritesBtn.addEventListener("click", showFavorites);

  // 🔥 DARK MODE
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });

  // 🔥 RESET (CLICK LOGO)
  logo.addEventListener("click", () => {
    displayMeals(allMeals);
    showingFavorites = false;
  });

  // INITIAL LOAD
  fetchMeals();
});