import SalesCreate2 from '@/sales/features/SalesCreate2'
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
                content: <SalesCreate2 />,
            }}
        </PageLayout>
    )
}

