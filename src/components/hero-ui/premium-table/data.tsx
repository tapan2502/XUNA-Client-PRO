import React from "react";
import {
  DangerCircleSvg,
  DefaultCircleSvg,
  SuccessCircleSvg,
  WarningCircleSvg,
} from "./icons";

export const statusOptions = [
  {name: "Active", uid: "active"},
  {name: "Inactive", uid: "inactive"},
  {name: "Paused", uid: "paused"},
  {name: "Vacation", uid: "vacation"},
] as const;

export type StatusOptions = (typeof statusOptions)[number]["name"];

export const statusColorMap: Record<StatusOptions, JSX.Element> = {
  Active: <SuccessCircleSvg />,
  Inactive: <DefaultCircleSvg />,
  Paused: <DangerCircleSvg />,
  Vacation: <WarningCircleSvg />,
};

type Teams =
  | "Design"
  | "Product"
  | "Marketing"
  | "Management"
  | "Engineering"
  | "Sales"
  | "Support"
  | "Other"
  | (string & {});

export type MemberInfo = {
  avatar: string;
  email: string;
  name: string;
};

export type Users = {
  id: number;
  workerID: number;
  externalWorkerID: string;
  memberInfo: MemberInfo;
  country: {
    name: string;
    icon: React.ReactNode;
  };
  role: string;
  workerType: "Contractor" | "Employee";
  status: StatusOptions;
  startDate: string; // Changed to string for easier mock data handling
  teams: Teams[];
};

export type ColumnsKey =
  | "workerID"
  | "externalWorkerID"
  | "memberInfo"
  | "country"
  | "role"
  | "workerType"
  | "status"
  | "startDate"
  | "teams"
  | "actions";

export const INITIAL_VISIBLE_COLUMNS: ColumnsKey[] = [
  "workerID",
  "externalWorkerID",
  "memberInfo",
  "country",
  "role",
  "workerType",
  "status",
  "startDate",
  "teams",
  "actions",
];

export const columns = [
  {name: "Worker ID", uid: "workerID"},
  {name: "External Worker ID", uid: "externalWorkerID"},
  {name: "Member", uid: "memberInfo", sortDirection: "ascending"},
  {name: "Country", uid: "country"},
  {name: "Role", uid: "role"},
  {name: "Worker Type", uid: "workerType"},
  {name: "Status", uid: "status", info: "The user's current status"},
  {name: "Start Date", uid: "startDate", info: "The date the user started"},
  {name: "Teams", uid: "teams"},
  {name: "Actions", uid: "actions"},
];

const names = [
  "Alice Johnson",
  "Bob Smith",
  "Charlie Brown",
  "David Wilson",
  "Eve Martinez",
  "Frank Thompson",
  "Grace Garcia",
  "Hannah Lee",
  "Isaac Anderson",
  "Julia Roberts",
];

const roles = [
  "Software Engineer",
  "Marketing Specialist",
  "Human Resources Manager",
  "Data Analyst",
  "Project Manager",
];

const countries = [
  {
    name: "Argentina",
    icon: (
      <svg
        fill="none"
        height="17"
        viewBox="0 0 16 17"
        width="16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <clipPath id="clip0_3080_19703">
            <rect fill="white" height="16" transform="translate(0 0.5)" width="16" />
        </clipPath>
        <g clipPath="url(#clip0_3080_19703)">
          <path
            d="M8 16.5C12.4183 16.5 16 12.9183 16 8.5C16 4.08172 12.4183 0.5 8 0.5C3.58172 0.5 0 4.08172 0 8.5C0 12.9183 3.58172 16.5 8 16.5Z"
            fill="#F0F0F0"
          />
          <path
            d="M8.00013 0.5C4.82844 0.5 2.08795 2.34578 0.793945 5.02175H15.2063C13.9123 2.34578 11.1718 0.5 8.00013 0.5Z"
            fill="#338AF3"
          />
          <path
            d="M8.00013 16.4993C11.1718 16.4993 13.9123 14.6535 15.2063 11.9775H0.793945C2.08795 14.6535 4.82844 16.4993 8.00013 16.4993Z"
            fill="#338AF3"
          />
          <path
            d="M10.3906 8.50019L9.41354 8.95978L9.93382 9.906L8.87289 9.70303L8.73845 10.7748L7.99948 9.98654L7.26049 10.7748L7.12608 9.70303L6.06515 9.90597L6.5854 8.95975L5.6084 8.50019L6.58543 8.04059L6.06515 7.0944L7.12605 7.29734L7.26052 6.22559L7.99948 7.01384L8.73848 6.22559L8.87289 7.29734L9.93385 7.0944L9.41357 8.04062L10.3906 8.50019Z"
            fill="#FFDA44"
          />
        </g>
      </svg>
    ),
  },
  {
    name: "United States",
    icon: (
      <svg
        fill="none"
        height="17"
        viewBox="0 0 16 17"
        width="16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <clipPath id="clip0_3080_19788">
          <rect fill="white" height="17" width="16" />
        </clipPath>
        <g clipPath="url(#clip0_3080_19788)">
          <path
              d="M8 16.418C12.4183 16.418 16 12.8362 16 8.41797C16 3.99969 12.4183 0.417969 8 0.417969C3.58172 0.417969 0 3.99969 0 8.41797C0 12.8362 3.58172 16.418 8 16.418Z"
              fill="#F0F0F0"
            />
        </g>
      </svg>
    ),
  },
];

const generateMockUserData = (count: number): Users[] => {
  const mockData: Users[] = [];

  for (let i = 0; i < count; i++) {
    const selectedName = names[i % names.length];
    const selectedRole = roles[i % roles.length];
    const selectedCountry = countries[i % countries.length];

    const user: Users = {
      id: i,
      workerID: Math.floor(Math.random() * 1000),
      externalWorkerID: `EXT-${Math.floor(Math.random() * 1000)}`,
      memberInfo: {
        avatar: `https://i.pravatar.cc/150?img=${i}`,
        email: `${selectedName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
        name: selectedName,
      },
      country: selectedCountry,
      role: selectedRole,
      workerType: Math.random() > 0.5 ? "Contractor" : "Employee",
      status: "Active",
      startDate: "2024-01-01",
      teams: ["Design", "Product"],
    };

    mockData.push(user);
  }

  return mockData;
};

export const users: Users[] = generateMockUserData(20);
