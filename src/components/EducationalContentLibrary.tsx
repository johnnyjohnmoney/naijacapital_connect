"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Search,
  Filter,
  Clock,
  Eye,
  Heart,
  Star,
  ChevronRight,
  ArrowLeft,
  Share,
  Bookmark,
  User,
  Calendar,
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
  { value: "INVESTING_BASICS", label: "Investing Basics", icon: "💡" },
  { value: "PORTFOLIO_MANAGEMENT", label: "Portfolio Management", icon: "📊" },
  { value: "RISK_ASSESSMENT", label: "Risk Assessment", icon: "⚠️" },
  { value: "MARKET_ANALYSIS", label: "Market Analysis", icon: "📈" },
  { value: "BUSINESS_PLANNING", label: "Business Planning", icon: "📋" },
  { value: "FINANCIAL_LITERACY", label: "Financial Literacy", icon: "💰" },
];

const audiences = [
  {
    value: "INVESTORS",
    label: "For Investors",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "BUSINESS_OWNERS",
    label: "For Business Owners",
    color: "bg-green-100 text-green-800",
  },
  {
    value: "BOTH",
    label: "For Everyone",
    color: "bg-purple-100 text-purple-800",
  },
];

const difficulties = [
  {
    value: "BEGINNER",
    label: "Beginner",
    color: "bg-green-100 text-green-800",
  },
  {
    value: "INTERMEDIATE",
    label: "Intermediate",
    color: "bg-yellow-100 text-yellow-800",
  },
  { value: "ADVANCED", label: "Advanced", color: "bg-red-100 text-red-800" },
];

interface EducationalContentLibraryProps {
  userRole?: "INVESTOR" | "BUSINESS_OWNER" | "ADMINISTRATOR";
}

export default function EducationalContentLibrary({
  userRole = "INVESTOR",
}: EducationalContentLibraryProps) {
  const [contents, setContents] = useState<EducationalContent[]>([]);
  const [filteredContents, setFilteredContents] = useState<
    EducationalContent[]
  >([]);
  const [selectedContent, setSelectedContent] =
    useState<EducationalContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  // Mock data for demonstration
  const mockContents: EducationalContent[] = [
    {
      id: "1",
      title: "Introduction to Investment Portfolio Diversification",
      description:
        "Learn the fundamentals of building a well-diversified investment portfolio to minimize risk and maximize returns.",
      content:
        "Portfolio diversification is one of the most fundamental concepts in investing...",
      category: "PORTFOLIO_MANAGEMENT",
      audience: "INVESTORS",
      difficulty: "BEGINNER",
      readTime: 8,
      published: true,
      featured: true,
      tags: ["diversification", "portfolio", "risk-management"],
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
        "A comprehensive guide to creating a compelling business plan that attracts investors.",
      content:
        "Creating a solid business plan is crucial for attracting investors...",
      category: "BUSINESS_PLANNING",
      audience: "BUSINESS_OWNERS",
      difficulty: "INTERMEDIATE",
      readTime: 12,
      published: true,
      featured: false,
      tags: ["business-plan", "funding", "startup"],
      author: { name: "Admin User", email: "admin@naijaconnect.com" },
      views: 856,
      likes: 67,
      createdAt: "2024-01-18T14:20:00Z",
      updatedAt: "2024-01-22T09:15:00Z",
    },
  ];

  useEffect(() => {
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
          content.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (content) => content.category === selectedCategory
      );
    }

    if (selectedDifficulty) {
      filtered = filtered.filter(
        (content) => content.difficulty === selectedDifficulty
      );
    }

    setFilteredContents(filtered);
  }, [contents, searchTerm, selectedCategory, selectedDifficulty]);

  const getCategoryLabel = (value: string) => {
    return categories.find((c) => c.value === value)?.label || value;
  };

  const getAudienceLabel = (value: string) => {
    return audiences.find((a) => a.value === value)?.label || value;
  };

  const getDifficultyColor = (difficulty: string) => {
    return (
      difficulties.find((d) => d.value === difficulty)?.color ||
      "bg-gray-100 text-gray-800"
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (selectedContent) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b">
            <button
              onClick={() => setSelectedContent(null)}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Library
            </button>

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {selectedContent.title}
                </h1>

                <div className="flex items-center space-x-4 mb-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(
                      selectedContent.difficulty
                    )}`}
                  >
                    {selectedContent.difficulty.toLowerCase()}
                  </span>

                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {selectedContent.readTime} min read
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <Eye className="h-4 w-4 mr-1" />
                    {selectedContent.views} views
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <Heart className="h-4 w-4 mr-1" />
                    {selectedContent.likes} likes
                  </div>
                </div>

                <p className="text-gray-600 text-lg mb-6">
                  {selectedContent.description}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100">
                  <Heart className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-blue-500 rounded-full hover:bg-gray-100">
                  <Bookmark className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-green-500 rounded-full hover:bg-gray-100">
                  <Share className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                {selectedContent.content}
              </div>
            </div>
          </div>

          <div className="p-6 border-t bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-sm text-gray-500">
                  <User className="h-4 w-4 mr-1" />
                  {selectedContent.author?.name}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(selectedContent.createdAt)}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedContent.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
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
              Educational Library
            </h1>
            <p className="text-gray-600">
              Expand your knowledge with expert insights and guides
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
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
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Levels</option>
            {difficulties.map((difficulty) => (
              <option key={difficulty.value} value={difficulty.value}>
                {difficulty.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContents.map((content) => (
          <div
            key={content.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
            onClick={() => setSelectedContent(content)}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  {content.featured && (
                    <div className="flex items-center mb-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                      <span className="text-xs font-medium text-yellow-600">
                        Featured
                      </span>
                    </div>
                  )}

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {content.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {content.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                    content.difficulty
                  )}`}
                >
                  {content.difficulty.toLowerCase()}
                </span>

                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  {content.readTime} min
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    {content.views}
                  </div>
                  <div className="flex items-center">
                    <Heart className="h-3 w-3 mr-1" />
                    {content.likes}
                  </div>
                </div>

                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredContents.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            No articles found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
}
