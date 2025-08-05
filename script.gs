const scriptURL = 'https://script.google.com/macros/s/AKfycbxqu2DMLwKCMUEVuX15Wo0C0SPGohsLRLbYP4SPKuJ5Zwjed4-RkdbZx0MRE1V1XtxKOQ/exec';

document.getElementById('guestForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const form = e.target;
  const data = new FormData(form);
  const status = document.getElementById('status');

  fetch(scriptURL, { method: 'POST', body: data })
    .then(response => {
      status.innerText = 'Data berhasil dikirim!';
      form.reset();
    })
    .catch(error => {
      status.innerText = 'Gagal mengirim data.';
      console.error('Error!', error.message);
    });
});
