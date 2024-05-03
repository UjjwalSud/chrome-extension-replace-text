class UIHelper {
  constructor() {
    this.resultsDiv = document.getElementById("results");
  }

  clearResults() {
    this.resultsDiv.textContent = "";
    this.resultsDiv.className = ""; // Clear previous classes
  }

  updateResults(message, type) {
    this.clearResults(); // Clear previous results
    this.resultsDiv.textContent = message;
    switch (type) {
      case "error":
        this.resultsDiv.classList.add("error");
        break;
      case "success":
        this.resultsDiv.classList.add("success");
        break;
      case "info":
        this.resultsDiv.classList.add("info");
        break;
      default:
        break; // No class added for unknown types
    }
  }
}
