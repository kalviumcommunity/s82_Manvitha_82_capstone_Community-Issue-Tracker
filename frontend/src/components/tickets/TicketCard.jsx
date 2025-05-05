import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, AlertTriangle, CheckCircle, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const statusConfig = {
  'open': { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300', label: 'Open' },
  'in-progress': { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300', label: 'In Progress' },
  'resolved': { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300', label: 'Resolved' },
  'closed': { color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300', label: 'Closed' }
};

const priorityConfig = {
  'low': { 
    color: 'text-gray-500', 
    label: 'Low', 
    icon: <Clock size={16} className="text-gray-500" />
  },
  'medium': { 
    color: 'text-blue-500', 
    label: 'Medium', 
    icon: <Clock size={16} className="text-blue-500" />
  },
  'high': { 
    color: 'text-orange-500', 
    label: 'High', 
    icon: <AlertTriangle size={16} className="text-orange-500" />
  },
  'urgent': { 
    color: 'text-red-500', 
    label: 'Urgent', 
    icon: <AlertTriangle size={16} className="text-red-500" />
  }
};

const categoryEmoji = {
  'maintenance': '🔧',
  'security': '🔒',
  'noise': '🔊',
  'cleanliness': '🧹',
  'amenities': '🏋️',
  'payments': '💰',
  'other': '📝'
};

const TicketCard = ({ ticket, compact = false }) => {
  const status = statusConfig[ticket.status];
  const priority = priorityConfig[ticket.priority];
  const ticketLink = `/tickets/${ticket.id}`;

  return (
    <Link 
      to={ticketLink}
      className="block border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-800 overflow-hidden"
    >
      {/* Priority Indicator */}
      <div className={`h-1 ${
        ticket.priority === 'urgent' ? 'bg-red-500' :
        ticket.priority === 'high' ? 'bg-orange-500' :
        ticket.priority === 'medium' ? 'bg-blue-500' :
        'bg-gray-300 dark:bg-gray-600'
      }`}></div>

      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <span className="text-lg mr-2" aria-hidden="true">
              {categoryEmoji[ticket.category] || '📝'}
            </span>
            <h3 className="text-md font-medium text-gray-900 dark:text-white">
              {compact && ticket.title.length > 40 
                ? ticket.title.substring(0, 40) + '...' 
                : ticket.title}
            </h3>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${status.color}`}>
            {status.label}
          </span>
        </div>
        
        {!compact && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {ticket.description}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center text-xs">
              {priority.icon}
              <span className={`ml-1 ${priority.color}`}>{priority.label}</span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {ticket.unit}
            </div>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
          </div>
        </div>

        {ticket.assignedTo && (
          <div className="mt-3 flex items-center text-xs text-gray-500 dark:text-gray-400">
            <User size={14} className="mr-1" />
            <span>Assigned</span>
          </div>
        )}

        {!compact && ticket.comments.length > 0 && (
          <div className="mt-3 flex items-center text-xs text-gray-500 dark:text-gray-400">
            <CheckCircle size={14} className="mr-1" />
            <span>{ticket.comments.length} comment{ticket.comments.length !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default TicketCard;
