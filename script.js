/* eslint-disable max-classes-per-file */
class Ls {
  constructor(booksKey) {
    this.booksKey = booksKey;
  }

  addToLS = (bookObj) => {
    localStorage.setItem(this.booksKey, JSON.stringify(bookObj));
  };

  getFromLS = (key) => {
    const lsData = localStorage.getItem(key);
    if (lsData) {
      const data = JSON.parse(lsData);
      return data;
    }

    return [];
  };

  removeFromLS = (bookId) => {
    const bookdata = this.getFromLS(this.booksKey);
    bookdata.filter((el, i) => {
      if (el.id === Number(bookId)) {
        bookdata.splice(i, 1);
        this.addToLS(bookdata);
      }
      return true;
    });
  };
}

class BooksList extends Ls {
  books = [];

  constructor(
    form,
    inputAuthor,
    inputTitle,
    bookListContainer,
    booksKey = 'books',
  ) {
    super(booksKey);
    this.form = form;
    this.inputAuthor = inputAuthor;
    this.inputTitle = inputTitle;
    this.bookListContainer = bookListContainer;
    this.booksKey = booksKey;
  }

  removeBook = (id, btnHTML) => {
    btnHTML.target.parentNode.remove();
    this.removeFromLS(id);
  };

  renderHTML = (obj) => `
            <div class = "bookcontainer">
                <div class='book-title'>${obj.title}</div>
                <p>by</p>
                <div class='book-author'>${obj.author}</div>
                <button class='remove-book' data-id="${obj.id}">Remove</button>
            </div>
            `;

  findRemoveButtons = () => {
    const removeBookBtn = document.querySelectorAll('.remove-book');

    removeBookBtn.forEach((btn) => {
      btn.addEventListener('click', (event) => {
        const btnId = event.target.getAttribute('data-id');

        this.removeBook(btnId, event);
      });
    });
  };

  addBookToHTML = (obj) => {
    this.bookListContainer.insertAdjacentHTML(
      'afterbegin',
      this.renderHTML(obj),
    );
    this.findRemoveButtons();
  };

  addToBookList = (idBook, authorInput, titleInput) => {
    const bookObj = {
      id: idBook,
      title: titleInput,
      author: authorInput,
    };

    this.books[this.booksKey] = this.getFromLS(this.booksKey);
    this.books[this.booksKey].push(bookObj);
    this.addBookToHTML(bookObj);
    this.addToLS(this.books[this.booksKey]);
  };

  getUniqueId = () => {
    const data = this.getFromLS(this.booksKey);
    let max = 0;

    data.forEach((_, i) => {
      if (data[i].id > max) {
        max = data[i].id;
      }
    });
    max += 1;
    return max;
  };

  init() {
    const data = this.getFromLS(this.booksKey);
    if (data.length > 0) {
      data.forEach((book) => {
        this.addBookToHTML(book);
      });
    }

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const bookId = this.getUniqueId();

      const authorText = this.inputAuthor.value;
      const titleText = this.inputTitle.value;

      this.addToBookList(bookId, authorText, titleText);
      this.form.reset();
    });
  }
}

const form = document.getElementById('add-book');
const inputAuthor = document.getElementById('author');
const inputTitle = document.getElementById('title');
const bookList = document.getElementById('book-list');

new BooksList(form, inputAuthor, inputTitle, bookList).init();
// spa
const navContainer = document.querySelectorAll('.nav-container li');
const navContainerArray = Array.from(navContainer);
const sections = document.querySelectorAll('section');
const sectionsArray = Array.from(sections);

navContainerArray.forEach((ele) => {
  ele.addEventListener('click', (e) => {
    sectionsArray.forEach((section) => {
      section.classList.remove('active');
    });
    const showElementById = document.querySelector(
      e.target.getAttribute('href'),
    );
    showElementById.classList.add('active');
  });
});

const dateTag = document.querySelector('.date');
const date = new Date().toUTCString();

dateTag.innerHTML = date;
