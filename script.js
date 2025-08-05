// Ganti dengan URL API kamu
const apiUrl = "https://script.google.com/macros/s/AKfycbxqu2DMLwKCMUEVuX15Wo0C0SPGohsLRLbYP4SPKuJ5Zwjed4-RkdbZx0MRE1V1XtxKOQ/exec";

// Tangani pengiriman form
document.getElementById("guestForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const data = new URLSearchParams(formData);

  fetch(apiUrl, {
    method: "POST",
    body: data
  })
    .then((response) => response.text())
    .then((result) => {
      document.getElementById("status").textContent = "Data berhasil dikirim!";
      this.reset();
      loadTable(); // Muat ulang data tabel
    })
    .catch((error) => {
      document.getElementById("status").textContent = "Gagal mengirim data!";
      console.error(error);
    });
});

// Fungsi untuk memuat data dari API dan menampilkannya di tabel
function loadTable() {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const tbody = document.querySelector("#dataTable tbody");
      tbody.innerHTML = "";

      data.forEach((item) => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${item.ID}</td>
          <td>${item.NAMA}</td>
          <td>${item.INSTANSI}</td>
          <td>${item.KEPERLUAN}</td>
          <td>${item.WAKTU}</td>
        `;

        tbody.appendChild(row);
      });
    })
    .catch((error) => {
      console.error("Gagal mengambil data:", error);
    });
}

// Panggil loadTable saat halaman dibuka
window.onload = loadTable;
