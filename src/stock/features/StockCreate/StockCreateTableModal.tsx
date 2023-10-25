import { Badge, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Table, TableContainer, Tbody, Text, Thead, ToastProps } from "@chakra-ui/react";
import CreateProduct from "../../data/interfaces/CreateProduct";
import Product from "../../data/interfaces/Product";
import { RobotoFont, scFont } from "@/shared/utils/fonts";
import Link from "next/link";


interface StockCreateTableModalProps {
    isOpen: boolean,
    onClose: () => void
    oldProd: Product
    newProd: CreateProduct
    updatedProd: Partial<Product>
    onConfirm: () => void
    resetForm: () => void
    setUpdateModal: React.Dispatch<React.SetStateAction<boolean>>
}

const StockCreateUpdateModal: React.FC<StockCreateTableModalProps> = ({ isOpen, onClose, oldProd, newProd, updatedProd, onConfirm, resetForm, setUpdateModal }) => {

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            isCentered
            size='xl'
            motionPreset='slideInBottom'>
            <ModalOverlay />
            <ModalContent >
                <ModalHeader className={RobotoFont.className} textAlign='center'>
                    El producto
                    <Badge fontSize='1em' colorScheme='green'>
                        {oldProd.name}
                    </Badge>
                    ya se encuentra en stock.
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text fontSize='17px' textAlign='center' className={RobotoFont.className}>¿Deseas actualizarlo?</Text>
                    <Text fontSize='17px' textAlign='center' className={RobotoFont.className} mt='1rem'>Confirma o cancela la actualización</Text>
                    <TableContainer className={scFont.className} mt='1.2rem'>
                        <Table>
                            <Thead>
                                <tr>
                                    <th>
                                        <Text>
                                            Stock
                                        </Text>
                                    </th>
                                    <th>
                                        <Text>
                                            Cantidad
                                        </Text>
                                    </th>
                                    <th>
                                        <Text>
                                            Precio de compra
                                        </Text>
                                    </th>
                                    <th>
                                        <Text>
                                            Precio de venta
                                        </Text>
                                    </th>
                                </tr>
                            </Thead>
                            <Tbody>
                                <tr>
                                    <td>
                                        <Text textAlign='center'>Actual</Text>
                                    </td>
                                    <td>
                                        <Text textAlign='center'>
                                            {oldProd.quantity}
                                        </Text>
                                    </td>
                                    <td>
                                        <Text textAlign='center'>
                                            {oldProd.buyPrice}
                                        </Text>
                                    </td>
                                    <td>
                                        <Text textAlign='center'>
                                            {oldProd.sellPrice}
                                        </Text>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Text textAlign='center'>Ingreso</Text>
                                    </td>
                                    <td>
                                        <Text textAlign='center'>
                                            {newProd.quantity}
                                        </Text>
                                    </td>
                                    <td>
                                        <Text textAlign='center'>
                                            {newProd.buyPrice}
                                        </Text>
                                    </td>
                                    <td>
                                        <Text textAlign='center'>
                                            {newProd.sellPrice}
                                        </Text>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Text textAlign='center' bg='green.300'>Resultado</Text>
                                    </td>
                                    <td>
                                        <Text textAlign='center' bg='green.300'>
                                            {updatedProd.quantity}
                                        </Text>
                                    </td>
                                    <td>
                                        <Text textAlign='center' bg='green.300'>
                                            {updatedProd.buyPrice}
                                        </Text>
                                    </td>
                                    <td>
                                        <Text textAlign='center' bg='green.300'>
                                            {updatedProd.sellPrice}
                                        </Text>
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
                    <Link href='/stock'>
                        <Button colorScheme='green' mr={3} onClick={onConfirm}>
                            Confirmar y salir
                        </Button>
                    </Link>
                    <Button colorScheme='green' onClick={() => {
                        onConfirm()
                        resetForm()
                        setUpdateModal(false)
                    }}>
                        Confirmar y mantenerse
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal >
    )
}

export default StockCreateUpdateModal