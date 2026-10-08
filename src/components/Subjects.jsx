
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api.js";
function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSubjects() {
      try {
        const response = await fetch(`${API_URL}/api/subjects`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || `Failed to load subjects`);
        }

        setSubjects(result.subjects || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSubjects();
  }, [token]);

  async function handleAddSubject(e) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Subject name is required");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/subjects/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ name: name.trim() }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to add subject");
      }

      setSubjects((prev) => [...prev, result.subject]);
      setName("");
    } catch (err) {
      setError(err.message);
    }
  }

  function startEdit(subject) {
    setEditingId(subject._id);
    setEditName(subject.name);
    setError("");
  }

  async function handleUpdateSubject(id) {
    setError("");

    if (!editName.trim()) {
      setError("Subject name is required");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/subjects/${id}`,  {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ name: editName.trim() }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update subject");
      }

      setSubjects((prev) =>
        prev.map((subject) =>
          subject._id === id
            ? { ...subject, name: editName.trim() }
            : subject
        )
      );

      setEditingId(null);
      setEditName("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteSubject(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this subject?"
    );

    if (!confirmed) return;

    setError("");

    try {
      const response = await fetch(`${API_URL}/api/subjects/${id}`,  {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete subject");
      }

      setSubjects((prev) =>
        prev.filter((subject) => subject._id !== id)
      );
    } catch (err) {
      setError(err.message);
    }
  }

  function openSubject(subject) {
    navigate(`/tasks?subject=${subject._id}`);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between gap-3">
          <h1 className="text-3xl font-bold text-gray-800">
            My Subjects
          </h1>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="rounded-lg bg-gray-700 px-4 py-2 text-white hover:bg-gray-800"
          >
            Dashboard
          </button>
        </div>

        <form
          onSubmit={handleAddSubject}
          className="mb-6 flex flex-wrap gap-3 rounded-lg bg-white p-5 shadow"
        >
          <input
            type="text"
            placeholder="Enter subject name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-2"
          />

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
            Add Subject
          </button>
        </form>

        {error && (
          <p className="mb-4 text-red-600">{error}</p>
        )}

        {loading ? (
          <p>Loading subjects...</p>
        ) : subjects.length === 0 ? (
          <p className="rounded-lg bg-white p-5 text-gray-600 shadow">
            No subjects added yet.
          </p>
        ) : (
          <div className="space-y-3">
            {subjects.map((subject) => (
              <div
                key={subject._id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-white p-4 shadow"
              >
                {editingId === subject._id ? (
                  <>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2"
                    />

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleUpdateSubject(subject._id)}
                        className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                      >
                        Save
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => openSubject(subject)}
                      className="text-left font-medium text-blue-600 hover:underline"
                    >
                      {subject.name}
                    </button>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(subject)}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteSubject(subject._id)}
                        className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Subjects;








