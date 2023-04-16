import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  Avatar,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  useToast,
} from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/spinner";
import { BellIcon, SearchIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useDisclosure } from "@chakra-ui/hooks";
import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import ProfileModal from "./ProfileModal";
import UserListItem from "../UserAvatar/UserListItem";
import ChatLoading from "./ChatLoading";
import { useHistory } from "react-router-dom";
import axios from "axios";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, setSelectedChat, chats, setChats } = ChatState();
  const history = useHistory();
  const toast = useToast();
  const logoutUser = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };
  const handleSearch = async (info) => {
    if (!info) {
      // toast({
      //   title: "Enter something to search!",
      //   status: "error",
      //   duration: 2000,
      // });
      setSearchResults([]);
      return;
    }
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`/api/user?search=${info}`, config);
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
  const accessChat = async (id) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post("/api/chat", { id }, config);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.message,
        status: "error",
        duration: 2000,
      });
    }
  };
  // const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  // while (userInfo._id !== user._id);

  return (
    <>
      {/* TODO: uncomment this shit!
      {userInfo._id === user._id ? (
        <> */}
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg="white"
        w={"100%"}
        // TODO: change styling
        // w={"99%"}
        // m={"auto"}
        // mt={"5px"}
        p={"5px 10px 5px 10px"}
        borderWidth={"5px"}
        // borderColor={"transparent"}
      >
        <Tooltip hasArrow label=" Search users" bg="gray.300" color="black">
          <Button onClick={onOpen} variant="ghost">
            <SearchIcon />
            <Text display={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize={"2xl"} fontFamily={"Work Sans"}>
          CommuniChat
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize={"2xl"} m={1} />
            </MenuButton>
            {/* <MenuList></MenuList> */}
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              {/* TODO: Avatar Badge */}
              <Avatar
                size="sm"
                name={user.name}
                // TODO: remove default picture
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuItem onClick={logoutUser}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>

          <DrawerBody>
            <Box display={"flex"} pb={2}>
              <Input
                placeholder="Search by name or email"
                // mr={2}
                value={search}
                onChange={(e) => {
                  // TODO: issue with handleSearch here
                  setSearch(e.target.value);
                  handleSearch(e.target.value);
                }}
              />
              {/* <Button onClick={() => handleSearch(search)}>Go</Button> */}
            </Box>
            {loading ? (
              <ChatLoading />
            ) : search ? (
              searchResults.length > 0 ? (
                searchResults.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                ))
              ) : (
                <Text
                  w={"100%"}
                  display={"flex"}
                  justifyContent="center"
                  alignItems="center"
                  my={2}
                  px={4}
                  overflow="hidden"
                  color={"gray.500"}
                >
                  No results found for "{search}"
                </Text>
              )
            ) : (
              <></>
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      {/* </>
      ) : (
        window.location.reload(false)
      )} */}
    </>
  );
};

export default SideDrawer;
