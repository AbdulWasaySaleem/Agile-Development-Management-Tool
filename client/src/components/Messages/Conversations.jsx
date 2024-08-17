import React from 'react';
import Conversation from './Conversation';
import useGetConversation from '../../hooks/useGetConversation';
import Loading from '../UI/Loading';

const Conversations = () => {
  const { loading, conversations } = useGetConversation();
  console.log("conversations: ", conversations);

  return (
    <div className='py-2 flex flex-col overflow-auto'>
      {loading && <Loading />}
      {conversations.map((conversation, idx) => (
        <Conversation
          key={conversation._id}
          conversation={conversation}
          lastIdx={idx === conversations.length - 1}
        />
      ))}
    </div>
  );
};

export default Conversations;
