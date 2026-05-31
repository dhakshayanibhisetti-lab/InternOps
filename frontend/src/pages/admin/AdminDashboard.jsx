import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../lib/axios'

export default function AdminDashboard() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const { data, isLoading } = useQuery({
    queryKey: ['adminUsers', page],
    queryFn: () => api.get(`/users?page=${page}&limit=10`).then(res => res.data),
  })

  const suspendMut = useMutation({
    mutationFn: (id) => api.patch(`/users/${id}/suspend`),
    onSuccess: () => queryClient.invalidateQueries('adminUsers')
  })
  const activateMut = useMutation({
    mutationFn: (id) => api.patch(`/users/${id}/activate`),
    onSuccess: () => queryClient.invalidateQueries('adminUsers')
  })
  const deleteMut = useMutation({
    mutationFn: (id) => api.delete(`/users/${id}`),
    onSuccess: () => queryClient.invalidateQueries('adminUsers')
  })

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      {isLoading && <p>Loading...</p>}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.map(u => (
            <tr key={u.id}>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border">{u.role}</td>
              <td className="p-2 border">{u.full_name || '-'}</td>
              <td className="p-2 border">{u.suspended ? 'Suspended' : 'Active'}</td>
              <td className="p-2 border flex gap-2">
                {u.suspended ? (
                  <button onClick={() => activateMut.mutate(u.id)} className="bg-green-500 text-white px-2 py-1 rounded">Activate</button>
                ) : (
                  <button onClick={() => suspendMut.mutate(u.id)} className="bg-yellow-500 text-white px-2 py-1 rounded">Suspend</button>
                )}
                <button onClick={() => deleteMut.mutate(u.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-2 flex gap-2">
        <button onClick={() => setPage(p => Math.max(1, p-1))} className="bg-gray-300 px-3 py-1 rounded" disabled={page===1}>Prev</button>
        <button onClick={() => setPage(p => p+1)} className="bg-gray-300 px-3 py-1 rounded">Next</button>
      </div>
    </div>
  )
}
