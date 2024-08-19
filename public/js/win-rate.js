// const form = document.getElementById("csvUploadForm");
// form.addEventListener("submit", async (e) => {
//   e.preventDefault();
//
//   // diable the submit button and enable the cancel button
//   const allButtons = document.getElementsByTagName("button");
//   allButtons[0].disabled = true;
//
//   const fileInput = document.getElementById("csvFile");
//   const file = fileInput.files[0];
//
//   const formData = new FormData();
//   formData.append("minWinRate", document.getElementById("min-win-rate").value);
//   formData.append("minProjects", document.getElementById("min-projects").value);
//   formData.append("roi", document.getElementById("roi").value);
//   formData.append("heliusApi", document.getElementById("helius-api").value);
//   formData.append("file", file);
//
//   fetch("/win-rate", {
//     method: "POST",
//     body: formData,
//   })
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }
//       return response.json();
//     })
//     .then((data) => {
//       console.log(data);
//       // enable the submit button and disable the cancel button
//       const allButtons = document.getElementsByTagName("button");
//       allButtons[0].disabled = false;
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//       document.getElementById("status").innerText = "Error uploading file.";
//       // enable the submit button and disable the cancel button
//       const allButtons = document.getElementsByTagName("button");
//       allButtons[0].disabled = false;
//     });
// });


const form = document.getElementById("csvUploadForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Disable the submit button
  const allButtons = document.getElementsByTagName("button");
  allButtons[0].disabled = true;

  const fileInput = document.getElementById("csvFile");
  const file = fileInput.files[0];

  const formData = new FormData();
  formData.append("minWinRate", document.getElementById("min-win-rate").value);
  formData.append("minProjects", document.getElementById("min-projects").value);
  formData.append("roi", document.getElementById("roi").value);
  formData.append("heliusApi", document.getElementById("helius-api").value);
  formData.append("day", document.getElementById("day").value);
  formData.append("file", file);

  fetch("/win-rate", {
    method: "POST",
    body: formData,
  })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        // Re-enable the submit button
        allButtons[0].disabled = false;
      })
      .catch((error) => {
        console.error("Error:", error);
        document.getElementById("status").innerText = "Error uploading file.";
        // Re-enable the submit button
        allButtons[0].disabled = false;
      });
});
