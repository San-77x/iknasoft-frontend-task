"use client";

import React from "react";
import {
  Status,
  Priority,
  Stage,
  statusColors,
  priorityColors,
  stageColors,
} from "@/types/table-types";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}

interface StageBadgeProps {
  stage: Stage;
  className?: string;
}

const BadgeBase: React.FC<{
  children: React.ReactNode;
  className?: string;
  colorClass: string;
}> = ({ children, className = "", colorClass }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass} ${className}`}
  >
    {children}
  </span>
);

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className,
}) => (
  <BadgeBase colorClass={statusColors[status]} className={className}>
    {status}
  </BadgeBase>
);

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  className,
}) => (
  <BadgeBase colorClass={priorityColors[priority]} className={className}>
    {priority}
  </BadgeBase>
);

export const StageBadge: React.FC<StageBadgeProps> = ({ stage, className }) => (
  <BadgeBase colorClass={stageColors[stage]} className={className}>
    {stage}
  </BadgeBase>
);

// Combined badge for showing multiple statuses
interface MultiBadgeProps {
  status?: Status;
  priority?: Priority;
  stage?: Stage;
  className?: string;
}

export const MultiBadge: React.FC<MultiBadgeProps> = ({
  status,
  priority,
  stage,
  className = "",
}) => (
  <div className={`flex gap-1 flex-wrap ${className}`}>
    {status && <StatusBadge status={status} />}
    {priority && <PriorityBadge priority={priority} />}
    {stage && <StageBadge stage={stage} />}
  </div>
);

// Tag badges for custom tags
interface TagBadgeProps {
  tag: string;
  onRemove?: () => void;
  className?: string;
}

export const TagBadge: React.FC<TagBadgeProps> = ({
  tag,
  onRemove,
  className,
}) => (
  <span
    className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-800 ${className}`}
  >
    {tag}
    {onRemove && (
      <button
        onClick={onRemove}
        className="ml-1 hover:text-gray-600 focus:outline-none"
        aria-label={`Remove ${tag} tag`}
      >
        ×
      </button>
    )}
  </span>
);
