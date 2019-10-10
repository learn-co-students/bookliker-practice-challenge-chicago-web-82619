function main(){
    document.addEventListener("DOMContentLoaded", function() {
        fetchBooks();
    });
}

function fetchBooks(){
    fetch('http://localhost:3000/books')
    .then(res => res.json())
    .then(data => {
        renderBooks(data)
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
        bookDetails(event.target);
    });
    list.append(li);
}

function bookDetails(book){
    const show = document.getElementById("show-panel");
    console.log(book);
    if(!show.innerHTML && show.innerHTML != `<h2>${book.innerHTML}</h2>`){
        let h2 = document.createElement('h2');
        h2.innerHTML = book.innerHTML;
        show.append(h2);
    }
}

main()