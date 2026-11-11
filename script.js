
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
  // HELPER
  // ==========================================

  function makeElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;

    return element;
  }

  // ==========================================
  // CREATE REAL BOOK COVERS
  // ==========================================

  function createBookshelf() {
    if (!bookshelf) return;

    bookshelf.innerHTML = "";

    books.forEach(function (book, index) {
      const card = document.createElement("button");

      card.type = "button";
      card.className = "book-card";
      card.setAttribute("aria-label", "Open " + book.title);

      // Actual book cover frame
      const coverWrap = makeElement("div", "book-cover-wrap");

      if (book.image) {
        const image = document.createElement("img");

        image.src = book.image;
        image.alt = book.title + " book cover";
        image.className = "book-cover-image";
        image.loading = "lazy";

        image.onerror = function () {
          image.remove();

          const fallback = makeElement(
            "div",
            "cover-image-fallback",
            book.title
          );

          fallback.style.cssText =
            "height:100%;display:flex;align-items:center;" +
            "justify-content:center;text-align:center;padding:18px;" +
            "color:#390817;font-family:serif;font-size:1.2rem;";

          coverWrap.appendChild(fallback);
        };

        coverWrap.appendChild(image);
      }

      // Book information
      const volume = makeElement(
        "span",
        "book-volume",
        "VOLUME " + String(index + 1).padStart(2, "0")
      );

      const title = makeElement("span", "book-title", book.title);

      const author = makeElement("span", "book-author", book.author);

      const openLabel = makeElement(
        "span",
        "book-open-label",
        "✦ OPEN BOOK ✦"
      );

      card.append(
        coverWrap,
        volume,
        title,
        author,
        openLabel
      );

      card.addEventListener("click", function () {
        openBook(index);
      });

      bookshelf.appendChild(card);
    });
  }

  // ==========================================
  // OPEN BOOK CONTENT
  // ==========================================

  function displayContent(book) {
    readerContent.innerHTML = "";

    if (book.image) {
      const image = document.createElement("img");

      image.src = book.image;
      image.alt = book.title;
      image.className = "reading-image";

      image.onerror = function () {
        image.style.display = "none";
      };

      readerContent.appendChild(image);
    }

    if (Array.isArray(book.content)) {
      book.content.forEach(function (item) {
        const paragraph = makeElement(
          "p",
          "reading-paragraph",
          item
        );

        readerContent.appendChild(paragraph);
      });
    } else if (
      typeof book.content === "string" &&
      book.content.trim()
    ) {
      book.content.split(/\n\s*\n/).forEach(function (item) {
        if (!item.trim()) return;

        readerContent.appendChild(
          makeElement("p", "reading-paragraph", item.trim())
        );
      });
    } else {
      readerContent.appendChild(
        makeElement("p", "", "No reading content is available.")
      );
    }
  }

  // ==========================================
  // OPEN BOOK FUNCTION
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
      .map(item => item.trim())
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
  // REFLECTION BOOKS
  // ==========================================

  function prepareReflection() {
    if (!reflectionContent) return;

    reflectionContent.innerHTML = "";

    const text = window.REFLECTION;

    if (typeof text !== "string" || !text.trim()) return;

    const paragraphs = text
      .trim()
      .split(/\n\s*\n/)
      .map(item => item.trim())
      .filter(Boolean);

    const sections = [];
    let introduction = [];
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

    // Introductory text
    introduction.forEach(function (paragraph) {
      reflectionContent.appendChild(
        makeElement("p", "reflection-intro", paragraph)
      );
    });

    // Reflection book cards
    const grid = makeElement("div", "reflection-book-grid");

    sections.forEach(function (section, index) {
      const card = document.createElement("button");

      card.type = "button";
      card.className = "reflection-book-card";

      const cover = makeElement("div", "mini-book-cover");

      cover.append(
        makeElement(
          "span",
          "mini-book-number",
          "REFLECTION " + String(index + 1).padStart(2, "0")
        ),
        makeElement("span", "mini-book-ornament", "❦"),
        makeElement("span", "mini-book-title", section.title),
        makeElement("span", "mini-book-open", "OPEN TO READ")
      );

      card.appendChild(cover);

      card.addEventListener("click", function () {
        openReflection(section);
      });

      grid.appendChild(card);
    });

    reflectionContent.appendChild(grid);
  }

  // ==========================================
  // OPEN REFLECTION
  // ==========================================

  function openReflection(section) {
    const oldReader = reflectionContent.querySelector(
      ".reflection-reader"
    );

    if (oldReader) oldReader.remove();

    const panel = makeElement("div", "reflection-reader");

    const top = makeElement("div", "reflection-reader-top");

    top.append(
      makeElement("span", "", "MY LITERARY JOURNEY"),
      makeElement("span", "", "A PERSONAL REFLECTION")
    );

    const heading = makeElement("h3", "", section.title);

    const content = makeElement(
      "div",
      "reflection-reader-content"
    );

    section.content.forEach(function (paragraph) {
      content.appendChild(
        makeElement("p", "", paragraph)
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
    });

    panel.append(top, heading, content, close);

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
    soundLabel.textContent = isPlaying
      ? "Pause music"
      : "Play music";

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
          soundLabel.textContent = "Try again";
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

  // ==========================================
  // INITIALIZE
  // ==========================================

  createBookshelf();
  displayLearning();
  prepareReflection();
  updateMusicButton(false);
});
