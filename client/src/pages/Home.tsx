import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';

export function Home() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['db-test'],
        queryFn: async () => {
            const response = await apiClient.get('/api/test-db');
            return response.data;
        },
    });

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Sunsama Clone
                </h1>
                <p className="text-gray-600 mb-6">
                    Your personal task management and time blocking app
                </p>

                <div className="border-t pt-4">
                    <h2 className="text-lg font-semibold mb-2">Database Status</h2>
                    {isLoading && <p className="text-gray-500">Connecting...</p>}
                    {error && <p className="text-red-500">Connection failed ❌</p>}
                    {data && (
                        <div className="space-y-2">
                            <p className="text-green-600 font-medium">✓ Connected</p>
                            <div className="text-sm text-gray-600">
                                <p>Users: {data.users}</p>
                                <p>Tasks: {data.tasks}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}