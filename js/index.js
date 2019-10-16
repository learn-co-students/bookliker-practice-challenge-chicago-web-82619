document.addEventListener("DOMContentLoaded", function() {
    displayBookNames();
    addClickListener();
});

const displayBookNames = () => {
    fetch("http://localhost:3000/books")
    .then(resp => resp.json())
    .then(json => json.forEach(element => addBookTitle(element)))
}

const addBookTitle = (book) => {
    const list = document.getElementById("list");

    const li = document.createElement("li");
    li.id = book.id
    li.innerHTML = book.title;

    list.append(li)
}

const addClickListener = () => {
    document.addEventListener("click", (event) => {
        if (event.target.tagName === 'LI'){
            displayLi(event.target);
        }
    })
}

const displayLi = (target) => {
    const id = target.id;

    fetch(`http://localhost:3000/books/${id}`)
    .then(resp => resp.json())
    .then(json => displayBook(json))
}

const displayBook = (book) => {
    const show = document.getElementById('show-panel');
    show.innerHTML = ""

    const h1 = document.createElement('h1');
    h1.textContent = book.title;

    const img = document.createElement('img');
    img.src = book.img_url;

    const p = document.createElement('p');
    p.innerHTML = book.description;

    const ul = document.createElement('ul');
    book.users.forEach(user => {
        li = document.createElement('li');
        li.innerHTML = user.username;
        ul.append(li);
    })

    const btn = document.createElement('button')
    btn.id = book.id
    btn.className = "read"
    btn.innerHTML = "Read Book"

    const userExists = book.users.filter(e => e.id === 1).length > 0

    console.log(userExists)

    btn.addEventListener('click', () => {
        const userExists = book.users.filter(e => e.id === 1).length > 0;
        if (!userExists){
            readBook(book)
        }
        else {
            alert("You fucked up!")
        }
    })

    show.append(h1, img, p, ul, btn);
}

const readBook = (book) => {
    console.log(book.id);
    const usersArray = book.users;
    usersArray.push({"id":1, "username":"pouros"});
    
    fetch(`http://localhost:3000/books/${book.id}`,{
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            users: usersArray
        })
    })
    .then(resp => resp.json())
    .then(json => addUser(json))
}

const addUser = (json) => {
        const ul = document.getElementById("show-panel").querySelector("ul");
        
        const li = document.createElement("li");
        li.innerHTML = "pouros"
        ul.append(li)
}