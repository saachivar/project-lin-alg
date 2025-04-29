import { useState } from 'react';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [compressedImgUrl, setCompressedImgUrl] = useState(null);
  const [compressionLevel, setCompressionLevel] = useState(50);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('k', compressionLevel);

    const res = await fetch('http://localhost:5000/compress', {
      method: 'POST',
      body: formData,
    });

    const blob = await res.blob();
    setCompressedImgUrl(URL.createObjectURL(blob));
  };

  return (
    <div className="App">
      <h1>Image Compression Tool</h1>
      <input type="file" onChange={handleFileChange} />
      <br />
      <label>Compression Level (k): {compressionLevel}</label>
      <input
        type="range"
        min="1"
        max="100"
        value={compressionLevel}
        onChange={(e) => setCompressionLevel(e.target.value)}
      />
      <br />
      <button onClick={handleUpload}>Compress</button>

      {compressedImgUrl && (
        <div>
          <h2>Compressed Image:</h2>
          <img src={compressedImgUrl} alt="Compressed" />
        </div>
      )}
    </div>
  );
}

export default App;
