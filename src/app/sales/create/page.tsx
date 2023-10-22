import SalesCreate from '@/sales/features/SalesCreate'
import SalesCreateHeader from '@/sales/features/SalesCreateHeader'
import PageLayout from '@/shared/components/layouts/pageLayout'
import React from 'react'

export default function SalesPage() {
    return (
        <PageLayout>
            {{
                header: (
                    <SalesCreateHeader />
                ),
                content: <SalesCreate />,
            }}
        </PageLayout>
    )
}

