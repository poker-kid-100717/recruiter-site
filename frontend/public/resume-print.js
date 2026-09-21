document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('print-resume');
  if (button) {
    button.addEventListener('click', () => window.print());
  }
});
