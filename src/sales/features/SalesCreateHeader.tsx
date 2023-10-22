'use client'
import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { AiOutlineClose } from 'react-icons/ai'

const SalesCreateHeader = () => {
    const router = useRouter();
    const navigateToSaleList = useCallback(
        () => router.push("/sales"),
        [router]
    );

    return (
        <Flex justify="space-between" wrap='wrap' gap={1}>
            <Link href='/stock'>
                <Heading justifyContent='center' as='h1'>Ventas</Heading>
            </Link>

            <Box display='flex' gap={2} flexWrap={{ base: 'wrap' }} justifyContent='center' >
                <Button
                    variant="outline"
                    onClick={navigateToSaleList}
                    color='white'
                    _hover={{ background: 'green.700' }}
                    background='green.500'
                    leftIcon={<AiOutlineClose />}
                >
                    Volver a la lista de ventas
                </Button>

            </Box>
        </Flex>
    );
};

export default SalesCreateHeader;