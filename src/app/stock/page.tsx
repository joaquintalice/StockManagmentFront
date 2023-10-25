import PageLayout from '@/shared/components/layouts/pageLayout';
import MainHeader from '@/stock/features/StockHeader';
import StockList from '@/stock/features/StockList/StockList';

export default async function StockPage() {


    return (
        <PageLayout>
            {{
                header: (
                    <MainHeader
                        title='Stock'
                        btnHref='/stock/create'
                        btnText='Crear Producto'
                    />
                ),
                content: <StockList />,
            }}
        </PageLayout>
    );
};
