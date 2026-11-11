
document.addEventListener("DOMContentLoaded", function () {

  // ==========================================
  // ELEMENTS
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

  const learningContent = document.getElementById("learningContent");
  const reflectionContent = document.getElementById("reflectionContent");

  const soundButton = document.getElementById("soundButton");
  const soundLabel = document.getElementById("soundLabel");
  const backgroundMusic = document.getElementById("backgroundMusic");

  // ==========================================
  // BOOK DATA FROM CONTENT.JS
  // ==========================================

  const defaultBooks = [
    { title: "The Ancient of Days (Job 38)", author: "ANCIENT LITERATURE" },
    { title: "The Panchatantra", author: "INDIAN LITERATURE" },
    { title: "The Ramayana", author: "INDIAN EPIC" },
    { title: "The Mahabharata", author: "INDIAN EPIC" },
    { title: "The Iliad", author: "HOMERIC EPIC" },
    { title: "The Odyssey", author: "HOMERIC EPIC" },
    { title: "The Song of Roland", author: "MEDIEVAL EPIC" }
  ];

  const books = Array.isArray(window.BOOKS) && window.BOOKS.length
    ? window.BOOKS.map(function (book, index) {
        return {
          ...book,
          title: book.title || defaultBooks[index]?.title || "Literary Work",
          author: book.author || defaultBooks[index]?.author || "GREAT BOOKS",
          content: book.content || []
        };
      })
    : defaultBooks.map(function (book) {
        return { ...book, content: [] };
      });

  let currentBookIndex = 0;

  // ==========================================
  // DISPLAY LEARNING AND REFLECTION
  // ==========================================

  function renderLongText(element, content) {

    if (!element) return;

    element.innerHTML = "";

    if (typeof content !== "string" || !content.trim()) {
      const message = document.createElement("p");
      message.textContent = "Content is not available yet.";
      element.appendChild(message);
      return;
    }

    const paragraphs = content
      .trim()
      .split(/\n\s*\n/)
      .map(function (paragraph) {
        return paragraph.trim();
      })
      .filter(Boolean);

    paragraphs.forEach(function (paragraph) {

      const p = document.createElement("p");
      p.textContent = paragraph;

      element.appendChild(p);

    });

  }

  function displayLearningAndReflection() {

    renderLongText(learningContent, window.LEARNING);
    renderLongText(reflectionContent, window.REFLECTION);

  }

  // ==========================================
  // CREATE BOOKSHELF
  // ==========================================

  function createBookshelf() {

    if (!bookshelf) return;

    bookshelf.innerHTML = "";

    books.forEach(function (book, index) {

      const card = document.createElement("button");
      card.type = "button";
      card.className = "book-card";
      card.setAttribute("aria-label", "Open " + book.title);

      const number = document.createElement("span");
      number.className = "book-number";
      number.textContent = "VOLUME " + String(index + 1).padStart(2, "0");

      const title = document.createElement("span");
      title.className = "book-title";
      title.textContent = book.title;

      const author = document.createElement("span");
      author.className = "book-author";
      author.textContent = book.author;

      const openLabel = document.createElement("span");
      openLabel.className = "book-open-label";
      openLabel.textContent = "OPEN BOOK";

      card.append(number, title, author, openLabel);

      card.addEventListener("click", function () {
        openBook(index);
      });

      bookshelf.appendChild(card);

    });

  }

  // ==========================================
  // DISPLAY BOOK IMAGE AND CONTENT
  // ==========================================

  function displayContent(book) {

    readerContent.innerHTML = "";

    if (book.image) {

      const image = document.createElement("img");
      image.src = book.image;
      image.alt = book.title;
      image.className = "reading-image";

      image.onerror = function () {
        image.remove();
      };

      readerContent.appendChild(image);

    }

    if (Array.isArray(book.content)) {

      book.content.forEach(function (item) {

        const paragraph = document.createElement("p");
        paragraph.textContent = item;
        readerContent.appendChild(paragraph);

      });

    } else if (typeof book.content === "string" && book.content.trim()) {

      const paragraph = document.createElement("p");
      paragraph.textContent = book.content;
      readerContent.appendChild(paragraph);

    } else {

      const message = document.createElement("p");
      message.textContent = "No reading content is available for this book yet.";
      readerContent.appendChild(message);

    }

  }

  // ==========================================
  // OPEN BOOK
  // ==========================================

  function openBook(index) {

    if (index < 0 || index >= books.length) return;

    currentBookIndex = index;

    const book = books[index];

    readerTitle.textContent = book.title;

    readerVolume.textContent =
      "VOLUME " + String(index + 1).padStart(2, "0");

    bookCounter.textContent =
      String(index + 1).padStart(2, "0") +
      " / " +
      String(books.length).padStart(2, "0");

    displayContent(book);

    previousBook.disabled = index === 0;
    nextBook.disabled = index === books.length - 1;

    previousBook.style.opacity = index === 0 ? "0.35" : "1";
    nextBook.style.opacity =
      index === books.length - 1 ? "0.35" : "1";

    reader.classList.remove("hidden");

    reader.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  }

  // ==========================================
  // BOOK NAVIGATION
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

    soundLabel.textContent = isPlaying ? "Pause music" : "Play music";

    soundButton.classList.toggle("playing", isPlaying);

    soundButton.setAttribute("aria-pressed", String(isPlaying));

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

  // ==========================================
  // INITIALIZE WEBSITE
  // ==========================================

  createBookshelf();
  displayLearningAndReflection();
  updateMusicButton(false);

});
