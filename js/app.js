(function(){

    let DB; 
    const listCustomers = document.querySelector('#listado-clientes');
    document.addEventListener('DOMContentLoaded', () => {
        createDB(); 

        if(window.indexedDB.open('crm', 1)){
          getCustomers(); 
        }

        listCustomers.addEventListener('click', deleteCustomer ); 
    })

function deleteCustomer(e){
if(e.target.classList.contains('delete')){
  const idDelete = Number(e.target.dataset.client);  
      Swal.fire({
        title: '¿Desea eliminar el Cliente?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Eliminado',
            'El cliente se a elimiando',
            'success'
          )
          const transaction = DB.transaction(['crm'], 'readwrite'); 
          const objectStore = transaction.objectStore('crm'); 
          objectStore.delete(idDelete);
          transaction.onerro = function(){
          console.log('Error'); 
          }
          transaction.oncomplete = function (){
            e.target.parentElement.parentElement.remove(); 
          }
        }
      })
  } 
}

function createDB(){
  const createDB = window.indexedDB.open('crm', 1); 

  createDB.onerro = function(){
    console.log('Tuvimos un error');
  }

  createDB.onsuccess = function(){
    DB = createDB.result; 
  }

  createDB.onupgradeneeded = function(e){
      const db = e.target.result; 

      const objectStore = db.createObjectStore('crm', {keyPath: 'id', autoIncrement: true});

      objectStore.createIndex('name', 'name', {unique: false});
      objectStore.createIndex('email', 'email', {unique: true});
      objectStore.createIndex('phone', 'phone', {unique: false});
      objectStore.createIndex('business', 'business', {unique: false});
      objectStore.createIndex('id', 'id', {unique: true});

      console.log('DB Lista y Creada'); 
  }


}//finish function createDB



function getCustomers(){
    const openConexionDB = window.indexedDB.open('crm', 1);

    openConexionDB.onerror = function(){
        console.log('Hubo un error');
    }

    openConexionDB.onsuccess = function(){
        DB = openConexionDB.result;

        const objectStore = DB.transaction('crm').objectStore('crm'); 
        objectStore.openCursor().onsuccess = function(e){
            const cursor = e.target.result; 

            if(cursor){
              const {name, email, phone, business, id } = cursor.value;
            
              listCustomers.innerHTML += `<tr>
              <td class = "px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <p class = "text-sm leading-5 font-medium text-gray-700 text-lg font-bold">${name}</p>
              <p class = "text-sm leading-10  text-gray-700">${email}</p>
              </td>
              <td class = "px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <p class = " text-gray-700">${phone}</p>
              </td>
              <td class = "px-6 py-4 whitespace-no-wrap border-b border-gray-200 leading-5 text-gray-700">
              <p class = " text-gray-600">${business}</p>
              </td>

              <td class = "px-6 py-4 whitespace-no-wrap border-b border-gray-200 leading-5 text-sm">
              <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
              <a href="#" data-client="${id}" class="text-red-600 hover:text-red-900 delete">Eliminar</a>
              </td>
              
              </tr>`; 
              
              cursor.continue(); 
            }else{
                console.log('Nohay más'); 
            }
        }
    }
}




})();