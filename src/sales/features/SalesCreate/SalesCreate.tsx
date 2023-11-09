'use client'

import { Alert, AlertIcon, Badge, Box, Button, Center, Flex, Heading, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalOverlay, NumberInput, NumberInputField, Spinner, Stat, StatLabel, StatNumber, Table, Tbody, Td, Text, Th, Thead, useDisclosure, useToast } from '@chakra-ui/react'
import { FormikValues, useFormik } from 'formik'
import React, { useEffect, useState, useRef } from 'react'
import { SalesSchema } from '../../schema/sales.schema'

import SalesRepository from '../../data/repository/SalesRepository'

import { FiTrash2 } from 'react-icons/fi'
import ICreateSalesDetail from '../../data/interfaces/SalesDetail.interface'
import SalesDetailRepository from '../../data/repository/SalesDetailRepository'
import { MdAdd } from 'react-icons/md'
import Select, { SingleValue, ActionMeta } from 'react-select';
import ProductRepository from '@/stock/data/repository/Product.repository'
import CashboxRepository from '@/cashbox/data/repository/CashboxRepository'
import SalesCreateConfirmModal from './SalesCreateConfirmModal'
import SalesCreateQuestionModal from './SalesCreateQuestionModal'
import Product from '@/stock/data/interfaces/Product'

import { useReactToPrint } from 'react-to-print'
import SalesCreateTicket from '@/sales/features/SalesCreate/SalesCreateTicket'

export default function SalesCreate() {

    const toast = useToast();

    const loadingModalDisclosure = useDisclosure()
    const confirmSaleModalDisclosure = useDisclosure();
    const questionModalDisclosure = useDisclosure();
    const ticketQuestionModalDisclosure = useDisclosure();


    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false)

    const [stockListData, setStockListData] = useState<Partial<Product[]>>([]);
    const [total, setTotal] = useState<number>(0);

    const [products, setProducts] = useState([{ name: '', quantity: 0 }]);
    const [saleCounter, setSaleCounter] = useState<number>(0);



    const formik = useFormik({
        initialValues: products,

        onSubmit: (values) => {
            confirmSaleModalDisclosure.onOpen()
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

                }
                return;
            };
            setError(false)
            const errors = new Array(values.length);
            result.error.issues.forEach((error) => {
                const index: number = +error.path[0];
                const key = error.path[1];
                if (!errors[index]) {
                    errors[index] = {};
                }
                errors[index][key] = error.message;
            });
            return errors;
        },



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
    }, [saleCounter])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        formik.handleChange(event);
        const updatedValues = { ...formik.values };
        const { name, value } = event.target;
        updatedValues[name] = value;
        calculateTotal(updatedValues);
    };

    const handleChangeInputName = (
        selectedOption: SingleValue<{ label: string | undefined; value: number | undefined; }>,
        actionMeta: ActionMeta<{ label: string | undefined; value: number | undefined; }>
    ) => {
        if (selectedOption && selectedOption.value && actionMeta.name) {
            formik.setFieldValue(actionMeta.name, selectedOption ? selectedOption.value.toString() : '');
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        formik.handleSubmit(event);
        calculateTotal(formik.values);
    };

    const calculateTotal = (values: FormikValues) => {
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
            confirmSaleModalDisclosure.onClose()
            loadingModalDisclosure.onOpen()

            await SalesRepository.insert({ total: total });
            const sale = await SalesRepository.getAll();
            const stockMovementId = sale[sale.length - 1].id;


            const data = formik.values
            const details: ICreateSalesDetail[] = []
            data.forEach(async prod => {
                const product = stockListData.find(product => product?.id === +prod.name);
                if (product) {
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
                }
            })

            await SalesDetailRepository.insert(details)

            const cashbox = await CashboxRepository.getById(1);
            const updatedCashbox = {
                name: cashbox.name,
                amount: parseFloat((cashbox.amount + total).toFixed(2))
            }

            await CashboxRepository.update(1, updatedCashbox);


            loadingModalDisclosure.onClose()
            questionModalDisclosure.onOpen()


            toast({
                position: 'top-right',
                title: 'Venta realizada exitosamente',
                description: "La venta ha sido realizada exitosamente",
                status: 'success',
                duration: 5000,
                isClosable: true,
            });

            formik.resetForm()
            setSaleCounter(saleCounter + 1)

        } catch (error) {
            console.log(error)
            setError(true)
        }
    }

    const componentToPrintRef = useRef<HTMLDivElement>()
    const handlePrint = useReactToPrint({
        content: () => componentToPrintRef.current,
    })

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
                                        <Flex >
                                            <Table size={{ base: 'sm', lg: 'lg' }} overflowX='auto'>
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
                                                            formik.values.map((producto, index) => {

                                                                return (
                                                                    <tr key={index}>
                                                                        <Td width='30%'>
                                                                            <Select
                                                                                name={`[${index}].name`}
                                                                                onChange={handleChangeInputName}
                                                                                onBlur={formik.handleBlur}
                                                                                options={stockListData.map(prod => ({ label: prod?.name, value: prod?.id }))}
                                                                                placeholder='Selecciona el producto'
                                                                            />
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
                                                                                                    .map(prod => {

                                                                                                        return (
                                                                                                            <Text key={prod?.id}>
                                                                                                                {prod?.quantity} {prod?.unit}
                                                                                                            </Text>

                                                                                                        )
                                                                                                    }
                                                                                                    )}
                                                                                        </Badge>
                                                                                    </Alert>
                                                                                ) : (<></>)
                                                                            }
                                                                            <NumberInput>
                                                                                <Input
                                                                                    type='number'
                                                                                    name={`[${index}].quantity`}
                                                                                    value={producto.quantity ? producto.quantity : ''}
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
                                                                                        const finalPrice = prod ? (prod.sellPrice * formik.values[index].quantity).toFixed(2) : null

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
                                                                )
                                                            })
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
                                            <Button type='submit' colorScheme='green'>Confirmar venta</Button>
                                        </Box>
                                    </form>
                                </Box>

                            </Box>
                        )
            }

            {
                <Modal
                    isOpen={loadingModalDisclosure.isOpen}
                    onClose={() => loadingModalDisclosure.onClose()}
                    isCentered
                    size='4xl'
                    motionPreset='slideInBottom'>
                    <ModalOverlay />
                    <ModalContent >
                        <ModalCloseButton />
                        <ModalBody p='5rem' textAlign='center'>
                            <Spinner color='red.500' size='lg' />
                        </ModalBody>
                    </ModalContent>
                </Modal >

            }

            {
                <SalesCreateConfirmModal
                    isOpen={confirmSaleModalDisclosure.isOpen}
                    onClose={() => confirmSaleModalDisclosure.onClose()}
                    formikValues={formik.values}
                    stockListData={stockListData}
                    total={total}
                    handleSaleFunction={handleSale}
                    handlePrint={() => handlePrint()}
                />
            }

            {
                <SalesCreateQuestionModal
                    isOpen={questionModalDisclosure.isOpen}
                    onClose={() => questionModalDisclosure.onClose()}
                />
            }

            {
                <Box style={{ display: 'none' }}>
                    <SalesCreateTicket
                        formikValues={formik.values}
                        stockListData={stockListData}
                        total={total}
                        ref={componentToPrintRef}
                    />
                </Box>
            }


        </>
    )
}
