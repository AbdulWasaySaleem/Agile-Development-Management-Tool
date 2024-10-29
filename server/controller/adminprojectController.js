import Project from "../Model/projectModel.js"; // Adjust the path as needed

export const postProjectController = async (req, res) => {
  try {
    const { title, description, startDate, endDate, status, members, methodology, tasks } =
      req.body;

    // Create a new project instance
    const newProject = new Project({
      title,
      description,
      startDate,
      endDate,
      status,
      members,
      methodology,  // Include the methodology
      tasks,
    });

    // Save the project to the database
    const savedProject = await newProject.save();

    // Respond with the created project
    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      project: savedProject,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating project",
      error: error.message,
    });
  }
};

export const allProjectController = async (req, res) => {
  try {
    const allProjects = await Project.find().populate('members', 'name skills profilePicture').populate('tasks'); // Populate members and tasks
    return res.status(200).json({
      success: true,
      message: "All projects fetched successfully",
      projects: allProjects,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching projects",
      error: error.message,
    });
  }
};

export const getProjectWithId = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id).populate('members', 'name skills profilePicture').populate('tasks'); // Populate member names and tasks
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Project fetched successfully",
      project: project,
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching project",
      error: error.message,
    });
  }
};

export const changeProjectStatus = async (req, res) => {
  try {
    const { id } = req.params; // Get the project ID from the URL
    const { status } = req.body; // Get the new status from the request body

    // Find the project by ID and update its status
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Return the updated document
    );

    if (!updatedProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project status updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Error changing project status:", error);
    return res.status(500).json({
      success: false,
      message: "Error changing project status",
      error: error.message,
    });
  }
};

export const addMemberToProject = async (req, res) => {
  try {
    const { userId } = req.body; // Get the user ID from the request body
    const { id } = req.params; // Get the project ID from the URL

    // Find the project by ID and add the new member
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { $addToSet: { members: userId } }, // Use $addToSet to avoid duplicates
      { new: true } // Return the updated document
    );

    if (!updatedProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Member added to project successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Error adding member to project:", error);
    return res.status(500).json({
      success: false,
      message: "Error adding member to project",
      error: error.message,
    });
  }
};


export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
      project: deletedProject,
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting project",
      error: error.message,
    });
  }
}