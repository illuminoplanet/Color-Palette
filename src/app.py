from urllib.request import urlopen
from flask import Flask, render_template, jsonify, request
import threading

from model import get_color_pallete

app = Flask(__name__)
threads = {}


@app.route("/color-pallete", methods=["GET", "POST"])
def color_pallete():
    if request.method == "POST":
        blob = request.files["image"]
        color_pallete = get_color_pallete(blob)
        return jsonify(color_pallete)


@app.route("/")
def index():
    return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)

