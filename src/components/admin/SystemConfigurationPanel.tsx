"use client";

import { useState, useEffect } from "react";

interface PlatformSetting {
  id: string;
  key: string;
  value: string;
  dataType: "STRING" | "NUMBER" | "BOOLEAN" | "JSON";
  category: "INVESTMENT" | "COMMISSION" | "LIMITS" | "FEATURES";
  description: string;
  updatedAt: Date;
  updater: {
    id: string;
    name: string;
    email: string;
  };
}

export default function SystemConfigurationPanel() {
  const [settings, setSettings] = useState<PlatformSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [needsInitialization, setNeedsInitialization] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, [categoryFilter]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (categoryFilter !== "all") {
        params.append("category", categoryFilter);
      }

      const response = await fetch(`/api/admin/settings?${params}`);
      if (!response.ok) throw new Error("Failed to fetch settings");

      const data = await response.json();
      setSettings(data.settings);
      setNeedsInitialization(data.settings.length === 0);
    } catch (error) {
      console.error("Error fetching settings:", error);
      alert("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleInitialize = async () => {
    if (!confirm("Initialize platform settings with default values?")) {
      return;
    }

    try {
      const response = await fetch("/api/admin/settings/initialize", {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to initialize settings");
      }

      alert("Settings initialized successfully");
      fetchSettings();
    } catch (error: any) {
      console.error("Error initializing settings:", error);
      alert(error.message || "Failed to initialize settings");
    }
  };

  const handleEdit = (setting: PlatformSetting) => {
    setEditingKey(setting.key);
    setEditValue(setting.value);
  };

  const handleSave = async (key: string) => {
    try {
      const response = await fetch(`/api/admin/settings/${key}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: editValue }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update setting");
      }

      alert("Setting updated successfully");
      setEditingKey(null);
      setEditValue("");
      fetchSettings();
    } catch (error: any) {
      console.error("Error updating setting:", error);
      alert(error.message || "Failed to update setting");
    }
  };

  const handleCancel = () => {
    setEditingKey(null);
    setEditValue("");
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "INVESTMENT":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "COMMISSION":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "LIMITS":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "FEATURES":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const renderValueInput = (setting: PlatformSetting) => {
    if (setting.dataType === "BOOLEAN") {
      return (
        <select
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="true">Enabled</option>
          <option value="false">Disabled</option>
        </select>
      );
    } else if (setting.dataType === "NUMBER") {
      return (
        <input
          type="number"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
      );
    } else if (setting.dataType === "JSON") {
      return (
        <textarea
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
        />
      );
    } else {
      return (
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
      );
    }
  };

  const formatValue = (value: string, dataType: string) => {
    if (dataType === "BOOLEAN") {
      return value === "true" ? "✓ Enabled" : "✗ Disabled";
    } else if (dataType === "NUMBER") {
      const num = parseFloat(value);
      if (value.includes(".")) {
        return `${num.toFixed(2)}`;
      }
      return new Intl.NumberFormat("en-NG").format(num);
    }
    return value;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          System Configuration
        </h2>
        {needsInitialization && (
          <button
            onClick={handleInitialize}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Initialize Settings
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Category:
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Categories</option>
            <option value="INVESTMENT">Investment</option>
            <option value="COMMISSION">Commission</option>
            <option value="LIMITS">Limits</option>
            <option value="FEATURES">Features</option>
          </select>
        </div>
      </div>

      {/* Settings List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            Loading settings...
          </div>
        ) : settings.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            {needsInitialization
              ? "No settings found. Click 'Initialize Settings' to set up default values."
              : "No settings found"}
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {settings.map((setting) => (
              <div
                key={setting.key}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {setting.key}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(
                          setting.category
                        )}`}
                      >
                        {setting.category}
                      </span>
                      <span className="px-2 py-1 text-xs font-mono bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded">
                        {setting.dataType}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {setting.description}
                    </p>

                    {editingKey === setting.key ? (
                      <div className="flex items-center space-x-3 mt-3">
                        {renderValueInput(setting)}
                        <button
                          onClick={() => handleSave(setting.key)}
                          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xl font-bold text-gray-900 dark:text-white">
                            {formatValue(setting.value, setting.dataType)}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Last updated by {setting.updater.name} on{" "}
                            {new Date(setting.updatedAt).toLocaleString()}
                          </div>
                        </div>
                        <button
                          onClick={() => handleEdit(setting)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
          ⚠️ Important Notes
        </h3>
        <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1 list-disc list-inside">
          <li>
            Changes to settings take effect immediately across the platform
          </li>
          <li>All setting changes are logged in the audit trail</li>
          <li>Some settings may require application restart to fully apply</li>
          <li>Boolean settings: true = Enabled, false = Disabled</li>
        </ul>
      </div>
    </div>
  );
}
