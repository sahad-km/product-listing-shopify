//Converting JSON to CSV data

export const jsonToCsv = (data) => {
  const { Parser } = require("json2csv");
  const fields = Object.keys(data[0]);
  const opts = { fields };
  try {
    const csv = new Parser(opts).parse(data);
    return csv;
  } catch (err) {
    console.error(err);
  }
};

//Download the CSV file to the system

export const downloadCsv = (csv) => {
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("href", url);
  a.setAttribute("download", "data.csv");
  a.click();
};
