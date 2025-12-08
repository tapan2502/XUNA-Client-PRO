import React from "react";
import { Card, CardBody, CardHeader, ScrollShadow, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";

interface NotificationsCardProps {
  className?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New Agent Created",
    message: "Your new AI assistant 'Customer Support Bot' is ready",
    time: "5m ago",
    type: "success",
    read: false,
  },
  {
    id: "2",
    title: "Call Completed",
    message: "Call with John Doe completed successfully",
    time: "1h ago",
    type: "info",
    read: false,
  },
  {
    id: "3",
    title: "Low Credits",
    message: "Your account has less than 100 credits remaining",
    time: "2h ago",
    type: "warning",
    read: true,
  },
  {
    id: "4",
    title: "Knowledge Base Updated",
    message: "3 new documents added to 'Product Documentation'",
    time: "1d ago",
    type: "info",
    read: true,
  },
  {
    id: "5",
    title: "System Maintenance",
    message: "Scheduled maintenance on Dec 10th, 2:00 AM - 4:00 AM",
    time: "2d ago",
    type: "warning",
    read: true,
  },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case "success":
      return "solar:check-circle-bold";
    case "warning":
      return "solar:danger-triangle-bold";
    case "error":
      return "solar:close-circle-bold";
    default:
      return "solar:info-circle-bold";
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "success":
      return "success";
    case "warning":
      return "warning";
    case "error":
      return "danger";
    default:
      return "primary";
  }
};

export default function NotificationsCard({ className }: NotificationsCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex gap-3 border-b border-divider px-4 py-3">
        <div className="flex flex-col flex-1">
          <p className="text-md font-semibold">Notifications</p>
          <p className="text-small text-default-500">You have 2 unread notifications</p>
        </div>
        <Chip color="primary" size="sm" variant="flat">
          5
        </Chip>
      </CardHeader>
      <CardBody className="p-0">
        <ScrollShadow className="max-h-[400px]">
          {mockNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex gap-3 px-4 py-3 border-b border-divider last:border-none cursor-pointer transition-colors ${
                !notification.read
                  ? "bg-primary-50/50 dark:bg-primary-100/10 hover:bg-primary-100/50 dark:hover:bg-primary-100/20"
                  : "hover:bg-default-100"
              }`}
            >
              <div className="flex-shrink-0 mt-1">
                <div
                  className={`p-2 rounded-full bg-${getTypeColor(notification.type)}-100/50 dark:bg-${getTypeColor(notification.type)}-100/20`}
                >
                  <Icon
                    className={`text-${getTypeColor(notification.type)}`}
                    icon={getTypeIcon(notification.type)}
                    width={16}
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-sm">{notification.title}</p>
                  {!notification.read && (
                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                  )}
                </div>
                <p className="text-small text-default-500 mt-0.5">{notification.message}</p>
                <p className="text-tiny text-default-400 mt-1">{notification.time}</p>
              </div>
            </div>
          ))}
        </ScrollShadow>
        <div className="px-4 py-3 border-t border-divider">
          <button className="text-small text-primary hover:underline font-medium w-full text-center">
            View all notifications
          </button>
        </div>
      </CardBody>
    </Card>
  );
}
