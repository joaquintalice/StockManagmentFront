import PageLayout from '@/shared/components/layouts/pageLayout'
import StockCreate from '@/stock/features/StockCreate';
import StockHeader from '@/stock/features/StockHeader';


export default async function StockPage() {


    return (
        <PageLayout>
            {{
                header: (
                    <StockHeader />
                ),
                content: <StockCreate />,
            }}
        </PageLayout>
    );
};
