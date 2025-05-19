import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import TicketCard from '../../components/tickets/TicketCard';

const MyTickets = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userDataString = localStorage.getItem('user'); // assuming you stored user details under 'user'
    if (userDataString) {
      const user = JSON.parse(userDataString);
      if (user?.id) {
        setLoading(true);
        axios.post('http://localhost:3551/api/issues/myissues', { userId: user.id })
          .then(res => {
            setTickets(res.data);
            setFilteredTickets(res.data);
            setLoading(false);
          })
          .catch(err => {
            console.error('Failed to fetch tickets:', err);
            setError('Failed to load tickets. Please try again later.');
            setLoading(false);
          });
      } else {
        setError('User ID not found in stored user data');
      }
    } else {
      setError('User not logged in');
    }
  }, []);

  const handleFilter = (filters) => {
    let result = [...tickets];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(ticket =>
        ticket.title.toLowerCase().includes(searchLower) ||
        (ticket.description && ticket.description.toLowerCase().includes(searchLower))
      );
    }

    if (filters.categories.length > 0) {
      result = result.filter(ticket => filters.categories.includes(ticket.category));
    }

    if (filters.priorities.length > 0) {
      result = result.filter(ticket => filters.priorities.includes(ticket.priority));
    }

    if (filters.statuses.length > 0) {
      result = result.filter(ticket => filters.statuses.includes(ticket.status));
    }

    setFilteredTickets(result);
  };

  return (
    <div className="p-4 lg:p-6">
      {loading && <p className="text-center text-gray-500 dark:text-gray-400">Loading tickets...</p>}
      {error && <p className="text-center text-red-600 dark:text-red-400">{error}</p>}

      {!loading && !error && filteredTickets.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">You don't have any tickets yet.</p>
          <button
            onClick={() => navigate('/resident/new-ticket')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20 hover:bg-blue-200 dark:hover:bg-blue-900/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusCircle size={16} className="mr-2" />
            Create your first ticket
          </button>
        </div>
      )}

      {!loading && !error && filteredTickets.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredTickets.map(ticket => (
            <TicketCard key={ticket._id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTickets;
