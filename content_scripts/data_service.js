class DataService {
  constructor() {}

  // Fetch data for dropdowns, initially using static data
  fetchDropdownData() {
    // return fetch("<<API>>")
    //   .then((response) => response.json())
    //   .then((data) => data.map((item) => ({ text: item.name, value: item.id })))
    //   .catch((error) => console.error("Error fetching data:", error));

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([
          { text: "Please Select", value: "" },
          { text: "Text 1 1", value: "Text 1  11" },
          { text: "Text 2 1", value: "Text 2  22" },
          { text: "Text 3 2", value: "Text 3  33" },
        ]);
      }, 100);
    });
  }
}

const dataService = new DataService();
export default dataService;
