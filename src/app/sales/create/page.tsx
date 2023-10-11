import SalesCreate from '@/sales/features/SalesCreate'
import SalesHeader from '@/sales/features/SalesHeader'
import PageLayout from '@/shared/components/layouts/pageLayout'
import React from 'react'

export default function SalesPage() {
    return (
        <PageLayout>
            {{
                header: (
                    <SalesHeader />
                ),
                content: <SalesCreate />,
            }}
        </PageLayout>
    )
}

