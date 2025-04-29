from flask import Flask, request, send_file
from flask_cors import CORS
from PIL import Image
import numpy as np
import os

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/compress', methods=['POST'])
def compress():
    file = request.files['file']
    k = int(request.form.get('k', 50))  # Default to 50 singular values

    # Save uploaded file
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    # Open and process the image
    img = Image.open(filepath).convert('L')  # Grayscale
    img_array = np.array(img)

    # Compress using SVD
    U, S, Vt = np.linalg.svd(img_array, full_matrices=False)
    S[k:] = 0
    compressed = (U @ np.diag(S) @ Vt)
    compressed = np.clip(compressed, 0, 255).astype('uint8')

    # Save compressed image
    compressed_img = Image.fromarray(compressed)
    compressed_path = os.path.join(UPLOAD_FOLDER, 'compressed_' + file.filename)
    compressed_img.save(compressed_path)

    return send_file(compressed_path, mimetype='image/jpeg')

if __name__ == '__main__':
    app.run(debug=True)
