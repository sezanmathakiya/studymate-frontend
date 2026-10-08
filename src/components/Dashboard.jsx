
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [progress, setProgress] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login", { replace: true });
          return;
        }

        const response = await fetch("/api/tasks/progress", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to load progress");
        }

        setProgress(result);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchProgress();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Student Dashboard
          </h1>

          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        {error && (
          <p className="text-red-600 bg-red-100 p-3 rounded-md mb-4">
            {error}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">
              Subjects
            </h2>

            <button
              onClick={() => navigate("/subjects")}
              className="text-blue-600 font-medium hover:underline"
            >
              View Subjects
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">
              Tasks
            </h2>

            <button
              onClick={() => navigate("/tasks")}
              className="text-blue-600 font-medium hover:underline"
            >
              View Tasks
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">
              Progress
            </h2>

            {progress ? (
              <>
                <p className="text-3xl font-bold text-green-600">
                  {progress.completionPercentage}%
                </p>

                <p className="text-sm text-gray-600 mt-2">
                  Completed: {progress.completedTasks} / {progress.totalTasks}
                </p>

                <p className="text-sm text-gray-600">
                  Pending: {progress.pendingTasks}
                </p>

                <p className="text-sm text-gray-600">
                  In Progress: {progress.inProgressTasks}
                </p>

                <button
                  onClick={() => navigate("/progress")}
                  className="text-blue-600 font-medium hover:underline mt-3"
                >
                  View Progress
                </button>
              </>
            ) : error ? null : (
              <p className="text-gray-500">Loading progress...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;