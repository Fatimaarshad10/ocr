// content
function changeContent(heading, paragraph) {
  var headingElement = document.getElementById("contentHeading");
  var paragraphElement = document.getElementById("contentParagraph");

  headingElement.textContent = heading;
  paragraphElement.textContent = paragraph;
}

window.addEventListener("DOMContentLoaded", function () {
  const feedbackButtonLink = document.querySelector(".feedback-button-link");
  const btnFeedbackP = document.querySelector(".btn-feedback-p");
  const feedbackIcon = document.querySelector(".feedback-icon");

  function handleScreenResize() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 600) {
      feedbackButtonLink.classList.add("mobile");
    } else {
      feedbackButtonLink.classList.remove("mobile");
    }
  }

  window.addEventListener("resize", handleScreenResize);
  handleScreenResize();
});
// google translator
function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    {
      pageLanguage: "en",
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
    },
    "google_translate_element"
  );
}

// ocr box 
const uploadImage = document.getElementById("uploadImage");
const imageInput = document.getElementById("imageInput");
const extractButton = document.querySelector(".box-btn");
const fileInput = document.getElementById("imageInput");
const loader = document.getElementById("loader1");
const newImage = document.getElementById("newImage");

uploadImage.addEventListener("click", function() {
  imageInput.click();
});

fileInput.addEventListener("change", function() {
  const selectedFile = fileInput.files[0];
  uploadImage.style.display = "none";
  if (selectedFile) {
    loader.style.display='block'
    const para = document.getElementById('card-p')
    para.style.display = 'none'
    // Display the selected file in the image form after 2 seconds
    setTimeout(function() {
      const reader = new FileReader();
      reader.onload = function(event) {
        newImage.src = event.target.result;
        newImage.style.marginLeft = '20%'
      };
      reader.readAsDataURL(selectedFile);

      // Hide the loader and show the image
    loader.style.display='none'

      uploadImage.style.display = "none";
      newImage.style.display = "block";
    
    }, 2000);
  } else {
    // Hide the image and loader when no file is chosen
    newImage.src = "";
    uploadImage.style.display = "block";
  }
});

function validateAndPerformOCR() {
  var fileInput = document.getElementById("imageInput");
  var selectedFile = fileInput.files[0];
 
  if (selectedFile) {

    performOCR();
  } else {
   
  hideLoader()
    showModal()
  }
}


async function performOCR() {
  // Show the loader
  showLoader();

  // Get the selected image file
  const input = document.getElementById("imageInput");
  const file = input.files[0];

  // Create a new instance of Tesseract.js worker
  const { createWorker } = Tesseract;
  const worker = await createWorker({
    logger: (m) => console.log(m.progress),
  });

  // Load the language and initialize the worker
  await worker.load();
  await worker.loadLanguage("eng");
  await worker.initialize("eng");

  try {
    // Perform OCR on the image file
    const {
      data: { text },
    } = await worker.recognize(file);

    // Display the extracted text
    document.getElementById("result").textContent = text;

    // Show the modal with the extracted text
    function showModal(text) {
      const modalBody = document.querySelector(".modal-body");

      // Clear the modal body
      modalBody.innerHTML = "";

      // Create a paragraph element for the extracted text
      const textElement = document.createElement("p");
      textElement.textContent = text;
      modalBody.appendChild(textElement);
      // Create a start over  button

      const StartOverButton = document.createElement("button");
      StartOverButton.textContent = "Start over";
      StartOverButton.classList.add("start-button");

      modalBody.appendChild(StartOverButton);

      StartOverButton.addEventListener("click", function() {
        location.reload();
      });

      // Create a copy button
      const copyButton = document.createElement("button");
      copyButton.textContent = "Copy";
      copyButton.classList.add("copy-button");

      modalBody.appendChild(copyButton);
      // Add click event listener to copy button
      copyButton.addEventListener("click", function() {
        // Copy the text to the clipboard
        navigator.clipboard
          .writeText(text)
          .then(function() {
            console.log("Text copied to clipboard: " + text);
            copyButton.textContent = "Copied";
          })
          .catch(function(error) {
            console.error("Error copying text to clipboard:", error);
          });
      });
      // Hide the loader
      hideLoader();

    }

    showModal(text);
  } catch (error) {
    console.error("Error performing OCR:", error);
    // Hide the loader in case of an error
    hideLoader();
  } finally {
    // Terminate the worker
    await worker.terminate();
  }
}

function showLoader() {
  const loader = document.getElementById("loader");
  loader.style.display = "block";
}

function hideLoader() {
  const loader = document.getElementById("loader");
  loader.style.display = "none";
}

function showModal(text) {
  const modalBody = document.querySelector(".modal-body");
  const resultElement = document.getElementById("result");

  if (text) {
    resultElement.innerHTML = `<p>${text}</p>`;
  } else {
    resultElement.innerHTML = `<h2 class="error-text">File is not uploaded</h2>`;

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    const startOverButton = document.createElement("button");
    startOverButton.textContent = "Start Over";
    startOverButton.classList.add("start-button");

    buttonContainer.appendChild(startOverButton);
    resultElement.appendChild(buttonContainer);

    startOverButton.addEventListener("click", function() {
      location.reload();
    });

    // Close modal and reload page when the modal's close button is clicked
    const closeButton = document.querySelector(".modal-close");
    closeButton.addEventListener("click", function() {
      location.reload();
    });
  }

  // Initialize the modal with backdrop: 'static'
  modal = new bootstrap.Modal(document.getElementById("exampleModalLabel"), {
    backdrop: 'static'
  });

  modal.show();
}

