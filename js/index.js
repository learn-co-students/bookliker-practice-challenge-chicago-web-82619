function main() {
  document.addEventListener("DOMContentLoaded", function() {
    getBooks()
  });

  function getBooks() {
    fetch('http://localhost:3000/books')
      .then(resp => resp.json())
      .then(books => renderBooks(books))
  }

  function renderBooks(books) {
    const bookList = document.getElementById('list');
    bookList.innerHTML = '';
    books.forEach((book) => {
      const li = document.createElement('li');
      li.innerText = book.title;
      li.onclick = (event) => renderBook(book.id);

      bookList.append(li)
    })
  }

  function renderBook(id) {
    fetch(`http://localhost:3000/books/${id}`)
      .then(resp => resp.json())
      .then(book => displayBook(book));
  }

  function displayBook(book) {
    const bookShow = document.getElementById('show-panel');
    bookShow.innerHTML = '';
    const h1 = document.createElement('h1');
    const img = document.createElement('img');
    const p = document.createElement('p');
    const button = document.createElement('button');
    const likes = document.createElement('div');
    console.log(book)
    book.users.forEach((user) => {
      const userLi = document.createElement('h5');
      userLi.innerHTML = user.username;
      likes.append(userLi);
    })
    
    button.setAttribute('class', 'like');
    button.innerHTML = 'Like Book'
    button.onclick = (event) => updateBook(book);
    h1.innerText = book.title;
    img.src = book.img_url;
    p.innerText = book.description;

    bookShow.append(h1, img, p, likes, button)
  }

  function updateBook(book) {
    
    const include = book.users.find(user => user.id == 1)
    if(!include) {
      const usersArray = book.users;
      usersArray.push({id: 1, username: "pouros"});
      fetch(`http://localhost:3000/books/${book.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json", 
          Accept: "application/json"
        },
        body: JSON.stringify({
          users: usersArray
        })
      })
      .then(resp => resp.json())
      .then(book => {
        displayBook(book)
      })
    }
  }

 

}

main()