"use client";
import { useState } from "react";

export default function Settings() {
  const [password, setPassword] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState("Default");

  const handleSave = async () => {
    alert("Settings saved! (Backend update required)");
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">⚙️ Settings</h2>

      <label className="block">New Password:</label>
      <input
        type="password"
        className="w-full p-2 border rounded mt-1"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <label className="block mt-4">Theme:</label>
      <select
        className="w-full p-2 border rounded mt-1"
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
      >
        <option>Default</option>
        <option>Dark</option>
        <option>Light</option>
      </select>

      <div className="mt-4 flex items-center">
        <input
          type="checkbox"
          checked={notifications}
          onChange={() => setNotifications(!notifications)}
        />
        <span className="ml-2">Enable Notifications</span>
      </div>

      <button
        onClick={handleSave}
        className="mt-4 p-2 bg-blue-500 text-white rounded"
      >
        Save Changes
      </button>
    </div>
  );
}
