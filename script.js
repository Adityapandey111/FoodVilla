const apiKey = 'b5a4f5706ab84e67a27f81290f9fe591'; // Get your API key from Spoonacular
let currentPage = 1; // Track the current page for infinite scrolling

document.addEventListener('DOMContentLoaded', () => {
    getMenu();
    setupInfiniteScroll();
});

function getMenu() {
    const menuContainer = document.getElementById('menu');
    const recipeResults = document.getElementById('recipeResults');

    // Initially hide the search results container
    recipeResults.style.display = 'none';

    // Fetch data from Spoonacular API
    fetchMenu(currentPage)
        .then(data => {
            // Display menu items
            displayMenu(data.recipes);
        })
        .catch(error => {
            console.error('Error:', error.message);
        });
}

function fetchMenu(page) {
    return fetch(`https://api.spoonacular.com/recipes/random?number=6&apiKey=${apiKey}&page=${page}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch menu items. Please try again.');
            }
            return response.json();
        });
}

function displayMenu(menuItems) {
    const menuContainer = document.getElementById('menu');

    menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.classList.add('menu-item');

        menuItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="card-item-details">
                <h4>${item.title}</h4>
                <p><strong>Price:</strong> $5.99</p> <!-- Placeholder for price -->
                <p><strong>Rating:</strong> 4.5</p>
            </div>
        `;

        menuContainer.appendChild(menuItem);
    });
}

function setupInfiniteScroll() {
    const footer = document.querySelector('footer');
    const footerHeight = footer.offsetHeight;

    window.addEventListener('scroll', () => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

        // Calculate the distance between the bottom of the viewport and the top of the footer
        const distanceToFooter = scrollHeight - (scrollTop + clientHeight) - footerHeight;

        // Stop infinite scroll when the user is close to the footer (adjust the threshold as needed)
        if (distanceToFooter < 50) {
            return;
        }

        // Load more items when user is near the bottom
        currentPage++;
        fetchMenu(currentPage)
            .then(data => {
                // Display additional menu items
                displayMenu(data.recipes);
            })
            .catch(error => {
                console.error('Error:', error.message);
            });
    });
}




// searching the items
function searchRecipes() {
    const searchInput = document.getElementById('searchInput').value;
    const recipeResults = document.getElementById('recipeResults');
    const menuContainer = document.getElementById('menu');
    const notificationContainer = document.getElementById('notification');

    // Check if the search input is not empty
    if (searchInput.trim() !== '') {
        const apiUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${searchInput}&apiKey=${apiKey}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    // Display search results and hide the main page
                    recipeResults.style.display = 'flex';
                    menuContainer.style.display = 'none';
                    displayRecipes(data);

                    // Notify user about search results
                    showNotification(`Results for "${searchInput}" found.`);
                } else {
                    // No results found
                    recipeResults.style.display = 'none';
                    menuContainer.style.display = 'flex';

                    // Notify user that no results were found
                    showNotification(`No recipes found for "${searchInput}".`);
                }
            })
            .catch(error => {
                console.error('Error fetching recipes:', error);
                // Notify user about the error
                showNotification('Error fetching recipes. Please try again later.');
            });
    } else {
        // Display the main page if the search input is empty
        recipeResults.style.display = 'none';
        menuContainer.style.display = 'flex';

        // Notify user that search input is empty
        showNotification('Please enter ingredients or keywords to search.');
    }
}

function showNotification(message) {
    const notificationContainer = document.getElementById('notification');
    notificationContainer.textContent = message;
    notificationContainer.style.display = 'block';

    // Hide notification after 3 seconds (adjust as needed)
    setTimeout(() => {
        notificationContainer.style.display = 'none';
    }, 3000);
}




function displayRecipes(recipes) {
    const recipeResults = document.getElementById('recipeResults');
    recipeResults.innerHTML = '';

    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');

        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <h4>${recipe.title}</h4>
            <p><strong>Ingredients:</strong> ${recipe.usedIngredients.map(ingredient => ingredient.name).join(', ')}</p>
            <p><a href="${recipe.sourceUrl}" target="_blank">Full Recipe</a></p>
        `;

        recipeResults.appendChild(recipeCard);
    });
}
