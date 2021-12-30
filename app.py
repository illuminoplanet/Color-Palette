import http
from flask import Flask, render_template, request
from models.image_processing import *

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/upload", methods=["GET", "POST"])
def upload():
    if request.method == "POST":
        image_data = request.get_data()
        save_image(image_data, "static/image/uploaded_image.jpg")

    return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)
