import React from 'react';

interface StatsCardProps {
    title: string;
    value: number | string;
    icon?: React.ReactNode;
    color?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color }) => {
    return (
        <div className={`rounded-lg shadow-md p-4 flex items-center ${color || 'bg-white'}`}>
            {icon && <div className="mr-4 text-3xl">{icon}</div>}
            <div>
                <div className="text-gray-500 text-sm font-medium">{title}</div>
                <div className="text-2xl font-bold">{value}</div>
            </div>
        </div>
    );
};

export default StatsCard;
