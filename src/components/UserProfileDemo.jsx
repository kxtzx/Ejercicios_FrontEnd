import React, { useEffect, useState } from 'react';
import profileData from '../data/profileData.json';
import UserProfileCard from './UserProfileCard';

const defaultPlaceholder = profileData.profileImageUrl || 'https://i.pravatar.cc/150?u=default';

const UserProfileDemo = () => {
  const [imageUrl, setImageUrl] = useState(defaultPlaceholder);

  useEffect(() => {
    // cleanup blob URL on unmount
    return () => {
      if (imageUrl && imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  const handleFileChange = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      const blob = URL.createObjectURL(file);
      // revoke previous blob if any
      setImageUrl(prev => {
        if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev);
        return blob;
      });
    }
  };

  const handleRevert = () => setImageUrl(defaultPlaceholder);

  const data = { ...profileData, profileImageUrl: imageUrl };

  return (
    <div style={{ padding: 20 }}>
      {/* File input works on web; on native this will not render but the demo is primarily for web */}
      {typeof window !== 'undefined' && (
        <div style={{ marginBottom: 12 }}>
          <label style={{ marginRight: 8 }}>
            Subir imagen:
            <input type="file" accept="image/*" onChange={handleFileChange} style={{ marginLeft: 8 }} />
          </label>
          <button onClick={handleRevert} style={{ marginLeft: 8 }}>Revertir</button>
        </div>
      )}

      <UserProfileCard profileData={data} />
    </div>
  );
};

export default UserProfileDemo;
