import React from 'react'
import ICreateSalesDetail from '../data/interfaces/SalesDetail.interface'
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, ModalProps, Table, TableContainer, Tbody, Td, Text, Thead, UseDisclosureProps, useDisclosure } from '@chakra-ui/react';
import { RobotoFont, scFont } from '@/shared/utils/fonts';

type salesDetailsProp = {
    data: ICreateSalesDetail[]
    isOpen: boolean
    onClose: () => void
}

export default function SalesDetailList({ data, isOpen, onClose }: salesDetailsProp) {
    console.log(data)
    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                isCentered
                size='4xl'
                motionPreset='slideInBottom'>
                <ModalOverlay />
                <ModalContent >
                    <ModalHeader className={RobotoFont.className} textAlign='center'>
                        Detalles
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
                                        data.map((producto, index) => (
                                            <tr key={index}>
                                                <Td textAlign='center' fontSize={18}>
                                                    {
                                                        producto.prodName
                                                    }
                                                </Td>
                                                <Td textAlign='center'>

                                                </Td>
                                                <Td textAlign='center'>

                                                </Td>
                                                <Td textAlign='center'>

                                                </Td>

                                            </tr>
                                        ))
                                    }
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' mr={3} onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button colorScheme='green'>
                            Confirmar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal >
        </>
    )
}
