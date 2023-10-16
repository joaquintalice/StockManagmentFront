'use client'
import Product from '@/stock/data/interfaces/Product'
import ProductRepository from '@/stock/data/repository/Product.repository'
import { Alert, AlertIcon, Badge, Box, Button, Center, Flex, FormControl, FormLabel, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberInput, NumberInputField, Select, Spinner, Stat, StatHelpText, StatLabel, StatNumber, Table, TableContainer, Tbody, Text, Thead, useDisclosure, useToast } from '@chakra-ui/react'
import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { MdOutlinePostAdd } from 'react-icons/md'
import { SalesSchema } from '../schema/sales.schema'
import { RobotoFont, scFont } from '@/shared/utils/fonts'
import SalesRepository from '../data/repository/SalesRepository'
import SalesDetailRepository from '../data/repository/SalesDetailRepository'
import CashboxRepository from '@/cashbox/data/repository/CashboxRepository'



export default function SalesCreate() {

    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false)

    const [stockListData, setStockListData] = useState<Partial<Product[]>>([]);
    const [currentProdID, setCurrentProdID] = useState<number>(); // En el onchange toma el id del producto seleccionado
    const [currentProdData, setCurrentProdData] = useState<Product>({}); // Guarda la data del producto en cuestión fetcheada gracias al ID obtenido previamente
    const [total, setTotal] = useState<number>(0);

    const [loadingModal, setLoadingModal] = useState<boolean>(false);
    const [confirmSaleModal, setConfirmSaleModal] = useState<boolean>(false);

    const formik = useFormik({
        initialValues: {
            name: '',
            quantity: 0,
        },
        onSubmit: (values) => {
            setConfirmSaleModal(false)
            const data = {
                name: currentProdData.name,
                quantity: values.quantity
            }

            const total = currentProdData.sellPrice * values.quantity
            console.log(total)
            setTotal(total)
            console.log(data)
            setConfirmSaleModal(true)

        },
        validate: (values) => {
            setConfirmSaleModal(false)
            const result = SalesSchema.safeParse(values);
            if (result.success) return;
            const errors = {}
            result.error.issues.forEach((error) => {
                errors[error.path[0]] = error.message;
            });
            return errors;
        },
    })

    useEffect(() => {
        async function getStockListData() {
            try {
                const stockData = await ProductRepository.getAll();
                setLoading(false)
                setStockListData(stockData)
                console.log(stockData)
            } catch (error) {
                console.log(error)
            }
        }

        getStockListData()
    }, [])

    useEffect(() => {
        console.log(currentProdID)
        setCurrentProdID(0)
        async function getCurrentProd() {
            try {
                if (currentProdID) {
                    const currentProd = await ProductRepository.getById(+currentProdID);
                    setCurrentProdData(currentProd)
                    console.log('ja')
                    return currentProd
                }
            } catch (error) {
                console.log(error)
            }
        }
        getCurrentProd()
    }, [currentProdID])


    async function handleSubmit() {
        // funcion que va a manejar el boton confirmar del modal
        try {
            const quantityAfterSale = currentProdData.quantity - parseFloat(formik.values.quantity)
            console.log(quantityAfterSale)

            if (quantityAfterSale < 0) {
                // Close the modal and throw the error toast
                onClose();
                toast({
                    position: 'top-right',
                    title: 'No se pudo realizar la venta',
                    description: "No puedes vender más kilos de los existentes en el stock",
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }

            setLoadingModal(true)

            await SalesRepository.insert({ total: total });

            const sale = await SalesRepository.getAll();
            const stockMovementId = sale[sale.length - 1].id;

            const details = {
                "prodId": currentProdData.id,
                "stockMovementId": stockMovementId,
                "quantity": parseFloat(formik.values.quantity),
                "buyPrice": currentProdData.buyPrice,
                "sellPrice": currentProdData.sellPrice,
            }

            // sale detail creation
            await SalesDetailRepository.insert(details);

            // product quantity update
            await ProductRepository.update(currentProdData.id, {
                quantity: quantityAfterSale
            });

            //get the cashbox
            const cashbox = await CashboxRepository.getById(1);

            const updatedCashbox = {
                name: cashbox.name,
                amount: parseFloat((cashbox.amount + total).toFixed(2))
            }
            // Update the cashbox 
            await CashboxRepository.update(1, updatedCashbox);

            // Close the modal and send feedback


            formik.setValues({
                name: '',
                quantity: 0
            })
            onClose();
            setLoadingModal(false)
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
            alert('error je')
        }

    }

    return (
        <>
            {
                loading ? (<>Cargando...</>) :
                    (
                        <Box as='section' w='100%'>
                            <Center>
                                <Heading as='h1' my='2rem'>
                                    Generar venta
                                </Heading>
                            </Center>

                            <Box display='flex' justifyContent='center'>
                                <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '55%' }}>

                                    <FormControl my='0.5rem'>
                                        <FormLabel fontSize='18px'>Producto</FormLabel>
                                        <Select
                                            name='name'
                                            value={formik.values.name}
                                            onChange={(e) => {
                                                formik.handleChange(e)
                                                setCurrentProdID(+(e.target.value))
                                            }}
                                            onBlur={formik.handleBlur}
                                            placeholder='Selecciona el producto'
                                            bg='green.300'
                                            fontSize='20px'>
                                            {
                                                stockListData.map((item) => {

                                                    return (
                                                        <option key={item?.id} value={item?.id}>{item?.name}</option>
                                                    )
                                                }
                                                )
                                            }
                                        </Select>

                                        {
                                            (formik.errors.name != undefined) ? (
                                                <Alert status='error' variant='left-accent' mt='5px'>
                                                    <AlertIcon />
                                                    {formik.errors.name}
                                                </Alert>
                                            ) : (<></>)
                                        }
                                    </FormControl>



                                    <FormControl my='1rem'>
                                        <FormLabel fontSize='18px'>Kilos</FormLabel>
                                        <NumberInput>
                                            <NumberInputField
                                                name="quantity"
                                                value={formik.values.quantity}
                                                onChange={formik.handleChange}
                                                bg='gray.700' fontSize='20px' color='white'
                                            />
                                        </NumberInput>

                                        {
                                            (formik.errors.quantity != undefined) ? (
                                                <Alert status='error' variant='left-accent' mt='5px'>
                                                    <AlertIcon />
                                                    {formik.errors.quantity}
                                                </Alert>
                                            ) : (<></>)
                                        }
                                    </FormControl>

                                    {
                                        currentProdData.id ? (
                                            <>
                                                <Flex gap={{ base: '10', sm: '132' }}>
                                                    <Stat textAlign='center'>
                                                        <StatLabel>C.disponible</StatLabel>
                                                        <StatNumber>{currentProdData.quantity}</StatNumber>
                                                    </Stat>

                                                    <Stat textAlign='center'>
                                                        <StatLabel>P.compra</StatLabel>
                                                        <StatNumber>${currentProdData.buyPrice}</StatNumber>
                                                    </Stat>


                                                    <Stat textAlign='center'>
                                                        <StatLabel>P.venta</StatLabel>
                                                        <StatNumber>${currentProdData.sellPrice}</StatNumber>
                                                    </Stat>
                                                </Flex>

                                            </>
                                        ) : (<></>)
                                    }


                                    <Button
                                        my={4}
                                        color='white'
                                        _hover={{
                                            bg: 'green.500',
                                            color: 'white'
                                        }}
                                        bg='green.300'
                                        type='submit'
                                        fontSize='16px'
                                        leftIcon={<MdOutlinePostAdd />}
                                        onClick={onOpen}
                                    >
                                        Confirmar
                                    </Button>

                                </form>
                            </Box>
                        </Box>
                    )
            }

            {
                loadingModal ? (<>
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
                </>) :
                    confirmSaleModal ? (<>
                        <Modal
                            isOpen={isOpen}
                            onClose={onClose}
                            isCentered
                            size='xl'
                            motionPreset='slideInBottom'>
                            <ModalOverlay />
                            <ModalContent >
                                <ModalHeader className={RobotoFont.className} textAlign='center'>
                                    Confirma la venta de
                                    <Badge fontSize='1em' colorScheme='green'>
                                        {currentProdData.name}
                                    </Badge>
                                </ModalHeader>
                                <ModalCloseButton />
                                <ModalBody>

                                    <TableContainer className={scFont.className} mt='1.2rem'>
                                        <Table>
                                            <Thead>
                                                <tr>
                                                    <th>
                                                        <Text>
                                                            Cantidad
                                                        </Text>
                                                    </th>
                                                    <th>
                                                        <Text>
                                                            Precio por kilo
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
                                                <tr>
                                                    <td>
                                                        <Text textAlign='center'>{formik.values.quantity} Kilos</Text>
                                                    </td>
                                                    <td>
                                                        <Text textAlign='center'>${currentProdData.sellPrice}</Text>
                                                    </td>
                                                    <td>
                                                        <Text textAlign='center'>${total.toFixed(2)}</Text>
                                                    </td>
                                                </tr>
                                            </Tbody>
                                        </Table>
                                    </TableContainer>
                                </ModalBody>

                                <ModalFooter>
                                    <Button colorScheme='red' mr={3} onClick={onClose}>
                                        Cancelar
                                    </Button>
                                    <Button colorScheme='green' onClick={handleSubmit}>
                                        Confirmar
                                    </Button>
                                </ModalFooter>
                            </ModalContent>
                        </Modal >
                    </>) : (<></>)
            }
        </>
    )
}
