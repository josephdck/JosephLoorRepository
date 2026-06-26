const facultades = [
    "Arquitectura", "Ciencias Administrativas", "Ciencias Agropecuarias", 
    "Ciencias de la Comunicación", "Ciencias de la Educación", "Ciencias del Mar", 
    "Ciencias Informáticas", "Ciencias Médicas", "Contabilidad Pública y Auditoría", 
    "Ciencias Económicas", "Derecho", "Enfermería", 
    "Gestión, Desarrollo y Secretariado Ejecutivo", "Hotelería y Turismo", 
    "Ingeniería", "Ingeniería Industrial", "Odontología", "Trabajo Social", "Psicología"
];

const selectFacultad = document.getElementById("facultad");
facultades.forEach(f => {
    selectFacultad.innerHTML += `<option value="${f}">${f}</option>`;
});

let estudiantes = JSON.parse(localStorage.getItem("estudiantes")) || [];
mostrarEstudiantes();

// Expresiones Regulares
const regexCedula = /^\d{10}$/; // Exactamente 10 números
const regexNombres = /^[a-zA-ZÀ-ÿ\s]{3,40}$/; // Letras y espacios, de 3 a 40 caracteres
const regexTelefono = /^0\d{9}$/; // Debe empezar con 0 y tener 10 números en total
const regexCorreo = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/; // Formato de email

document.getElementById("formulario").addEventListener("submit", function (e) {
    e.preventDefault();
    
    // Obtener valores
    const cedula = document.getElementById("cedula").value.trim();
    const apellidos = document.getElementById("apellidos").value.trim();
    const nombres = document.getElementById("nombres").value.trim();
    const direccion = document.getElementById("direccion").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const facultad = document.getElementById("facultad").value;
    const nivel = document.getElementById("nivel").value;
    const paralelo = document.getElementById("paralelo").value;

    let esValido = true;

    // Funciones de validación visual
    const validarCampo = (condicion, idError) => {
        const spanError = document.getElementById(idError);
        if (!condicion) {
            spanError.style.display = "block";
            esValido = false;
        } else {
            spanError.style.display = "none";
        }
    };

    // Aplicando RegEx y validaciones
    validarCampo(regexCedula.test(cedula), "err-cedula");
    validarCampo(regexNombres.test(apellidos), "err-apellidos");
    validarCampo(regexNombres.test(nombres), "err-nombres");
    validarCampo(direccion.length > 5, "err-direccion");
    validarCampo(regexTelefono.test(telefono), "err-telefono");
    validarCampo(regexCorreo.test(correo), "err-correo");
    validarCampo(facultad !== "", "err-facultad");
    validarCampo(nivel !== "", "err-nivel");
    validarCampo(paralelo !== "", "err-paralelo");

    if (esValido) {
        const estudiante = { cedula, apellidos, nombres, direccion, telefono, correo, facultad, nivel, paralelo };
        estudiantes.push(estudiante);
        
        // Guardar en LocalStorage
        localStorage.setItem("estudiantes", JSON.stringify(estudiantes));
        
        mostrarEstudiantes();
        this.reset();
        alert("Estudiante registrado exitosamente.");
    }
});

function mostrarEstudiantes() {
    const tbody = document.getElementById("tablaEstudiantes");
    tbody.innerHTML = "";
    
    estudiantes.forEach((est, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${est.cedula}</td>
                <td>${est.apellidos} ${est.nombres}</td>
                <td>${est.facultad}</td>
                <td>${est.nivel} "${est.paralelo}"</td>
                <td>
                    <button class="eliminar" onclick="eliminarEstudiante(${index})">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

function eliminarEstudiante(index) {
    if(confirm("¿Seguro que deseas eliminar este registro?")){
        estudiantes.splice(index, 1);
        localStorage.setItem("estudiantes", JSON.stringify(estudiantes));
        mostrarEstudiantes();
    }
}

// Exportar JSON
document.getElementById("btnExportar").addEventListener("click", function() {
    if (estudiantes.length === 0) {
        alert("No hay registros para exportar.");
        return;
    }
    const datosJSON = JSON.stringify(estudiantes, null, 4);
    const blob = new Blob([datosJSON], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = "registro_estudiantes.json";
    enlace.click();
    URL.revokeObjectURL(url);
});
