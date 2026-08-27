from flask import Flask, jsonify
import requests

app = Flask(__name__)


@app.get("/api/ip")
def get_ip():

    try:

        response = requests.get(
            "https://ipapi.co/json/",
            timeout=10
        )

        response.raise_for_status()

        return jsonify(
            response.json()
        )

    except requests.RequestException:

        return jsonify({
            "error": True,
            "message": "Lookup failed"
        }), 500


if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )
