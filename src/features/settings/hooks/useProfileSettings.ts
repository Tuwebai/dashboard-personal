import { useState, useRef } from 'react';
import { useAppStore } from '../../../stores/useAppStore';

export function useProfileSettings() {
  const { user, updateUser } = useAppStore();
  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
    bio: user.bio || '',
    timezone: user.timezone || 'UTC'
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFieldChange = (field: keyof typeof profileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const saveProfile = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      updateUser(profileData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;

        if (typeof result !== 'string') {
          reject(new Error('avatar-read-failed'));
          return;
        }

        updateUser({ avatar: result });
        resolve();
      };
      reader.onerror = () => reject(new Error('avatar-read-failed'));
      reader.readAsDataURL(file);
    });
  };

  return {
    user,
    profileData,
    isSaving,
    saved,
    fileInputRef,
    handleFieldChange,
    saveProfile,
    handleAvatarClick,
    handleAvatarFileChange
  };
}
