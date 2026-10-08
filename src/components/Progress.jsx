
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Progress() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [overall, setOverall] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    async function loadProgress() {
      try {
        setLoading(true);
        setError("");

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [overallRes, subjectsRes, activityRes] =
          await Promise.all([
            fetch("/api/tasks/progress", { headers }),
            fetch("/api/tasks/progress/subjects", { headers }),
            fetch("/api/tasks/activity", { headers }),
          ]);

        const overallData = await overallRes.json();
        const subjectsData = await subjectsRes.json();
        const activityData = await activityRes.json();

        if (!overallRes.ok) {
          throw new Error(overallData.message || "Progress load failed");
        }

        if (!subjectsRes.ok) {
          throw new Error(subjectsData.message || "Subject progress failed");
        }

        if (!activityRes.ok) {
          throw new Error(activityData.message || "Activity load failed");
        }

        setOverall(overallData);
        setSubjects(subjectsData.subjects || []);
        setActivity(activityData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProgress();
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 text-center">
        Loading progress...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <p className="rounded-lg bg-red-100 p-4 text-red-700">
          {error}
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-4 rounded-lg bg-gray-700 px-4 py-2 text-white"
        >
          Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Progress
            </h1>
            <p className="mt-1 text-gray-600">
              Track your study performance
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-lg bg-gray-700 px-4 py-2 text-white hover:bg-gray-800"
          >
            Dashboard
          </button>
        </div>

        <section className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Overall Progress
          </h2>

          <div className="mb-2 flex items-center justify-between">
            <span className="text-gray-600">Completion</span>
            <span className="text-2xl font-bold text-blue-600">
              {overall?.completionPercentage ?? 0}%
            </span>
          </div>

          <div className="h-4 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{
                width: `${Math.min(
                  100,
                  Math.max(0, Number(overall?.completionPercentage) || 0)
                )}%`,
              }}
            />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Total", value: overall?.totalTasks ?? 0 },
              { label: "Completed", value: overall?.completedTasks ?? 0 },
              { label: "Pending", value: overall?.pendingTasks ?? 0 },
              { label: "In Progress", value: overall?.inProgressTasks ?? 0 },
            ].map((item) => (
              <div key={item.label} className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className="mt-1 text-2xl font-bold text-gray-800">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Subject-wise Progress
          </h2>

          {subjects.length === 0 ? (
            <p className="text-gray-500">No subject progress available.</p>
          ) : (
            <div className="space-y-5">
              {subjects.map((subject) => (
                <div key={subject.subjectId}>
                  <div className="mb-2 flex flex-wrap justify-between gap-2">
                    <span className="font-medium text-gray-800">
                      {subject.subjectName}
                    </span>
                    <span className="text-sm font-semibold text-blue-600">
                      {subject.completionPercentage ?? 0}%
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-green-500"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(
                            0,
                            Number(subject.completionPercentage) || 0
                          )
                        )}%`,
                      }}
                    />
                  </div>

                  <p className="mt-1 text-xs text-gray-500">
                    {subject.completedTasks} completed / {subject.totalTasks} total
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-3 text-xl font-semibold text-gray-800">
            Last 7 Days Activity
          </h2>

          <p className="mb-3 text-gray-600">
            Current streak:{" "}
            <span className="font-bold text-blue-600">
              {activity?.currentStreak ?? 0} days
            </span>
          </p>

          {Array.isArray(activity?.last7Days) ? (
            <div className="space-y-2">
              {activity.last7Days.map((day, index) => (
                <div
                  key={day.date || index}
                  className="flex flex-wrap justify-between gap-2 rounded-lg bg-gray-50 p-3 text-sm"
                >
                  <span className="text-gray-700">
                    {day.date || `Day ${index + 1}`}
                  </span>
                  <span className="font-medium text-gray-800">
                    {day.count ?? day.completedTasks ?? day.tasksCompleted ?? 0} tasks
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              Activity data is not available.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

export default Progress;