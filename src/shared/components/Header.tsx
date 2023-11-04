'use client'
import { Button, Flex, Heading } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

interface HeaderProps {
    title: string
    btnHref: string
    btnText: string
}

const MainHeader: React.FC<HeaderProps> = ({ title, btnHref, btnText }) => {
    const router = useRouter();
    const navigateToCreateStock = useCallback(
        () => router.push(`${btnHref}`),
        [router]
    );


    return (
        <Flex justify="space-between" wrap='wrap' gap={1} my={15} mx={15}>
            <Link href='/'>
                <Heading justifyContent='center' as='h1'>{title}</Heading>
            </Link>

            <Button
                variant="outline"
                onClick={navigateToCreateStock}
                colorScheme="teal" >
                {btnText}
            </Button>
        </Flex>
    );
};

export default MainHeader;