
document.addEventListener("DOMContentLoaded", function () {

  // ==========================================
  // 1. WEBSITE ELEMENTS
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
  // 2. BOOK INFORMATION
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
          image: book.image || "",
          content: book.content || []
        };
      })
    : defaultBooks.map(function (book) {
        return { ...book, image: "", content: [] };
      });

  let currentBookIndex = 0;

  // ==========================================
  // 3. GENERAL HELPERS
  // ==========================================

  function createElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) {
      element.className = className;
    }

    if (text !== undefined) {
      element.textContent = text;
    }

    return element;
  }

  function getParagraphs(content) {
    if (Array.isArray(content)) {
      return content
        .map(function (item) {
          return String(item).trim();
        })
        .filter(Boolean);
    }

    if (typeof content === "string") {
      return content
        .trim()
        .split(/\n\s*\n/)
        .map(function (item) {
          return item.trim();
        })
        .filter(Boolean);
    }

    return [];
  }

  function renderLongText(element, content) {
    if (!element) return;

    element.innerHTML = "";

    const paragraphs = getParagraphs(content);

    paragraphs.forEach(function (paragraph) {
      element.appendChild(
        createElement("p", "", paragraph)
      );
    });
  }

  // ==========================================
  // 4. CREATE REAL BOOK COVERS
  // ==========================================

  function createBookshelf() {
    if (!bookshelf) return;

    bookshelf.innerHTML = "";

    books.forEach(function (book, index) {

      const card = createElement("button", "book-card");
      card.type = "button";
      card.setAttribute("aria-label", "Open " + book.title);

      // Book cover
      const cover = createElement("span", "book-cover-wrap");

      const coverImage = createElement("img", "book-cover-image");
      coverImage.alt = book.title + " book cover";
      coverImage.loading = "lazy";

      if (book.image) {
        coverImage.src = book.image;

        coverImage.onerror = function () {
          coverImage.style.display = "none";
          cover.classList.add("cover-image-missing");
        };
      } else {
        cover.classList.add("cover-image-missing");
      }

      // Decorative cover details
      const coverOverlay = createElement("span", "cover-overlay");

      const coverVolume = createElement(
        "span",
        "cover-volume",
        "VOLUME " + String(index + 1).padStart(2, "0")
      );

      const coverTitle = createElement(
        "span",
        "cover-title",
        book.title
      );

      const coverAuthor = createElement(
        "span",
        "cover-author",
        book.author
      );

      const coverOrnament = createElement(
        "span",
        "cover-ornament",
        "❦"
      );

      coverOverlay.append(
        coverVolume,
        coverOrnament,
        coverTitle,
        coverAuthor
      );

      cover.append(coverImage, coverOverlay);

      // Label below the cover
      const openLabel = createElement(
        "span",
        "book-open-label",
        "OPEN BOOK  →"
      );

      card.append(cover, openLabel);

      card.addEventListener("click", function () {
        openBook(index);
      });

      bookshelf.appendChild(card);
    });
  }

  // ==========================================
  // 5. CREATE THE OPEN BOOK PAGES
  // ==========================================

  function displayContent(book) {
    if (!readerContent) return;

    readerContent.innerHTML = "";

    const spread = createElement("div", "book-open-spread");

    const leftPage = createElement("article", "book-page book-page-left");
    const rightPage = createElement("article", "book-page book-page-right");

    // Book image
    if (book.image) {
      const imageFrame = createElement("div", "reading-image-frame");
      const image = createElement("img", "reading-image");

      image.src = book.image;
      image.alt = book.title;
      image.loading = "lazy";

      image.onerror = function () {
        imageFrame.remove();
      };

      imageFrame.appendChild(image);
      leftPage.appendChild(imageFrame);
    }

    const leftHeading = createElement(
      "p",
      "page-running-title",
      book.title
    );

    const rightHeading = createElement(
      "p",
      "page-running-title",
      "MY LITERARY JOURNEY"
    );

    leftPage.appendChild(leftHeading);
    rightPage.appendChild(rightHeading);

    // Preserve every paragraph in the original content
    const paragraphs = getParagraphs(book.content);

    if (paragraphs.length === 0) {
      leftPage.appendChild(
        createElement(
          "p",
          "",
          "No reading content is available for this book yet."
        )
      );
    } else {

      const midpoint = Math.ceil(paragraphs.length / 2);

      const leftParagraphs = paragraphs.slice(0, midpoint);
      const rightParagraphs = paragraphs.slice(midpoint);

      leftParagraphs.forEach(function (paragraph) {
        leftPage.appendChild(
          createElement("p", "reading-paragraph", paragraph)
        );
      });

      rightParagraphs.forEach(function (paragraph) {
        rightPage.appendChild(
          createElement("p", "reading-paragraph", paragraph)
        );
      });
    }

    leftPage.appendChild(
      createElement("span", "page-number", "✦")
    );

    rightPage.appendChild(
      createElement("span", "page-number", "✦")
    );

    spread.append(leftPage, rightPage);
    readerContent.appendChild(spread);
  }

  // ==========================================
  // 6. OPEN A BOOK
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

    reader.classList.remove("hidden");

    reader.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  // ==========================================
  // 7. BOOK NAVIGATION
  // ==========================================

  if (previousBook) {
    previousBook.addEventListener("click", function () {
      if (currentBookIndex > 0) {
        openBook(currentBookIndex - 1);
      }
    });
  }

  if (nextBook) {
    nextBook.addEventListener("click", function () {
      if (currentBookIndex < books.length - 1) {
        openBook(currentBookIndex + 1);
      }
    });
  }

  if (backToShelf) {
    backToShelf.addEventListener("click", function () {
      reader.classList.add("hidden");

      document.getElementById("collection").scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  }

  // ==========================================
  // 8. LEARNING SECTION
  // ==========================================

  function displayLearning() {
    renderLongText(learningContent, window.LEARNING);
  }

  // ==========================================
  // 9. REFLECTION MINI-BOOKS
  // ==========================================

  function prepareReflectionSections() {

    const paragraphs = getParagraphs(window.REFLECTION);

    const sections = [];
    let currentSection = null;
    const introduction = [];

    paragraphs.forEach(function (paragraph) {

      const isNumberedHeading =
        /^(?:\d+[\.\)]\s*|question\s+\d+)/i.test(paragraph);

      const isOverallHeading =
        /^overall reflection\s*$/i.test(paragraph);

      if (isNumberedHeading || isOverallHeading) {

        if (currentSection) {
          sections.push(currentSection);
        }

        currentSection = {
          title: isOverallHeading
            ? "Overall Reflection"
            : paragraph.replace(/^\d+[\.\)]\s*/, "").trim(),
          content: []
        };

      } else if (currentSection) {

        currentSection.content.push(paragraph);

      } else {

        introduction.push(paragraph);

      }
    });

    if (currentSection) {
      sections.push(currentSection);
    }

    // Fallback: retain all text even if the format differs
    if (sections.length === 0 && paragraphs.length) {
      paragraphs.forEach(function (paragraph, index) {
        sections.push({
          title: "Reflection " + (index + 1),
          content: [paragraph]
        });
      });
    }

    return {
      introduction: introduction,
      sections: sections
    };
  }

  function openReflection(section, index) {

    const oldReader = reflectionContent.querySelector(
      ".reflection-reader"
    );

    if (oldReader) oldReader.remove();

    const panel = createElement("div", "reflection-reader");

    const panelTop = createElement("div", "reflection-reader-top");

    const panelLabel = createElement(
      "span",
      "reflection-reader-label",
      "PERSONAL REFLECTION · " + String(index + 1).padStart(2, "0")
    );

    const closeButton = createElement(
      "button",
      "reflection-close",
      "CLOSE ×"
    );

    closeButton.type = "button";

    closeButton.addEventListener("click", function () {
      panel.remove();
    });

    panelTop.append(panelLabel, closeButton);

    const title = createElement(
      "h3",
      "reflection-reader-title",
      section.title
    );

    const paper = createElement("div", "reflection-paper");

    section.content.forEach(function (paragraph) {
      paper.appendChild(
        createElement("p", "reflection-paragraph", paragraph)
      );
    });

    panel.append(panelTop, title, paper);
    reflectionContent.appendChild(panel);

    panel.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }

  function createReflectionBooks() {

    if (!reflectionContent) return;

    reflectionContent.innerHTML = "";

    const data = prepareReflectionSections();

    // Introductory reflection
    if (data.introduction.length) {
      const intro = createElement("div", "reflection-intro");

      data.introduction.forEach(function (paragraph) {
        intro.appendChild(createElement("p", "", paragraph));
      });

      reflectionContent.appendChild(intro);
    }

    const grid = createElement(
      "div",
      "reflection-bookshelf-grid"
    );

    data.sections.forEach(function (section, index) {

      const card = createElement(
        "button",
        "reflection-book-card"
      );

      card.type = "button";

      const cover = createElement(
        "span",
        "reflection-mini-cover"
      );

      const number = createElement(
        "span",
        "reflection-mini-number",
        "NOTEBOOK " + String(index + 1).padStart(2, "0")
      );

      const ornament = createElement(
        "span",
        "reflection-mini-ornament",
        "❦"
      );

      const title = createElement(
        "span",
        "reflection-mini-title",
        section.title
      );

      const label = createElement(
        "span",
        "reflection-mini-label",
        "OPEN TO READ"
      );

      cover.append(number, ornament, title, label);
      card.appendChild(cover);

      card.addEventListener("click", function () {
        openReflection(section, index);
      });

      grid.appendChild(card);
    });

    reflectionContent.appendChild(grid);
  }

  // ==========================================
  // 10. BACKGROUND MUSIC
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

  if (soundButton && backgroundMusic) {

    soundButton.addEventListener("click", function () {

      if (backgroundMusic.paused) {

        backgroundMusic.play()
          .then(function () {
            updateMusicButton(true);
          })
          .catch(function () {
            updateMusicButton(false);
            soundLabel.textContent = "Try Again";
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
  }

  // ==========================================
  // 11. INITIALIZE
  // ==========================================

  createBookshelf();
  displayLearning();
  createReflectionBooks();
  updateMusicButton(false);

});
