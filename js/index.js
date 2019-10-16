function main(){
    document.addEventListener("DOMContentLoaded", function() {
        let books = [];
        let allUsers = [];
        fetchBooks();
        fetchUsers();
    });
}

function fetchBooks(){
    fetch('http://localhost:3000/books')
    .then(res => res.json())
    .then(data => {
        books = data;
        renderBooks(data)
    })
}

function fetchUsers(){
    fetch('http://localhost:3000/users')
    .then(res => res.json())
    .then(data => {
        allUsers = data;
        getCurrentUser("pouros");
    })
}

function renderBooks(books){
    books.forEach(book => {
        renderBook(book)
      })
}

function renderBook(book){
    const list = document.getElementById("list");
    let li = document.createElement("li");
    li.innerHTML = book.title;
    li.addEventListener("click", function(event){
        currentBook = selectedBook(event.target);
        bookDetails(currentBook);
    });
    list.append(li);
}

function bookDetails(book){
    const show = document.getElementById("show-panel");
    show.innerHTML = '';
    let h2 = document.createElement('h2');
    h2.innerHTML = book.title;
    let img = document.createElement("img");
    img.setAttribute('src',book.img_url);
    let p = document.createElement('p');
    p.innerHTML = book.description;
    let userList = document.createElement('ul');
    let readBtn = document.createElement('button');
    readBtn.innerHTML = "Read Book";
    book.users.forEach (user => {
        let userLi = document.createElement('li');
        userLi.innerHTML = user.username;
        userList.append(userLi);
        if(user.username == currentUser.username){
            readBtn.innerHTML = "Remove Book"; 
        }
    })
    readBtn.addEventListener("click", () => {
        readBook(book);
    });
    show.append(h2, img, p, userList, readBtn);
}

function selectedBook(target){
    let selectedBook = {};
    books.forEach(book => {
        if(book.title == target.innerHTML){
            selectedBook = book;
        }
    })
    return selectedBook;
}

function readBook(book){
    let read = false;
    book.users.forEach(user => {
        if(user.username == currentUser.username){
            read = true;    
        }
    })
    if(read){
        removeUser(book, currentUser);
        window.alert("Book removed!");
    } else {
        patchBook(book, currentUser);
    }
}

function patchBook(book, user){
    let readers = [...book.users, user];
    fetch(`http://localhost:3000/books/${book.id}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify( {
          users: readers
        })
      })
    .then(resp => resp.json())
    .then(bookData => {
        bookDetails(bookData)
    })
    
}

function removeUser(book, user){
    let readers = book.users; 
    let filtered = readers.filter(u=>{
        console.log(u);
        console.log(user);
        return u.username != user.username;
    });
    fetch(`http://localhost:3000/books/${book.id}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify( {
          users: filtered
        })
      })
    .then(resp => resp.json())
    .then(bookData => {
        bookDetails(bookData)
    })
    
}

function getCurrentUser(username){
    allUsers.forEach(user => {
        if(user.username == username){
            currentUser = user;
        }
    })
    return currentUser;
}

main()