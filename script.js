
document.addEventListener("DOMContentLoaded", function () {

  // ==========================================
  // WEBSITE ELEMENTS
  // ==========================================

  const bookshelf = document.getElementById("bookshelf");
  const reader = document.getElementById("reader");

  const readerTitle = document.getElementById("readerTitle");
  const readerVolume = document.getElementById("readerVolume");
  const readerContent = document.getElementById("readerContent");
  const bookCounter = document.getElementById("bookCounter");

  const backToShelf = document.getElementById("backToShelf");
  const previousBook = document.getElementById("previousBook");
  const nextBook = document.getElementById("nextBook");

  const soundButton = document.getElementById("soundButton");
  const soundLabel = document.getElementById("soundLabel");
  const backgroundMusic = document.getElementById("backgroundMusic");

  // ==========================================
  // BOOK INFORMATION
  // ==========================================

  const defaultBooks = [
    {
      title: "The Ancient of Days",
      author: "ANCIENT LITERATURE"
    },
    {
      title: "The Panchatantra",
      author: "INDIAN LITERATURE"
    },
    {
      title: "The Ramayana",
      author: "INDIAN EPIC"
    },
    {
      title: "The Mahabharata",
      author: "INDIAN EPIC"
    },
    {
      title: "The Iliad",
      author: "HOMERIC EPIC"
    },
    {
      title: "The Odyssey",
      author: "HOMERIC EPIC"
    },
    {
      title: "The Song of Roland",
      author: "MEDIEVAL EPIC"
    }
  ];

  // ==========================================
  // READ CONTENT.JS
  // ==========================================

  function getAvailableBooks() {

    const possibleSources = [
      window.BOOKS,
      window.books,
      window.GREAT_BOOKS,
      window.bookData,
      window.literaryWorks,
      window.LITERARY_BOOKS
    ];

    for (const source of possibleSources) {

      if (Array.isArray(source) && source.length > 0) {

        const normalized = source.map(function (book, index) {

          if (typeof book === "string") {
            return {
              title: defaultBooks[index]?.title || "Literary Work",
              author: "GREAT BOOKS",
              content: book
            };
          }

          return {
            ...book,
            title:
              book.title ||
              book.name ||
              defaultBooks[index]?.title ||
              "Literary Work",

            author:
              book.author ||
              book.writer ||
              defaultBooks[index]?.author ||
              "GREAT BOOKS",

            content:
              book.content ||
              book.analysis ||
              book.description ||
              book.body ||
              book.text ||
              ""
          };

        });

        return normalized;
      }
    }

    return defaultBooks.map(function (book) {
      return {
        ...book,
        content: ""
      };
    });
  }

  const books = getAvailableBooks();

  let currentBookIndex = 0;

  // ==========================================
  // CREATE BOOKSHELF
  // ==========================================

  function createBookshelf() {

    bookshelf.innerHTML = "";

    books.forEach(function (book, index) {

      const card = document.createElement("button");

      card.type = "button";
      card.className = "book-card";

      card.setAttribute(
        "aria-label",
        "Open " + book.title
      );

      const number = document.createElement("span");
      number.className = "book-number";
      number.textContent =
        "VOLUME " + String(index + 1).padStart(2, "0");

      const title = document.createElement("span");
      title.className = "book-title";
      title.textContent = book.title;

      const author = document.createElement("span");
      author.className = "book-author";
      author.textContent = book.author;

      const openLabel = document.createElement("span");
      openLabel.className = "book-open-label";
      openLabel.textContent = "OPEN BOOK";

      card.appendChild(number);
      card.appendChild(title);
      card.appendChild(author);
      card.appendChild(openLabel);

      card.addEventListener("click", function () {
        openBook(index);
      });

      bookshelf.appendChild(card);

    });

  }

  // ==========================================
  // DISPLAY BOOK CONTENT
  // ==========================================

  function displayContent(content) {

    readerContent.innerHTML = "";

    if (!content) {

      const message = document.createElement("p");

      message.textContent =
        "The content for this literary work has not been connected yet. Please check the content.js file.";

      readerContent.appendChild(message);

      return;
    }

    // Preserve HTML formatting if the content contains it.
    if (typeof content === "string") {

      const template = document.createElement("template");
      template.innerHTML = content;

      readerContent.appendChild(template.content.cloneNode(true));

      return;
    }

    if (Array.isArray(content)) {

      content.forEach(function (item) {

        const paragraph = document.createElement("p");

        paragraph.textContent =
          typeof item === "string"
            ? item
            : item.text || item.content || "";

        readerContent.appendChild(paragraph);

      });

    }

  }

  // ==========================================
  // OPEN A BOOK
  // ==========================================

  function openBook(index) {

    if (index < 0 || index >= books.length) {
      return;
    }

    currentBookIndex = index;

    const book = books[index];

    readerTitle.textContent = book.title;

    readerVolume.textContent =
      "VOLUME " + String(index + 1).padStart(2, "0");

    bookCounter.textContent =
      String(index + 1).padStart(2, "0") +
      " / " +
      String(books.length).padStart(2, "0");

    displayContent(book.content);

    previousBook.disabled = index === 0;
    nextBook.disabled = index === books.length - 1;

    previousBook.style.opacity =
      index === 0 ? "0.35" : "1";

    nextBook.style.opacity =
      index === books.length - 1 ? "0.35" : "1";

    reader.classList.remove("hidden");

    reader.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  }

  // ==========================================
  // PREVIOUS AND NEXT
  // ==========================================

  previousBook.addEventListener("click", function () {

    if (currentBookIndex > 0) {
      openBook(currentBookIndex - 1);
    }

  });

  nextBook.addEventListener("click", function () {

    if (currentBookIndex < books.length - 1) {
      openBook(currentBookIndex + 1);
    }

  });

  // ==========================================
  // RETURN TO BOOKSHELF
  // ==========================================

  backToShelf.addEventListener("click", function () {

    reader.classList.add("hidden");

    document.getElementById("collection").scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  });

  // ==========================================
  // BACKGROUND MUSIC
  // ==========================================

  function updateMusicButton(isPlaying) {

    soundLabel.textContent =
      isPlaying ? "Pause music" : "Play music";

    soundButton.classList.toggle("playing", isPlaying);

    soundButton.setAttribute(
      "aria-pressed",
      String(isPlaying)
    );

  }

  soundButton.addEventListener("click", function () {

    if (backgroundMusic.paused) {

      backgroundMusic.play()
        .then(function () {
          updateMusicButton(true);
        })
        .catch(function () {
          updateMusicButton(false);
          soundLabel.textContent = "Try again";
        });

    } else {

      backgroundMusic.pause();
      updateMusicButton(false);

    }

  });

  backgroundMusic.addEventListener("play", function () {
    updateMusicButton(true);
  });

  backgroundMusic.addEventListener("pause", function () {
    updateMusicButton(false);
  });

  backgroundMusic.addEventListener("ended", function () {
    updateMusicButton(false);
  });

  // ==========================================
  // INITIALIZE WEBSITE
  // ==========================================

  createBookshelf();

  updateMusicButton(false);

});
