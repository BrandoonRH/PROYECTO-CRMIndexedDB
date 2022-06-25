(function(){
let DB; 
const formulario = document.querySelector('#formulario');
document.addEventListener('DOMContentLoaded', () => {
    conectDB(); 
    formulario.addEventListener('submit', validateClient); 
})

function conectDB(){
    const openConexionDB = window.indexedDB.open('crm', 1); 

    openConexionDB.onerro = function(){
      console.log('Tuvimos un error');
    }

    openConexionDB.onsuccess = function(){
      DB = openConexionDB.result; 
    }
}



function validateClient(e){
 e.preventDefault();
 //Leer todos los inputs 
 const name = document.querySelector('#name').value;
 const email = document.querySelector('#email').value;
 const phone = document.querySelector('#phone').value;
 const business = document.querySelector('#business').value;

 if(name === '' || email === '' || phone === '' || business === ''){
   showAlert('Todos los campos son Obligatorios', 'error');
   return; 
 }

 //Crear Objeto con la Información 
 const client = {
    name, 
    email,
    phone,
    business,
 }
 client.id = Date.now(); 
 createNewClient(client);
 formulario.reset(); 
}

function createNewClient(client){
    const transaction = DB.transaction(['crm'], 'readwrite'); 
    const objectStore = transaction.objectStore('crm'); 
    objectStore.add(client);

    transaction.onerro = function(){
        showAlert('Hubo un error', 'error')
    }
    transaction.oncomplete = function (){
        showAlert('Cliente Agregado');
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Cliente Guardado',
            showConfirmButton: false,
            timer: 1500
          }); 
          setTimeout(() => {
            window.location.href = 'index.html'; 
        }, 2400);  
    }

}




})();