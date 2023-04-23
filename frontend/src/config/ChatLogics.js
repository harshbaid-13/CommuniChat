export const getSender = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};
export const getSenderFull = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};

export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

export const isFirstMessage = (messages, m, i, userId) => {
  return (
    m.sender._id !== userId &&
    (i === 0 || (i > 0 && messages[i - 1].sender._id !== m.sender._id))
  );
};
export const isSameSenderMargin = (messages, m, i, userId) => {
  if (isFirstMessage(messages, m, i, userId)) return 0;
  else if (m.sender._id !== userId && !isFirstMessage(messages, m, i, userId))
    return 36;
  else return "auto";
};
