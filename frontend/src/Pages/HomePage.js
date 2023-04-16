import React, { useEffect } from "react";
import {
  Box,
  Container,
  Tab,
  TabList,
  Tabs,
  Text,
  TabPanel,
  TabPanels,
} from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import { useHistory } from "react-router-dom";

const HomePage = () => {
  const history = useHistory();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) history.push("/chats");
  }, [history]);
  return (
    <Container maxW={"xl"} centerContent>
      <Box
        display="flex"
        justifyContent="center"
        p="3"
        bg="white"
        m="40px 0 15px 0"
        width="100%"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="Work Sans">
          CommuniChat
        </Text>
      </Box>
      <Box p="4" bg="white" width="100%" borderRadius="lg" borderWidth="1px">
        <Tabs variant="soft-rounded">
          <TabList mb={"1em"}>
            <Tab borderRadius="lg" width={"50%"}>
              Login
            </Tab>
            <Tab borderRadius="lg" width={"50%"}>
              Signup
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
