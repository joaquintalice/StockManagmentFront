import React from 'react'
import { Button, Card, CardBody, CardFooter, Center, Heading, Image, Stack, Text } from '@chakra-ui/react'
import Link from 'next/link';

interface cardProps {
  image: string;
  heading: string;
  description: string;
  buttonText: string;
  buttonColorScheme: string;
  btnHref: string;
}

export const HomeCard: React.FC<cardProps> = ({ buttonColorScheme, buttonText, description, heading, image, btnHref }) => {
  return (
    <Card
      direction={{ base: 'column', sm: 'row' }}
      overflow='hidden'
      variant='elevated'
      w='100%'
    >
      <Image
        objectFit='cover'
        maxW={{ base: '100%', sm: '200px' }}
        src={image}
        alt='Caffe Latte'
      />
      <Stack>
        <CardBody>
          <Heading size='md'>{heading}</Heading>

          <Text py='2'>
            {description}
          </Text>
        </CardBody>

        <CardFooter>
          <Link href={btnHref}>
            <Button variant='solid' colorScheme={buttonColorScheme ? buttonColorScheme : 'green'}>
              {buttonText}
            </Button>
          </Link>
        </CardFooter>
      </Stack>
    </Card>
  )
}
