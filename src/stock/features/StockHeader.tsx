'use client'
import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

const StockHeader = () => {
    const router = useRouter();
    const navigateToCreateStock = useCallback(
        () => router.push("/stock/create"),
        [router]
    );

    const navigateToSell = useCallback(
        () => router.push("/stock"),
        [router]
    );

    return (
        <Flex justify="space-between" wrap='wrap' gap={1}>
            <Link href='/stock'>
                <Heading justifyContent='center' as='h1'>Stock</Heading>
            </Link>

            <Box display='flex' gap={2} flexWrap={{ base: 'wrap' }} justifyContent='center' >
                <Button
                    variant="outline"
                    onClick={navigateToCreateStock}
                    colorScheme="teal"
                >
                    Crear producto
                </Button>

                {/* <Button
                    variant="outline"
                    onClick={navigateToSell}
                    colorScheme="teal"
                >
                    Generar venta
                </Button> */}
            </Box>
        </Flex>
    );
};

export default StockHeader;