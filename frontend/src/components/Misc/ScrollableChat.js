import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isFirstMessage,
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../config/ChatLogics";
import { ChatState } from "../../context/ChatProvider";
import { Avatar, Tooltip } from "@chakra-ui/react";
const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  console.log(messages);
  return (
    <div>
      <ScrollableFeed forceScroll={true}>
        {messages &&
          messages.map((item, i) => (
            <div style={{ display: "flex" }} key={i}>
              {isFirstMessage(messages, item, i, user._id) && (
                <Tooltip
                  label={item.sender.name}
                  placement="bottom-start"
                  hasArrow
                >
                  <Avatar
                    mr={1}
                    size="sm"
                    name={item.sender.name}
                    src={item.sender.pic}
                  />
                </Tooltip>
              )}
              <span
                style={{
                  backgroundColor: `${
                    item.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                  } `,
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                  marginLeft: isSameSenderMargin(messages, item, i, user._id),
                  marginBottom: isLastMessage(messages, item, i, user._id)
                    ? 10
                    : 3,
                  //   marginBottom: isSameUser(messages, item, i, user._id)
                  //     ? 0
                  //     : 10,
                }}
              >
                {item.content}
              </span>
            </div>
          ))}
      </ScrollableFeed>
    </div>
  );
};

export default ScrollableChat;
