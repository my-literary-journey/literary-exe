
document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const bookshelf = $("#bookshelf") || $("#bookshelfGrid");
  const reader = $("#readingView") || $("#readerScreen") || $("#reader");
  const readerTitle = $("#readerTitle") || $("#readingTitle");
  const readerContent = $("#readerContent") || $("#readingContent");
  const readerVolume = $("#readerVolume") || $("#readingNumber");
  const bookCounter = $("#bookCounter") || $("#readingCount");

  const backButton = $("#backToShelf");
  const previousButton = $("#previousBook") || $("#prevBook");
  const nextButton = $("#nextBook");

  const learningContent = $("#learningContent");
  const reflectionContent = $("#reflectionContent");

  const books = Array.isArray(window.BOOKS) ? window.BOOKS : [];

  let currentBookIndex = 0;
  let currentPageIndex = 0;
  let currentPages = [];

  const fallbackAuthors = [
    "Book of Job",
    "Vishnu Sharma",
    "Valmiki",
    "Vyasa",
    "Homer",
    "Homer",
    "Anonymous"
  ];

  function makeElement(tag, className, content) {
    const element = document.createElement(tag);

    if (className) element.className = className;
    if (content !== undefined) element.textContent = content;

    return element;
  }

  function getParagraphs(value) {
    if (Array.isArray(value)) {
      return value
        .map(item => {
          if (typeof item === "string") return item;
          return item?.text || item?.content || "";
        })
        .filter(Boolean);
    }

    if (typeof value !== "string") return [];

    return value
      .replace(/<\/(p|div|h[1-6]|li)>/gi, "\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .split(/\n+/)
      .map(item => item.trim())
      .filter(Boolean);
  }

  // ==========================================
  // OPENING SCREEN
  // ==========================================

  function createOpeningScreen() {
    if ($("#openingScreen")) return;

    const opening = makeElement("section", "opening-screen");
    opening.id = "openingScreen";

    opening.innerHTML = `
      <div class="opening-decoration opening-decoration-one">✧</div>
      <div class="opening-decoration opening-decoration-two">❧</div>

      <div class="opening-frame">
        <div class="opening-small">A GREAT BOOKS DIGITAL PORTFOLIO</div>
        <div class="opening-ornament">✦</div>

        <div class="opening-book">
          <div class="opening-book-border">
            <span class="opening-book-label">MY PERSONAL COLLECTION</span>

            <div class="opening-book-title">
              MY LITERARY
              <em>JOURNEY</em>
            </div>

            <div class="opening-book-flourish">❦</div>
            <span class="opening-book-author">IMAE METAS</span>
          </div>
        </div>

        <p class="opening-description">
          A collection of stories, reflections, and lessons
          gathered through the pages of literature.
        </p>

        <button type="button" id="enterLibrary" class="opening-button">
          OPEN MY JOURNEY <span>→</span>
        </button>

        <div class="opening-footer">
          UNIVERSITY OF NUEVA CACERES · GREAT BOOKS
        </div>
      </div>
    `;

    document.body.prepend(opening);
    document.body.classList.add("website-locked");

    $("#enterLibrary", opening).addEventListener("click", function () {
      opening.classList.add("opening-exit");
      document.body.classList.remove("website-locked");

      window.setTimeout(function () {
        opening.remove();

        const library = $("#collection");

        if (library) {
          library.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      }, 650);
    });
  }

  // ==========================================
  // BOOKSHELF — ORIGINAL UPLOADED IMAGES
  // ==========================================

  function createBookshelf() {
    if (!bookshelf) {
      console.error("Bookshelf element was not found.");
      return;
    }

    bookshelf.innerHTML = "";

    books.forEach(function (book, index) {
      const card = makeElement("button", "book-card");
      card.type = "button";
      card.setAttribute("aria-label", "Open " + book.title);

      const cover = makeElement("div", "book-cover-wrap");

      if (book.image) {
        const image = document.createElement("img");

        image.className = "book-cover-image";
        image.src = book.image;
        image.alt = book.title + " original literary artwork";
        image.loading = "lazy";

        image.onerror = function () {
          image.style.display = "none";

          const fallback = makeElement(
            "div",
            "cover-image-missing",
            book.title
          );

          cover.appendChild(fallback);
        };

        cover.appendChild(image);
      } else {
        cover.appendChild(
          makeElement("div", "cover-image-missing", book.title)
        );
      }

      const information = makeElement("div", "book-information");

      information.append(
        makeElement("span", "cover-title", book.title),
        makeElement(
          "span",
          "cover-author",
          book.author || fallbackAuthors[index] || "Great Books"
        ),
        makeElement("span", "book-open-label", "OPEN BOOK →")
      );

      card.append(cover, information);

      card.addEventListener("click", function () {
        openBook(index);
      });

      bookshelf.appendChild(card);
    });
  }

  // ==========================================
  // REAL BOOK PAGES
  // ==========================================

  function divideIntoPages(paragraphs, paragraphsPerPage) {
    const pages = [];

    for (let i = 0; i < paragraphs.length; i += paragraphsPerPage) {
      pages.push(paragraphs.slice(i, i + paragraphsPerPage));
    }

    return pages.length ? pages : [["No written content is available."]];
  }

  function createReadingPage(paragraphs, pageNumber, title) {
    const page = makeElement("article", "book-page");

    page.appendChild(
      makeElement("div", "page-running-title", title)
    );

    const body = makeElement("div", "page-text");

    paragraphs.forEach(function (paragraph) {
      body.appendChild(
        makeElement("p", "reading-paragraph", paragraph)
      );
    });

    page.appendChild(body);

    page.appendChild(
      makeElement("span", "page-number", String(pageNumber))
    );

    return page;
  }

  function renderCurrentSpread() {
    if (!readerContent) return;

    readerContent.innerHTML = "";

    const spread = makeElement("div", "book-open-spread");

    const leftParagraphs = currentPages[currentPageIndex] || [];
    const rightParagraphs = currentPages[currentPageIndex + 1] || [];

    spread.append(
      createReadingPage(
        leftParagraphs,
        currentPageIndex + 1,
        books[currentBookIndex].title
      ),
      createReadingPage(
        rightParagraphs,
        currentPageIndex + 2,
        books[currentBookIndex].title
      )
    );

    readerContent.appendChild(spread);

    const pageControls = makeElement("div", "page-controls");

    const previousPage = makeElement(
      "button",
      "button button-outline",
      "← Previous Pages"
    );

    previousPage.type = "button";
    previousPage.disabled = currentPageIndex === 0;

    previousPage.addEventListener("click", function () {
      if (currentPageIndex >= 2) {
        currentPageIndex -= 2;
        renderCurrentSpread();
      }
    });

    const pageLabel = makeElement(
      "span",
      "page-count",
      "Pages " +
        (currentPageIndex + 1) +
        "–" +
        Math.min(currentPageIndex + 2, currentPages.length) +
        " of " +
        currentPages.length
    );

    const nextPage = makeElement(
      "button",
      "button button-outline",
      "Next Pages →"
    );

    nextPage.type = "button";
    nextPage.disabled = currentPageIndex + 2 >= currentPages.length;

    nextPage.addEventListener("click", function () {
      if (currentPageIndex + 2 < currentPages.length) {
        currentPageIndex += 2;
        renderCurrentSpread();
      }
    });

    pageControls.append(previousPage, pageLabel, nextPage);
    readerContent.appendChild(pageControls);
  }

  function openBook(index) {
    const book = books[index];

    if (!book || !reader) return;

    currentBookIndex = index;
    currentPageIndex = 0;

    const paragraphs = getParagraphs(book.content);
    currentPages = divideIntoPages(paragraphs, 2);

    if (readerTitle) readerTitle.textContent = book.title;

    if (readerVolume) {
      readerVolume.textContent =
        "VOLUME " + String(index + 1).padStart(2, "0");
    }

    if (bookCounter) {
      bookCounter.textContent =
        String(index + 1).padStart(2, "0") +
        " / " +
        String(books.length).padStart(2, "0");
    }

    if (previousButton) previousButton.disabled = index === 0;
    if (nextButton) nextButton.disabled = index === books.length - 1;

    renderCurrentSpread();

    reader.classList.remove("hidden");

    reader.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  function closeReader() {
    if (reader) reader.classList.add("hidden");

    if (bookshelf) {
      bookshelf.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  }

  backButton?.addEventListener("click", closeReader);

  previousButton?.addEventListener("click", function () {
    if (currentBookIndex > 0) {
      openBook(currentBookIndex - 1);
    }
  });

  nextButton?.addEventListener("click", function () {
    if (currentBookIndex < books.length - 1) {
      openBook(currentBookIndex + 1);
    }
  });

  // ==========================================
  // LEARNING JOURNAL — CLICK TO OPEN
  // ==========================================

  function displayLearning() {
    if (!learningContent) return;

    const cover = makeElement("button", "learning-journal-cover");
    cover.type = "button";

    cover.innerHTML = `
      <span class="journal-symbol">❧</span>
      <small>PERSONAL LEARNING JOURNAL</small>
      <strong>LESSONS<br>BETWEEN THE LINES</strong>
      <span>CLICK TO OPEN</span>
    `;

    const paper = makeElement("div", "learning-paper hidden");
    const entries = makeElement("div", "learning-entries");

    getParagraphs(window.LEARNING || "").forEach(function (paragraph) {
      entries.appendChild(
        makeElement("p", "learning-paragraph", paragraph)
      );
    });

    const close = makeElement(
      "button",
      "button button-outline journal-close",
      "← Close journal"
    );

    close.type = "button";

    close.addEventListener("click", function () {
      paper.classList.add("hidden");
      cover.classList.remove("hidden");

      cover.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    });

    paper.append(entries, close);

    learningContent.innerHTML = "";
    learningContent.append(cover, paper);

    cover.addEventListener("click", function () {
      cover.classList.add("hidden");
      paper.classList.remove("hidden");

      paper.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    });
  }

  // ==========================================
  // REFLECTION DIARY — CLICK TO OPEN
  // ==========================================

  function parseReflectionSections(value) {
    const lines = String(value || "")
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(Boolean);

    const sections = [];
    let current = null;

    lines.forEach(function (line) {
      const numberedHeading = line.match(/^\d+[.)]\s+(.+)$/);
      const overall = /^overall reflection$/i.test(line);

      if (numberedHeading || overall) {
        current = {
          title: numberedHeading ? numberedHeading[1] : line,
          content: []
        };

        sections.push(current);
      } else {
        if (!current) {
          current = {
            title: "My Reflection",
            content: []
          };

          sections.push(current);
        }

        current.content.push(line);
      }
    });

    return sections;
  }

  function displayReflection() {
    if (!reflectionContent) return;

    const sections = parseReflectionSections(window.REFLECTION || "");

    const cover = makeElement("button", "reflection-diary-cover");
    cover.type = "button";

    cover.innerHTML = `
      <span class="journal-symbol">❧</span>
      <small>THE READER'S PERSONAL JOURNAL</small>
      <strong>MY REFLECTION<br>DIARY</strong>
      <span>CLICK TO OPEN</span>
    `;

    const inside = makeElement("div", "reflection-inside hidden");
    const grid = makeElement("div", "reflection-bookshelf-grid");
    const readerPanel = makeElement("div", "reflection-reader hidden");

    sections.forEach(function (section, index) {
      const miniBook = makeElement("button", "reflection-mini-cover");
      miniBook.type = "button";

      miniBook.append(
        makeElement(
          "span",
          "reflection-mini-number",
          "ENTRY " + String(index + 1).padStart(2, "0")
        ),
        makeElement("span", "reflection-mini-ornament", "✧"),
        makeElement("span", "reflection-mini-title", section.title),
        makeElement("span", "reflection-mini-label", "OPEN REFLECTION")
      );

      miniBook.addEventListener("click", function () {
        readerPanel.innerHTML = "";

        readerPanel.append(
          makeElement("span", "reflection-reader-label eyebrow", "PERSONAL REFLECTION"),
          makeElement("h3", "reflection-reader-title", section.title)
        );

        section.content.forEach(function (paragraph) {
          readerPanel.appendChild(
            makeElement("p", "reflection-paragraph", paragraph)
          );
        });

        const closeEntry = makeElement(
          "button",
          "button button-outline reflection-close",
          "← Back to diary"
        );

        closeEntry.type = "button";

        closeEntry.addEventListener("click", function () {
          readerPanel.classList.add("hidden");
          grid.classList.remove("hidden");
        });

        readerPanel.appendChild(closeEntry);

        grid.classList.add("hidden");
        readerPanel.classList.remove("hidden");

        readerPanel.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      });

      grid.appendChild(miniBook);
    });

    const closeDiary = makeElement(
      "button",
      "button button-outline journal-close",
      "← Close diary"
    );

    closeDiary.type = "button";

    closeDiary.addEventListener("click", function () {
      inside.classList.add("hidden");
      cover.classList.remove("hidden");
      readerPanel.classList.add("hidden");
      grid.classList.remove("hidden");
    });

    inside.append(grid, readerPanel, closeDiary);

    reflectionContent.innerHTML = "";
    reflectionContent.append(cover, inside);

    cover.addEventListener("click", function () {
      cover.classList.add("hidden");
      inside.classList.remove("hidden");

      inside.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    });
  }

  // ==========================================
  // MUSIC
  // ==========================================

  const music = $("#backgroundMusic") || $("#musicPlayer");
  const soundButton = $("#soundButton") || $("#musicButton");
  const soundLabel = $("#soundLabel");

  if (soundButton && music) {
    soundButton.addEventListener("click", async function () {
      if (music.paused) {
        try {
          await music.play();

          if (soundLabel) soundLabel.textContent = "Pause Music";

          soundButton.setAttribute("aria-label", "Pause background music");
        } catch (error) {
          if (soundLabel) soundLabel.textContent = "Music unavailable";
        }
      } else {
        music.pause();

        if (soundLabel) soundLabel.textContent = "Play Music";

        soundButton.setAttribute("aria-label", "Play background music");
      }
    });
  }

  // ==========================================
  // MOBILE NAVIGATION
  // ==========================================

  const menuToggle = $("#menuToggle");
  const mainNav = $("#mainNav");

  menuToggle?.addEventListener("click", function () {
    mainNav?.classList.toggle("open");
  });

  mainNav?.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      mainNav.classList.remove("open");
    });
  });

  // ==========================================
  // SCROLL PROGRESS
  // ==========================================

  const progressBar = $("#progressBar");

  function updateProgress() {
    if (!progressBar) return;

    const total =
      document.documentElement.scrollHeight - window.innerHeight;

    const percentage = total > 0
      ? (window.scrollY / total) * 100
      : 0;

    progressBar.style.width = percentage + "%";
  }

  window.addEventListener("scroll", updateProgress);
  updateProgress();

  // ==========================================
  // START WEBSITE
  // ==========================================

  createBookshelf();
  displayLearning();
  displayReflection();
  createOpeningScreen();
});
