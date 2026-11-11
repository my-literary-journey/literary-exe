
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

  const learningContent = document.getElementById("learningContent");
  const reflectionContent = document.getElementById("reflectionContent");

  const soundButton = document.getElementById("soundButton");
  const soundLabel = document.getElementById("soundLabel");
  const backgroundMusic = document.getElementById("backgroundMusic");

  // ==========================================
  // BOOK DATA
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

  const books = Array.isArray(window.BOOKS)
    ? window.BOOKS.map(function (book, index) {
        return {
          ...book,
          title: book.title || defaultBooks[index]?.title || "Literary Work",
          author: book.author || defaultBooks[index]?.author || "GREAT BOOKS",
          image: book.image || "",
          content: book.content || []
        };
      })
    : [];

  let currentBookIndex = 0;

  // ==========================================
  // ELEMENT HELPER
  // ==========================================

  function makeElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;

    return element;
  }

  // ==========================================
  // CREATE BOOK COVER
  // ==========================================

  function createBookshelf() {
    if (!bookshelf) return;

    bookshelf.innerHTML = "";

    books.forEach(function (book, index) {

      const card = document.createElement("button");

      card.type = "button";
      card.className = "book-card";
      card.setAttribute("aria-label", "Open " + book.title);

      const coverWrap = makeElement("div", "book-cover-wrap");

      // Book image
      if (book.image) {
        const image = document.createElement("img");

        image.src = book.image;
        image.alt = book.title + " illustration";
        image.className = "book-cover-image";
        image.loading = "lazy";

        image.onerror = function () {
          image.remove();
          coverWrap.classList.add("cover-image-missing");
        };

        coverWrap.appendChild(image);
      } else {
        coverWrap.classList.add("cover-image-missing");
      }

      // Dark overlay and cover typography
      const overlay = makeElement("div", "cover-overlay");

      overlay.append(
        makeElement(
          "span",
          "cover-volume",
          "VOLUME " + String(index + 1).padStart(2, "0")
        ),
        makeElement("span", "cover-ornament", "❦"),
        makeElement("span", "cover-title", book.title),
        makeElement("span", "cover-author", book.author)
      );

      coverWrap.appendChild(overlay);

      const openLabel = makeElement(
        "span",
        "book-open-label",
        "✦ OPEN BOOK ✦"
      );

      card.append(coverWrap, openLabel);

      card.addEventListener("click", function () {
        openBook(index);
      });

      bookshelf.appendChild(card);
    });
  }

  // ==========================================
  // READER CONTENT
  // ==========================================

  function getBookParagraphs(book) {
    if (Array.isArray(book.content)) {
      return book.content.filter(function (item) {
        return typeof item === "string" && item.trim();
      });
    }

    if (typeof book.content === "string") {
      return book.content
        .split(/\n\s*\n/)
        .map(function (item) {
          return item.trim();
        })
        .filter(Boolean);
    }

    return [];
  }

  function displayContent(book, index) {
    readerContent.innerHTML = "";

    const paragraphs = getBookParagraphs(book);

    // Two-page book layout
    const spread = makeElement("div", "book-open-spread");

    const leftPage = makeElement(
      "article",
      "book-page book-page-left"
    );

    const rightPage = makeElement(
      "article",
      "book-page book-page-right"
    );

    const leftHeader = makeElement(
      "div",
      "page-running-title",
      book.title
    );

    const rightHeader = makeElement(
      "div",
      "page-running-title",
      "MY LITERARY JOURNEY"
    );

    leftPage.appendChild(leftHeader);
    rightPage.appendChild(rightHeader);

    // Image on the left page
    if (book.image) {
      const imageFrame = makeElement(
        "div",
        "reading-image-frame"
      );

      const image = document.createElement("img");

      image.src = book.image;
      image.alt = book.title;
      image.className = "reading-image";
      image.loading = "lazy";

      image.onerror = function () {
        imageFrame.remove();
      };

      imageFrame.appendChild(image);
      leftPage.appendChild(imageFrame);
    }

    // Divide reading paragraphs between pages
    const middle = Math.ceil(paragraphs.length / 2);

    paragraphs.forEach(function (paragraph, paragraphIndex) {

      const targetPage = paragraphIndex < middle
        ? leftPage
        : rightPage;

      const text = makeElement(
        "p",
        "reading-paragraph",
        paragraph
      );

      targetPage.appendChild(text);
    });

    leftPage.appendChild(
      makeElement(
        "span",
        "page-number",
        String(index * 2 + 1).padStart(2, "0")
      )
    );

    rightPage.appendChild(
      makeElement(
        "span",
        "page-number",
        String(index * 2 + 2).padStart(2, "0")
      )
    );

    spread.append(leftPage, rightPage);

    readerContent.appendChild(spread);

    if (paragraphs.length === 0 && !book.image) {
      readerContent.appendChild(
        makeElement("p", "", "No reading content is available.")
      );
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

    displayContent(book, index);

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
  // LEARNING SECTION
  // ==========================================

  function displayLearning() {
    if (!learningContent) return;

    learningContent.innerHTML = "";

    const text = window.LEARNING;

    if (typeof text !== "string" || !text.trim()) return;

    const paragraphs = text
      .trim()
      .split(/\n\s*\n/)
      .map(function (item) {
        return item.trim();
      })
      .filter(Boolean);

    paragraphs.forEach(function (item) {

      if (/^\d+\.\s/.test(item)) {
        learningContent.appendChild(
          makeElement("h3", "", item)
        );
      } else {
        learningContent.appendChild(
          makeElement("p", "", item)
        );
      }

    });
  }

  // ==========================================
  // REFLECTION MINI-BOOKS
  // ==========================================

  function prepareReflection() {
    if (!reflectionContent) return;

    reflectionContent.innerHTML = "";

    const text = window.REFLECTION;

    if (typeof text !== "string" || !text.trim()) return;

    const paragraphs = text
      .trim()
      .split(/\n\s*\n/)
      .map(function (item) {
        return item.trim();
      })
      .filter(Boolean);

    const sections = [];
    const introduction = [];

    let currentSection = null;

    paragraphs.forEach(function (paragraph) {

      if (/^\d+\.\s/.test(paragraph)) {

        currentSection = {
          title: paragraph,
          content: []
        };

        sections.push(currentSection);

      } else if (/^Overall Reflection$/i.test(paragraph)) {

        currentSection = {
          title: "Overall Reflection",
          content: []
        };

        sections.push(currentSection);

      } else if (currentSection) {

        currentSection.content.push(paragraph);

      } else {

        introduction.push(paragraph);

      }

    });

    introduction.forEach(function (paragraph) {
      reflectionContent.appendChild(
        makeElement("p", "reflection-intro", paragraph)
      );
    });

    const grid = makeElement(
      "div",
      "reflection-bookshelf-grid"
    );

    sections.forEach(function (section, index) {

      const card = document.createElement("button");

      card.type = "button";
      card.className = "reflection-mini-cover";
      card.setAttribute("aria-label", "Open " + section.title);

      card.append(
        makeElement(
          "span",
          "reflection-mini-number",
          "REFLECTION " + String(index + 1).padStart(2, "0")
        ),

        makeElement("span", "reflection-mini-ornament", "❦"),

        makeElement(
          "span",
          "reflection-mini-title",
          section.title
        ),

        makeElement(
          "span",
          "reflection-mini-label",
          "OPEN TO READ"
        )
      );

      card.addEventListener("click", function () {
        openReflection(section, card);
      });

      grid.appendChild(card);

    });

    reflectionContent.appendChild(grid);
  }

  // ==========================================
  // OPEN REFLECTION BOOK
  // ==========================================

  function openReflection(section, selectedCard) {

    const oldReader = reflectionContent.querySelector(
      ".reflection-reader"
    );

    if (oldReader) oldReader.remove();

    const panel = makeElement("article", "reflection-reader");

    const top = makeElement(
      "div",
      "reflection-reader-label",
      "MY LITERARY JOURNEY • PERSONAL REFLECTION"
    );

    const heading = makeElement(
      "h3",
      "reflection-reader-title",
      section.title
    );

    const paper = makeElement("div", "reflection-paper");

    section.content.forEach(function (paragraph) {
      paper.appendChild(
        makeElement("p", "reflection-paragraph", paragraph)
      );
    });

    const close = makeElement(
      "button",
      "reflection-close",
      "CLOSE BOOK"
    );

    close.type = "button";

    close.addEventListener("click", function () {
      panel.remove();

      if (selectedCard) {
        selectedCard.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }
    });

    panel.append(top, heading, paper, close);

    reflectionContent.appendChild(panel);

    panel.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }

  // ==========================================
  // BACKGROUND MUSIC
  // ==========================================

  function updateMusicButton(isPlaying) {

    if (!soundButton || !soundLabel) return;

    soundLabel.textContent = isPlaying
      ? "Pause Music"
      : "Play Music";

    soundButton.classList.toggle("playing", isPlaying);

    soundButton.setAttribute(
      "aria-pressed",
      String(isPlaying)
    );
  }

  if (soundButton && backgroundMusic && soundLabel) {

    soundButton.addEventListener("click", function () {

      if (backgroundMusic.paused) {

        backgroundMusic.play()
          .then(function () {
            updateMusicButton(true);
          })
          .catch(function () {
            updateMusicButton(false);
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

    updateMusicButton(false);
  }

  // ==========================================
  // INITIALIZE WEBSITE
  // ==========================================

  createBookshelf();
  displayLearning();
  prepareReflection();

});
