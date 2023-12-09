document.addEventListener('onload', function(){
    async function fetchData(url) {
        await fetch(url).then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Something went wrong');
            })
            .catch((error) => {
            console.log(error);
            return 'error';
        });
    }

    const taskContainer = document.querySelector('.task-container');

    function delete_children(){
        let child = taskContainer.lastElementChild;
        while (child) {
            taskContainer.removeChild(child);
            child = taskContainer.lastElementChild;
        }
    }

    function create_list(){
        delete_children();
        let data = fetchData(`http://127.0.0.1:8000/api/get-tasks/${username}`);
        if(data === 'error'){
            return;
        }else{
            console.log(data);
        }
    }

    create_list();
});