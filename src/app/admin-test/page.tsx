import { auth } from '@/lib/auth'

export default async function AdminTestPage() {
  const session = await auth()
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Test Page</h1>
      
      <div className="space-y-4">
        <div className="p-4 bg-muted rounded">
          <h2 className="font-semibold mb-2">Session Data:</h2>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>

        <div className="p-4 bg-muted rounded">
          <h2 className="font-semibold mb-2">User Info:</h2>
          {session?.user ? (
            <ul className="text-sm space-y-1">
              <li>Email: {session.user.email}</li>
              <li>Name: {session.user.name}</li>
              <li>Role: {session.user.role}</li>
              <li>ID: {session.user.id}</li>
            </ul>
          ) : (
            <p className="text-red-500">No session found</p>
          )}
        </div>

        <div className="p-4 bg-muted rounded">
          <h2 className="font-semibold mb-2">Is Admin?</h2>
          <p className={session?.user?.role === 'ADMIN' ? 'text-green-500' : 'text-red-500'}>
            {session?.user?.role === 'ADMIN' ? 'YES - Admin access granted' : 'NO - Not an admin'}
          </p>
        </div>
      </div>
    </div>
  )
}
