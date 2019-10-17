function main() {
    document.addEventListener("DOMContentLoaded", function() {
        fetchAllBooks();
        addShowBookListener();
    });    
}

// GETS BOOKS FROM SERVER AND CALLS FUNCTION TO DISPLAY EACH BOOK - PASSING JSON DATA
function fetchAllBooks() {
    fetch(`http://localhost:3000/books`)
    .then(resp => resp.json())
    .then(json => displayAllBooks(json))
}

// RECEIVES JSON INPUT AND CREATES HTML ELEMENTS FOR EACH BOOK USING THE ID AND TITLE
function displayAllBooks(books) {
    const ul = document.querySelector('#list');
    books.forEach(book => {
        ul.insertAdjacentHTML('beforeend',
        `
        <li class="book" data-id="${book.id}">${book.title}</li>
        `)
    })
}

// ADD CLICK LISTENER FOR ALL BOOKS AND CALL FUNCTION TO FETCH A SINGLE BOOKS DATA, PASSING THE BOOKS ID
function addShowBookListener() {
    document.addEventListener('click', (event) => {
        if(event.target.className === 'book'){
            const bookId = parseInt(event.target.dataset.id);
            fetchSingleBook(bookId);
        }
    });
}

// FETCH DATA FOR A SINGLE BOOK AND CALL FUNCTION TO DISPLAY THE BOOK INFO, PASSING THE JSON RESPONSE
function fetchSingleBook(bookId) {
    fetch(`http://localhost:3000/books/${bookId}`)
    .then(resp => resp.json())
    .then(json => displaySingleBook(json))
}

// DISPLAY A SINGLE BOOK IN THE DIV AND CALL FUNCTION TO ADD EVENT LISTENER TO THE BUTTON
function displaySingleBook(json) {
    const div = document.querySelector('#show-panel')
    const users = json.users;
    div.setAttribute('data-id', json.id)
    div.innerHTML = '';
    div.insertAdjacentHTML('beforeend',
    `
    <h2>${json.title}</h2>
    <img src="${json.img_url}">
    <p>${json.description}</p>
    <ul id="user-liked">
    </ul>
    <button data-book-id="${json.id}" class="like-book">Read Book</button>
    `);

    const userList = document.querySelector('#user-liked');
    users.forEach(user => {
        userList.insertAdjacentHTML('beforeend', 
        `
        <li>${user.username}</li>
        `)
    });
    
    const btn = div.getElementsByClassName("like-book")[0];
    console.log(btn);

    btn.addEventListener('click', (event) => {
        if(event.target.dataset.bookId === div.dataset.id) {
            patchLike(json);
        }
    });
}

// FETCH THE DISPLAYED BOOK AND UPDATE THE DATABASE WITH A LIKE, THEN ADD NEW HTML TO SHOW USERS THAT LIKED THE BOOK
function patchLike(book) {
    const usersLikes = book.users;
    usersLikes.push({"id":1, "username":"pouros"});
    const userList = document.querySelector('#user-liked');
    if(userList.innerHTML.includes("pouros")) {
        alert('You already liked this book!')
    } else {
        userList.insertAdjacentHTML('beforeend', 
        `
        <li>pouros</li>
        `)
        return fetch(`http://localhost:3000/books/${book.id}`, {
            method: "PATCH",
            headers: {
                "Accept": 'application/json',
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                "users": usersLikes
            })
        });
    }
    
}
  
main();