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
    // Simulate API save
    await new Promise(resolve => setTimeout(resolve, 800));
    updateUser(profileData);
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert to Base64 for local storage
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      updateUser({ avatar: base64 });
    };
    reader.readAsDataURL(file);
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
