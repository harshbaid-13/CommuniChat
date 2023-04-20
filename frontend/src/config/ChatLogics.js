export const getSender = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};
export const getSenderFull = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};
export const isSameSender = (messages, item, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id === undefined ||
      messages[i + 1].sender._id !== item.sender._id) &&
    messages[i].sender._id !== userId
  );
};

export const isFirstMessage = (messages, item, i, userId) => {
  if (i == 0 && messages[i].sender._id !== userId) return true;
  return (
    i > 0 &&
    messages[i - 1].sender._id !== item.sender._id &&
    messages[i].sender._id !== userId
  );
};
// export const isLastMessage = (messages, i, userId) => {
//   // if (i > 0) console.log(messages[i - 1].sender._id);
//   return (
//     i === messages.length - 1 &&
//     messages[messages.length - 1].sender._id !== userId &&
//     messages[i].sender._id
//   );
// };
export const isSameSenderMargin = (messages, item, i, userId) => {
  if (
    (i == 0 && messages[i].sender._id !== userId) ||
    (i > 0 &&
      messages[i - 1].sender._id !== item.sender._id &&
      messages[i].sender._id !== userId)
  )
    return 0;
  else if (messages[i].sender._id !== userId) return 33;
  else return "auto";
};
export const isLastMessage = (messages, item, i) => {
  if (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id === undefined ||
      messages[i + 1].sender._id !== item.sender._id)
  )
    console.log(i);
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id === undefined ||
      messages[i + 1].sender._id !== item.sender._id)
  );
};
