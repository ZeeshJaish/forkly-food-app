const API_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

const mealsContainer = document.getElementById("mealsContainer");
const searchInput = document.getElementById("searchInput");

// Fetch meals from API
async function fetchMeals(query = "chicken") {
  mealsContainer.innerHTML = "<p>Loading...</p>";

  try {
    const res = await fetch(API_URL + query);
    const data = await res.json();

    displayMeals(data.meals);
  } catch (error) {
    mealsContainer.innerHTML = "<p>Something went wrong. Try again.</p>";
    console.error(error);
  }
}

// Display meals
function displayMeals(meals) {
  mealsContainer.innerHTML = "";

  if (!meals || meals.length === 0) {
    mealsContainer.innerHTML = "<p>No meals found</p>";
    return;
  }

  meals.forEach(meal => {
    const card = document.createElement("div");
    card.classList.add("meal-card");

    card.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <h3>${meal.strMeal}</h3>
      <button>View</button>
    `;

    mealsContainer.appendChild(card);
  });
}

// Search functionality
searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim();

  if (query === "") {
    fetchMeals("chicken");
  } else {
    fetchMeals(query);
  }
});

// Initial load
fetchMeals();