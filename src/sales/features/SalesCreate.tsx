'use client'
import Product from '@/stock/data/interfaces/Product'
import ProductRepository from '@/stock/data/repository/Product.repository'
import { Alert, AlertIcon, Badge, Box, Button, Center, Flex, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberInput, NumberInputField, Select, Spinner, Stat, StatLabel, StatNumber, Table, TableContainer, Tag, Tbody, Td, Text, Th, Thead, useDisclosure, useToast } from '@chakra-ui/react'
import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { SalesSchema } from '../schema/sales.schema'
import { RobotoFont, scFont } from '@/shared/utils/fonts'
import SalesRepository from '../data/repository/SalesRepository'
import CashboxRepository from '@/cashbox/data/repository/CashboxRepository'
import { FiTrash2 } from 'react-icons/fi'
import ICreateSalesDetail from '../data/interfaces/SalesDetail.interface'
import SalesDetailRepository from '../data/repository/SalesDetailRepository'
import { MdAdd } from 'react-icons/md'
import Link from 'next/link'



export default function SalesCreate2() {

    const toast = useToast();

    const { isOpen, onOpen, onClose } = useDisclosure();
    const confirmSaleModalDisclosure = useDisclosure();
    const saleFinishedModalDisclosure = useDisclosure();


    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false)

    const [stockListData, setStockListData] = useState<Partial<Product[]>>([]);
    const [total, setTotal] = useState<number>(0);

    const [loadingModal, setLoadingModal] = useState<boolean>(false);


    const [products, setProducts] = useState([{ name: '', quantity: 0 }]);


    const formik = useFormik({
        initialValues: products,

        onSubmit: (values) => {
        },
        validate: (values) => {
            const result = SalesSchema.safeParse(values);

            if (result.success) {
                if (result.data.length < 1) {
                    toast({
                        title: 'No hay productos',
                        description: "Puedes agregar productos en el botón 'Agregar producto'",
                        status: 'info',
                        duration: 9000,
                        position: 'top-right',
                        isClosable: true,
                    })
                    setError(true)
                }
                return;
            };
            setError(false)
            const errors = new Array(values.length);
            result.error.issues.forEach((error) => {
                const index = error.path[0];
                const key = error.path[1];
                if (!errors[index]) {
                    errors[index] = {};
                }
                errors[index][key] = error.message;
            });
            return errors;
        }


    })

    useEffect(() => {
        setError(false)
        async function getStockListData() {
            try {
                const stockData = await ProductRepository.getAll();
                setLoading(false)
                setStockListData(stockData)
            } catch (error) {
                setLoading(false)
                setError(true)
            }
        }

        getStockListData()
    }, [])

    const handleChange = (event) => {
        formik.handleChange(event);
        const updatedValues = { ...formik.values };
        const { name, value } = event.target;
        updatedValues[name] = value;
        calculateTotal(updatedValues);
    };

    const handleSubmit = (event) => {
        formik.handleSubmit(event);
        calculateTotal(formik.values);
    };

    const calculateTotal = (values) => {
        let totalPrice = 0;
        if (Array.isArray(values)) {
            values.forEach((producto) => {
                const productData = stockListData.find(prod => prod?.id === +producto?.name);
                if (productData) {
                    totalPrice += productData?.sellPrice * producto.quantity;
                }
            });
        }
        setTotal(totalPrice);
    };

    useEffect(() => {
        calculateTotal(formik.values);
    }, [formik.values]);

    async function handleSale() {
        try {

            setLoadingModal(true)

            await SalesRepository.insert({ total: total });
            const sale = await SalesRepository.getAll();
            const stockMovementId = sale[sale.length - 1].id;

            console.log(sale)

            const data = formik.values
            const details: ICreateSalesDetail[] = []

            data.forEach(async prod => {
                const product = stockListData.find(product => product?.id === +prod.name);

                details.push({
                    prodName: product?.name,
                    stockMovementId: stockMovementId,
                    unit: product?.unit,
                    quantity: +prod.quantity,
                    buyPrice: product?.buyPrice,
                    sellPrice: product?.sellPrice
                });

                await ProductRepository.update(product?.id, {
                    quantity: (product?.quantity) - (+prod.quantity)
                });
            })

            await SalesDetailRepository.insert(details)

            const cashbox = await CashboxRepository.getById(1);
            const updatedCashbox = {
                name: cashbox.name,
                amount: parseFloat((cashbox.amount + total).toFixed(2))
            }

            await CashboxRepository.update(1, updatedCashbox);

            setLoadingModal(false)
            confirmSaleModalDisclosure.onClose()
            saleFinishedModalDisclosure.onOpen()

            toast({
                position: 'top-right',
                title: 'Venta realizada exitosamente',
                description: "La venta ha sido realizada exitosamente",
                status: 'success',
                duration: 5000,
                isClosable: true,
            });


        } catch (error) {
            console.log(error)
            setError(true)
        }
    }

    return (
        <>
            {
                loading ?
                    (<>Cargando...</>)
                    :
                    error ?
                        (<>No hay suficientes datos para realizar una venta</>)
                        :
                        (
                            <Box as='section' w='100%'>
                                <Center>
                                    <Heading as='h1' my='2rem'>
                                        Generar venta
                                    </Heading>
                                </Center>

                                <Box display='flex' justifyContent='center'>
                                    <form onSubmit={handleSubmit}>
                                        <Flex>
                                            <Table size='lg'>
                                                <Thead>
                                                    <tr>
                                                        <Th>Nombre</Th>
                                                        <Th>Cantidad</Th>
                                                        <Th>Precio</Th>
                                                        <Th>Precio final</Th>
                                                        <Th></Th>
                                                    </tr>
                                                </Thead>
                                                <Tbody>
                                                    {
                                                        error ? (
                                                            <tr>
                                                                <Td my={5}>No hay productos</Td>
                                                            </tr>) :
                                                            formik.values.map((producto, index) => (
                                                                <tr key={index}>
                                                                    <Td>
                                                                        <Select
                                                                            name={`[${index}].name`}
                                                                            value={producto.name}
                                                                            onChange={handleChange}
                                                                            onBlur={formik.handleBlur}
                                                                            placeholder='Selecciona el producto'
                                                                            bg='green.300'
                                                                            fontSize='20px'>
                                                                            {
                                                                                stockListData.map((item) => (
                                                                                    <option key={item?.id} value={item?.id}>{item?.name}</option>
                                                                                ))
                                                                            }
                                                                        </Select>
                                                                        {
                                                                            formik.errors[index] && formik.errors[index].name && (
                                                                                <Alert status='error' variant='left-accent' mt='5px'>
                                                                                    <AlertIcon />
                                                                                    {formik.errors[index].name}
                                                                                </Alert>
                                                                            )
                                                                        }
                                                                    </Td>
                                                                    <Td>
                                                                        {
                                                                            formik.values[index].name ? (
                                                                                <Alert status='info' variant='top-accent' fontSize='14px' display='flex' alignItems='center' gap={2}>
                                                                                    <AlertIcon />
                                                                                    Stock actual:
                                                                                    <Badge fontSize='1.3em' colorScheme='green'>
                                                                                        {
                                                                                            stockListData
                                                                                                .filter(prod => prod?.id === +producto?.name)
                                                                                                .map(prod => (
                                                                                                    <Text key={prod?.id}>
                                                                                                        {prod?.quantity} {prod?.unit}
                                                                                                    </Text>

                                                                                                ))}
                                                                                    </Badge>
                                                                                </Alert>
                                                                            ) : (<></>)
                                                                        }
                                                                        <NumberInput>
                                                                            <NumberInputField
                                                                                name={`[${index}].quantity`}
                                                                                value={producto.quantity}
                                                                                onChange={handleChange}
                                                                                bg='gray.700' fontSize='20px' color='white'
                                                                            />
                                                                        </NumberInput>
                                                                        {
                                                                            formik.errors[index] && formik.errors[index].quantity && (
                                                                                <Alert status='error' variant='left-accent' mt='5px'>
                                                                                    <AlertIcon />
                                                                                    {formik.errors[index].quantity}
                                                                                </Alert>
                                                                            )
                                                                        }
                                                                    </Td>
                                                                    <Td textAlign='center'>
                                                                        {
                                                                            stockListData
                                                                                .filter(prod => prod?.id === +producto?.name)
                                                                                .map(prod => (
                                                                                    <Text key={prod?.id}>
                                                                                        ${prod?.sellPrice}
                                                                                    </Text>
                                                                                ))
                                                                        }
                                                                    </Td>
                                                                    <Td textAlign='center'>
                                                                        {
                                                                            stockListData
                                                                                .filter(prod => prod?.id === +producto?.name)
                                                                                .map(prod => {
                                                                                    const finalPrice = (prod?.sellPrice * formik.values[index].quantity).toFixed(2)

                                                                                    return (
                                                                                        <Text key={prod?.id}>
                                                                                            ${finalPrice}
                                                                                        </Text>
                                                                                    )
                                                                                })
                                                                        }
                                                                    </Td>
                                                                    <Td textAlign='center'>

                                                                        <Button
                                                                            type="button"
                                                                            colorScheme='red'
                                                                            onClick={() => {
                                                                                const newValues = formik.values.filter((_, productIndex) => productIndex !== index);
                                                                                formik.setValues(newValues);
                                                                            }}
                                                                        >
                                                                            <FiTrash2 />
                                                                        </Button>
                                                                    </Td>
                                                                </tr>
                                                            ))
                                                    }

                                                </Tbody>
                                            </Table>
                                        </Flex>

                                        <Table size='lg'>
                                            <Tbody>
                                                <tr>
                                                    <Td>
                                                        <Button
                                                            colorScheme='teal'
                                                            onClick={() => {
                                                                formik.setValues([...formik.values, { name: '', quantity: 0 }]);
                                                            }}
                                                            leftIcon={<MdAdd />}
                                                        >
                                                            Agregar producto
                                                        </Button>
                                                    </Td>
                                                    <Td></Td>
                                                    <Td></Td>
                                                    <Td>
                                                        <Stat textAlign='end'>
                                                            <StatLabel fontSize={18}>Total</StatLabel>
                                                            <StatNumber fontSize={27}>${total.toFixed(2)}</StatNumber>
                                                        </Stat>
                                                    </Td>
                                                    <Td></Td>
                                                </tr>
                                            </Tbody>
                                        </Table>

                                        <Box textAlign='center' mt={10}>
                                            <Button type='submit' colorScheme='green' onClick={() => confirmSaleModalDisclosure.onOpen()}>Confirmar venta</Button>
                                        </Box>
                                    </form>
                                </Box>

                            </Box>
                        )
            }

            {
                loadingModal ?
                    (<>
                        <Modal
                            isOpen={isOpen}
                            onClose={onClose}
                            isCentered
                            size='xl'
                            motionPreset='slideInBottom'>
                            <ModalOverlay />
                            <ModalContent >
                                <ModalCloseButton />
                                <ModalBody p='5rem' textAlign='center'>
                                    <Spinner color='red.500' size='lg' />
                                </ModalBody>
                            </ModalContent>
                        </Modal >
                    </>)
                    : <></>
            }

            {
                <Modal
                    isOpen={confirmSaleModalDisclosure.isOpen}
                    onClose={() => confirmSaleModalDisclosure.onClose()}
                    isCentered
                    size='4xl'
                    motionPreset='slideInBottom'>
                    <ModalOverlay />
                    <ModalContent >
                        <ModalHeader className={RobotoFont.className} textAlign='center'>
                            Confirma la venta
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>

                            <TableContainer className={scFont.className} mt='1.2rem'>
                                <Table>
                                    <Thead>
                                        <tr>
                                            <th>
                                                <Text>
                                                    Producto
                                                </Text>
                                            </th>
                                            <th>
                                                <Text>
                                                    Cantidad
                                                </Text>
                                            </th>
                                            <th>
                                                <Text>
                                                    Precio de venta
                                                </Text>
                                            </th>
                                            <th>
                                                <Text>
                                                    Total
                                                </Text>
                                            </th>
                                        </tr>
                                    </Thead>
                                    <Tbody>
                                        {
                                            formik.values.map((producto, index) => (
                                                <tr key={index}>
                                                    <Td textAlign='center' fontSize={18}>
                                                        {
                                                            stockListData
                                                                .filter(prod => prod?.id === +producto?.name)
                                                                .map(prod => (
                                                                    <Text key={prod?.id} >
                                                                        <Tag colorScheme='green' >
                                                                            {prod?.name}
                                                                        </Tag>
                                                                    </Text>
                                                                ))
                                                        }
                                                    </Td>
                                                    <Td textAlign='center'>
                                                        {
                                                            stockListData
                                                                .filter(prod => prod?.id === +producto?.name)
                                                                .map(prod => (
                                                                    <Text key={prod?.id} >
                                                                        <Tag colorScheme='green' >
                                                                            {formik.values[index].quantity} {prod?.unit}
                                                                        </Tag>
                                                                    </Text>
                                                                ))
                                                        }
                                                    </Td>
                                                    <Td textAlign='center'>
                                                        {
                                                            stockListData
                                                                .filter(prod => prod?.id === +producto?.name)
                                                                .map(prod => (
                                                                    <Text key={prod?.id}>
                                                                        ${prod?.sellPrice} por {prod?.unit.toLocaleLowerCase()}
                                                                    </Text>
                                                                ))
                                                        }
                                                    </Td>
                                                    <Td textAlign='center'>
                                                        {
                                                            stockListData
                                                                .filter(prod => prod?.id === +producto?.name)
                                                                .map(prod => {
                                                                    const finalPrice = (prod?.sellPrice * formik.values[index].quantity).toFixed(2)

                                                                    return (
                                                                        <Text key={prod?.id}>
                                                                            ${finalPrice}
                                                                        </Text>
                                                                    )
                                                                })
                                                        }
                                                    </Td>
                                                </tr>
                                            ))
                                        }
                                        {
                                            <tr>
                                                <Td></Td>
                                                <Td></Td>
                                                <Td></Td>
                                                <Td fontSize={20} fontWeight='bold' textAlign='center'>${total.toFixed(2)}</Td>
                                            </tr>

                                        }
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </ModalBody>

                        <ModalFooter>
                            <Button colorScheme='red' mr={3} onClick={() => confirmSaleModalDisclosure.onClose()}>
                                Cancelar
                            </Button>
                            <Button colorScheme='green' onClick={() => handleSale()}>
                                Confirmar
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            }

            {
                <Modal
                    isOpen={saleFinishedModalDisclosure.isOpen}
                    onClose={() => saleFinishedModalDisclosure.onClose()}
                    isCentered
                    size='4xl'
                    motionPreset='slideInBottom'
                >
                    <ModalOverlay />
                    <ModalContent >
                        <ModalHeader className={RobotoFont.className} textAlign='center'>
                            ¿Desea generar otra venta?
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Text>
                                Presiona
                                <Badge fontSize='1em' colorScheme='green'>
                                    Si
                                </Badge> para mantenerte en esta página y generar otra venta.
                            </Text>
                            <Text>
                                Presiona <Badge fontSize='1em' colorScheme='red'>
                                    No
                                </Badge> para salir hacia el registro de ventas.
                            </Text>
                        </ModalBody>

                        <ModalFooter>
                            <Link href='/sales'>
                                <Button colorScheme='red' mr={3}>
                                    No
                                </Button>
                            </Link>
                            <Button colorScheme='green' onClick={() => { saleFinishedModalDisclosure.onClose(); location.reload() }}>
                                Si
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal >
            }

        </>
    )
}
