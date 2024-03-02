const textArea = document.getElementById("text_to_summarize");
const submitButton = document.getElementById("submit-button");
const summarizedTextArea = document.getElementById("summary");
const toggleModeButton = document.getElementById("toggle-mode-button");

// Initial state

let isDarkMode = false;

toggleModeButton.addEventListener("click", toggleMode);

function toggleMode() {
  isDarkMode = !isDarkMode;
  updateMode();
}

function updateMode() {
  document.body.classList.toggle("dark-mode", isDarkMode);
  document.body.classList.toggle("light-mode", !isDarkMode);
}
submitButton.disabled = true;

textArea.addEventListener("input", verifyTextLength);
submitButton.addEventListener("click", submitData);

function verifyTextLength(e) {
  const textarea = e.target;

  // Verify the TextArea value.
  const isValidLength = textarea.value.length > 200 && textarea.value.length < 100000;

  // Toggle the button disabled state and add/remove a class for visual feedback
  submitButton.disabled = !isValidLength;
  toggleButtonAnimation(isValidLength);
}

function toggleButtonAnimation(isValidLength) {
  // Add/remove class for visual feedback
  submitButton.classList.toggle("submit-button--loading", isValidLength);
}

async function submitData(e) {
  // Disable the button during the API request
  submitButton.disabled = true;
  toggleButtonAnimation(false);

  const text_to_summarize = textArea.value;

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  try {
    const response = await fetch('/summarize', {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({ "text_to_summarize": text_to_summarize }),
      redirect: 'follow'
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const summary = await response.text();
    // Update the output text area with new summary
    summarizedTextArea.value = summary;
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    // Re-enable the button after API request completion
    submitButton.disabled = false;
    toggleButtonAnimation(true);
  }
}
