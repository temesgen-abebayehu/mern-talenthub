import React from 'react';

interface PendingApprovalListProps {
    users?: Array<{ id: string; name: string; email: string; }>;
}

const PendingApprovalList: React.FC<PendingApprovalListProps> = ({ users = [] }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 mt-4">
            <h3 className="text-lg font-semibold mb-2">Pending Approvals</h3>
            {users.length === 0 ? (
                <div className="text-gray-500">No pending approvals.</div>
            ) : (
                <ul>
                    {users.map(user => (
                        <li key={user.id} className="py-2 border-b last:border-b-0 flex justify-between items-center">
                            <span>{user.name} ({user.email})</span>
                            <button className="bg-blue-500 text-white px-3 py-1 rounded">Approve</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PendingApprovalList;
