import React, { useState } from "react";
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
  useToast,
  FormControl,
  Input,
  ModalFooter,
  Button,
  Box,
} from "@chakra-ui/react";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const toast = useToast();
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const handleSearch = async (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`/api/user?search=${query}`, config);
      setSearchResults(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.message,
        status: "error",
        duration: 2000,
      });
    }
  };
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all the fields!",
        status: "error",
        duration: 2000,
      });
      return;
    }
    if (selectedUsers.length < 2) {
      toast({
        title: "Please add atleast 2 members!",
        status: "error",
        duration: 2000,
      });
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post(
        "https://communichat-api-backend.vercel.app/api/chat/group/",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((user) => user._id)),
        },
        config
      );
      setChats([data, ...chats]);
      onClose();
      toast({
        title: "Group Chat Created!",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Failed to create group!",
        status: "error",
        duration: 2000,
      });
    }
  };
  const handleDelete = (users) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== users._id));
  };
  const handleGroup = async (userToAdd) => {
    if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
      toast({
        title: "User Already Added!",
        status: "error",
        duration: 2000,
      });
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only Admin can add users!",
        status: "error",
        duration: 2000,
      });
      return;
    }
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(
        "https://communichat-api-backend.vercel.app/api/chat/groupadd",
        {
          chatId: selectedChat._id,
          userId: userToAdd._id,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
      toast({
        title: `${userToAdd.name} added to group!`,
        status: "success",
        duration: 3000,
      });
      // setSelectedChat([...selectedUsers, users]);
    } catch (error) {
      toast({
        title: "Failed to add to group!",
        status: "error",
        duration: 2000,
      });
    }
  };
  const removeUser = async (userToRemove) => {
    if (
      selectedChat.groupAdmin._id !== user._id &&
      user._id !== userToRemove._id
    ) {
      toast({
        title: "Only Admin can remove users!",
        status: "error",
        duration: 2000,
      });
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(
        "https://communichat-api-backend.vercel.app/api/chat/groupremove",
        {
          chatId: selectedChat._id,
          userId: userToRemove._id,
        },
        config
      );
      user._id === userToRemove._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      if (user._id === userToRemove._id) {
        toast({
          title: `You left the group!`,
          status: "success",
          duration: 3000,
        });
        return;
      }
      toast({
        title: `${userToRemove.name} removed from group!`,
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Failed to remove from group!",
        status: "error",
        duration: 2000,
      });
    }
  };
  const handleRename = async () => {
    if (!groupChatName) {
      toast({
        title: "Group name cannot be empty!",
        status: "error",
        duration: 2000,
      });
      return;
    }
    try {
      setRenameLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(
        "https://communichat-api-backend.vercel.app/api/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
      toast({
        title: "Group Chat Renamed!",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Failed to rename group!",
        status: "error",
        duration: 2000,
      });
    }
    setGroupChatName("");
  };
  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon boxSize={5} color="teal" />}
        onClick={onOpen}
      ></IconButton>
      <Modal
        size={{ base: "xs", md: "sm" }}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={{ base: "20", md: "30" }}
            fontFamily="Work Sans"
            display="flex"
            justifyContent="center"
          >
            {selectedChat.chatName.toUpperCase()}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody flexDir="column" display="flex" alignItems="center">
            <Box display="flex" width={"100%"} flexWrap="wrap" mb={2}>
              {selectedChat.users
                .slice(0)
                .reverse()
                .map((user) => (
                  <UserBadgeItem
                    key={user._id}
                    user={user}
                    handleFunction={() => removeUser(user)}
                  />
                ))}
            </Box>
            <FormControl display={"flex"}>
              <Input
                placeholder="Group Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant={"solid"}
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Search here to add more users"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            {loading ? (
              <div>Loading...</div>
            ) : (
              searchResults
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={() => removeUser(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
