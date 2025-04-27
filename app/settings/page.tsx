'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const Settings: React.FC = () => {
    const router = useRouter();

    // Notification preference state
    const [notificationPreferences, setNotificationPreferences] = useState<string>('EMAIL_ONLY');

    const handleSave = () => {
        // TODO: Call your API to save preferences
        console.log('Saving preferences:', { notificationPreferences });
        // Show toast or feedback
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <button
                onClick={() => router.back()}
                className="text-sm text-gray-500 hover:underline mb-4"
            >
                ← Back to Profile
            </button>

            <h1 className="text-2xl font-bold mb-4">Settings</h1>

            <div className="space-y-4">
                {/* Change Password */}
                <label className="block">
                    <span className="text-gray-700">Change Password</span>
                    <input
                        type="password"
                        placeholder="New Password"
                        className="mt-1 block w-full border rounded p-2"
                    />
                </label>

                {/* Notification Preferences */}
                <label className="block">
                    <span className="text-gray-700">Notification Preferences</span>
                    <div className="mt-1">
                        <Select
                            value={notificationPreferences}
                            onValueChange={(value) => setNotificationPreferences(value)}
                        >
                            <SelectTrigger className="w-60">
                                <SelectValue placeholder="Select preference" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="EMAIL_ONLY">Email Only</SelectItem>
                                <SelectItem value="PUSH_NOTIFICATIONS">Push Notifications</SelectItem>
                                <SelectItem value="NONE">None</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </label>

                <button
                    onClick={handleSave}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default Settings;
