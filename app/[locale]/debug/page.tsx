import { prisma } from '@/lib/prisma'

export default async function DebugPage() {
    let dbStatus = 'Checking...'
    let error = null

    try {
        // Test query
        const count = await prisma.user.count()
        dbStatus = `Connected! User count: ${count}`
    } catch (e: any) {
        dbStatus = 'Failed'
        error = {
            message: e.message,
            code: e.code,
            meta: e.meta,
        }
    }

    return (
        <div className="p-10 font-mono">
            <h1 className="text-2xl font-bold mb-4">Database Debug Info</h1>
            <p className="mb-2"><strong>Status:</strong> {dbStatus}</p>
            {error && (
                <div className="bg-red-50 p-4 rounded border border-red-200">
                    <p className="font-bold text-red-600 mb-2">Error Details:</p>
                    <pre className="text-sm overflow-auto text-red-800">
                        {JSON.stringify(error, null, 2)}
                    </pre>
                </div>
            )}
            <div className="mt-10 pt-10 border-t">
                <p className="text-xs text-gray-400">Environment:</p>
                <pre className="text-[10px] text-gray-500">
                    NODE_ENV: {process.env.NODE_ENV}
                    DATABASE_URL: {process.env.DATABASE_URL ? 'PRESENT (hidden for security)' : 'MISSING'}
                </pre>
            </div>
        </div>
    )
}
