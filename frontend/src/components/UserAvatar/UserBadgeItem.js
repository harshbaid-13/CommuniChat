import React from "react";
import { Box, Avatar, Text, Tooltip, AvatarBadge } from "@chakra-ui/react";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box px={1} py={1} mt={1} mb={2}>
      <Tooltip label={user.name} bg="gray.300" color="black">
        <Avatar
          mr={2}
          size="md"
          cursor="normal"
          src={user.pic}
          name={user.name}
        >
          <AvatarBadge
            cursor="pointer"
            onClick={handleFunction}
            boxSize="1.25em"
            bg="red.500"
            display="flex"
            color={"white"}
          >
            <Text fontFamily={"Work Sans"} fontWeight={"bold"} fontSize={10}>
              X
            </Text>
          </AvatarBadge>
        </Avatar>
      </Tooltip>
    </Box>
  );
};
export default UserBadgeItem;
