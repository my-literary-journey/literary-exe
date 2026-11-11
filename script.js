
document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  const $ = (selector, parent = document) => parent.querySelector(selector);

  const bookshelf =
    $("#bookshelf") || $("#bookshelfGrid");

  const reader =
    $("#readerScreen") || $("#readingView") || $("#reader");

  const readerTitle =
    $("#readerTitle") || $("#readingTitle");

  const readerContent =
    $("#readerContent") || $("#readingContent");

  const readerVolume =
    $("#readerVolume") || $("#readingNumber");

  const bookCounter =
    $("#bookCounter") || $("#readingCount");

  const backButton =
    $("#backToShelf");

  const previousButton =
    $("#previousBook") || $("#prevBook");

  const nextButton =
    $("#nextBook");

  const learningContent = $("#learningContent");
  const reflectionContent = $("#reflectionContent");

  let currentBookIndex = 0;
  let books = Array.isArray(window.BOOKS) ? window.BOOKS : [];

  const fallbackBooks = [
    { title: "The Ancient of Days", author: "Job 38" },
    { title: "The Panchatantra", author: "Vishnu Sharma" },
    { title: "The Ramayana", author: "Valmiki" },
    { title: "The Mahabharata", author: "Vyasa" },
    { title: "The Iliad", author: "Homer" },
    { title: "The Odyssey", author: "Homer" },
    { title: "The Song of Roland", author: "Anonymous" }
  ];

  books = fallbackBooks.map((fallback, index) => {
    const original = books[index] || {};

    return {
      ...original,
      title: original.title || fallback.title,
      author: original.author || fallback.author,
      image: original.image || original.cover || "",
      content: original.content || original.analysis || ""
    };
  });

  function makeElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;

    return element;
  }

  function getTextContent(value) {
    if (Array.isArray(value)) {
      return value.map(item => {
        if (typeof item === "string") return item;
        return item.text || item.content || "";
      }).filter(Boolean);
    }

    if (typeof value !== "string") return [];

    const cleaned = value
      .replace(/<\/(p|div|h[1-6]|li)>/gi, "\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");

    return cleaned
      .split(/\n+/)
      .map(part => part.trim())
      .filter(Boolean);
  }

  function createBookshelf() {
    if (!bookshelf) return;

    bookshelf.innerHTML = "";

    books.forEach((book, index) => {
      const card = makeElement("button", "book-card");
      card.type = "button";
      card.setAttribute("aria-label", `Open ${book.title}`);

      const cover = makeElement("div", "book-cover-wrap");

      if (book.image) {
        const image = document.createElement("img");
        image.className = "book-cover-image";
        image.src = book.image;
        image.alt = `${book.title} book cover`;
        image.loading = "lazy";

        image.onerror = function () {
          cover.innerHTML = "";
          const missing = makeElement(
            "div",
            "cover-image-missing",
            book.title
          );
          cover.appendChild(missing);
        };

        cover.appendChild(image);
      } else {
        cover.appendChild(
          makeElement("div", "cover-image-missing", book.title)
        );
      }

      const title = makeElement("span", "cover-title", book.title);
      const author = makeElement(
        "span",
        "cover-author",
        book.author || "Great Books Collection"
      );
      const openLabel = makeElement(
        "span",
        "book-open-label",
        "Click to open"
      );

      card.append(cover, title, author, openLabel);

      card.addEventListener("click", () => openBook(index));

      bookshelf.appendChild(card);
    });
  }

  function createPage(paragraphs, pageNumber, bookTitle, imagePath, showImage) {
    const page = makeElement("div", "book-page");

    page.appendChild(
      makeElement("div", "page-running-title", bookTitle)
    );

    if (showImage && imagePath) {
      const frame = makeElement("div", "reading-image-frame");
      const image = document.createElement("img");

      image.className = "reading-image";
      image.src = imagePath;
      image.alt = `${bookTitle} illustration`;
      image.loading = "lazy";

      frame.appendChild(image);
      page.appendChild(frame);
    }

    paragraphs.forEach(paragraph => {
      page.appendChild(
        makeElement("p", "reading-paragraph", paragraph)
      );
    });

    page.appendChild(
      makeElement("span", "page-number", String(pageNumber))
    );

    return page;
  }

  function displayBook(book) {
    if (!readerContent) return;

    readerContent.innerHTML = "";

    const paragraphs = getTextContent(book.content);

    if (!paragraphs.length) {
      paragraphs.push("The written analysis for this book will appear here.");
    }

    const middle = Math.ceil(paragraphs.length / 2);
    const leftParagraphs = paragraphs.slice(0, middle);
    const rightParagraphs = paragraphs.slice(middle);

    const spread = makeElement("div", "book-open-spread");

    spread.appendChild(
      createPage(leftParagraphs, 1, book.title, book.image, true)
    );

    spread.appendChild(
      createPage(rightParagraphs, 2, book.title, "", false)
    );

    readerContent.appendChild(spread);
  }

  function openBook(index) {
    if (!books[index]) return;

    currentBookIndex = index;
    const book = books[index];

    if (readerTitle) readerTitle.textContent = book.title;

    if (readerVolume) {
      readerVolume.textContent =
        `VOLUME ${String(index + 1).padStart(2, "0")}`;
    }

    if (bookCounter) {
      bookCounter.textContent =
        `${String(index + 1).padStart(2, "0")} / ${String(books.length).padStart(2, "0")}`;
    }

    displayBook(book);

    if (previousButton) {
      previousButton.disabled = index === 0;
    }

    if (nextButton) {
      nextButton.disabled = index === books.length - 1;
    }

    reader?.classList.remove("hidden");

    reader?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  function closeReader() {
    reader?.classList.add("hidden");

    bookshelf?.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }

  backButton?.addEventListener("click", closeReader);

  previousButton?.addEventListener("click", () => {
    if (currentBookIndex > 0) {
      openBook(currentBookIndex - 1);
    }
  });

  nextButton?.addEventListener("click", () => {
    if (currentBookIndex < books.length - 1) {
      openBook(currentBookIndex + 1);
    }
  });

  /* LEARNING JOURNAL */

  function displayLearning() {
    if (!learningContent) return;

    const originalLearning = window.LEARNING || "";

    const section = learningContent.parentElement;
    const cover = makeElement("button", "learning-journal-cover");
    cover.type = "button";
    cover.innerHTML = `
      <span class="journal-symbol">❧</span>
      <small>PERSONAL LEARNING JOURNAL</small>
      <strong>LESSONS<br>BETWEEN THE LINES</strong>
      <span>CLICK TO OPEN</span>
    `;

    const paper = makeElement("div", "learning-paper hidden");
    const close = makeElement(
      "button",
      "button button-outline journal-close",
      "← Close journal"
    );
    close.type = "button";

    const content = makeElement("div", "learning-entries");

    getTextContent(originalLearning).forEach(line => {
      content.appendChild(makeElement("p", "", line));
    });

    paper.append(content, close);

    learningContent.replaceWith(cover);
    cover.insertAdjacentElement("afterend", paper);

    cover.addEventListener("click", () => {
      cover.classList.add("hidden");
      paper.classList.remove("hidden");

      paper.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    });

    close.addEventListener("click", () => {
      paper.classList.add("hidden");
      cover.classList.remove("hidden");

      cover.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    });
  }

  /* REFLECTION DIARY */

  function parseReflectionSections(value) {
    if (Array.isArray(value)) {
      return value.map((item, index) => ({
        title: item.title || `Reflection ${index + 1}`,
        content: item.content || item.text || ""
      }));
    }

    if (value && typeof value === "object") {
      return Object.entries(value).map(([title, content]) => ({
        title,
        content: typeof content === "string"
          ? content
          : JSON.stringify(content)
      }));
    }

    const lines = String(value || "")
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(Boolean);

    const sections = [];
    let current = null;

    lines.forEach(line => {
      const heading = line.match(
        /^(?:(?:\d+)[.)]\s*)?(Overall Reflection|.+?)(?::)?$/
      );

      const looksLikeHeading =
        line.length < 75 &&
        (
          /^\d+[.)]\s/.test(line) ||
          /overall reflection/i.test(line) ||
          /^[A-Z][A-Za-z\s,&'-]{2,55}$/.test(line)
        );

      if (looksLikeHeading && !/[.!?]$/.test(line)) {
        current = {
          title: line.replace(/^\d+[.)]\s*/, "").replace(/:$/, ""),
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

    return sections.map(section => ({
      title: section.title,
      content: Array.isArray(section.content)
        ? section.content.join("\n\n")
        : section.content
    }));
  }

  function displayReflection() {
    if (!reflectionContent) return;

    const originalReflection = window.REFLECTION || "";
    const sections = parseReflectionSections(originalReflection);

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

    sections.forEach((section, index) => {
      const miniBook = makeElement("button", "reflection-mini-cover");
      miniBook.type = "button";

      miniBook.append(
        makeElement(
          "span",
          "reflection-mini-number",
          `ENTRY ${String(index + 1).padStart(2, "0")}`
        ),
        makeElement("span", "reflection-mini-ornament", "✧"),
        makeElement("span", "reflection-mini-title", section.title),
        makeElement("span", "reflection-mini-label", "OPEN REFLECTION")
      );

      miniBook.addEventListener("click", () => {
        readerPanel.innerHTML = "";

        readerPanel.appendChild(
          makeElement("span", "reflection-reader-label eyebrow", "PERSONAL REFLECTION")
        );

        readerPanel.appendChild(
          makeElement("h3", "reflection-reader-title", section.title)
        );

        getTextContent(section.content).forEach(paragraph => {
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
        closeEntry.addEventListener("click", () => {
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

    closeDiary.addEventListener("click", () => {
      inside.classList.add("hidden");
      cover.classList.remove("hidden");
      readerPanel.classList.add("hidden");
      grid.classList.remove("hidden");

      cover.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    });

    inside.append(grid, readerPanel, closeDiary);

    reflectionContent.innerHTML = "";
    reflectionContent.append(cover, inside);

    cover.addEventListener("click", () => {
      cover.classList.add("hidden");
      inside.classList.remove("hidden");

      inside.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    });
  }

  /* MUSIC CONTROL */

  const music =
    $("#backgroundMusic") || $("#musicPlayer");

  const soundButton =
    $("#soundButton") || $("#musicButton");

  const soundLabel =
    $("#soundLabel");

  if (soundButton && music) {
    soundButton.addEventListener("click", async () => {
      if (music.paused) {
        try {
          await music.play();

          if (soundLabel) {
            soundLabel.textContent = "Pause Music";
          }

          soundButton.setAttribute("aria-label", "Pause background music");
        } catch (error) {
          if (soundLabel) {
            soundLabel.textContent = "Music unavailable";
          }
        }
      } else {
        music.pause();

        if (soundLabel) {
          soundLabel.textContent = "Play Music";
        }

        soundButton.setAttribute("aria-label", "Play background music");
      }
    });
  }

  /* MOBILE MENU */

  const menuToggle = $("#menuToggle");
  const mainNav = $("#mainNav");

  menuToggle?.addEventListener("click", () => {
    mainNav?.classList.toggle("open");
  });

  mainNav?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
    });
  });

  /* SCROLL PROGRESS */

  const progressBar = $("#progressBar");

  function updateProgress() {
    if (!progressBar) return;

    const scrollable =
      document.documentElement.scrollHeight - window.innerHeight;

    const progress = scrollable > 0
      ? (window.scrollY / scrollable) * 100
      : 0;

    progressBar.style.width = `${progress}%`;
  }

  window.addEventListener("scroll", updateProgress);
  updateProgress();

  /* START WEBSITE */

  createBookshelf();
  displayLearning();
  displayReflection();
});
