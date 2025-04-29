from flask import Flask, request, send_file
from flask_cors import CORS, cross_origin
from PIL import Image
import numpy as np
import os

app = Flask(__name__)
CORS(app, resources={r"/compress": {"origins": "http://localhost:3000"}})

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def compress_image(img_array, k):
    U, S, Vt = np.linalg.svd(img_array, full_matrices=False)
    U_k = U[:, :k]
    S_k = np.diag(S[:k])
    Vt_k = Vt[:k, :]
    compressed = U_k @ S_k @ Vt_k
    compressed = np.clip(compressed, 0, 255)
    return compressed.astype('uint8')

@app.route('/compress', methods=['POST'])
@cross_origin(origin='*', headers=['Content-Type', 'application/json'], supports_credentials=True)
def compress():
    file = request.files['file']
    k = int(request.form.get('k', 50))  # Default to 50 singular values

    # Save uploaded file
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    # Open image as RGB
    img = Image.open(filepath).convert('RGB')
    r, g, b = img.split()
    r = np.array(r)
    g = np.array(g)
    b = np.array(b)

    # Compress each channel
    r_comp = compress_image(r, k)
    g_comp = compress_image(g, k)
    b_comp = compress_image(b, k)

    # Recombine
    compressed_img = Image.merge("RGB", (
        Image.fromarray(r_comp),
        Image.fromarray(g_comp),
        Image.fromarray(b_comp)
    ))

    # Save compressed image
    compressed_path = os.path.join(UPLOAD_FOLDER, 'compressed_' + file.filename)
    compressed_img.save(compressed_path)

    return send_file(compressed_path, mimetype='image/jpeg')

if __name__ == '__main__':
    app.run(debug=True)
