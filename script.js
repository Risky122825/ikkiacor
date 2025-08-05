// Ganti dengan URL API kamu
const apiUrl = "https://script.google.com/macros/s/AKfycbyyk_B8a7hrDdYM8SOo4J0-OrMFH4dvG8p_RNDhF_n46FRoqW8UiJUmg_aLPkLZA3TO8A/exec";

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
let isEditMode = false;
let editId = null;

// Tangani form kirim dan update
document.getElementById("guestForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const data = new URLSearchParams(formData);

  if (isEditMode) {
    data.append("action", "edit");
  }

  fetch(apiUrl, {
    method: "POST",
    body: data
  })
    .then((response) => response.text())
    .then((result) => {
      document.getElementById("status").textContent = isEditMode
        ? "Data berhasil diupdate!"
        : "Data berhasil dikirim!";
      this.reset();
      isEditMode = false;
      editId = null;
      document.querySelector("button[type='submit']").textContent = "Kirim";
      loadTable();
    })
    .catch((error) => {
      document.getElementById("status").textContent = "Gagal mengirim data!";
      console.error(error);
    });
});

// Fungsi muat data
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
          <td>
            <button class="edit-btn" data-id="${item.ID}" data-nama="${item.NAMA}" data-instansi="${item.INSTANSI}" data-keperluan="${item.KEPERLUAN}" data-waktu="${item.WAKTU}">Edit</button>
            <button class="delete-btn" data-id="${item.ID}">Hapus</button>
          </td>
        `;

        tbody.appendChild(row);
      });

      // Event tombol edit
      document.querySelectorAll(".edit-btn").forEach(button => {
        button.addEventListener("click", function () {
          const id = this.getAttribute("data-id");
          const nama = this.getAttribute("data-nama");
          const instansi = this.getAttribute("data-instansi");
          const keperluan = this.getAttribute("data-keperluan");
          const waktu = this.getAttribute("data-waktu");

          document.getElementById("id").value = id;
          document.getElementById("nama").value = nama;
          document.getElementById("instansi").value = instansi;
          document.getElementById("keperluan").value = keperluan;
          document.getElementById("waktu").value = waktu;

          isEditMode = true;
          editId = id;

          document.querySelector("button[type='submit']").textContent = "Update";
        });
      });

      // Event tombol hapus
      document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", function () {
          const id = this.getAttribute("data-id");
          const confirmDelete = confirm("Yakin ingin menghapus data ID: " + id + "?");
          if (confirmDelete) {
            deleteData(id);
          }
        });
      });
    })
    .catch((error) => {
      console.error("Gagal mengambil data:", error);
    });
}

// Fungsi hapus data
function deleteData(id) {
  fetch(apiUrl + "?id=" + id + "&action=delete", {
    method: "GET"
  })
    .then(response => response.text())
    .then(result => {
      alert("Data berhasil dihapus!");
      loadTable();
    })
    .catch(error => {
      console.error("Gagal menghapus data:", error);
    });
}

window.onload = loadTable;

