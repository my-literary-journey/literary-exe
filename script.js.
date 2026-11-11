
document.addEventListener("DOMContentLoaded", function () {

  // =====================================
  // WEBSITE ELEMENTS
  // =====================================

  const homeScreen = document.getElementById("homeScreen");
  const libraryScreen = document.getElementById("libraryScreen");
  const readerScreen = document.getElementById("readerScreen");
  const journalScreen = document.getElementById("journalScreen");

  const openLibraryButton = document.getElementById("openLibrary");
  const backToHomeButton = document.getElementById("backToHome");
  const closeBookButton = document.getElementById("closeBook");

  const bookshelf = document.getElementById("bookshelf");

  const readingTitle = document.getElementById("readingTitle");
  const readerBookTitle = document.getElementById("readerBookTitle");
  const readerBookAuthor = document.getElementById("readerBookAuthor");
  const readerBookImage = document.getElementById("readerBookImage");

  const leftPageContent = document.getElementById("leftPageContent");
  const readingContent = document.getElementById("readingContent");

  const leftPageNumber = document.getElementById("leftPageNumber");
  const rightPageNumber = document.getElementById("rightPageNumber");
  const readingCount = document.getElementById("readingCount");
  const readingNumber = document.getElementById("readingNumber");

  const openBook = document.getElementById("openBook");

  const prevPageButton = document.getElementById("prevPage");
  const nextPageButton = document.getElementById("nextPage");

  const music = document.getElementById("backgroundMusic");
  const musicToggle = document.getElementById("musicToggle");

  const closeJournalButton = document.getElementById("closeJournal");
  const showLearningButton = document.getElementById("showLearning");
  const showReflectionButton = document.getElementById("showReflection");
  const journalContent = document.getElementById("journalContent");


  // =====================================
  // SCREEN NAVIGATION
  // =====================================

  function showScreen(screen) {

    const screens = [
      homeScreen,
      libraryScreen,
      readerScreen,
      journalScreen
    ];

    screens.forEach(function (item) {
      item.classList.add("hidden");
    });

    screen.classList.remove("hidden");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }


  // =====================================
  // BOOK DATA
  // =====================================

  const books = window.BOOKS || [];

  let currentBook = null;
  let currentBookIndex = 0;
  let currentPage = 0;


  // =====================================
  // CREATE BOOKSHELF
  // =====================================

  function createBookshelf() {

    bookshelf.innerHTML = "";

    if (!books.length) {
      bookshelf.textContent =
        "Books are unavailable. Please check content.js.";
      return;
    }

    books.forEach(function (book, index) {

      const card = document.createElement("button");
      card.type = "button";
      card.className = "book-card";
      card.setAttribute("aria-label", "Open " + book.title);

      const cover = document.createElement("div");
      cover.className = "book-cover";

      const image = document.createElement("img");
      image.src = book.image;
      image.alt = book.title;
      image.loading = "lazy";

      image.onerror = function () {
        image.style.display = "none";
      };

      cover.appendChild(image);

      const title = document.createElement("span");
      title.className = "book-title";
      title.textContent = book.title;

      const subtitle = document.createElement("span");
      subtitle.className = "book-subtitle";
      subtitle.textContent =
        "VOLUME " + String(index + 1).padStart(2, "0");

      card.appendChild(cover);
      card.appendChild(title);
      card.appendChild(subtitle);

      card.addEventListener("click", function () {
        openSelectedBook(index);
      });

      bookshelf.appendChild(card);

    });

  }


  // =====================================
  // GET AUTHOR
  // =====================================

  function getAuthor(book) {

    if (!book.content || !book.content.length) {
      return "Unknown Author";
    }

    const authorLine = book.content.find(function (item) {
      return item.toLowerCase().startsWith("author:");
    });

    if (authorLine) {
      return authorLine.substring(7).trim();
    }

    return "Author information";
  }


  // =====================================
  // OPEN SELECTED BOOK
  // =====================================

  function openSelectedBook(index) {

    currentBook = books[index];
    currentBookIndex = index;
    currentPage = 0;

    if (!currentBook) return;

    readingTitle.textContent = currentBook.title;
    readerBookTitle.textContent = currentBook.title;
    readerBookAuthor.textContent = getAuthor(currentBook);

    readerBookImage.src = currentBook.image;
    readerBookImage.alt = currentBook.title;

    readingNumber.textContent =
      "VOLUME " + String(index + 1).padStart(2, "0");

    renderPages();
    showScreen(readerScreen);

  }


  // =====================================
  // FORMAT CONTENT
  // =====================================

  function createContentSection(text) {

    const section = document.createElement("div");
    section.className = "page-section";

    const headingMatch = text.match(/^([^:]+):\s*/);

    if (headingMatch) {

      const heading = document.createElement("h3");
      heading.textContent = headingMatch[1].trim();

      section.appendChild(heading);

      const remainingText =
        text.substring(headingMatch[0].length).trim();

      if (remainingText) {
        const paragraph = document.createElement("p");
        paragraph.textContent = remainingText;
        section.appendChild(paragraph);
      }

    } else {

      const paragraph = document.createElement("p");
      paragraph.textContent = text;
      section.appendChild(paragraph);

    }

    return section;

  }


  // =====================================
  // DISPLAY TWO-PAGE BOOK
  // =====================================

  function renderPages() {

    if (!currentBook) return;

    const content = currentBook.content || [];
    const totalPages = Math.max(content.length, 1);

    leftPageContent.innerHTML = "";
    readingContent.innerHTML = "";

    // LEFT PAGE: BOOK COVER

    if (currentPage === 0) {

      const imageFrame = document.createElement("div");
      imageFrame.className = "book-illustration";

      const image = document.createElement("img");
      image.src = currentBook.image;
      image.alt = currentBook.title;

      imageFrame.appendChild(image);

      const title = document.createElement("h3");
      title.textContent = currentBook.title;

      const author = document.createElement("p");
      author.className = "book-author";
      author.textContent = getAuthor(currentBook);

      leftPageContent.appendChild(imageFrame);
      leftPageContent.appendChild(title);
      leftPageContent.appendChild(author);

    } else {

      const previousSection = content[currentPage - 1];

      if (previousSection) {
        leftPageContent.appendChild(
          createContentSection(previousSection)
        );
      }

    }

    leftPageNumber.textContent =
      String(currentPage * 2 + 1).padStart(2, "0");


    // RIGHT PAGE: LITERARY ANALYSIS

    const currentSection = content[currentPage];

    if (currentSection) {

      readingContent.appendChild(
        createContentSection(currentSection)
      );

    } else {

      const message = document.createElement("p");
      message.textContent = "End of this literary work.";
      readingContent.appendChild(message);

    }

    rightPageNumber.textContent =
      String(currentPage * 2 + 2).padStart(2, "0");


    // PAGE COUNTER

    readingCount.textContent =
      String(currentPage + 1).padStart(2, "0") +
      " / " +
      String(totalPages).padStart(2, "0");

    prevPageButton.disabled = currentPage === 0;
    nextPageButton.disabled = currentPage >= totalPages - 1;

  }


  // =====================================
  // PAGE TURN ANIMATION
  // =====================================

  function turnPage(direction) {

    if (!currentBook) return;

    const totalPages = currentBook.content.length;

    if (direction === "next" && currentPage < totalPages - 1) {
      currentPage++;
    } else if (direction === "prev" && currentPage > 0) {
      currentPage--;
    } else {
      return;
    }

    openBook.classList.remove("turn-next", "turn-prev");

    void openBook.offsetWidth;

    openBook.classList.add(
      direction === "next" ? "turn-next" : "turn-prev"
    );

    renderPages();

    setTimeout(function () {
      openBook.classList.remove("turn-next", "turn-prev");
    }, 600);

  }


  // =====================================
  // LEARNING AND REFLECTION
  // =====================================

  function displayJournal(text, heading) {

    journalContent.innerHTML = "";

    const title = document.createElement("h2");
    title.textContent = heading;
    journalContent.appendChild(title);

    if (!text) {
      const message = document.createElement("p");
      message.textContent = "No content available.";
      journalContent.appendChild(message);
    } else {

      const paragraphs = text
        .split(/\n\s*\n/)
        .map(function (paragraph) {
          return paragraph.trim();
        })
        .filter(Boolean);

      paragraphs.forEach(function (paragraph) {

        const element = document.createElement("p");
        element.textContent = paragraph;

        journalContent.appendChild(element);

      });

    }

    showScreen(journalScreen);

  }


  // =====================================
  // BACKGROUND MUSIC
  // =====================================

  function updateMusicButton() {

    if (!music || !musicToggle) return;

    const playing = !music.paused;

    musicToggle.textContent = playing
      ? "♫ Sound On"
      : "♫ Sound Off";

    musicToggle.setAttribute(
      "aria-pressed",
      playing ? "true" : "false"
    );

  }


  async function playMusic() {

    if (!music) return;

    try {

      await music.play();
      updateMusicButton();

    } catch (error) {

      updateMusicButton();

    }

  }


  function pauseMusic() {

    if (!music) return;

    music.pause();
    updateMusicButton();

  }


  if (music) {

    music.volume = 0.35;

    music.addEventListener("play", updateMusicButton);
    music.addEventListener("pause", updateMusicButton);

    // Browser may block autoplay.
    // The visitor can start the music using the button.

    playMusic();

  }


  if (musicToggle) {

    musicToggle.addEventListener("click", function () {

      if (music.paused) {
        playMusic();
      } else {
        pauseMusic();
      }

    });

  }


  // =====================================
  // MAIN BUTTONS
  // =====================================

  openLibraryButton.addEventListener("click", function () {

    createBookshelf();
    showScreen(libraryScreen);
    playMusic();

  });


  backToHomeButton.addEventListener("click", function () {
    showScreen(homeScreen);
  });


  closeBookButton.addEventListener("click", function () {
    showScreen(libraryScreen);
  });


  prevPageButton.addEventListener("click", function () {
    turnPage("prev");
  });


  nextPageButton.addEventListener("click", function () {
    turnPage("next");
  });


  // =====================================
  // JOURNAL NAVIGATION
  // =====================================

  showLearningButton.addEventListener("click", function () {

    displayJournal(
      window.LEARNING || "",
      "My Learning"
    );

  });


  showReflectionButton.addEventListener("click", function () {

    displayJournal(
      window.REFLECTION || "",
      "My Reflection"
    );

  });


  closeJournalButton.addEventListener("click", function () {
    showScreen(libraryScreen);
  });


  // =====================================
  // READER'S JOURNAL BUTTON
  // =====================================

  const journalButton = document.createElement("button");

  journalButton.type = "button";
  journalButton.className = "journal-button";
  journalButton.textContent = "READER'S JOURNAL";

  journalButton.addEventListener("click", function () {

    displayJournal(
      window.LEARNING || "",
      "My Learning"
    );

  });

  document.querySelector(".library-bottom").appendChild(journalButton);


  // =====================================
  // INITIALIZE WEBSITE
  // =====================================

  showScreen(homeScreen);
  updateMusicButton();

});
