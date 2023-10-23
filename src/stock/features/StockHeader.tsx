'use client'
import { Box, Button, Flex, Heading, Input } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

const StockHeader = () => {
    const router = useRouter();
    const navigateToCreateStock = useCallback(
        () => router.push("/stock/create"),
        [router]
    );


    return (
        <Flex justify="space-between" wrap='wrap' gap={1}>
            <Link href='/stock'>
                <Heading justifyContent='center' as='h1'>Stock</Heading>
            </Link>

            <Button
                variant="outline"
                onClick={navigateToCreateStock}
                colorScheme="teal" >
                Crear producto
            </Button>
        </Flex>
    );
};

export default StockHeader;