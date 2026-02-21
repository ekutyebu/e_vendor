import { NextRequest, NextResponse } from 'next/server'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            include: {
                _count: { select: { vendors: true, products: true } },
            },
            orderBy: { name: 'asc' },
        })

        return NextResponse.json({ categories })
    } catch (_error) {
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
        }

        const { name, nameFr, slug, description, icon, color } = await req.json()

        const category = await prisma.category.create({
            data: { name, nameFr, slug, description, icon, color },
        })

        return NextResponse.json({ success: true, category }, { status: 201 })
    } catch (_error) {
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
    }
}
