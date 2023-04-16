import React from "react";
import { ViewIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Image,
  Text,
} from "@chakra-ui/react";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon boxSize={5} color="teal" />}
          onClick={onOpen}
        />
      )}
      <Modal
        size={{ base: "xs", md: "sm" }}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={{ base: "30", md: "40" }}
            fontFamily="Work Sans"
            display="flex"
            justifyContent="center"
          >
            {user?.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            flexDir="column"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Image
              src={user?.pic}
              alt={user?.name}
              borderRadius={"full"}
              boxSize={150}
            />
            <Text
              my={5}
              fontSize={{ base: "15", md: "20" }}
              fontFamily="Work Sans"
            >
              Email: {user?.email}
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
