import Sprint from "../Model/sprintModel.js";

export const addSprint = async (req, res) => {
  const {projectId} = req.params;
  const {name, startDate, endDate} = req.body;
  try {
    const newSprint = new Sprint({
      name,
      startDate,
      endDate,
      project: projectId
    });
    await newSprint.save();
    res.status(201).send({success:true,message:"Sprint added successfully",newSprint});
  } catch (error) {
    console.log("somethign went wrong while creating sprint",error);
    
  }
}


export const allSprints = async (req, res) => {
  const { projectId } = req.params;

  try {
    // Find all sprints associated with the given project ID
    const sprints = await Sprint.find({ project: projectId });

    // Check if sprints exist
    if (!sprints.length) {
      return res.status(404).json({ success: false, message: 'No sprints found for this project.' });
    }

    // Return the found sprints
    res.status(200).json({ success: true, data: sprints, message:"All Sprints" });
  } catch (error) {
    console.error('Error fetching sprints:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching sprints.' });
  }
};

export const deleteSprint = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the sprint by ID and delete it
    const sprint = await Sprint.findByIdAndDelete(id);

    // Check if sprint exists
    if (!sprint) {
      return res.status(404).json({ success: false, message: 'Sprint not found.' });
    }

    // Return the deleted sprint
    res.status(200).json({ success: true, data: sprint, message: 'Sprint deleted successfully.' });
  } catch (error) {
    console.error('Error deleting sprint:', error);
    res.status(500).json({ success: false, message: 'Server error while deleting sprint.' });
  }
}