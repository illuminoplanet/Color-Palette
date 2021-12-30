function dropHandler(event) {
    event.preventDefault();

    const reader = new FileReader();
    reader.readAsDataURL(event.dataTransfer.files[0]);
    reader.onload = function () {
        fetch("https://www.onsemiro.cloud/flask/upload",
            {
                method: 'POST',
                body: reader.result
            }
        );
    };
}

function dragOverHandler(event) {
    event.preventDefault();
}