// src/pages/Profile/ProfilePage.jsx
import React from 'react';
import { useUser } from '../../contexts/UserContext';
import { Link } from 'react-router-dom';
import ProfileDetails from '../../components/profile/ProfileDetails';
import ApplicationHistory from '../../components/profile/ApplicationHistory';

const ProfilePage = () => {
  const { user, loading } = useUser();


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!loading && !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to view your profile</h2>
          <Link
            to="/login"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
        {user && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Details */}
            <div className="lg:col-span-1">
              <ProfileDetails user={user} />
            </div>
            {/* Application History */}
            <div className="lg:col-span-2">
              <ApplicationHistory userId={user._id} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;