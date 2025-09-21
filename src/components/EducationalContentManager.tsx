"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Users,
  Clock,
  Filter,
  Search,
  ChevronDown,
  Save,
  X,
} from "lucide-react";

interface EducationalContent {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  audience: string;
  difficulty: string;
  readTime: number;
  published: boolean;
  featured: boolean;
  tags: string[];
  authorId: string;
  author?: {
    name: string;
    email: string;
  };
  views?: number;
  likes?: number;
  createdAt: string;
  updatedAt: string;
}

const categories = [
  { value: "INVESTING_BASICS", label: "Investing Basics" },
  { value: "PORTFOLIO_MANAGEMENT", label: "Portfolio Management" },
  { value: "RISK_ASSESSMENT", label: "Risk Assessment" },
  { value: "MARKET_ANALYSIS", label: "Market Analysis" },
  { value: "BUSINESS_PLANNING", label: "Business Planning" },
  { value: "FINANCIAL_LITERACY", label: "Financial Literacy" },
  { value: "TAX_PLANNING", label: "Tax Planning" },
  { value: "LEGAL_COMPLIANCE", label: "Legal Compliance" },
  { value: "STARTUP_FUNDING", label: "Startup Funding" },
  { value: "GROWTH_STRATEGIES", label: "Growth Strategies" },
];

const audiences = [
  { value: "INVESTORS", label: "Investors" },
  { value: "BUSINESS_OWNERS", label: "Business Owners" },
  { value: "BOTH", label: "Both" },
  { value: "GENERAL", label: "General" },
];

const difficulties = [
  { value: "BEGINNER", label: "Beginner" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" },
];

export default function EducationalContentManager() {
  const [contents, setContents] = useState<EducationalContent[]>([]);
  const [filteredContents, setFilteredContents] = useState<
    EducationalContent[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingContent, setEditingContent] =
    useState<EducationalContent | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterAudience, setFilterAudience] = useState("");
  const [filterPublished, setFilterPublished] = useState<boolean | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "INVESTING_BASICS",
    audience: "INVESTORS",
    difficulty: "BEGINNER",
    readTime: 5,
    published: false,
    featured: false,
    tags: "",
  });

  // Mock data for demonstration
  const mockContents: EducationalContent[] = [
    {
      id: "1",
      title: "Introduction to Investment Portfolio Diversification",
      description:
        "Learn the fundamentals of building a well-diversified investment portfolio to minimize risk and maximize returns.",
      content: `# Introduction to Investment Portfolio Diversification

Portfolio diversification is one of the most fundamental concepts in investing. It's the practice of spreading your investments across various asset classes, sectors, and geographical regions to reduce risk.

## Why Diversification Matters

When you diversify your portfolio, you're essentially not putting all your eggs in one basket. This strategy helps protect your investments from the volatility of any single asset or market sector.

## Key Principles

1. **Asset Class Diversification**: Spread investments across stocks, bonds, real estate, and other asset classes
2. **Sector Diversification**: Invest in different industries and sectors
3. **Geographic Diversification**: Consider both domestic and international investments
4. **Time Diversification**: Invest regularly over time (dollar-cost averaging)

## Getting Started

Start by assessing your risk tolerance and investment goals. Then, gradually build a portfolio that aligns with your objectives while maintaining proper diversification.`,
      category: "PORTFOLIO_MANAGEMENT",
      audience: "INVESTORS",
      difficulty: "BEGINNER",
      readTime: 8,
      published: true,
      featured: true,
      tags: ["diversification", "portfolio", "risk-management", "investing"],
      authorId: "admin-1",
      author: { name: "Admin User", email: "admin@naijaconnect.com" },
      views: 1247,
      likes: 89,
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-20T15:30:00Z",
    },
    {
      id: "2",
      title: "Business Plan Essentials for Startup Funding",
      description:
        "A comprehensive guide to creating a compelling business plan that attracts investors and secures funding.",
      content: `# Business Plan Essentials for Startup Funding

Creating a solid business plan is crucial for attracting investors and securing funding for your startup. This guide will walk you through the essential components.

## Executive Summary

Your executive summary should be compelling and concise, highlighting:
- Your business concept
- Market opportunity
- Competitive advantage
- Financial projections
- Funding requirements

## Market Analysis

Demonstrate your understanding of:
- Target market size and growth potential
- Customer demographics and behavior
- Competitive landscape
- Market trends and opportunities

## Financial Projections

Include realistic projections for:
- Revenue forecasts (3-5 years)
- Expense budgets
- Cash flow statements
- Break-even analysis
- Return on investment calculations

## Tips for Success

1. Be realistic with your projections
2. Show clear market research
3. Demonstrate scalability
4. Highlight your team's expertise
5. Present multiple funding scenarios`,
      category: "BUSINESS_PLANNING",
      audience: "BUSINESS_OWNERS",
      difficulty: "INTERMEDIATE",
      readTime: 12,
      published: true,
      featured: false,
      tags: ["business-plan", "funding", "startup", "investors"],
      authorId: "admin-1",
      author: { name: "Admin User", email: "admin@naijaconnect.com" },
      views: 856,
      likes: 67,
      createdAt: "2024-01-18T14:20:00Z",
      updatedAt: "2024-01-22T09:15:00Z",
    },
    {
      id: "3",
      title: "Understanding Risk Assessment in Investments",
      description:
        "Learn how to evaluate and manage investment risks to make informed decisions.",
      content: `# Understanding Risk Assessment in Investments

Risk assessment is a critical skill for any investor. Understanding different types of risks and how to evaluate them can help you make better investment decisions.

## Types of Investment Risks

### Market Risk
The risk that the entire market will decline, affecting all investments.

### Credit Risk
The risk that a borrower will default on their obligations.

### Liquidity Risk
The risk that you won't be able to sell an investment quickly without affecting its price.

### Inflation Risk
The risk that inflation will erode the purchasing power of your returns.

## Risk Assessment Tools

1. **Beta Coefficient**: Measures volatility relative to the market
2. **Standard Deviation**: Shows historical volatility
3. **Sharpe Ratio**: Risk-adjusted returns
4. **Value at Risk (VaR)**: Potential loss over a specific time period

## Risk Management Strategies

- Diversification across asset classes
- Regular portfolio rebalancing
- Setting stop-loss orders
- Maintaining emergency funds
- Regular risk assessment reviews`,
      category: "RISK_ASSESSMENT",
      audience: "BOTH",
      difficulty: "INTERMEDIATE",
      readTime: 10,
      published: false,
      featured: false,
      tags: ["risk-assessment", "portfolio", "management", "investing"],
      authorId: "admin-1",
      author: { name: "Admin User", email: "admin@naijaconnect.com" },
      views: 0,
      likes: 0,
      createdAt: "2024-01-25T11:45:00Z",
      updatedAt: "2024-01-25T11:45:00Z",
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setContents(mockContents);
      setFilteredContents(mockContents);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter contents based on search and filters
  useEffect(() => {
    let filtered = contents;

    if (searchTerm) {
      filtered = filtered.filter(
        (content) =>
          content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          content.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          content.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    if (filterCategory) {
      filtered = filtered.filter(
        (content) => content.category === filterCategory
      );
    }

    if (filterAudience) {
      filtered = filtered.filter(
        (content) => content.audience === filterAudience
      );
    }

    if (filterPublished !== null) {
      filtered = filtered.filter(
        (content) => content.published === filterPublished
      );
    }

    setFilteredContents(filtered);
  }, [contents, searchTerm, filterCategory, filterAudience, filterPublished]);

  const handleEdit = (content: EducationalContent) => {
    setEditingContent(content);
    setFormData({
      title: content.title,
      description: content.description,
      content: content.content,
      category: content.category,
      audience: content.audience,
      difficulty: content.difficulty,
      readTime: content.readTime,
      published: content.published,
      featured: content.featured,
      tags: content.tags.join(", "),
    });
    setShowEditor(true);
  };

  const handleCreate = () => {
    setEditingContent(null);
    setFormData({
      title: "",
      description: "",
      content: "",
      category: "INVESTING_BASICS",
      audience: "INVESTORS",
      difficulty: "BEGINNER",
      readTime: 5,
      published: false,
      featured: false,
      tags: "",
    });
    setShowEditor(true);
  };

  const handleSave = () => {
    // In a real application, this would make an API call
    console.log("Saving content:", formData);
    setShowEditor(false);
    // Refresh content list
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this content?")) {
      // In a real application, this would make an API call
      console.log("Deleting content:", id);
      setContents(contents.filter((c) => c.id !== id));
    }
  };

  const togglePublished = (id: string) => {
    // In a real application, this would make an API call
    setContents(
      contents.map((c) => (c.id === id ? { ...c, published: !c.published } : c))
    );
  };

  const toggleFeatured = (id: string) => {
    // In a real application, this would make an API call
    setContents(
      contents.map((c) => (c.id === id ? { ...c, featured: !c.featured } : c))
    );
  };

  const getCategoryLabel = (value: string) => {
    return categories.find((c) => c.value === value)?.label || value;
  };

  const getAudienceLabel = (value: string) => {
    return audiences.find((a) => a.value === value)?.label || value;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "BEGINNER":
        return "text-green-600 bg-green-100";
      case "INTERMEDIATE":
        return "text-yellow-600 bg-yellow-100";
      case "ADVANCED":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Educational Content Manager
            </h1>
            <p className="text-gray-600">
              Create and manage educational resources for users
            </p>
          </div>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Create Content</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>

          <select
            value={filterAudience}
            onChange={(e) => setFilterAudience(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Audiences</option>
            {audiences.map((audience) => (
              <option key={audience.value} value={audience.value}>
                {audience.label}
              </option>
            ))}
          </select>

          <select
            value={filterPublished === null ? "" : filterPublished.toString()}
            onChange={(e) =>
              setFilterPublished(
                e.target.value === "" ? null : e.target.value === "true"
              )
            }
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="true">Published</option>
            <option value="false">Draft</option>
          </select>
        </div>

        <div className="text-sm text-gray-600">
          Showing {filteredContents.length} of {contents.length} articles
        </div>
      </div>

      {/* Content List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Content
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Audience
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stats
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContents.map((content) => (
                <tr key={content.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-start space-x-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {content.title}
                          </p>
                          {content.featured && (
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate max-w-md">
                          {content.description}
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                              content.difficulty
                            )}`}
                          >
                            {content.difficulty.toLowerCase()}
                          </span>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            {content.readTime} min read
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getCategoryLabel(content.category)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getAudienceLabel(content.audience)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          content.published
                            ? "text-green-800 bg-green-100"
                            : "text-gray-800 bg-gray-100"
                        }`}
                      >
                        {content.published ? "Published" : "Draft"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {content.views || 0}
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1" />
                        {content.likes || 0}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => togglePublished(content.id)}
                        className={`p-1 rounded-full hover:bg-gray-100 ${
                          content.published ? "text-green-600" : "text-gray-400"
                        }`}
                        title={content.published ? "Unpublish" : "Publish"}
                      >
                        {content.published ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => toggleFeatured(content.id)}
                        className={`p-1 rounded-full hover:bg-gray-100 ${
                          content.featured ? "text-yellow-500" : "text-gray-400"
                        }`}
                        title={
                          content.featured
                            ? "Remove from featured"
                            : "Add to featured"
                        }
                      >
                        <Star
                          className={`h-4 w-4 ${
                            content.featured ? "fill-current" : ""
                          }`}
                        />
                      </button>
                      <button
                        onClick={() => handleEdit(content)}
                        className="p-1 rounded-full hover:bg-gray-100 text-blue-600"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(content.id)}
                        className="p-1 rounded-full hover:bg-gray-100 text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                {editingContent ? "Edit Content" : "Create New Content"}
              </h2>
              <button
                onClick={() => setShowEditor(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter article title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Read Time (minutes)
                  </label>
                  <input
                    type="number"
                    value={formData.readTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        readTime: parseInt(e.target.value) || 5,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    max="60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description of the article"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Audience
                  </label>
                  <select
                    value={formData.audience}
                    onChange={(e) =>
                      setFormData({ ...formData, audience: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {audiences.map((audience) => (
                      <option key={audience.value} value={audience.value}>
                        {audience.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) =>
                      setFormData({ ...formData, difficulty: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {difficulties.map((difficulty) => (
                      <option key={difficulty.value} value={difficulty.value}>
                        {difficulty.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="investing, portfolio, risk-management"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content (Markdown supported)
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  rows={15}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder="Write your article content here. Markdown is supported for formatting."
                />
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) =>
                      setFormData({ ...formData, published: e.target.checked })
                    }
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">
                    Publish immediately
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({ ...formData, featured: e.target.checked })
                    }
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">
                    Feature this article
                  </span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 p-6 border-t">
              <button
                onClick={() => setShowEditor(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>{editingContent ? "Update" : "Create"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
