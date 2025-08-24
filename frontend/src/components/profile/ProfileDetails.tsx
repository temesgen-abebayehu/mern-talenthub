// src/components/profile/ProfileDetails.tsx
import React, { useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import { userAPI } from '../../services/userService';
import ProfileForm from './ProfileForm';
import AvatarUpload from './AvatarUpload';

interface UserProfile {
  _id?: string;
  name?: string;
  email?: string;
  bio?: string;
  skills?: string[];
  location?: string;
  company?: string;
  website?: string;
  role?: string;
  avatar?: string;
  [key: string]: any;
}

interface ProfileDetailsProps {
  user: UserProfile;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ user }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { updateUser } = useUser();

  const handleSave = async (userData: UserProfile) => {
    setLoading(true);
    try {
      // Remove _id if present in userData
      const { _id, ...profileData } = userData;
      if (!user._id) throw new Error('User ID is missing');
      const response = await userAPI.updateProfile(user._id, profileData);
      updateUser(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      if (!user._id) throw new Error('User ID is missing');
      const response = await userAPI.uploadAvatar(user._id, formData);
      // Update avatar in user context and force re-render
      updateUser({ ...response.data, avatar: response.data.avatarUrl || response.data.avatar });
    } catch (error) {
      console.error('Failed to upload avatar', error);
      alert('Failed to upload avatar. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isEditing) {
    return (
      <ProfileForm
        user={user}
        onSave={handleSave}
        onCancel={() => setIsEditing(false)}
        loading={loading}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-6">
        <AvatarUpload
          currentAvatar={user.avatar}
          onUpload={handleAvatarUpload}
          loading={loading}
        />
        <h2 className="text-xl font-semibold mt-4">{user.name}</h2>
        <p className="text-gray-600">{user.email}</p>
        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-2">
          {user.role}
        </span>
        {user.website && (
          <div className="mt-2 flex items-center justify-center">
            <a
              href={user.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-500 hover:underline"
              title={user.website}
            >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 72 72"
                  fill="none"
                  className="inline-block align-middle text-blue-500"
                  aria-hidden="true"
                >
                  <path
                  d="M43 12c-2.209 0-4 1.791-4 4s1.791 4 4 4h3.344L35.172 31.172c-1.562 1.562-1.562 4.094 0 5.656A3.995 3.995 0 0 0 38 38c1.023 0 2.048-.392 2.828-1.172L52 25.656V29c0 2.209 1.791 4 4 4s4-1.791 4-4V16c0-2.209-1.791-4-4-4H43zm-20 2C18.037 14 14 18.038 14 23v26c0 4.962 4.037 9 9 9h26c4.963 0 9-4.038 9-9v-8c0-2.209-1.791-4-4-4s-4 1.791-4 4v8c0 .551-.448 1-1 1H23c-.552 0-1-.449-1-1V23c0-.551.448-1 1-1h8c2.209 0 4-1.791 4-4s-1.791-4-4-4h-8z"
                  fill="currentColor"
                  />
                </svg>
              <span>Website</span>
            </a>
          </div>
        )}
      </div>
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-bold text-gray-700">Bio</h3>
          <p className="mt-1">{user.bio || 'No bio added yet.'}</p>
        </div>
        {user.skills && user.skills.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-gray-700">Skills</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {user.skills.map((skill: string, index: number) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        {user.location && (
          <div>
            <h3 className="text-sm font-bold text-gray-700">Location</h3>
            <p className="mt-1">{user.location}</p>
          </div>
        )}
        {user.company && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Company</h3>
            <p className="mt-1">{user.company}</p>
          </div>
        )}
      </div>
      <button
        onClick={() => setIsEditing(true)}
        className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
      >
        Edit Profile
      </button>
    </div>
  );
};

export default ProfileDetails;