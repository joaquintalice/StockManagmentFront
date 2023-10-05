import SalesHeader from '@/sales/features/SalesHeader'
import SalesList from '@/sales/features/SalesList'
import PageLayout from '@/shared/components/layouts/pageLayout'
import React from 'react'

export default function SalesPage() {
    return (
        <PageLayout>
            {{
                header: (
                    <SalesHeader />
                ),
                content: <SalesList />,
            }}
        </PageLayout>
    )
}

