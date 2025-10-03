"use client";

import React from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface DarkModeToggleProps {
  size?: "sm" | "md" | "lg";
  variant?: "button" | "dropdown" | "switch";
  showLabel?: boolean;
}

export default function DarkModeToggle({
  size = "md",
  variant = "button",
  showLabel = false,
}: DarkModeToggleProps) {
  const { theme, toggleTheme, setTheme } = useTheme();

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const buttonSizes = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-2.5",
  };

  // Simple toggle button
  if (variant === "button") {
    return (
      <button
        onClick={toggleTheme}
        className={`
          ${buttonSizes[size]}
          inline-flex items-center justify-center
          rounded-lg border border-gray-300 dark:border-gray-600
          bg-white dark:bg-gray-800
          text-gray-700 dark:text-gray-200
          hover:bg-gray-50 dark:hover:bg-gray-700
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          transition-colors duration-200
          ${showLabel ? "space-x-2" : ""}
        `}
        title={
          theme === "light" ? "Switch to dark mode" : "Switch to light mode"
        }
      >
        {theme === "light" ? (
          <Moon className={iconSizes[size]} />
        ) : (
          <Sun className={iconSizes[size]} />
        )}
        {showLabel && (
          <span className="text-sm font-medium">
            {theme === "light" ? "Dark" : "Light"}
          </span>
        )}
      </button>
    );
  }

  // Switch toggle
  if (variant === "switch") {
    return (
      <div className="flex items-center space-x-3">
        {showLabel && (
          <div className="flex items-center space-x-2">
            <Sun className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Light
            </span>
          </div>
        )}

        <button
          onClick={toggleTheme}
          className={`
            relative inline-flex h-6 w-11 items-center rounded-full
            transition-colors duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            ${theme === "dark" ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"}
          `}
          role="switch"
          aria-checked={theme === "dark"}
        >
          <span
            className={`
              inline-block h-4 w-4 transform rounded-full bg-white
              transition-transform duration-200 ease-in-out
              ${theme === "dark" ? "translate-x-6" : "translate-x-1"}
            `}
          />
        </button>

        {showLabel && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Dark
            </span>
            <Moon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </div>
        )}
      </div>
    );
  }

  // Dropdown with system option
  if (variant === "dropdown") {
    const [isOpen, setIsOpen] = React.useState(false);

    const options = [
      { value: "light", label: "Light", icon: Sun },
      { value: "dark", label: "Dark", icon: Moon },
      { value: "system", label: "System", icon: Monitor },
    ];

    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            ${buttonSizes[size]}
            inline-flex items-center justify-center
            rounded-lg border border-gray-300 dark:border-gray-600
            bg-white dark:bg-gray-800
            text-gray-700 dark:text-gray-200
            hover:bg-gray-50 dark:hover:bg-gray-700
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            transition-colors duration-200
            ${showLabel ? "space-x-2 px-3" : ""}
          `}
        >
          {theme === "light" ? (
            <Sun className={iconSizes[size]} />
          ) : (
            <Moon className={iconSizes[size]} />
          )}
          {showLabel && (
            <span className="text-sm font-medium capitalize">{theme}</span>
          )}
        </button>

        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown menu */}
            <div className="absolute right-0 z-20 mt-2 w-48 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                {options.map((option) => {
                  const Icon = option.icon;
                  const isActive =
                    theme === option.value ||
                    (option.value === "system" &&
                      !localStorage.getItem("naijaconnect-theme"));

                  return (
                    <button
                      key={option.value}
                      onClick={() => {
                        if (option.value === "system") {
                          // Remove theme from localStorage to use system preference
                          localStorage.removeItem("naijaconnect-theme");
                          const prefersDark = window.matchMedia(
                            "(prefers-color-scheme: dark)"
                          ).matches;
                          setTheme(prefersDark ? "dark" : "light");
                        } else {
                          setTheme(option.value as "light" | "dark");
                        }
                        setIsOpen(false);
                      }}
                      className={`
                        flex w-full items-center px-4 py-2 text-sm
                        ${
                          isActive
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }
                        transition-colors duration-150
                      `}
                    >
                      <Icon className="mr-3 h-4 w-4" />
                      <span>{option.label}</span>
                      {isActive && (
                        <div className="ml-auto h-2 w-2 rounded-full bg-blue-600" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return null;
}
