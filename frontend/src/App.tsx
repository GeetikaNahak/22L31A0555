import { useState } from "react";
import axios from "axios";
const BACKEND = "http://localhost:5000";
const LOGGING = "http://localhost:6000/log";
interface ShortenResponse {
  shortlink: string;
  expiry: string;
}
interface StatsResponse {
  originalUrl: string;
  clicks: number;
  expiry: string;
}
export default function App() {
  const [url, setUrl] = useState<string>("");
  const [validity, setValidity] = useState<number>(7);
  const [shortcode, setShortcode] = useState<string>("");
  const [shortlink, setShortlink] = useState<string>("");
  const [expiry, setExpiry] = useState<string>("");
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const handleSubmit = async () => {
    try {
      const res = await axios.post<ShortenResponse>(`${BACKEND}/shorten`, {
        url,
        validity,
        shortcode,
      });
      setShortlink(res.data.shortlink);
      setExpiry(res.data.expiry);
      await axios.post(LOGGING, {
        stack: "frontend",
        level: "info",
        package: "url-shortener-ui",
        message: "User created a short URL",
      });
    } catch (error) {
      console.error("Error creating short URL:", error);
    }
  };
  const getStats = async () => {
    if (!shortcode) return;
    try {
      const res = await axios.get<StatsResponse>(
        `${BACKEND}/stats/${shortcode}`
      );
      setStats(res.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };
  return (
    <div className="p-6 max-w-md mx-auto">
      {" "}
      <h1 className="text-2xl font-bold">URL Shortener</h1>{" "}
      <input
        className="border p-2 w-full mt-2"
        placeholder="Enter URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />{" "}
      <input
        className="border p-2 w-full mt-2"
        type="number"
        placeholder="Validity (days)"
        value={validity}
        onChange={(e) => setValidity(Number(e.target.value))}
      />{" "}
      <input
        className="border p-2 w-full mt-2"
        placeholder="Custom shortcode (optional)"
        value={shortcode}
        onChange={(e) => setShortcode(e.target.value)}
      />{" "}
      <button
        className="bg-blue-500 text-white px-4 py-2 mt-3 rounded"
        onClick={handleSubmit}
      >
        {" "}
        Shorten{" "}
      </button>{" "}
      {shortlink && (
        <div className="mt-4">
          {" "}
          <p>
            {" "}
            Shortlink:{" "}
            <a href={shortlink} target="_blank" rel="noopener noreferrer">
              {" "}
              {shortlink}{" "}
            </a>{" "}
          </p>{" "}
          <p>Expiry: {new Date(expiry).toLocaleString()}</p>{" "}
        </div>
      )}{" "}
      <button
        className="bg-purple-500 text-white px-4 py-2 mt-3 rounded"
        onClick={getStats}
      >
        {" "}
        Get Stats{" "}
      </button>{" "}
      {stats && (
        <div className="mt-4 border p-3 rounded">
          {" "}
          <p>Original URL: {stats.originalUrl}</p> <p>Clicks: {stats.clicks}</p>{" "}
          <p>Expiry: {new Date(stats.expiry).toLocaleString()}</p>{" "}
        </div>
      )}{" "}
    </div>
  );
}
