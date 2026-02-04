// shared/components/StatusBadge.jsx
import React from 'react';
import { Badge } from "@/components/ui/badge";

export const StatusBadge = ({ status, onClick, showCursor = false }) => {
  const getStatusConfig = (status) => {
    const configs = {
      'open': { 
        className: 'bg-green-100 text-green-800 border-green-300',
        label: 'Open'
      },
      'in_progress': { 
        className: 'bg-blue-100 text-blue-800 border-blue-300',
        label: 'In Progress'
      },
      'resolved': { 
        className: 'bg-purple-100 text-purple-800 border-purple-300',
        label: 'Resolved'
      },
      'closed': { 
        className: 'bg-gray-100 text-gray-800 border-gray-300',
        label: 'Closed'
      },
      'pending': { 
        className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        label: 'Pending'
      }
    };
    return configs[status?.toLowerCase()] || { 
      className: 'bg-gray-100 text-gray-800 border-gray-300',
      label: status || 'Unknown'
    };
  };

  const config = getStatusConfig(status);
  
  return (
    <Badge 
      variant="outline" 
      className={`${config.className} ${showCursor ? 'cursor-pointer hover:opacity-80' : ''}`}
      onClick={onClick}
    >
      {config.label}
    </Badge>
  );
};