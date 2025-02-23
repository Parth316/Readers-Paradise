import React, { useState, useEffect } from "react";
import axios from "axios";
import { Grid, List } from "lucide-react"; // For layout icons
import NotFound from './NotFound';
import { ErrorBoundary } from 'react-error-boundary'; // Import ErrorBoundary component
import Skeleton from 'react-loading-skeleton'; // Import Skeleton component
import 'react-loading-skeleton/dist/skeleton.css'; // Import Skeleton CSS

interface User {
  id: number;
  name: string;
  email: string;
}

const ListUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [layout, setLayout] = useState<"grid" | "list">("grid"); // Layout state
  const BACKEND_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<User[]>(`${BACKEND_URL}/api/admin/listUsers`);
        setUsers(response.data);
      } catch (error) {
        setError("Error fetching users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Function to generate user logo (initials)
  const getUserLogo = (name: string) => {
    const initials = name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
    return (
      <div className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full">
        {initials}
      </div>
    );
  };

  return (
    <ErrorBoundary
      FallbackComponent={({ error }) => (
        <div className="flex items-center justify-center h-screen text-red-500">
          {error.message}
        </div>
      )}
    >
      {loading ? (
        <div className="container mx-auto pt-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 m-10">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center">
                <Skeleton circle={true} height={48} width={48} />
                <Skeleton height={24} width={`60%`} className="mt-4" />
                <Skeleton height={16} width={`80%`} className="mt-2" />
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <NotFound imagePath="../images/error404.gif" Title={error} ButtonText="Refresh" Route="/listUsers" Description={""}/>
      ) : users.length === 0 ? (
        <div className='flex flex-col items-center justify-center w-full h-full text-center'>
          <NotFound imagePath='./images/nouser.png' Title='No users found' ButtonText='Go back' Route='/' Description={"We could not find any registered users."} />
        </div>
      ) : (
        <div className="container mx-auto pt-24 ">
          <div className="flex justify-between items-center mb-6">
            {users && <h2 className="text-2xl ms-10">Total Users : {users.length}</h2>}
            <div className="flex justify-end mb-4 mr-10">
              <button
                onClick={() => setLayout('grid')}
                className={`p-2 ${layout === 'grid' ? 'bg-gray-600 text-white' : 'bg-gray-300'} rounded-l`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setLayout('list')}
                className={`p-2 ${layout === 'list' ? 'bg-gray-600 text-white' : 'bg-gray-300'} rounded-r`}
              >
                <List size={20} />
              </button>
            </div>
          </div>

          {/* Grid Layout */}
          {layout === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 m-10">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center"
                >
                  {getUserLogo(user.name)}
                  <h3 className="text-xl font-semibold text-gray-900 mt-4">{user.name}</h3>
                  <p className="text-gray-600 mt-2">{user.email}</p>
                </div>
              ))}
            </div>
          )}

          {/* List Layout */}
          {layout === "list" && (
            <div className="space-y-4 m-10">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300 flex items-center gap-6"
                >
                  {getUserLogo(user.name)}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-gray-600 mt-1">{user.email}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </ErrorBoundary>
  );
};

export default ListUsers;