import { Stack } from "@chakra-ui/react";
import { ReactNode } from "react";

interface PeopleLayoutProps {
    children: {
        header: ReactNode;
        content: ReactNode;
    };
}

const PageLayout = ({ children }: PeopleLayoutProps) => (
    <Stack h="full" pb={0} px={0} spacing={8}>
        {children.header}
        {children.content}
    </Stack>
);

export default PageLayout;