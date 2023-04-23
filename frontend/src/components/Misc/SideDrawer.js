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
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  MenuGroup,
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
import NotificationBadge, { Effect } from "react-notification-badge";
const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notifications,
    setNotifications,
  } = ChatState();
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
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "https://communichat-api-backend.vercel.app/api/chat",
        { userId },
        config
      );

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error occured while fetching chat!",
        description: error.message,
        status: "error",
        duration: 2000,
      });
    }
  };
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  return (
    <>
      {userInfo._id === user._id ? (
        <>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            bg="#111b21"
            color={"#aebac1"}
            // TODO: change styling
            width={"98%"}
            m={"auto"}
            mt={"5px"}
            p={"5px 10px 5px 10px"}
            borderWidth={"5px"}
            borderRadius={"lg"}
            borderColor={"transparent"}
          >
            <Tooltip hasArrow label="Search users" bg="gray.300" color="black">
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
                  <NotificationBadge
                    count={notifications.length}
                    effect={Effect.SCALE}
                  />
                  <BellIcon fontSize={"2xl"} m={1} />
                </MenuButton>
                <MenuList bg="#111b21">
                  {!notifications || notifications.length === 0 ? (
                    <MenuGroup
                      bg="#111b21"
                      title="No Notifications"
                    ></MenuGroup>
                  ) : (
                    notifications.map((notification) => {
                      return (
                        <MenuItem
                          bg="#111b21"
                          key={notification._id}
                          onClick={() => {
                            setSelectedChat(notification.chat);
                            setNotifications(
                              notifications.filter(
                                (n) => n._id !== notification._id
                              )
                            );
                          }}
                        >
                          {notification.chat.isGroupChat
                            ? `${notification.chat.chatName} has new message`
                            : `${
                                notification.sender.name.split(" ")[0]
                              } has new message`}
                        </MenuItem>
                      );
                    })
                  )}
                </MenuList>
              </Menu>
              <Menu>
                <MenuButton
                  colorScheme="#111b21"
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                >
                  {/* TODO: Avatar Badge */}
                  <Avatar
                    size="sm"
                    name={user.name}
                    // TODO: remove default picture
                    src={user.pic}
                  />
                </MenuButton>
                <MenuList bg="#202c33" borderColor="transparent">
                  <ProfileModal user={user}>
                    <MenuItem bg="#202c33">My Profile</MenuItem>
                  </ProfileModal>
                  <MenuItem bg="#202c33" onClick={logoutUser}>
                    Logout
                  </MenuItem>
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
                  <ChatLoading num={13} />
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
        </>
      ) : (
        window.location.reload(false)
      )}
    </>
  );
};

export default SideDrawer;
