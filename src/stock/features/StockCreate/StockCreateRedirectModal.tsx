import { RobotoFont } from "@/shared/utils/fonts"
import { Badge, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from "@chakra-ui/react"
import Link from "next/link"

interface CreateRedirectModalProps {
    isOpen: boolean,
    onClose: () => void
    resetForm: () => void
    setCreateModal: React.Dispatch<React.SetStateAction<boolean>>
}

const StockCreateRedirectModal: React.FC<CreateRedirectModalProps> = ({ isOpen, onClose, resetForm, setCreateModal }) => {

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
                    Producto creado exitosamente
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text fontSize='17px' textAlign='center' className={RobotoFont.className} mb='1rem'>¿Deseas crear otro producto?</Text>
                    <Text>
                        Presiona
                        <Badge fontSize='1em' colorScheme='green'>
                            si
                        </Badge> para mantenerte en esta página
                    </Text>
                    <Text>
                        Presiona <Badge fontSize='1em' colorScheme='red'>
                            no
                        </Badge> para salir hacia la tabla de stock
                    </Text>


                </ModalBody>

                <ModalFooter>
                    <Link href='/stock'>
                        <Button colorScheme='red' mr={3} onClick={onClose}>
                            NO
                        </Button>
                    </Link>
                    <Button colorScheme='green' onClick={() => {
                        onClose()
                        resetForm()
                        setCreateModal(false)
                    }}>
                        SI
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}


export default StockCreateRedirectModal