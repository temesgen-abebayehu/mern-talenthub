import React from 'react';

interface Activity {
    id: string;
    description: string;
    date: string;
}

interface RecentActivityProps {
    activities?: Activity[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities = [] }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 mt-4">
            <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
            {activities.length === 0 ? (
                <div className="text-gray-500">No recent activity.</div>
            ) : (
                <ul>
                    {activities.map(activity => (
                        <li key={activity.id} className="py-2 border-b last:border-b-0">
                            <div>{activity.description}</div>
                            <div className="text-xs text-gray-400">{activity.date}</div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default RecentActivity;
