import CashboxAmount from '@/cashbox/features/CashboxAmount'
import CashboxHeader from '@/cashbox/features/CashboxHeader'
import PageLayout from '@/shared/components/layouts/pageLayout'
import React from 'react'

export default function SalesPage() {
    return (
        <PageLayout>
            {{
                header: (
                    <CashboxHeader />
                ),
                content: (
                    <CashboxAmount />
                )
            }}
        </PageLayout>
    )
}

