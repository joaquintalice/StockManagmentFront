import PageLayout from '@/shared/components/layouts/pageLayout'
import MainHeader from '@/stock/features/StockHeader'
import StockUpdate from '@/stock/features/StockUpdate/StockUpdate'
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher'

export default function page({ params }: Params) {

    return (
        <PageLayout>
            {{
                header: (
                    <MainHeader
                        title='Stock'
                        btnHref='/stock'
                        btnText='Volver a la lista de stock'
                    />
                ),
                content: (
                    <StockUpdate id={params.id} />
                ),
            }}
        </PageLayout>
    )
}
