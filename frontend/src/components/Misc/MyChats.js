import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import ChatLoading from "./ChatLoading";
import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import { getSender } from "../../config/ChatLogics";
import GroupChatModel from "./GroupChatModel";
const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const toast = useToast();
  const fetchChats = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(
        "https://communichat-api-backend.vercel.app/api/chat",
        config
      );
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.message,
        status: "error",
        duration: 2000,
      });
    }
  };
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir={"column"}
      alignItems={"center"}
      p={3}
      bg={"#202c33"}
      color="#aebac1"
      w={{ base: "100%", md: "30%" }}
      borderRadius={"lg"}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily={"Work Sans"}
        display={"flex"}
        w={"100%"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        My Chats
        <GroupChatModel>
          <Button
            color="#005c4b"
            display={"flex"}
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModel>
      </Box>
      <Box
        display={"flex"}
        flexDir={"column"}
        p={3}
        bg={"#202c33"}
        color="#aebac1"
        w={"100%"}
        h={"100%"}
        borderRadius={"lg"}
        overflowY={"hidden"}
      >
        {chats.length > 0 ? (
          <Stack overflowY="scroll">
            {chats?.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor={"pointer"}
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius={"lg"}
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          // <ChatLoading />
          <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            width={"100%"}
            height={"100%"}
          >
            <Text fontSize={"20px"} fontFamily={"Work Sans"}>
              No Chats Found
            </Text>
          </Box>
          // <div>Search</div>
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
