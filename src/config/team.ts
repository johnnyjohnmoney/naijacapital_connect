/**
 * NaijaConnect Capital Team Members
 * Source: Official Business Plan December 2025
 */

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  title: string;
  description: string;
  image: string;
  linkedin?: string;
  twitter?: string;
  expertise: string[];
}

export const teamMembers: TeamMember[] = [
  {
    id: "temitayo-sunmonu-balogun",
    name: "Temitayo Sunmonu-Balogun",
    role: "CEO",
    title: "Chief Executive Officer",
    description:
      "A finance and management professional with over 10 years of experience in accounting, finance, and corporate leadership. She has a strong record of promoting growth, improving operations, and ensuring financial responsibility in both private and institutional settings.",
    image: "/images/team/temitayo-ceo.jpg",
    expertise: [
      "Corporate Leadership",
      "Financial Management",
      "Strategic Planning",
      "Operational Excellence",
    ],
  },
  {
    id: "emmanuel-orevba",
    name: "Emmanuel Orevba",
    role: "COO",
    title: "Chief Operating Officer",
    description:
      "A dedicated professional with skills in risk profiling, tax compliance, and audit management. He has a successful history of meeting organizational goals through planning, working with stakeholders, and executing processes. He also has experience in managing information systems, optimizing digital presence, and reporting on operations.",
    image: "/images/team/emmanuel-coo.jpg",
    expertise: [
      "Risk Management",
      "Tax Compliance",
      "Audit Management",
      "Operations Strategy",
      "Digital Transformation",
    ],
  },
  {
    id: "eric-ojeaga",
    name: "Eric Ojeaga",
    role: "CFO",
    title: "Chief Financial Officer",
    description:
      "A skilled finance professional with solid analytical and quantitative abilities in corporate finance, accounting, and investment management. Has experience in capital allocation, budget management, and financial forecasting for growth-stage companies. Proficient at creating sustainable financial models and ensuring compliance with Nigerian and international accounting standards.",
    image: "/images/team/eric-cfo.jpg",
    expertise: [
      "Corporate Finance",
      "Investment Management",
      "Financial Modeling",
      "Capital Allocation",
      "IFRS Compliance",
    ],
  },
  {
    id: "kevin-odiley",
    name: "Kevin Odiley",
    role: "CTO",
    title: "Chief Technology Officer",
    description:
      "Innovative and results-driven Chief Technology Officer with years of experience in the technology sector, specializing in fintech solutions. Proven expertise in leading software development teams and managing technology infrastructure to drive operational efficiency and enhance user experiences. Proficient in full-stack development, API integration, and cybersecurity, with a focus on creating scalable systems compatible with blockchain technology.",
    image: "/images/team/kevin-cto.jpg",
    expertise: [
      "Fintech Solutions",
      "Full-Stack Development",
      "Blockchain Technology",
      "Cybersecurity",
      "API Integration",
      "System Architecture",
    ],
  },
  {
    id: "kikelomo-abikele",
    name: "Kikelomo Abikele",
    role: "Head of Investment & Partnerships",
    title: "Head, Investment & Partnerships",
    description:
      "A professional with extensive experience in identifying and cultivating impactful and sustainable investment opportunities. Demonstrated success in building strong relationships with stakeholders, negotiating high-stakes agreements, and driving strategic initiatives that enhance organizational growth. Proficient in market analysis, due diligence, and portfolio management, with a proven track record of leveraging partnerships to optimize investment outcomes and foster innovation.",
    image: "/images/team/kikelomo-partnerships.jpg",
    expertise: [
      "Investment Analysis",
      "Partnership Development",
      "Due Diligence",
      "Portfolio Management",
      "Stakeholder Relations",
      "Market Analysis",
    ],
  },
];

export const advisoryBoard = [
  {
    role: "Legal Consultant",
    description:
      "Independent legal advisor for regulatory compliance and corporate governance",
    status: "To be appointed",
  },
  {
    role: "Compliance & Regulatory Advisor",
    description: "Expert in SEC and CBN regulations, AML/CTF frameworks",
    status: "To be appointed",
  },
  {
    role: "Industry Expert",
    description: "Experienced fintech and diaspora investment specialist",
    status: "To be appointed",
  },
];
