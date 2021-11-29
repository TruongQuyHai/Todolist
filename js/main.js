import Task from "./Task.js";
import TaskServices from "./TaskServices.js";
import { checkEmpty } from "./Validation.js";

const taskApi = new TaskServices();

const getEleId = (id) => {
  return document.getElementById(id);
};

const checkLoading = (isLoading) => {
  isLoading == true
    ? (getEleId("loader").style.display = "block")
    : (getEleId("loader").style.display = "none");
};

// hàm này trả về một chuỗi để gán vào innerHTML
const showTask = (taskList, _status) => {
  return taskList?.reduce((taskType, task) => {
    if (task.statusTask == _status) {
      // dựa vào _status của tham số mà chọn render ra HTML
      return (taskType += `
                <li>
                    <span>${task.textTask}</span>
                    <div class="buttons">
                    <button class="remove" onclick="deleteTaskApi('${task.id}')">
                        <i class="fa fa-trash-alt"></i>
                    </button>
                    <button class="complete" onclick="updateTaskApi('${task.id}')">
                        <i class="far fa-check-circle"></i>
                        <i class="fas fa-check-circle"></i>
                    </button>
                    </div>
                </li>
            `);
    } else {
      return taskType;
    }
  }, "");
};

const showTaskList = (taskList) => {
  const todoHTML = showTask(taskList, "todo");
  const completedHTML = showTask(taskList, "completed");
  getEleId("todo").innerHTML = todoHTML;
  getEleId("completed").innerHTML = completedHTML;
};

const getListTaskApi = () => {
  checkLoading(true); // hiện loading screen
  taskApi
    .getListTask()
    .then((taskListObj) => {
      showTaskList(taskListObj.data);
      checkLoading(false); // tắt loading screen
    })
    .catch((err) => {
      console.log(err);
      checkLoading(false); // tắt loading screen
    });
};
getListTaskApi();

const validate = (task) => {
  return checkEmpty(task.textTask, "Empty task!");
};

const addTaskApi = () => {
  const textTask = getEleId("newTask").value;
  let task = new Task("", textTask, "todo");

  let isValid = validate(task);
  if (isValid) {
    checkLoading(true);
    taskApi
      .addTask(task)
      .then(() => {
        getListTaskApi();
        checkLoading(false);
        getEleId("newTask").value = ""; // reset lại input trên HTML
      })
      .catch((err) => {
        console.log(err);
        checkLoading(false);
      });
  }
};
getEleId("addItem").onclick = addTaskApi;

const deleteTaskApi = (id) => {
  checkLoading(true);
  taskApi
    .deleteTask(id)
    .then(() => {
      getListTaskApi();
      checkLoading(false);
    })
    .catch((err) => {
      console.log(err);
      checkLoading(false);
    });
};
window.deleteTaskApi = deleteTaskApi;

const updateTaskApi = (id) => {
  checkLoading(true);
  taskApi
    .getTaskById(id)
    .then((result) => {
      const task = result.data; // Task mình lấy về từ server
      if (task.statusTask == "todo") {
        task.statusTask = "completed"; // nếu status của task là todo -> chuyển sang completed
      } else {
        task.statusTask = "todo"; // và ngược lại
      }

      taskApi
        .updateTask(task.id, task) // task đã có status mới, gửi lên api để cập nhật
        .then((taskObj) => {
          getListTaskApi();
          checkLoading(false);
        })
        .catch((err) => {
          console.log(err);
          checkLoading(false);
        });
    })
    .catch((err) => {
      console.log(err);
      checkLoading(false);
    });
};
window.updateTaskApi = updateTaskApi;
