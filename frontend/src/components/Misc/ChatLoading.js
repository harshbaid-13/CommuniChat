import React from "react";
import { Skeleton, Stack } from "@chakra-ui/react";
const ChatLoading = ({ num }) => {
  const skeletons = [];
  for (let index = 0; index < num; index++) {
    skeletons.push(<Skeleton zIndex={5} height="40px" />);
  }
  return (
    <Stack>
      {skeletons}
      {/* <Skeleton height="40px" />
      <Skeleton height="40px" />
      <Skeleton height="40px" />
      <Skeleton height="40px" />
      <Skeleton height="40px" />
      <Skeleton height="40px" />
      <Skeleton height="40px" />
      <Skeleton height="40px" />
      <Skeleton height="40px" />
      <Skeleton height="40px" />
      <Skeleton height="40px" />
      <Skeleton height="40px" /> */}
    </Stack>
  );
};

export default ChatLoading;
