'use strict';

const output = document.getElementById("output");
var modal = new bootstrap.Modal(document.getElementById('add-dream-modal'));
var updateModal = new bootstrap.Modal(document.getElementById('update-dream-modal'));
let dreamId;

document.getElementById("addDreamButton").addEventListener('click', function () {
    modal.show();
});

document.getElementById("cancelAddButton").addEventListener('click', function () {
    modal.hide();
});

document.getElementById("cancelUpdateButton").addEventListener('click', function () {
    updateModal.hide();
});

//Get all dreams
function getDreams() {
    axios.get("http://localhost:8080/getAll")
        .then(res => {
            const dreams = res.data;
            output.innerHTML = "";

            dreams.forEach(dream => {
                const newDream = renderDreams(dream);
                console.log("New dream: ", newDream);
                output.prepend(newDream);
            });
        }).catch(err => console.error(err))
}

//Add dream
document.getElementById("createDream").addEventListener('submit', function (event) {
    event.preventDefault();

    const data = {
        date: this.date.value,
        description: this.description.value,
        tag: this.tag.value
    };

    axios.post("http://localhost:8080/addDream", data,).then(() => {
        this.reset();
        modal.hide();
        getDreams();
    })
        .catch(err => console.error(err));

});

// Update dream
document.getElementById("updateDream").addEventListener('submit', function (event) {
    event.preventDefault();

    const data = {
        date: this.updateDate.value,
        description: this.updateDescription.value,
        tag: this.updateTag.value
    };

    axios.put("http://localhost:8080/update/" + dreamId, data).then(() => {
        this.reset();
        updateModal.hide();
        getDreams();
    }).catch(err => console.error(err));
});

//Show dreams in table
function renderDreams(dream) {
    const newRow = document.createElement("tr");

    const dreamDate = document.createElement("td");
    dreamDate.innerText = dream.date;
    dreamDate.className = "dateText";

    const dreamDescription = document.createElement("td");
    dreamDescription.innerText = dream.description;
    dreamDescription.className = "tableText";

    const dreamTag = document.createElement("td");
    dreamTag.innerText = dream.tag;
    dreamTag.className = "tagText";

    const updateDreamButton = document.createElement("button");
    updateDreamButton.className = "btn btn-link";
    updateDreamButton.innerHTML = '<i class="fa fa-edit" aria-hidden="true" id="updateIcon"></i>';
    updateDreamButton.addEventListener('click', function (event) {
        updateModal.show();
        dreamId = dream.id;
    })

    const deleteButton = document.createElement("button");
    deleteButton.className = "btn btn-link";
    deleteButton.innerHTML = '<i class="fa fa-trash-o" aria-hidden="true" id="deleteIcon"></i>';
    deleteButton.addEventListener('click', function () {
        deleteDream(dream.id);
    });

    newRow.appendChild(dreamDate);
    newRow.appendChild(dreamDescription);
    newRow.appendChild(dreamTag);
    newRow.appendChild(updateDreamButton);
    newRow.appendChild(deleteButton);
    return newRow;
}


//Delete dream
function deleteDream(id) {
    axios.delete("http://localhost:8080/delete/" + id).then(() => getDreams()).catch(err => console.error(err));
}


getDreams();