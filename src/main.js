const ecommData = {
    categories: [
        {id: 1, name: "Chairs", itemsIds: [1, 5], image: "https://placehold.co/600x400"},
        {id: 2, name: "Tables", itemsIds: [2], image: "https://placehold.co/600x400"},
        {id: 3, name: "Benches", itemsIds: [3], image: "https://placehold.co/600x400"},
        {id: 4, name: "Beds", itemsIds: [4], image: "https://placehold.co/600x400"},
    ],

    products: [
        { id: 1, name: "Red Chair", price: 100, stock: 50, description: "A red chair", image: "https://placehold.co/600x400"},
        { id: 2, name: "Table", price: 140, stock: 10, description: "A table", image: "https://placehold.co/600x400"},
        { id: 3, name: "Bench", price: 200, stock: 40, description: "A bence", image: "https://placehold.co/600x400"},
        { id: 4, name: "Bed", price: 180, stock: 20, description: "A bed", image: "https://placehold.co/600x400"},
        { id: 5, name: "Blue Chair", price: 100, stock: 50, description: "A blue chair", image: "https://placehold.co/600x400"},
    ],

    users: [
        { id: 1, name: "Foo", email: "foo@mail.com", password: "pass1", isAdmin: true },
        { id: 2, name: "Bar", email: "bar@mail.com", password: "pass2", isAdmin: false },
        { id: 3, name: "Baz", email: "baz@mail.com", password: "pass3", isAdmin: false },
    ],

    orders: [
        { id: 1, customerId: 2, items: [{productId: 1, quantity: 2}], total: 200 },
        { id: 2, customerId: 3, items: [{productId: 1, quantity: 4}, {productId: 2, quantity: 1}], total:  540 },
        { id: 3, customerId: 3, items: [{productId: 3, quantity: 1}], total: 200 },
    ],
};
// Seed initial data into localStorage if not already there
function seedDatabase() {
    if (!localStorage.getItem("DB")) {
        localStorage.setItem("DB", JSON.stringify(ecommData));
    }
}
seedDatabase();

// Database helpers
function getDatabase() {
    return JSON.parse(localStorage.getItem("DB"));
}

function updateDatabase(data) {
    localStorage.setItem("DB", JSON.stringify(data));
}

function generateId(list) {
    return list.length > 0 ? Math.max(...list.map(item => item.id)) + 1 : 1;
}

// Category operations
function addCategory(category) {
    const db = getDatabase();
    category.id = generateId(db.categories);
    db.categories.push(category);
    updateDatabase(db);
}

function getCategories() {
    return getDatabase().categories;
}

function getCategoryById(id) {
    return getDatabase().categories.find(c => c.id === id);
}

function updateCategory(id, updatedCategory) {
    const db = getDatabase();
    const index = db.categories.findIndex(c => c.id === id);
    if (index !== -1) {
        db.categories[index] = { ...db.categories[index], ...updatedCategory };
        updateDatabase(db);
        return true;
    }
    return false;
}

function deleteCategory(id) {
    const db = getDatabase();
    const category = db.categories.find(c => c.id === id);

    if (category) {
        // Remove products that belong to this category
        db.products = db.products.filter(p => !category.itemsIds.includes(p.id));
    }

    db.categories = db.categories.filter(c => c.id !== id);
    updateDatabase(db);
}

// Product operations
function addProduct(product) {
    const db = getDatabase();
    product.id = generateId(db.products);
    db.products.push(product);
    updateDatabase(db);
}

function getProducts() {
    return getDatabase().products;
}

function getProductById(id) {
    return getDatabase().products.find(p => p.id === id);
}

function updateProduct(id, updatedProduct) {
    const db = getDatabase();
    const index = db.products.findIndex(p => p.id === id);
    if (index !== -1) {
        db.products[index] = { ...db.products[index], ...updatedProduct };
        updateDatabase(db);
        return true;
    }
    return false;
}

function deleteProduct(id) {
    const db = getDatabase();
    db.products = db.products.filter(p => p.id !== id);
    updateDatabase(db);
}

// User operations
function addUser(user) {
    const db = getDatabase();
    user.id = generateId(db.users);
    db.users.push(user);
    updateDatabase(db);
}

function getUsers() {
    return getDatabase().users;
}

function getUserById(id) {
    return getDatabase().users.find(u => u.id === id);
}

function updateUser(id, updatedUser) {
    const db = getDatabase();
    const index = db.users.findIndex(u => u.id === id);
    if (index !== -1) {
        db.users[index] = { ...db.users[index], ...updatedUser };
        updateDatabase(db);
        return true;
    }
    return false;
}

function deleteUser(id) {
    const db = getDatabase();
    db.users = db.users.filter(u => u.id !== id);
    updateDatabase(db);
}

// Order operations
function addOrder(order) {
    const db = getDatabase();
    order.id = generateId(db.orders);

    // Check stock before processing
    for (let item of order.items) {
        const product = db.products.find(p => p.id === item.productId);
        if (!product || product.stock < item.quantity) {
            return false;
        }
    }

    // Deduct stock
    order.items.forEach(item => {
        const product = db.products.find(p => p.id === item.productId);
        product.stock -= item.quantity;
    });

    db.orders.push(order);
    updateDatabase(db);
    return true;
}

function getOrders() {
    return getDatabase().orders;
}

function getOrderById(id) {
    return getDatabase().orders.find(o => o.id === id);
}

function updateOrder(id, updatedOrder) {
    const db = getDatabase();
    const index = db.orders.findIndex(o => o.id === id);
    if (index !== -1) {
        db.orders[index] = { ...db.orders[index], ...updatedOrder };
        updateDatabase(db);
        return true;
    }
    return false;
}

function deleteOrder(id) {
    const db = getDatabase();
    const index = db.orders.findIndex(o => o.id === id);
    if (index === -1) return false;

    const order = db.orders[index];

    // Restock products
    order.items.forEach(item => {
        const product = db.products.find(p => p.id === item.productId);
        if (product) {
            product.stock += item.quantity;
        }
    });

    db.orders = db.orders.filter(o => o.id !== id);
    updateDatabase(db);
    return true;
}

// Search utility
function searchProducts(event) {
    event.preventDefault();
    const searchInput = document.getElementById("search-input");
    const searchTerm = searchInput.value.trim().toLowerCase();

    if (!searchTerm) {
        return;
    }

    const results = getProducts().filter(p => p.name.toLowerCase().includes(searchTerm));

    localStorage.setItem("searchTerm", searchTerm);
    localStorage.setItem("searchResults", JSON.stringify(results));

    window.location.href = "search-results.html";
}

function displaySearchResults() {
    const results = JSON.parse(localStorage.getItem("searchResults"));
    const searchTerm = localStorage.getItem("searchTerm");

    const searchTermHeader = document.getElementById("term-header");
    searchTermHeader.innerHTML += searchTerm;

    const productsContainer = document.getElementById("cards-container");

    results.forEach(product => {
        productsContainer.innerHTML += `
                        <a href="product-details.html?id=${product.id}" class="text-decoration-none text-dark product-card col">
                            <div class="card h-100 shadow-sm rounded-4 border-0 position-relative overflow-hidden transition">
                                <button class="btn btn-light position-absolute top-0 end-0 m-2 rounded-circle shadow-sm z-2">
                                    <i class="fa-regular fa-heart"></i>
                                </button>
                                <img src="${product.image}" class="card-img-top rounded-top-4" alt="${product.name}">
                                <div class="card-body">
                                    <h5 class="card-title">${product.name}</h5>
                                    <p class="card-text text-muted">${product.description}</p>
                                    <div class="d-flex align-items-baseline">
                                        <sup class="fs-6">EGP</sup>
                                        <p class="fs-4 fw-bold mb-0">${product.price}</p>
                                        <sup class="fs-6">.00</sup>
                                    </div>
                                </div>
                                <div class="add-to-cart-overlay position-absolute bottom-0 start-0 end-0 p-3 bg-white border-top d-none">
                                    <button class="btn btn-success w-100 add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                                </div>
                            </div>
                        </a>`;
    });
}

// login-signup utility
function checkLogin() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    return loggedInUser !== null;
}

function populateNavbar() {
    const navbar = document.getElementsByClassName("navbar-nav")[0];
    if (navbar === undefined) {
        return;
    }

    const isUserLoggedIn = checkLogin();

    if (!isUserLoggedIn) {
        navbar.innerHTML += `
                        <li class="nav-item" id="login-icon">
                            <a class="nav-link active" href="./login.html">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-person-plus-fill" viewBox="0 0 16 16">
                                    <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                                    <path fill-rule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5"/>
                                </svg>
                                <span class="d-sm-none">Sign In</span>
                            </a>
                        </li>`;
    } else {
        navbar.innerHTML += `
                        <li class="nav-item" id="login-icon">
                            <a class="nav-link active" href="./home.html" onclick="logout()">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
                                <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
                                </svg>
                                <span class="d-sm-none">Sign In</span>
                            </a>
                        </li>`;
    }
}

function logout() {
    localStorage.setItem("loggedInUser", null);
}

populateNavbar();
