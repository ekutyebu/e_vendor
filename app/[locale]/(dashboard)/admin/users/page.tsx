import { getLocale } from 'next-intl/server'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { 
    Users, 
    UserPlus, 
    Mail, 
    Shield, 
    User, 
    MoreHorizontal,
    Search,
    Lock,
    Trash2
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'

function RoleBadge({ role }: { role: string }) {
    switch (role) {
        case 'ADMIN':
            return <Badge className="bg-purple-100 text-purple-700 border-0 text-[10px] gap-1 font-bold"><Shield className="w-3 h-3" /> ADMIN</Badge>
        case 'VENDOR':
            return <Badge className="bg-orange-100 text-orange-700 border-0 text-[10px] gap-1 font-bold"><User className="w-3 h-3" /> VENDOR</Badge>
        default:
            return <Badge variant="secondary" className="text-[10px] font-bold">CUSTOMER</Badge>
    }
}

export default async function AdminUsersPage() {
    const locale = await getLocale()
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
        redirect(`/${locale}/signin`)
    }

    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50
    })

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter italic">User Directory</h1>
                    <p className="text-muted-foreground text-sm">Manage access control and user profiles.</p>
                </div>
                <Button className="bg-[#131921] hover:bg-blue-600 text-white font-bold gap-2">
                    <UserPlus className="w-4 h-4" /> Add Staff
                </Button>
            </div>

            <div className="bg-white dark:bg-white/5 border rounded-2xl overflow-hidden shadow-sm">
                <div className="p-4 border-b flex items-center gap-4 bg-gray-50/30">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Search users..." className="pl-9 h-9" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[10px] uppercase font-black tracking-widest text-muted-foreground bg-gray-50/50 border-b">
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Joined</th>
                                <th className="px-6 py-4">Phone</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-sm">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs">
                                                {user.image ? (
                                                    <Image src={user.image} alt={user.name} width={32} height={32} className="rounded-full" />
                                                ) : (
                                                    user.name.charAt(0)
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold">{user.name}</span>
                                                <span className="text-[10px] text-muted-foreground italic">{user.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <RoleBadge role={user.role} />
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs">
                                        {user.phone || '—'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100 rounded-lg">
                                                <Lock className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50 hover:text-red-600 rounded-lg">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
