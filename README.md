# Linear Algebra Image Compression Tool

This project is a web-based image compression tool that demonstrates how **Singular Value Decomposition (SVD)** — a fundamental linear algebra technique — can be applied to compress images by reducing their rank.

Users can upload an image, select the number of singular values \( k \) to retain, and download the compressed version. A singular value plot is also provided to visualize information density.

---

## Tech Stack

- **Frontend**: React
- **Backend**: Python (Flask)
- **Libraries**:
  - NumPy (for matrix operations)
  - Pillow (image manipulation)
  - Matplotlib (plotting singular values)
  - Flask-CORS (handling cross-origin requests)

---

## How It Works

1. User uploads an image via the React frontend.
2. Image is sent to the Flask backend.
3. Image is:
   - Converted into pixel matrices (R, G, B channels)
   - Decomposed using **SVD**: \( A = U \Sigma V^T \)
   - Truncated to top-`k` singular values
   - Reconstructed as a low-rank approximation
4. The backend returns:
   - The compressed image
   - A plot of the singular values used
   - Both are zipped and sent back to the frontend

---

## Run Locally

### 1. Clone the repo
```bash
git clone https://github.com/your-username/linear-algebra-image-compression.git
cd linear-algebra-image-compression

