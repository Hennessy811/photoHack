const form = document.querySelector('#upload');

form.addEventListener('change', () => {

    const file = upload.files[0];
    let formData = new FormData();

    console.log(file)

    formData.append("photo", file);
    fetch('someurl', {method: "POST", body: formData}).then(res => console.log(res));
});