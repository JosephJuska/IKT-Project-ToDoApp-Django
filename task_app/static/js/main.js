window.addEventListener('load', function(){
    const taskContainer = document.querySelector('.tasks-container');

    const taskAddInput = document.querySelector('.task-add-input');
    const taskAddButton = document.querySelector('.task-add-button');

    async function add_task(){
        const task = taskAddInput.value;
        if(task && task.length > 0){
            let response = await fetch(`http://127.0.0.1:8000/api/create-task/${task}/${username}`).then(response => response.json());
            if(response.success){
                taskAddInput.value = '';
                window.alert('Task created successfully');
                create_list();
            }else{
                window.alert(response.message);
            }
        }else{
            window.alert('Task is not provided');
        }
    }

    taskAddButton.addEventListener('click', function(){
        add_task();
    })
    
    this.document.addEventListener('keypress', function(e){
        if(taskAddInput === document.activeElement && e.key === 'Enter'){
            add_task();
        }
    })

    function delete_children(){
        let child = taskContainer.lastElementChild;
        while (child) {
            taskContainer.removeChild(child);
            child = taskContainer.lastElementChild;
        }
    }

    function create_child(data){
        const id = data.id;
        const finished = data.finished;
        const task = data.task;
        const new_task = document.createElement('div');
        new_task.classList.add('task');
        if(finished){
            new_task.classList.add('finished');
        }
        new_task.id = id;

        const textArea = document.createElement('textarea');
        textArea.innerText = task;
        textArea.disabled = true;

        new_task.appendChild(textArea);

        const buttons = document.createElement('div');
        buttons.classList.add('task-buttons');
        new_task.appendChild(buttons);

        const finishButton = document.createElement('button');
        finishButton.classList.add('task-finish');
        if(finished){
            finishButton.classList.add('checked');
        }

        finishButton.onclick = async () => {
            if(finishButton.classList.contains('checked')){
                let response = await fetch(`http://127.0.0.1:8000/api/unfinish-task/${id}`).then(response => response.json());
                if(response.success){
                    window.alert('Task has been reset successfully');
                    create_list();
                }else{
                    window.alert(response.message);
                }
            }else{
                let response = await fetch(`http://127.0.0.1:8000/api/finish-task/${id}`).then(response => response.json());
                if(response.success){
                    window.alert('Task has been finished successfully');
                    create_list();
                }else{
                    window.alert(response.message);
                }
            }
        }

        const finishText = document.createElement('i');
        if(finished){
            finishText.classList.add('fa-solid');
            finishText.classList.add('fa-rotate-left');
        }else{
            finishText.classList.add('fa-solid');
            finishText.classList.add('fa-check');
        }
        finishButton.appendChild(finishText);
        buttons.appendChild(finishButton);

        const editButton = document.createElement('button');
        editButton.classList.add('task-edit');

        async function edit_task(task_text){
            if(!task_text || task_text.length === 0){
                window.alert('Task cannot be empty');
                create_list();
            }
            task_text = encodeURIComponent(task_text);
            let response = await fetch(`http://127.0.0.1:8000/api/edit-task/${id}/${task_text}`).then(response => response.json());
            if(response.success){
                window.alert('Task updated successfully');
                create_list();
            }else{
                window.alert(response.message);
                create_list();
            }
        };

        editButton.onclick = () => {
            if(editButton.classList.contains('edited')){
                editButton.classList.remove('edited');
                textArea.disabled = true;
                edit_task(textArea.value);
            }else{
                editButton.classList.add('edited');
                textArea.disabled = false;
                textArea.focus();
            }
        }

        textArea.addEventListener('focus', function(){
            textArea.selectionStart = textArea.selectionEnd = textArea.value.length;
        });

        textArea.addEventListener('keydown', function(e){
            if(e.key === 'Enter' && e.ctrlKey){
                textArea.value += '\n';
            }else if(e.key === 'Enter' && !e.ctrlKey && textArea === document.activeElement){
                textArea.disabled = true;
                if(editButton.classList.contains('edited')){
                    editButton.classList.remove('edited');
                }

                edit_task(textArea.value);
            }
        });

        const editText = document.createElement('i');
        editText.classList.add('fa-solid');
        editText.classList.add('fa-pen');
        editButton.appendChild(editText);
        buttons.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('task-delete');

        deleteButton.onclick = async () => {
            if(window.confirm("Are you sure you want to delete this task?")){
                let response = await fetch(`http://127.0.0.1:8000/api/delete-task/${id}`).then(response => response.json());
                if(response.success){
                    window.alert('Task has been deleted successfully');
                    create_list();
                }else{
                    window.alert(response.message);
                }
            }
        }

        const deleteText = document.createElement('i');
        deleteText.classList.add('fa-solid');
        deleteText.classList.add('fa-x');
        deleteButton.appendChild(deleteText);
        buttons.appendChild(deleteButton);

        taskContainer.appendChild(new_task);
    }

    async function create_list(){
        delete_children();
        let data = await fetch(`http://127.0.0.1:8000/api/get-tasks/${username}`).then(response => response.json());
        if(data){
            data.forEach(data => create_child(data));
        }
    }

    create_list();
});