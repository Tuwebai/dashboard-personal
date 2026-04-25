import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../../../stores/useAppStore';

const PROFILE_READONLY_ERROR = 'PROFILE_READONLY';

export function useProfileSettings() {
  const user = useAppStore((state) => state.user);
  const updateUser = useAppStore((state) => state.updateUser);
  const workspaceReadOnly = useAppStore((state) => state.workspaceReadOnly);
  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
    bio: user.bio || '',
    timezone: user.timezone || 'UTC'
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const savedTimeoutRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (savedTimeoutRef.current !== null) {
      window.clearTimeout(savedTimeoutRef.current);
    }
  }, []);

  const handleFieldChange = (field: keyof typeof profileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const saveProfile = async () => {
    setIsSaving(true);
    try {
      if (workspaceReadOnly) {
        throw new Error(PROFILE_READONLY_ERROR);
      }

      updateUser({
        ...profileData,
        name: profileData.name.trim(),
        email: profileData.email.trim(),
        bio: profileData.bio.trim(),
      });

      setSaved(true);

      if (savedTimeoutRef.current !== null) {
        window.clearTimeout(savedTimeoutRef.current);
      }

      savedTimeoutRef.current = window.setTimeout(() => setSaved(false), 3000);
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

    if (workspaceReadOnly) {
      throw new Error(PROFILE_READONLY_ERROR);
    }

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
    handleAvatarFileChange,
    profileReadonlyError: PROFILE_READONLY_ERROR,
  };
}
