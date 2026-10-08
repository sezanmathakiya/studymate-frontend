import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API_URL from "../api.js";

function Tasks() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const subjectId = searchParams.get("subject");
  const token = localStorage.getItem("token");

  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [removeMaterial, setRemoveMaterial] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [previewFile, setPreviewFile] = useState(null);
  const [deletingMaterialId, setDeletingMaterialId] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    dueDate: "",
    subject: subjectId || "",
  });

  const [filters, setFilters] = useState({
    status: "",
    priority: "",
  });

  async function loadSubjects() {
    const response = await fetch(`${API_URL}/api/subjects`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Subjects load failed");
    }

    setSubjects(result.subjects || []);
  }

  async function loadTasks() {
    const params = new URLSearchParams();

    if (subjectId) {
      params.set("subject", subjectId);
    }

    if (filters.status) {
      params.set("status", filters.status);
    }

    if (filters.priority) {
      params.set("priority", filters.priority);
    }

    const query = params.toString();

    const response = await fetch(
      `${API_URL}/api/tasks${query ? `?${query}` : ""}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Tasks load failed");
    }

    setTasks(result.tasks || []);
  }

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    async function loadData() {
      setLoading(true);
      setError("");

      try {
        await Promise.all([loadSubjects(), loadTasks()]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [subjectId, filters.status, filters.priority]);

  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ];

    const allowedExtensions = /\.(pdf|doc|docx|ppt|pptx)$/i;

    if (
      !allowedTypes.includes(file.type) ||
      !allowedExtensions.test(file.name)
    ) {
      setError("Only PDF, DOC, DOCX, PPT and PPTX files are allowed.");
      e.target.value = "";
      setSelectedFile(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be 5 MB or less.");
      e.target.value = "";
      setSelectedFile(null);
      return;
    }

    setError("");
    setSuccess("");
    setSelectedFile(file);
    setRemoveMaterial(false);
  }

  function resetForm() {
    setForm({
      title: "",
      description: "",
      status: "pending",
      priority: "medium",
      dueDate: "",
      subject: subjectId || "",
    });

    setSelectedFile(null);
    setRemoveMaterial(false);
    setEditingId(null);
    setFileInputKey((prev) => prev + 1);
  }

  async function uploadMaterial() {
    if (!selectedFile) {
      return null;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    const response = await fetch(`${API_URL}/api/files/upload`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Material upload failed");
    }

    if (!result.file?._id) {
      throw new Error("Upload succeeded but file ID was not returned.");
    }

    return result.file._id;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.title.trim()) {
      setError("Task title is required.");
      return;
    }

    if (!form.subject) {
      setError("Please select a subject.");
      return;
    }

    setSaving(true);

    let uploadedMaterialId = null;
    let taskSaved = false;

    try {
      uploadedMaterialId = await uploadMaterial();

      let materialId = uploadedMaterialId;

      if (!selectedFile && editingId) {
        const currentTask = tasks.find(
          (task) => task._id === editingId
        );

        materialId = removeMaterial
          ? null
          : currentTask?.material?._id ||
            currentTask?.material ||
            null;
      }

      const url = editingId
        ? `${API_URL}/api/tasks/${editingId}`
        : `${API_URL}/api/tasks/create`;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          ...form,
          title: form.title.trim(),
          description: form.description.trim(),
          dueDate: form.dueDate || null,
          material: materialId,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Task save failed");
      }

      taskSaved = true;

      const wasEditing = Boolean(editingId);

      resetForm();

      await loadTasks();

      setSuccess(
        wasEditing
          ? "Task updated successfully!"
          : "Task created successfully!"
      );
    } catch (err) {
      if (uploadedMaterialId && !taskSaved) {
        try {
          await fetch(`${API_URL}/api/files/${uploadedMaterialId}`, {
            method: "DELETE",
            headers: {
              Authorization: "Bearer " + token,
            },
          });
        } catch {
          // Preserve the original error.
        }
      }

      setError(err.message || "Unable to save task.");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(task) {
    setEditingId(task._id);

    setForm({
      title: task.title || "",
      description: task.description || "",
      status: task.status || "pending",
      priority: task.priority || "medium",
      dueDate: task.dueDate
        ? new Date(task.dueDate).toISOString().slice(0, 10)
        : "",
      subject: task.subject?._id || task.subject || "",
    });

    setSelectedFile(null);
    setRemoveMaterial(false);
    setFileInputKey((prev) => prev + 1);
    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function deleteMaterial(material) {
    if (!material?._id) {
      setError("Material file ID was not found.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${
        material.originalName || "this material"
      }"?`
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");
    setDeletingMaterialId(material._id);

    try {
      const response = await fetch(
        `${API_URL}/api/files/${material._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Material delete failed");
      }

      if (previewFile?._id === material._id) {
        setPreviewFile(null);
      }

      await loadTasks();

      setSuccess("Study material deleted successfully!");
    } catch (err) {
      setError(err.message || "Unable to delete material.");
    } finally {
      setDeletingMaterialId(null);
    }
  }

  async function deleteTask(id) {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    setError("");
    setSuccess("");
    setDeletingTaskId(id);

    try {
      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Task delete failed");
      }

      if (editingId === id) {
        resetForm();
      }

      await loadTasks();

      setSuccess("Task deleted successfully!");
    } catch (err) {
      setError(err.message || "Unable to delete task.");
    } finally {
      setDeletingTaskId(null);
    }
  }

  function openMaterial(material) {
    if (!material?.url) {
      setError("Material URL not found.");
      return;
    }

    setPreviewFile(material);
  }

  const isPdf = (file) =>
    file?.mimeType === "application/pdf" ||
    /\.pdf$/i.test(file?.originalName || "");

  const isOfficeFile = (file) =>
    /\.(doc|docx|ppt|pptx)$/i.test(file?.originalName || "");

  const getInlineUrl = (file) => {
    if (!file?.url) {
      return "";
    }

    if (isPdf(file) && file.url.includes("/upload/")) {
      return file.url.replace("/upload/", "/upload/fl_inline/");
    }

    return file.url;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-8">
      <div className="mx-auto max-w-5xl space-y-6">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              My Tasks
            </h1>

            <p className="mt-1 text-gray-600">
              Organize your study tasks and materials.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="rounded-xl bg-gray-800 px-5 py-2.5 font-medium text-white shadow transition hover:bg-gray-900"
          >
            ← Dashboard
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
          >
            {success}
          </div>
        )}

        {/* Add / Edit Task */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-lg sm:p-7"
        >
          <div className="flex items-center gap-3 border-b pb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
              {editingId ? "✏️" : "📝"}
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {editingId ? "Edit Task" : "Add New Task"}
              </h2>

              <p className="text-sm text-gray-500">
                Fill in the details of your study task.
              </p>
            </div>
          </div>

          {/* Task Title */}
          <div>
            <label
              htmlFor="title"
              className="mb-1.5 block text-sm font-semibold text-gray-700"
            >
              Task Title <span className="text-red-500">*</span>
            </label>

            <input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              maxLength={150}
              placeholder="e.g. Complete DBMS assignment"
              className="w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="mb-1.5 block text-sm font-semibold text-gray-700"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              maxLength={1000}
              placeholder="Enter task details..."
              className="w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Subject, Status, Priority and Due Date */}
          <div className="grid gap-4 sm:grid-cols-2">

            <div>
              <label
                htmlFor="subject"
                className="mb-1.5 block text-sm font-semibold text-gray-700"
              >
                Subject <span className="text-red-500">*</span>
              </label>

              <select
                id="subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-300 bg-white p-3 outline-none focus:border-blue-500"
              >
                <option value="">Select Subject</option>

                {subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="status"
                className="mb-1.5 block text-sm font-semibold text-gray-700"
              >
                Status
              </label>

              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 bg-white p-3 outline-none focus:border-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="priority"
                className="mb-1.5 block text-sm font-semibold text-gray-700"
              >
                Priority
              </label>

              <select
                id="priority"
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 bg-white p-3 outline-none focus:border-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="dueDate"
                className="mb-1.5 block text-sm font-semibold text-gray-700"
              >
                Due Date
              </label>

              <input
                id="dueDate"
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 bg-white p-3 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Study Material */}
          <div>
            <label
              htmlFor="material"
              className="mb-1.5 block text-sm font-semibold text-gray-700"
            >
              Study Material (Optional)
            </label>

            <input
              key={fileInputKey}
              id="material"
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx"
              aria-describedby="material-help"
              onChange={handleFileChange}
              className="w-full rounded-xl border border-gray-300 bg-white p-3 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-blue-100 file:px-4 file:py-2 file:font-semibold file:text-blue-700 hover:file:bg-blue-200"
            />

            <p
              id="material-help"
              className="mt-1 text-xs text-gray-500"
            >
              PDF, DOC, DOCX, PPT and PPTX. Maximum size: 5 MB.
            </p>

            {selectedFile && (
              <p className="mt-2 break-all text-sm text-blue-700">
                Selected: {selectedFile.name}
              </p>
            )}

            {editingId &&
              tasks.find((task) => task._id === editingId)?.material && (
                <label className="mt-3 flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={removeMaterial}
                    onChange={(e) =>
                      setRemoveMaterial(e.target.checked)
                    }
                    className="h-4 w-4 accent-red-600"
                  />

                  Remove existing material when updating
                </label>
              )}
          </div>

          {/* Form Buttons */}
          <div className="flex flex-wrap gap-3 border-t pt-4">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Task"
                : "Create Task"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="rounded-xl bg-gray-200 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-300 disabled:opacity-60"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Your Tasks */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Your Tasks
              </h2>

              <p className="text-sm text-gray-500">
                Manage and track your study activities.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                aria-label="Filter by status"
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    status: e.target.value,
                  }))
                }
                className="rounded-xl border border-gray-300 bg-white p-2.5 text-sm outline-none focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <select
                aria-label="Filter by priority"
                value={filters.priority}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    priority: e.target.value,
                  }))
                }
                className="rounded-xl border border-gray-300 bg-white p-2.5 text-sm outline-none focus:border-blue-500"
              >
                <option value="">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow">
              Loading tasks...
            </div>
          ) : tasks.length === 0 ? (
            <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center shadow">
              <div className="mb-3 text-5xl">📋</div>

              <h3 className="font-semibold text-gray-800">
                No tasks found
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Add a new task to get started.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {tasks.map((task) => (
                <article
                  key={task._id}
                  className="space-y-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="break-words text-lg font-bold text-gray-800">
                      {task.title}
                    </h3>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                        task.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : task.status === "in-progress"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {task.status === "in-progress"
                        ? "In Progress"
                        : (task.status || "pending")
                            .charAt(0)
                            .toUpperCase() +
                          (task.status || "pending").slice(1)}
                    </span>
                  </div>

                  {task.description && (
                    <p className="whitespace-pre-wrap break-words text-sm text-gray-600">
                      {task.description}
                    </p>
                  )}

                  <div className="space-y-1.5 text-sm text-gray-600">
                    <p>
                      <span className="font-semibold text-gray-700">
                        Subject:
                      </span>{" "}
                      {task.subject?.name || "Unknown"}
                    </p>

                    <p>
                      <span className="font-semibold text-gray-700">
                        Priority:
                      </span>{" "}
                      <span
                        className={
                          task.priority === "high"
                            ? "font-semibold text-red-600"
                            : task.priority === "medium"
                            ? "font-semibold text-amber-600"
                            : "font-semibold text-green-600"
                        }
                      >
                        {(task.priority || "medium")
                          .charAt(0)
                          .toUpperCase() +
                          (task.priority || "medium").slice(1)}
                      </span>
                    </p>

                    <p>
                      <span className="font-semibold text-gray-700">
                        Due Date:
                      </span>{" "}
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : "Not set"}
                    </p>

                    {/* Email Reminder Status */}
                    <p>
                      <span className="font-semibold text-gray-700">
                        Email Reminder:
                      </span>{" "}
                      {task.status === "completed" ? (
                        <span className="font-semibold text-gray-500">
                          Not required
                        </span>
                      ) : task.reminderSent ? (
                        <span className="font-semibold text-green-600">
                          ✓ Email Sent
                        </span>
                      ) : (
                        <span className="font-semibold text-amber-600">
                          ⏳ Pending
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Attached Material */}
                  {task.material?.url && (
                    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 p-3">
                      <span className="text-2xl">📄</span>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-gray-600">
                          Study Material
                        </p>

                        <p className="break-all text-sm font-medium text-gray-800">
                          {task.material.originalName ||
                            "Attached material"}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => openMaterial(task.material)}
                        className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                      >
                        View
                      </button>

                      <a
                        href={task.material.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={task.material.originalName || true}
                        className="rounded-lg border border-blue-300 bg-white px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                      >
                        Download
                      </a>

                      <button
                        type="button"
                        onClick={() => deleteMaterial(task.material)}
                        disabled={
                          deletingMaterialId === task.material._id
                        }
                        className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletingMaterialId === task.material._id
                          ? "Deleting..."
                          : "Delete Material"}
                      </button>
                    </div>
                  )}

                  <div className="flex gap-2 border-t pt-3">
                    <button
                      type="button"
                      onClick={() => startEdit(task)}
                      className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-600"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteTask(task._id)}
                      disabled={deletingTaskId === task._id}
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingTaskId === task._id
                        ? "Deleting..."
                        : "Delete Task"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Material Preview Modal */}
      {previewFile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-6"
          onClick={() => setPreviewFile(null)}
        >
          <div
            className="flex h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b p-4">
              <h3 className="min-w-0 truncate font-bold text-gray-800">
                {previewFile.originalName || "Material Preview"}
              </h3>

              <div className="flex shrink-0 items-center gap-2">
                <a
                  href={getInlineUrl(previewFile)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Open
                </a>

                <button
                  type="button"
                  onClick={() => setPreviewFile(null)}
                  className="rounded-lg bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300"
                >
                  Close ✕
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 bg-gray-100">
              {isPdf(previewFile) ? (
                <iframe
                  title="PDF Preview"
                  src={getInlineUrl(previewFile)}
                  className="h-full w-full"
                />
              ) : isOfficeFile(previewFile) ? (
                <iframe
                  title="Office Document Preview"
                  src={`https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(
                    previewFile.url
                  )}`}
                  className="h-full w-full"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
                  <p className="font-medium text-gray-700">
                    Preview is not available for this file.
                  </p>

                  <a
                    href={previewFile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                  >
                    Open File
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;

