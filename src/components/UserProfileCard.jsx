import React, { useState } from 'react';
import './UserProfileCard.css';

const UserProfileCard = ({ profileData }) => {
  const { 
    profileName, 
    username, 
    profileImageUrl, 
    bio, 
    location, 
    joinDate, 
    followersCount, 
    followingCount 
  } = profileData;
  const { verificationPlatform } = profileData;

  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollowClick = () => {
    setIsFollowing(prev => !prev);
  };

  return (
    <div className="profile-card">
      <div className="header-section">
        <img src={profileImageUrl} alt="Profile" className="profile-image" />
        <button className="edit-button">Edit Profile</button>
      </div>

      <div className="info-section">
        <h2 className="profile-name">
          {profileName}{' '}
          {verificationPlatform === 'x' ? (
            <span className="verification-badge" aria-label="Verificado en X" title="Verificado en X">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="11" fill="#1DA1F2" />
                <path d="M17 9l-5.2 6L7 11.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          ) : (
            <span className="verified-icon">✔️</span>
          )}
        </h2>
        <p className="username">@{username}</p>

        <p className="bio">{bio}</p>
        <div className="details">
          <span className="location">{location}</span>
          <span className="join-date">{joinDate}</span>
        </div>

        <div className="stats-section">
          <span className="count"><strong>{followingCount}</strong> Following</span>
          <span className="count"><strong>{followersCount}</strong> Followers</span>
        </div>
      </div>

      <button 
        className={`follow-button ${isFollowing ? 'following' : 'not-following'}`}
        onClick={handleFollowClick}
      >
        {isFollowing ? 'Siguiendo' : 'Seguir'}
      </button>
    </div>
  );
};

export default UserProfileCard;
