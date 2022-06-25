(function(){
    let DB; 
    let idCustomer;
    const nameInput = document.querySelector('#name');
    const emailInput = document.querySelector('#email');
    const phoneInput = document.querySelector('#phone');
    const businessInput = document.querySelector('#business');
    const form = document.querySelector('#formulario');

document.addEventListener('DOMContentLoaded', () => {
    conectDB(); 
    //Actualiza el cliente 
    form.addEventListener('submit', updateCustomer);
    //Verificar el ID de la URL 
    const paramsURL = new URLSearchParams(window.location.search);
    idCustomer = paramsURL.get('id');
    if(idCustomer){
       
      setTimeout(() => {
        getCustomer(idCustomer);
      }, 300);
    }
}); 

function getCustomer(id){
 const transaction = DB.transaction(['crm'], 'readwrite');
 const objectStore = transaction.objectStore('crm'); 
 const customer = objectStore.openCursor(); 
 customer.onsuccess = function(e){
    const cursor = e.target.result; 
    if(cursor){
      if(cursor.value.id === Number(id)){
      fillForm(cursor.value);
      }
      cursor.continue(); 
    }
 }
}

function conectDB(){
    const openConexionDB = window.indexedDB.open('crm', 1); 

    openConexionDB.onerro = function(){
      console.log('Tuvimos un error');
    }

    openConexionDB.onsuccess = function(){
      DB = openConexionDB.result; 
    }
}

function fillForm(dataCustomer){
  const { name, email, phone, business } = dataCustomer; 
  nameInput.value = name; 
  emailInput.value = email; 
  phoneInput.value = phone; 
  businessInput.value = business; 

}

function updateCustomer(e){
 e.preventDefault(); 
 if(nameInput.value === '' || emailInput.value === '' || phoneInput.value === '' || businessInput.value === ''){
 showAlert('Todos los Campos son Obligatorios', 'error'); 
  return; 
 }
 //Update Customer 
 const updateCustomer = {
    name: nameInput.value, 
    email: emailInput.value, 
    phone: phoneInput.value, 
    business: businessInput.value,
    id: Number(idCustomer)
 }

 const transaction = DB.transaction(['crm'], 'readwrite'); 
 const objectStore = transaction.objectStore('crm'); 
 objectStore.put(updateCustomer); 
 transaction.onerro = function(){
    showAlert('Hubo un error', 'error')
}
transaction.oncomplete = function (){
    showAlert('Cliente Actualizado');
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Cliente Actualizado',
      showConfirmButton: false,
      timer: 1500
    }); 
    setTimeout(() => {
        window.location.href = 'index.html'; 
    }, 2400);
}

}

})();