'use client'
import Product from '@/stock/data/interfaces/Product'
import ProductRepository from '@/stock/data/repository/Product.repository'
import { Alert, AlertIcon, Badge, Box, Button, Center, Flex, FormControl, FormLabel, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberInput, NumberInputField, Select, Spinner, Stat, StatArrow, StatGroup, StatHelpText, StatLabel, StatNumber, Table, TableContainer, Tag, Tbody, Td, Text, Th, Thead, useDisclosure, useToast } from '@chakra-ui/react'
import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { MdOutlinePostAdd } from 'react-icons/md'
import { SalesSchema2 } from '../schema/sales2.schema'
import { RobotoFont, scFont } from '@/shared/utils/fonts'
import SalesRepository from '../data/repository/SalesRepository'
import CashboxRepository from '@/cashbox/data/repository/CashboxRepository'
import { FiTrash2 } from 'react-icons/fi'
import ICreateSalesDetail from '../data/interfaces/SalesDetail.interface'
import SalesDetailRepository from '../data/repository/SalesDetailRepository'
import { MdAdd } from 'react-icons/md'



export default function SalesCreate2() {

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


    const [products, setProducts] = useState([{ name: '', quantity: 0 }]);


    const formik = useFormik({
        initialValues: products,

        onSubmit: (values) => {

            console.log(values)
            setConfirmSaleModal(true)
        },
        validate: (values) => {
            setConfirmSaleModal(false)
            const result = SalesSchema2.safeParse(values);
            console.log(result)
            console.log(products)

            if (result.success) {
                if (result.data.length < 1) {
                    alert('no hay productos je')
                    setError(true)
                }
                return
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
            console.log(errors)
            return errors;
        }


    })

    useEffect(() => {
        console.log(formik.initialValues)
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

    /* 
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
     */

    async function handleSale() {
        try {

            setLoadingModal(true)

            await SalesRepository.insert({ total: total });
            const sale = await SalesRepository.getAll();
            const stockMovementId = sale[sale.length - 1].id;


            const data = formik.values
            const details: ICreateSalesDetail[] = []

            data.forEach(async prod => {
                const product = stockListData.find(product => product?.id === +prod.name);

                details.push({
                    prodName: product?.name,
                    stockMovementId: stockMovementId,
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
            onClose();
            toast({
                position: 'top-right',
                title: 'Venta realizada exitosamente',
                description: "La venta ha sido realizada exitosamente",
                status: 'success',
                duration: 5000,
                isClosable: true,
            });

            setTimeout(() => {
                location.reload()
            }, 1000);
        } catch (error) {
            console.log(error)
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

                                <form onSubmit={handleSubmit}>
                                    <Flex>
                                        <Table size='lg'>
                                            <Thead>
                                                <tr>
                                                    <Th>Nombre</Th>
                                                    <Th>Cantidad</Th>
                                                    <Th>Precio por kilo</Th>
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

                                                                                {formik.errors[index].name}
                                                                            </Alert>
                                                                        )
                                                                    }
                                                                </Td>
                                                                <Td>
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
                                        <Button type='submit' colorScheme='green' onClick={onOpen}>Confirmar venta</Button>
                                    </Box>
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
                            size='4xl'
                            motionPreset='slideInBottom'>
                            <ModalOverlay />
                            <ModalContent >
                                <ModalHeader className={RobotoFont.className} textAlign='center'>
                                    Confirma la venta
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
                                                            Producto
                                                        </Text>
                                                    </th>
                                                    <th>
                                                        <Text>
                                                            Cantidad (kg)
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
                                                                <Text>
                                                                    {
                                                                        formik.values[index].quantity
                                                                    }
                                                                </Text>
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
                                    <Button colorScheme='red' mr={3} onClick={onClose}>
                                        Cancelar
                                    </Button>
                                    <Button colorScheme='green' onClick={handleSale}>
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
