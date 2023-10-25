import PageLayout from '@/shared/components/layouts/pageLayout';
import StockHeader from '@/stock/features/StockHeader';
import StockList from '@/stock/features/StockList/StockList';

export default async function StockPage() {


    return (
        <PageLayout>
            {{
                header: (
                    <StockHeader />
                ),
                content: <StockList />,
            }}
        </PageLayout>
    );
};
