"use client";

import React, { FC } from "react";
import { useNotificationStore } from "@/store/NotificationStore";
import Toast from "./Toast";

interface ToastContainerProps {
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
  usePortal?: boolean;
}

const ToastContainer: FC<ToastContainerProps> = ({
  position = "top-right",
}) => {
  const { notifications, removeNotification } = useNotificationStore();

  const getPositionClasses = () => {
    switch (position) {
      case "top-right":
        return "top-4 right-4 items-end";
      case "top-left":
        return "top-4 left-4 items-start";
      case "bottom-right":
        return "bottom-4 right-4 items-end";
      case "bottom-left":
        return "bottom-4 left-4 items-start";
      case "top-center":
        return "top-4 left-1/2 transform -translate-x-1/2 items-center";
      case "bottom-center":
        return "bottom-4 left-1/2 transform -translate-x-1/2 items-center";
      default:
        return "top-4 right-4 items-end";
    }
  };

  return (
    <div
      className={`
        fixed z-[99999] flex flex-col pointer-events-none
        ${getPositionClasses()}
      `}
      style={{
        maxHeight: "calc(100vh - 2rem)",
        overflowY: "auto",
        width: "auto",
        minWidth: "320px",
        maxWidth: "400px",
        position: "fixed",
        zIndex: 99999,
      }}
    >
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          notification={notification}
          onClose={removeNotification}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
