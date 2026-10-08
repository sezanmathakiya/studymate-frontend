
import { useEffect, useState } from "react";
import API_URL from "../api.js";
function FileUpload() {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const fetchFiles = async () => {
    setFetching(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/files`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to fetch files`);
      }

      setFiles(data.files || []);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file first");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_URL}/api/files/upload`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      setMessage("File uploaded successfully!");
      setFile(null);
      e.target.reset();

      await fetchFiles();
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const formatSize = (bytes) => {
    if (!bytes) return "0 KB";
    return (bytes / 1024).toFixed(2) + " KB";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            File Management
          </h1>
          <p className="mt-2 text-gray-600">
            Upload and manage your study files.
          </p>
        </div>

        {/* Upload Form */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Upload New File
          </h2>

          <form onSubmit={handleUpload}>
            <label className="mb-2 block font-medium text-gray-700">
              Select File
            </label>

            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0] || null)}
              className="mb-4 block w-full rounded-lg border border-gray-300 p-3 text-sm"
            />

            <p className="mb-4 text-sm text-gray-500">
              Maximum file size: 5 MB
            </p>

            {file && (
              <p className="mb-4 text-sm text-gray-700">
                Selected: {file.name}
              </p>
            )}

            {error && (
              <p className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
                {error}
              </p>
            )}

            {message && (
              <p className="mb-4 rounded-lg bg-green-100 p-3 text-sm text-green-700">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !file}
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Uploading..." : "Upload File"}
            </button>
          </form>
        </div>

        {/* Uploaded Files */}
        <div className="rounded-xl bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              My Uploaded Files
            </h2>

            <button
              onClick={fetchFiles}
              disabled={fetching}
              className="rounded-lg bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300 disabled:opacity-50"
            >
              Refresh
            </button>
          </div>

          {fetching ? (
            <p className="py-6 text-center text-gray-500">
              Loading files...
            </p>
          ) : files.length === 0 ? (
            <p className="py-6 text-center text-gray-500">
              No files uploaded yet.
            </p>
          ) : (
            <div className="space-y-3">
              {files.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col justify-between gap-3 rounded-lg border border-gray-200 p-4 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0">
                    <p className="break-words font-medium text-gray-800">
                      {item.originalName}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {formatSize(item.size)}
                    </p>
                  </div>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 rounded-lg bg-green-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-green-700"
                  >
                    Open File
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FileUpload;






