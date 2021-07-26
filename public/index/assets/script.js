let roommates = [];
let gastos = [];
let gastoEditing = null;
const getRoommates = async () => {
  const res = await fetch("http://localhost:3000/roommates");
  const data = await res.json();
  roommates = data;
};
const getGastos = async () => {
  const res = await fetch("http://localhost:3000/gastos");
  const data = await res.json();
  gastos = data;
};

const calcularGastosIndividuales = ()=>{    
  roommates.forEach((roommate,index,arr)=>{    
    gastos.forEach(gasto=>{
      const gastoComun = Math.ceil(gasto.body.monto/arr.length)  
      if(gasto.body.roommate == roommate.nombre)
      {        
        if(!roommate["recibe"]){
          roommate["recibe"]= gastoComun
        } 
        else{
          roommate["recibe"] += gastoComun
        }       
      }
      else{
        if(!roommate["debe"]){
          roommate["debe"]= gastoComun
        } 
        else{
          roommate["debe"] += gastoComun
        }         
      }
    })
  }) 
}



const imprimir = async () => {
  try {
    await getRoommates();
    await getGastos();
    $("#roommates").html("");
    $("#roommatesSelect").html("");
    $("#roommatesSelectModal").html("");
    calcularGastosIndividuales(roommates)
    roommates.forEach((r) => {
      $("#roommatesSelect").append(`
          <option value="${r.nombre}">${r.nombre}</option>
          `);
      $("#roommatesSelectModal").append(`
          <option value="${r.nombre}">${r.nombre}</option>
          `);
      $("#roommates").append(`
                  <tr>
                    <td>${r.nombre}</td>
                    <td class="text-danger">${r.debe ? r.debe : "-"}</td>
                    <td class="text-success">${r.recibe ? r.recibe : "-"}</td>
                  </tr>
              `);
    });
    $("#gastosHistorial").html("");
    gastos.forEach((g, index) => {
      $("#gastosHistorial").append(`
                <tr>
                  <td>${g.body.roommate}</td>
                  <td>${g.body.descripcion}</td>
                  <td>${g.body.monto}</td>
                  <td class="d-flex align-items-center justify-content-between">
                    <i class="fas fa-edit text-warning" onclick="editGasto('${g.id}')" data-toggle="modal" data-target="#exampleModal"></i>
                    <i class="fas fa-trash-alt text-danger" onclick="deleteGasto('${g.id}')" ></i>
                  </td>
                </tr>
              `);
    });
  } catch (e) {
    console.log(e);
  }
};



const nuevoRoommate = () => {
  fetch("http://localhost:3000/roommate", { method: "POST" })
    .then((res) => res.json())
    .then(() => {      
      imprimir();
    });
};

const agregarGasto = async () => {
  const roommateSelected = $("#roommatesSelect").val();
  const descripcion = $("#descripcion").val();
  const monto = Number($("#monto").val());
  $("#spinner").show()
  $("#buttonAgregar").hide()
  await fetch("http://localhost:3000/gasto", {
    method: "POST",
    body: JSON.stringify({
      roommate: roommateSelected,
      descripcion,
      monto,
    }),
  });
  $("#spinner").hide()
  $("#buttonAgregar").show() 
  imprimir();
};

const deleteGasto = async (id) => {
  await fetch("http://localhost:3000/gasto?id=" + id, {
    method: "DELETE",
  });  
  imprimir();
};

const updateGasto = async () => {
  const roommateSelected = $("#roommatesSelectModal").val();
  const descripcion = $("#descripcionModal").val();
  const monto = Number($("#montoModal").val());
  await fetch("http://localhost:3000/gasto?id=" + gastoEditing, {
    method: "PUT",
    body: JSON.stringify({
      roommate: roommateSelected,
      descripcion,
      monto,
    }),
  });
  $("#exampleModal").modal("hide");  
  imprimir();
};

const editGasto = (id) => {
  gastoEditing = id;
  const { roommate, descripcion, monto } = gastos.find((g) => g.id == id);
  $("#roommatesSelectModal").val(roommate);
  $("#descripcionModal").html(descripcion);
  $("#montoModal").val(monto);
};




imprimir();
