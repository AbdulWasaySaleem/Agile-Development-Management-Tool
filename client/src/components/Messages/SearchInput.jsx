import React, { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import useConversation from "../../zustand/useConversation";
import useGetConversation from "../../hooks/useGetConversation";
import { toast } from "react-toastify";

const SearchInput = () => {
  const [search,setSearch]=useState("")
  const {setSelectedConversation} = useConversation()
  const {conversations}=useGetConversation()



  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search) return;

    // Corrected toLowerCase method
    const conversation = conversations.find((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );

    if (conversation) {
      setSelectedConversation(conversation);
      setSearch("");
    } else {
      toast.error("No user found.");
    }
  };
  return (
    <form className="relative" onSubmit={handleSubmit}>
      <input
      value={search}
      onChange={(e)=>setSearch(e.target.value)}
        type="text"
        placeholder="Search..."
        className="w-full p-2 pl-10 bg-gray-100 text-gray-800 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        <IoSearchSharp size={20} />
      </button>
    </form>
  );
};

export default SearchInput;
