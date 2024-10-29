import Project from "../Model/projectModel.js";
import Sprint from "../Model/sprintModel.js";
import Task from "../Model/taskModel.js";
import userModel from "../Model/userModel.js";

export const getTasks = async (req, res) => {
  try {
    // Retrieve all tasks from the database and populate the assigned projects
    const tasks = await Task.find()
      .populate({
        path: "assignedTo", // Assuming this field references User collection
        select: "title", // Select only the title field from the project
      })
      .exec();

    // Create a result array that includes tasks with project titles
    const tasksWithProjects = await Promise.all(
      tasks.map(async (task) => {
        // Find the project details based on assignedTo (this assumes there's a one-to-one mapping)
        const projectDetails = await Project.findOne({
          _id: { $in: task.assignedTo },
        });

        return {
          ...task._doc, // Spread the original task document
          projectTitle: projectDetails ? projectDetails.title : null, // Add the project title
        };
      })
    );

    // Send the retrieved tasks with project titles as a response
    res.status(200).json(tasksWithProjects);
  } catch (error) {
    console.error("Error retrieving tasks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// export const addTasks = async (req, res) => {
//   const { title, description, assignedBy, assignedTo, deadline } = req.body;
//   try {
//     const userAssigning = await userModel.findById(assignedBy);
//     const userAssignTo = await userModel.findById(assignedTo);

//     if (!userAssigning || !userAssignTo) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     const task = new Task({
//       title,
//       description,
//       assignedBy,
//       assignedTo,
//       deadline,
//     });
//     await task.save();
//     res.status(200).json({ message: "Task added successfully" });
//   } catch (error) {
//     console.log("Error in addTasks", error);
//   }
// };

export const addnewTask = async (req, res) => {
  const { title, description, assignedBy, assignedTo, sprint, xpPhase } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: "Title and description are required" });
  }

  try {
    const project = await Project.findById(assignedTo);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const newTask = new Task({
      title,
      description,
      assignedBy,
      assignedTo,
      methodology: project.methodology,
      status: "To Do",
      currentPhase: project.methodology === "XP" ? "" : undefined,
    });

    if (project.methodology === "Scrum" && sprint) {
      newTask.sprint = sprint;
    } else if (project.methodology === "XP" && xpPhase) {
      newTask.xpPhase = xpPhase;
    }

    const savedTask = await newTask.save();

    project.tasks.push(savedTask._id);
    await project.save();

    res.status(201).json({
      message: "Task added successfully",
      task: savedTask,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding task", error });
  }
};


export const getTasksOfProject = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const getTasks = await Task.find({ assignedTo: id });

    if (!getTasks) {
      return res.status(404).json({ message: "Task not found" });
    }
    res
      .status(200)
      .json({ message: "Task fetched successfully", success: true, getTasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addTasks = async (req, res) => {
  const {
    title,
    description,
    assignedBy,
    assignedTo,
    methodology,
    methodologySpecific,
  } = req.body;
  console.log(
    title,
    description,
    assignedBy,
    assignedTo,
    methodology,
    methodologySpecific
  );

  try {
    const task = new Task({
      title,
      description,
      assignedBy,
      assignedTo,
      methodology,
      methodologySpecific,
    });

    await task.save();
    return res.status(201).json({ message: "Task created successfully", task });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to create task", details: err.message });
  }
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    assignedBy,
    assignedTo,
    deadline,
    status,
    progressUpdate,
  } = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        title,
        description,
        assignedBy,
        assignedTo,
        deadline,
        status,
        progressUpdate,
      },
      { new: true } // Returns the updated task
    )
      .populate("assignedBy", "name")
      .populate("assignedTo", "name");

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task updated successfully", updatedTask });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ success: true, message: "Task not found" });
    }

    res
      .status(200)
      .json({ message: "Task deleted successfully", success: true });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const patchTask = async (req, res) => {
  const { status } = req.body;
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.status(200).json({
      task,
      success: true,
      message: "Task status updated successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getTasksSprints = async (req, res) => {
  const { sprintid } = req.params;
  try {
    const tasks = await Task.find({ sprint: sprintid });
    res.status(200).send({ tasks, success: true, message: "Tasks fetched successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


export const patchSprint = async (req, res) => {
  const { sprintId, taskIds } = req.body;

  try {
    // Validate if the sprint exists
    const sprint = await Sprint.findById(sprintId);
    if (!sprint) {
      return res
        .status(404)
        .json({ success: false, message: "Sprint not found" });
    }

    // Update the sprint field of the specified tasks
    const result = await Task.updateMany(
      { _id: { $in: taskIds } }, // Find tasks with these IDs
      { $set: { sprint: sprintId } } // Set their sprint field
    );

    return res.json({
      success: true,
      message: "Tasks assigned to sprint successfully",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "An error occurred",
        error: error.message,
      });
  }
};

export const createSprint = async (req, res) => {
  const { name, startDate, endDate, project } = req.body;

  try {
    const projectExists = await Project.findById(project);
    if (!projectExists || projectExists.methodology !== "Scrum") {
      return res
        .status(400)
        .json({ message: "Sprint can only be created for Scrum projects." });
    }

    const newSprint = await Sprint.create({
      name,
      startDate,
      endDate,
      project,
    });
    res.status(201).json({
      newSprint,
      success: true,
      message: "Sprint created successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateTaskPhase = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Determine the next phase
    const phases = ['Planning', 'Design', 'Coding', 'Testing', 'Release'];
    const currentIndex = phases.indexOf(task.currentPhase);
    if (currentIndex < 0 || currentIndex >= phases.length - 1) {
      return res.status(400).json({ message: "Cannot move to the next phase" });
    }

    // Update to the next phase
    task.currentPhase = phases[currentIndex + 1];
    await task.save();

    res.status(200).json({ message: "Task moved to the next phase", task });
  } catch (error) {
    res.status(500).json({ message: "Error updating task phase", error });
  }
};
