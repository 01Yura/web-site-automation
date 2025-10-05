// Copy code functionality
function addCopyButtons() {
  const codeBlocks = document.querySelectorAll("pre");

  codeBlocks.forEach((block) => {
    // Skip if already has copy button
    if (block.querySelector(".copy-button")) return;

    const copyButton = document.createElement("button");
    copyButton.className = "copy-button";
    copyButton.textContent = "Copy";
    copyButton.onclick = () => copyCode(block, copyButton);

    block.insertBefore(copyButton, block.firstChild);
  });
}

function copyCode(codeBlock, button) {
  const text = codeBlock.textContent.replace("Copy", "").trim();

  navigator.clipboard
    .writeText(text)
    .then(() => {
      // Show success state
      button.textContent = "Copied!";
      button.classList.add("copied");

      // Reset after 2 seconds
      setTimeout(() => {
        button.textContent = "Copy";
        button.classList.remove("copied");
      }, 2000);
    })
    .catch((err) => {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);

      // Show success state
      button.textContent = "Copied!";
      button.classList.add("copied");

      setTimeout(() => {
        button.textContent = "Copy";
        button.classList.remove("copied");
      }, 2000);
    });
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", addCopyButtons);
