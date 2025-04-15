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
        { id: 1, customreId: 2, items: [{productId: 1, quantity: 2}], total: 200 },
        { id: 2, customreId: 3, items: [{productId: 1, quantity: 4}, {productId: 2, quantity: 1}], total:  540 },
        { id: 3, customreId: 3, items: [{productId: 3, quantity: 1}], total: 200 },
    ],
};

function seedDatabase() {
    if (!localStorage.getItem("DB")) {
        localStorage.setItem("DB", JSON.stringify(ecommData));
    }
}
seedDatabase();

// Database helper functions
function getDatabase() {
    return JSON.parse(localStorage.getItem("DB"));
}

function updateDatabase(data) {
    localStorage.setItem("DB", JSON.stringify(data));
}

// Catrogory operations
function addCategory(category) {
    const db = getDatabase();
    category.id = db.categories.length > 0 ? Math.max(...db.categories.map(c => c.id)) + 1 : 1;
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
        db.categories[index] = {...db.categories[index], ...updatedCategory};
        updateDatabase(db);
        return true;
    }
    return false;
}

function deleteCategory(id) {
    // TODO: also delete all products in this category
    const db = getDatabase();
    db.categories = db.categories.filter(c => c.id !== id);
    updateDatabase(db);
}

// Product operations
function addProduct(product) {
    const db = getDatabase();
    product.id = db.products.length > 0 ? Math.max(...db.products.map(p => p.id)) + 1 : 1;
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
    const index = db.prodcuts.findIndex(p => p.id === id);
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
    user.id = db.users.length > 0 ? Math.max(...db.users.map(u => u.id)) + 1 : 1;
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
    const index = db.prodcuts.findIndex(u => u.id === id);
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
    order.id = db.orders.length > 0 ? Math.max(...db.orders.map(o => o.id)) : 1;
    db.orders.push(order);

    order.items.forEach(item => {
        const product = db.products.find(p => p.id === item.productId);
        if (product) {
            if (product.stock < item.quantity) {
                return false;
            }
            product.stock -= item.quantity;
        }
    });

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
    if (index === -1) {
        return false;
    }
    const order = db.orders[index];
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

    for (let i = 0; i < results.length; i++) {
        productsContainer.innerHTML += `
            <div class="col">
                <div class="card h-100" style="width: 18rem;">
                    <img src="https://placehold.co/600x400" class="card-img-top">
                    <div class="card-body">
                        <h5 class="card-title">${results[i].name}</h5>
                        <p class="card-text">${results[i].description}</p>
                        <div class="d-flex align-items-baseline">
                            <sup class="fs-6">EGP</sup>
                            <p class="fs-4 fw-bold">${results[i].price}</p>
                        </div>
                    </div>
                </div>
            </div>`;
    }
}
