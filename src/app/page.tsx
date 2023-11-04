import { Text } from '@chakra-ui/react'
import React from 'react'
import PageLayout from '../shared/components/layouts/pageLayout';
import { HomePage } from '@/root/features/HomePage';
import { HomeHeader } from '@/root/features/HomeHeader';

export default function Home() {
  return (
    <PageLayout>
      {{
        header: (
          <HomeHeader />
        ),
        content: <HomePage />,
      }}
    </PageLayout>
  )
}
