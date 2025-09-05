import conversationModel from "../Model/conversationModel.js";
import userModel from "../Model/userModel.js";

export const getUserForSideBar = async (req,res)=>{
  const loggedInUser = req.user._id 

  console.log(loggedInUser)

  const filterUser = await userModel.find({_id:{ $ne: loggedInUser}}).select("-password")

  return res.status(200).json(filterUser)

}


export const getUserBySearch = async (req, res) => {
  try {
    const search = req.query.search || "";
    const currentUserId = req.user._id;

    //console.log("from getuserSearch",search,currentUserId)

    const user = await userModel
      .find({
        $and: [
          {
            $or: [
              { name: { $regex: ".*" + search + ".*", $options: "i" } },
              { email: { $regex: ".*" + search + ".*", $options: "i" } },
            ],
          },
          {
            _id: { $ne: currentUserId },
          },
        ],
      })
      .select("-password");

    //console.log("user from usermessage:",user)

    res.status(200).send(user);
  } catch (error) {
    console.log("Error in search", error.message);
    res.status(500).send({
      success: false,
      message: error,
    });
  }
};

export const getCurrentChat = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    // Fetch conversations where current user is a participant
    const currentChat = await conversationModel
      .find({
        participants: currentUserId,
      })
      .sort({ updatedAt: -1 });

    // If no conversations are found, return an empty array
    if (!currentChat || currentChat.length === 0) {
      return res.status(200).send([]);
    }

    // Extract participant IDs, excluding the current user's ID
    const participantsIDS = Array.from(
      new Set(
        currentChat.reduce((ids, conversation) => {
          const otherParticipants = conversation.participants.filter(
            (id) => id.toString() !== currentUserId.toString()
          );
          return [...ids, ...otherParticipants];
        }, [])
      )
    );

    // Remove duplicates
    const uniqueParticipantIDs = [
      ...new Set(participantsIDS.map((id) => id.toString())),
    ];

    // Find users by these IDs
    const users = await userModel
      .find({ _id: { $in: uniqueParticipantIDs } })
      .select("-password -email");

    // Respond with user data
    res.status(200).send(users);
  } catch (error) {
    console.log("Error in getCurrentChat", error.message);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// export const getCurrentChat= async (req,res)=>{
//   try {
//     const currentUserId = req.user._id

//     const currentChat = await conversationModel.find({
//       participants: currentUserId
//     }).sort({updatedAt: -1})

//     if(!currentChat || currentChat.length ===0 ) return res.status(200).send([])

//     const participantsIDS = currentChat.reduce((ids,conversation)=>{
//       const otherParticipents = conversation.participants.filter(id=> id!== currentUserId);
//       return [...ids,...otherParticipents]
//     })

//     const otherParticipentsIDS = participantsIDS.filter(id=> id.toString() !== currentUserId.toString());

//     const user = await userModel.find({_id:{$in:otherParticipentsIDS}}).select('-password').select('-email')

//     const users = otherParticipentsIDS.map(id => user.find(user => user._id.toString()=== id.toString()))

//     res.status(200).send(users)

//   } catch (error) {
//     console.log("Error in getCurrentChat", error.message)
//     res.status(500).send({
//       success: false,
//       message: error
//     })
//   }
// }
