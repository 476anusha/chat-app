import React, { useContext } from "react";
import { ChatContext } from "../components/context/ChatProvider";
import { Box, Text } from "@chakra-ui/react";
import ChatBox from "../components/ChatBox";
import MyChats from "../components/MyChats";
import { Sidedrawer } from "../components/Miscellaneous/Sidedrawer";

const ChatPage = () => {
  const { user } = useContext(ChatContext);

  return 
   
};

export default ChatPage;