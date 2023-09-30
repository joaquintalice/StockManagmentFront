import PageLayout from '@/shared/components/layouts/pageLayout'
import StockHeader from '@/stock/features/StockHeader'
import StockUpdate from '@/stock/features/StockUpdate'
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher'

export default function page({ params }: Params) {
    console.log(params)

    return (
        <PageLayout>
            {{
                header: (
                    <StockHeader />
                ),
                content: (
                    <StockUpdate id={params.id} />
                ),
            }}
        </PageLayout>
    )
}
