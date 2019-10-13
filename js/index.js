function main() {
  document.addEventListener('DOMContentLoaded', () => {
    let allBooks = []
    const bookList = document.querySelector('#list')
    const showPanel = document.querySelector('#show-panel')
    const likesUl = document.createElement('ul')
    likesUl.id = 'likes'

    let allLikesTotal = []

    fetch('http://localhost:3000/books')
    .then(resp => resp.json())
    .then(bookData => {
      allBooks = bookData
      bookList.innerHTML = renderBookList(allBooks)
    })

    bookList.addEventListener('click', (event) => {
      // console.log(event.target.dataset.id)
      handleBook(event)
    })

    showPanel.addEventListener('click', (event) => {
      // console.log(event.target.id)
      if (event.target.id === 'like') {
        // console.log(event)
        handleLike(event)
      }
    })



// get likes for specific book
function getBookLikes(book) {
  console.log(book)
  fetch(`http://localhost:3000/books/${book.id}`)
    .then(resp => resp.json())
    .then(book => {
      // allLikesTotal = []
      allLikesTotal = book
      // console.log(allLikesTotal)
      likesUl.innerHTML = renderUserLikes(allLikesTotal);
      console.log(likesUl)
      showPanel.appendChild(likesUl)
      // console.log('likesUl rendered', likesUl)
    })
  }

// post the original likes for specific book

function renderUserLikes(book) {
  // console.log(book.users)
  return book.users.map(renderUser).join('')
  // console.log('likes test', likesTest)
}

function renderUser(user) {
  return (`<li data-id=${user.id}>${user.username}</li>`)
}


// Handle like
function handleLike(event) {
  console.log(event.target.parentNode.children[0].dataset.id)
  const bookId = event.target.parentNode.children[0].dataset.id
  fetch(`http://localhost:3000/books/${bookId}`)
    .then(resp => resp.json())
    .then(book => renderNewLikes(book))
}

  // renderNewLikes

function renderNewLikes(book) {
  // assemble new data
  // console.log(book.users)
  const newUsers = assembleNewUserData(book.users)

  console.log(newUsers)

  // make fetch call
  //
  // console.log(book.id)
  reqObj = {
    method: 'PATCH',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify( {
      users: newUsers
    })
  }

  fetch(`http://localhost:3000/books/${book.id}`, reqObj)
    .then(resp => resp.json())
    .then(bookData => {
      // allLikesTotal = []
      allLikesTotal = bookData
      // console.log(allLikesTotal)
      likesUl.innerHTML = ""
      likesUl.innerHTML = renderUserLikes(allLikesTotal);
      console.log(likesUl)
      showPanel.appendChild(likesUl)
    })


  // renderUserLikes(users)
}
//
function assembleNewUserData(users) {
  console.log(users)
  const newUser = {"id":1, "username":"pouros"}
  // console.log(newUser)
  const newUsers = users.concat(newUser)
  console.log(newUsers)
  // console.log(newUsers)
  return newUsers
}


// Show Book

function handleBook(event) {
  fetch(`http://localhost:3000/books/${event.target.dataset.id}`)
    .then(resp => resp.json())
    .then(book => {
      // console.log(book)
      renderBook(book)
    })
}

function renderBook(book) {
  const showPanel = document.getElementById('show-panel')
  showPanel.innerHTML = ""

  const bookHead = document.createElement('h2')
  bookHead.dataset.id = `${book.id}`
  bookHead.innerHTML = `${book.title}`

  const bookImg = document.createElement('img')
  bookImg.src = book.img_url

  const bookDescrip = document.createElement('p')
  bookDescrip.innerHTML = `Description: ${book.description}`

  const likesBtn = document.createElement('button')
  likesBtn.textContent = 'like the book'
  likesBtn.id = 'like'
    // console.log(userLikes)
    // console.log(bookImg)
  showPanel.appendChild(bookHead)
  showPanel.appendChild(bookImg)
  showPanel.appendChild(bookDescrip)
  //

  showPanel.appendChild(likesBtn)
  // console.log(showPanel)
  getBookLikes(book)

}

// Render All Books on Side

function renderBookList(bookData) {
  return bookData.map(renderBookOnList).join('')
}

function renderBookOnList(bookObj) {
  return (`<li data-id="${bookObj.id}">
      ${bookObj.title}
    </li>`
  )
}
})
}


main()
