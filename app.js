const saveBtn = document.querySelector(".save_btn");
let isUpdate = false;
let editID = null;

//Custom UUID
const uuid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;

    return v.toString(16);
  });
};

const getData = () => {
  const checkLS =
    localStorage.getItem("Notes") === null
      ? []
      : JSON.parse(localStorage.getItem("Notes"));

  //checking if the storage is not equal to zero
  if (checkLS.length === 0) {
    console.log("No data is available!");
    return [];
  }

  return checkLS;
};

const fetchData = () => {
  if (!getData()) {
    console.log("No data is available!");
  } else {
    console.log(getData());
  }
};

fetchData();

saveBtn.addEventListener("click", () => {
  if (checkValidity()) {
    if (isUpdate) {
      const data = getData();

      //global id for edit note
      const id = editID;

      //find the index of note
      const noteId = data.findIndex((note) => note.id === id);

      console.log(noteId);

      data[noteId] = checkValidity();

      localStorage.setItem("Notes", JSON.stringify(data));
    } else {
      //returning all input fields
      const note = checkValidity();
      //prev data from localStorage
      const prevNoteList = getData();

      prevNoteList.push(note);
      localStorage.setItem("Notes", JSON.stringify(prevNoteList));
    }
  }

  displayNotes();
  clearInput();
});

//checking if all input fields are not empty strings
const checkValidity = () => {
  const title = document.querySelector(".title").value.trim();
  const category = document.querySelector(".category").value.trim();
  const content = document.querySelector(".note_content").value.trim();

  if (title === "" || category === "" || content === "") {
    return false;
  }

  return {
    title,
    category,
    content,
    date: new Date().toLocaleDateString(),
    id: uuid(),
    isLocked: false,
  };
};

const displayNotes = () => {
  const collectionContainer = document.querySelector(".collection");
  const data = getData();
  let output = "";
  if (data.length === 0) {
    output += `
     <div class="empty_collection">
     <img src="./styles/no_item.svg" />
     <p>NO COLLECTIONS</p>
     </div>
    `;
  } else {
    data.map((note, index) => {
      const { title, category, content, date, id, isLocked } = note;

      const setAction = isLocked ? "lock" : "";
      const cutContent =
        content.length >= 25 ? content.slice(0, 25) + "..." : content;

      output += `

          <li>
          <div class="detail">
            <p class="note">${cutContent}</p>
            <p class="date">${date}</p>
          </div>

          <div class="action ${setAction}">
                      
            <span class="lock_btn ${setAction}"  onclick="lockNote(${index})"><ion-icon name="lock"></ion-icon></span>
            <span class="edit_btn ${setAction}" onclick="editNote(${index})"><ion-icon name="create"></ion-icon></span>
            <span class="delete_btn ${setAction}" onclick="deleteNote(${index})"><ion-icon name="trash"></ion-icon></span>
          </div>
        </li>

      `;
    });
  }

  collectionContainer.innerHTML = output;
};

displayNotes();

//delete
const deleteNote = (index) => {
  const data = getData();

  data.splice(index, 1);
  localStorage.setItem("Notes", JSON.stringify(data));
  displayNotes();
};

//edit
const editNote = (index) => {
  const data = getData();
  const saveBtn = document.querySelector(".save_btn");

  const { title, category, content, date, id } = data[index];

  document.querySelector(".title").value = title;
  document.querySelector(".category").value = category;
  document.querySelector(".note_content").value = content;
  saveBtn.innerHTML = "UPDATE";

  isUpdate = true;
  console.log(isUpdate);

  editID = id;
};

const lockNote = (index) => {
  const data = getData();

  //index is from lock_btn
  const { id } = data[index];

  //toggle to true or false
  data[index].isLocked = !data[index].isLocked;

  localStorage.setItem("Notes", JSON.stringify(data));

  displayNotes();
};

//search notes

const searchInput = document.querySelector(".search_input");

searchInput.addEventListener("keyup", () => {
  const data = getData();
  const collectionContainer = document.querySelector(".collection");
  let output = "";
  const searchValue = searchInput.value.toLowerCase();
  const filteredData = data.filter((note) =>
    note.content.toLowerCase().includes(searchValue)
  );

  if (filteredData.length > 0) {
    filteredData.map((note, index) => {
      const { title, category, content, date, id, isLocked } = note;
      const setAction = isLocked ? "lock" : "";
      const cutContent =
        content.length >= 25 ? content.slice(0, 25) + "..." : content;
      output += `

          <li>
          <div class="detail">
            <p class="note">${cutContent}</p>
            <p class="date">${date}</p>
          </div>

          <div class="action ${setAction}">
                      
            <span class="lock_btn ${setAction}"  onclick="lockNote(${index})"><ion-icon name="lock"></ion-icon></span>
            <span class="edit_btn ${setAction}" onclick="editNote(${index})"><ion-icon name="create"></ion-icon></span>
            <span class="delete_btn ${setAction}" onclick="deleteNote(${index})"><ion-icon name="trash"></ion-icon></span>
          </div>
        </li> `;
    });
  } else {
    output += `
        <div class="empty_collection">
          <img src="./styles/no_item.svg" />
          <p>NO COLLECTIONS FOUND</p>
        </div> 
    `;
  }
  collectionContainer.innerHTML = output;

  console.log(searchValue);
});

const clearInput = () => {
  document.querySelector(".title").value = "";
  document.querySelector(".category").value = "";
  document.querySelector(".note_content").value = "";
};
//search for the note_content
