import { useState } from "react";

const BACKEND = "http://localhost:5000";

function App() {
  const [url, setUrl] = useState("");
  const [shortLink, setShortLink] = useState("");
  type Stats = {
    original: string;
    totalClicks: number;
  };
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  const handleShorten = async () => {
    if (!url) {
      setError("Enter a URL");
      return;
    }
    try {
      const res = await fetch(`${BACKEND}/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (res.ok) {
        setShortLink(data.shortUrl);
        setStats(null);
        setError("");
      } else {
        setError(data.error);
      }
    } catch {
      setError("Backend not reachable");
    }
  };

  const handleStats = async () => {
    if (!shortLink) return;
    const code = shortLink.split("/").pop();
    const res = await fetch(`${BACKEND}/stats/${code}`);
    const data = await res.json();
    if (res.ok || res.status === 200) setStats(data);
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4">
  <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-2xl border border-blue-50">
    <h1 className="text-4xl font-extrabold text-center text-blue-600 mb-8 tracking-tight drop-shadow-md">
      URL Shortener
    </h1>

    <input
      type="text"
      placeholder="Enter long URL"
      value={url}
      onChange={(e) => setUrl(e.target.value)}
      className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition-shadow mb-2 bg-blue-50 placeholder-gray-400 text-gray-700 break-words"
    />

    <button
      onClick={handleShorten}
      className="w-full mt-4 bg-blue-500 from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white py-3 rounded-lg font-semibold transition duration-150 shadow-md"
    >
      Shorten
    </button>

    {error && (
      <p className="text-red-500 mt-3 text-center font-medium drop-shadow-sm">
        {error}
      </p>
    )}

    {shortLink && (
      <div className="mt-8 p-5 border border-purple-200 rounded-lg bg-purple-50 shadow-sm break-words">
        <p className="mb-2 text-gray-800">
          <span className="font-semibold text-blue-600">Short URL:</span>{" "}
          <a
            href={shortLink}
            target="_blank"
            rel="noreferrer"
            className="text-blue-700 hover:text-blue-900 hover:underline font-medium transition-colors break-words"
          >
            {shortLink}
          </a>
        </p>
        <button
          onClick={handleStats}
          className="mt-3 w-full bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 text-white py-2 rounded-lg font-medium transition-colors shadow"
        >
          View Stats
        </button>
      </div>
    )}

    {stats && (
      <div className="mt-8 p-5 border border-indigo-200 rounded-lg bg-indigo-50 shadow-md break-words">
        <h2 className="text-lg font-bold mb-4 text-indigo-700">Stats</h2>
        <p>
          <span className="font-medium text-indigo-600">Original URL:</span>{" "}
          <span className="break-words">{stats.original}</span>
        </p>
        <p>
          <span className="font-medium text-indigo-600">Total Clicks:</span>{" "}
          {stats.totalClicks}
        </p>
      </div>
    )}
  </div>
</div>

);

}

export default App;
