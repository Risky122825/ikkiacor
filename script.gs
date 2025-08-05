const scriptURL = 'https://script.google.com/macros/s/AKfycbyyk_B8a7hrDdYM8SOo4J0-OrMFH4dvG8p_RNDhF_n46FRoqW8UiJUmg_aLPkLZA3TO8A/exec';
const form = document.getElementById('guestForm');
const status = document.getElementById('status');
const tableBody = document.querySelector('#guestTable tbody');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);

  fetch(scriptURL, { method: 'POST', body: data })
    .then(response => {
      status.innerText = 'Data berhasil dikirim!';
      form.reset();
      fetchData();
    })
    .catch(error => {
      status.innerText = 'Gagal mengirim data.';
      console.error('Error!', error.message);
    });
});

function fetchData() {
  fetch(scriptURL)
    .then(response => response.json())
    .then(data => {
      tableBody.innerHTML = '';
      data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${row.ID}</td>
          <td>${row.NAMA}</td>
          <td>${row.INSTANSI}</td>
          <td>${row.KEPERLUAN}</td>
          <td>${row.WAKTU}</td>
          <td class="action-buttons">
            <button class="edit">Edit</button>
            <button class="delete">Hapus</button>
          </td>
        `;
        tr.querySelector('.edit').addEventListener('click', () => editRow(row));
        tr.querySelector('.delete').addEventListener('click', () => deleteRow(row));
        tableBody.appendChild(tr);
      });
    })
    .catch(error => {
      console.error('Gagal mengambil data:', error);
    });
}

function editRow(row) {
  const newName = prompt('Edit Nama:', row.NAMA);
  const newInstansi = prompt('Edit Instansi:', row.INSTANSI);
  const newKeperluan = prompt('Edit Keperluan:', row.KEPERLUAN);
  const newWaktu = prompt('Edit Waktu:', row.WAKTU);

  const formData = new FormData();
  formData.append('action', 'update');
  formData.append('id', row.ID);
  formData.append('nama', newName);
  formData.append('instansi', newInstansi);
  formData.append('keperluan', newKeperluan);
  formData.append('waktu', newWaktu);

  fetch(scriptURL, { method: 'POST', body: formData })
    .then(response => response.text())
    .then(msg => {
      alert(msg);
      fetchData();
    })
    .catch(error => {
      alert('Gagal update data');
      console.error('Error!', error.message);
    });
}

function deleteRow(row) {
  if (confirm(`Yakin ingin menghapus data ID: ${row.ID}?`)) {
    const formData = new FormData();
    formData.append('action', 'delete');
    formData.append('id', row.ID);

    fetch(scriptURL, { method: 'POST', body: formData })
      .then(response => response.text())
      .then(msg => {
        alert(msg);
        fetchData();
      })
      .catch(error => {
        alert('Gagal hapus data');
        console.error('Error!', error.message);
      });
  }
}

fetchData();
