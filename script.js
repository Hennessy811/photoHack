const form = document.querySelector('#upload');
const UPLOAD_URL = 'http://upload-soft.photolab.me/upload.php';
const TG_URL = 'http://upload-soft.photolab.me/upload.php';
const API_URL = 'http://ec2-18-223-149-113.us-east-2.compute.amazonaws.com/filter';
const CREATE_GIF = 'http://ec2-18-223-149-113.us-east-2.compute.amazonaws.com/create_gif';
const PUBLISH = 'http://ec2-18-223-149-113.us-east-2.compute.amazonaws.com/publish';
const GET_PHOTO = 'http://ec2-18-223-149-113.us-east-2.compute.amazonaws.com/filter_with_ai';
const CLARIFY = 'http://ec2-18-223-149-113.us-east-2.compute.amazonaws.com/clarify';
const IMG_POOL = [];
const clar = [];

form.addEventListener('change', () => {
    const file = upload.files[0];

    uploadPhoto(file);
});

domagic.addEventListener('click', () => {
    new Slide(0, 0, 0);
});

function uploadPhoto(file) {
    let formData = new FormData();
    formData.append("photo", file);
    return fetch(UPLOAD_URL, {method: "POST", body: formData})
        .then(res => res.text())
        .then(res => {
            fetch(`${CLARIFY}?url=${res}`).then(r => r.json()).then(r => {
                IMG_POOL.push(res);
                clar.push([...r.outputs[0].data.concepts.splice(0, 4).map(item => item.name)])

                new Slide('Looks like', clar[0], '... it was easy, isnt it?');
            });
            return res;
        })
        .then(res => fetch(`${GET_PHOTO}?url=${res}`))
        .then(res => res.json())
        .then(res1 => {
            fetch(`${CLARIFY}?url=${res1.url}`).then(r => r.json()).then(r => {
                clar.push([...r.outputs[0].data.concepts.splice(0, 4).map(item => item.name)])

                //    new slide
                let canvas = document.querySelector('#canvas');
                let context = canvas.getContext('2d');
                context.fillStyle = '#ffe454';
                context.fillRect(0, 0, this.canvas.width, this.canvas.height);

                context.font = "bold 36px Verdana";
                context.fillStyle = 'black';
                context.fillText('How we expect it', 50, 50);
                context.fillText('to look like now…', 50, 90);
                context.font = "bold 42px Verdana";
                let startX = 140;
                for (let tag of clar[1]) {
                    context.fillText(tag, 60, startX);
                    startX += 60;
                }
                context.font = "normal 30px Verdana";
                context.fillText("... it was easy, isnt it?", 130, 470);

                let url = document.getElementById('canvas').toDataURL();
                urltoFile(url, 'img.png', 'image/png').then(res => {
                    let formData = new FormData();
                    formData.append("photo", res);
                    fetch(UPLOAD_URL, {method: "POST", body: formData})
                        .then(res => res.text())
                        .then(res => IMG_POOL.push(res))
                });

                //    new slide
                canvas = document.querySelector('#canvas');
                context = canvas.getContext('2d');
                context.fillStyle = '#ffe454';
                context.fillRect(0, 0, this.canvas.width, this.canvas.height);

                context.font = "bold 36px Verdana";
                context.fillStyle = 'black';
                context.fillText('How do you think it ', 50, 50);
                context.fillText('should look like?', 50, 90);
                context.fillText('TA-DAAAAAM!!!!', 50, 150);

                url = document.getElementById('canvas').toDataURL();
                return urltoFile(url, 'img.png', 'image/png').then(res => {
                    let formData = new FormData();
                    formData.append("photo", res);
                    return fetch(UPLOAD_URL, {method: "POST", body: formData})
                        .then(res => res.text())
                        .then(res => IMG_POOL.push(res))
                        .then(() => {
                            IMG_POOL.push(res1.url);

                            let str = '';

                            IMG_POOL.forEach((item, i, arr) => {
                                if (i === arr.length - 1) {
                                    str += item;
                                } else {
                                    str += `${item},`
                                }
                            });

                            fetch(`${CREATE_GIF}?urls=${str}`).then(res => res.json()).then(res => res.url).then(res => {
                                fetch(`${PUBLISH}?url=${res}`)
                            });
                        })
                });
            });

            return res1.url;
        })
        .then(() => {

            console.log(IMG_POOL);
            console.log(clar)
        })
}

class Slide {
    constructor(title, tagsArray, footer) {
        this.title = title;
        this.tagsArray = tagsArray;
        this.footer = footer;

        this.canvas = document.querySelector('#canvas');
        this.context = this.canvas.getContext('2d');
        this.context.fillStyle = '#ffe454';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawText(this.title, this.tagsArray, this.footer);
    }

    drawText(title, tags, footer) {
        this.context.font = "bold 36px Verdana";
        this.context.fillStyle = 'black';
        this.context.fillText(title, 50, 50);
        this.context.font = "bold 42px Verdana";
        let startX = 130;
        for (let tag of tags) {
            this.context.fillText(tag, 150, startX);
            startX += 60;
        }
        this.context.font = "normal 30px Verdana";
        this.context.fillText("... it was easy, isnt it?", 130, 470);

        let url = document.getElementById('canvas').toDataURL();
        urltoFile(url, 'img.png', 'image/png').then(res => {
            let formData = new FormData();
            formData.append("photo", res);
            return fetch(UPLOAD_URL, {method: "POST", body: formData})
                .then(res => res.text())
                .then(res => IMG_POOL.push(res))
                .then(() => {
                    let newCtx = this.canvas.getContext('2d');
                    newCtx.fillStyle = '#ffe454';
                    newCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);

                    this.context.font = "bold 36px Verdana";
                    this.context.fillStyle = 'black';
                    this.context.fillText('Now let us', 100, 50);
                    this.context.fillText('do some magic', 100, 90);
                    this.context.fillText('for you', 100, 130);

                    let url = document.getElementById('canvas').toDataURL();
                    urltoFile(url, 'img.png', 'image/png').then(res => {
                        let formData = new FormData();
                        formData.append("photo", res);
                        return fetch(UPLOAD_URL, {method: "POST", body: formData})
                            .then(res => res.text())
                            .then(res => IMG_POOL.push(res))
                    })
                });
        })
    }
}

function urltoFile(url, filename, mimeType) {
    return (fetch(url)
            .then(function (res) {
                return res.arrayBuffer();
            })
            .then(function (buf) {
                return new File([buf], filename, {type: mimeType});
            })
    );
}

function drawSlides(tags) {


}