import React, { useEffect } from "react";
import { ChatState } from "../context/ChatProvider";
import SideDrawer from "../components/Misc/SideDrawer";
import MyChats from "../components/Misc/MyChats";
import ChatBox from "../components/Misc/ChatBox";
import { Box } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
const ChatPage = () => {
  const { user } = ChatState();
  // const history = useHistory();
  // useEffect(() => {
  //   const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  //   if (!userInfo) history.push("/");
  // }, [history]);
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent={"space-between"}
        p={"10px"}
        h={"90vh"}
        w={"100%"}
      >
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
};

export default ChatPage;
