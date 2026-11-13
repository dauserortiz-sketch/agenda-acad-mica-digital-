/* JAVASCRIPT - AGENDA ACADÉMICA DIGITAL ESCOLAR
   U.E.T.H. "Enrique Sánchez de Lozada" (Agua Castilla - Porco)
   Especialidad BTH: Sistemas Informáticos
   Postulantes: Andy Dauser Ortiz Ecos y Rayner Gallardo Rodríguez */


const CLAVE_PROFESOR = "profesor123";

const tareasIniciales = [
    {
        id: 1,
        materia: "Sistemas Informáticos",
        fecha: "2026-10-27",
        profesor: "Prof. Silvia Eugenia Choque Villafuerte",
        detalle: "Revisión final de la estructura de la Agenda Web en carpetas y código fuente."
    },
    {
        id: 2,
        materia: "Matemáticas",
        fecha: "2026-10-29",
        profesor: "Prof. Choque",
        detalle: "Práctica de derivadas en hojas de carpeta cuadriculada (ejercicios impares)."
    },
    {
        id: 3,
        materia: "Lenguaje y Comunicación",
        fecha: "2026-10-30",
        profesor: "Prof. Mirian Alvarado",
        detalle: "Presentación del informe de lectura y análisis de texto argumentativo."
    }
];

const examenesIniciales = [
    {
        id: 1,
        materia: "Sistemas Informáticos",
        fecha: "2026-11-04",
        tipo: "Defensa de Proyecto BTH",
        temas: "Demostración de la Agenda Académica ante el tribunal de evaluación docente."
    },
    {
        id: 2,
        materia: "Matemáticas",
        fecha: "2026-11-06",
        tipo: "Examen Escrito Trimestral",
        temas: "Cálculo diferencial y resolución de problemas prácticos."
    }
];

const comunicadosIniciales = [
    {
        id: 1,
        titulo: "Reunión de Coordinación de Padres de 6to de Secundaria",
        fecha: "2026-10-25",
        firma: "Dirección de la Unidad Educativa",
        mensaje: "Se convoca a los señores padres y madres de familia a la asamblea para coordinar el cronograma de defensas BTH y cierre del año escolar."
    }
];

// Cargar o inicializar almacenamiento local
let tareas = JSON.parse(localStorage.getItem("agenda_tareas")) || tareasIniciales;
let examenes = JSON.parse(localStorage.getItem("agenda_examenes")) || examenesIniciales;
let comunicados = JSON.parse(localStorage.getItem("agenda_comunicados")) || comunicadosIniciales;

let usuarioSesion = {
    tipo: "",
    nombre: ""
};

// 1. Mostrar/Ocultar contraseña según el usuario
function verificarTipoLogin() {
    const tipo = document.getElementById("tipoUsuarioLogin").value;
    const campoPass = document.getElementById("campoPasswordProfesor");
    const inputPass = document.getElementById("passwordProfesor");
    const labelNombre = document.getElementById("etiquetaNombreUsuario");

    if (tipo === "profesor") {
        campoPass.style.display = "block";
        inputPass.required = true;
        labelNombre.textContent = "Nombre del Docente:";
    } else if (tipo === "padre") {
        campoPass.style.display = "none";
        inputPass.required = false;
        inputPass.value = "";
        labelNombre.textContent = "Nombre del Padre / Madre de Familia:";
    } else {
        campoPass.style.display = "none";
        inputPass.required = false;
        inputPass.value = "";
        labelNombre.textContent = "Nombre del Estudiante:";
    }
}

// 2. Iniciar Sesión
function iniciarSesion(e) {
    e.preventDefault();

    const tipo = document.getElementById("tipoUsuarioLogin").value;
    const nombre = document.getElementById("nombreUsuarioLogin").value.trim();
    const pass = document.getElementById("passwordProfesor").value;

    if (tipo === "profesor") {
        if (pass !== CLAVE_PROFESOR) {
            alert("Contraseña de profesor incorrecta. (Clave de prueba: profesor123)");
            return;
        }
    }

    usuarioSesion.tipo = tipo;
    usuarioSesion.nombre = nombre;

    document.getElementById("pantallaLogin").style.display = "none";
    document.getElementById("pantallaPrincipal").style.display = "block";

    aplicarPermisosSegunRol();
    dibujarTareas();
    dibujarExamenes();
    dibujarComunicados();
    actualizarVistaPadres();
}

// 3. Cerrar Sesión
function cerrarSesion() {
    usuarioSesion = { tipo: "", nombre: "" };
    document.getElementById("formularioLogin").reset();
    verificarTipoLogin();
    document.getElementById("pantallaPrincipal").style.display = "none";
    document.getElementById("pantallaLogin").style.display = "flex";
}

// 4. Configurar lo que se puede ver según el rol
function aplicarPermisosSegunRol() {
    const textoUsuario = document.getElementById("textoUsuarioActivo");
    const aviso = document.getElementById("cajaAviso");

    const formulariosDocente = [
        document.getElementById("cajaDocenteTarea"),
        document.getElementById("cajaDocenteExamen"),
        document.getElementById("cajaDocenteComunicado")
    ];

    const colAccion = document.getElementById("colAccionExamen");

    if (usuarioSesion.tipo === "profesor") {
        textoUsuario.textContent = "Docente: " + usuarioSesion.nombre;
        aviso.className = "aviso-banner aviso-modo-docente";
        aviso.innerHTML = "<strong>Modo Administrador Docente Habilitado:</strong> Usted puede publicar o retirar tareas, registrar fechas de exámenes y emitir comunicados oficiales.";

        formulariosDocente.forEach(f => f.style.display = "block");
        colAccion.style.display = "table-cell";

    } else if (usuarioSesion.tipo === "padre") {
        textoUsuario.textContent = "Padre/Madre de Familia: " + usuarioSesion.nombre;
        aviso.className = "aviso-banner aviso-modo-padre";
        aviso.innerHTML = "<strong>Acceso de Padre de Familia (Solo Consulta):</strong> Puede revisar el avance de tareas, rol de exámenes y circulares oficiales emitidas por los profesores.";

        formulariosDocente.forEach(f => f.style.display = "none");
        colAccion.style.display = "none";

    } else {
        textoUsuario.textContent = "Estudiante: " + usuarioSesion.nombre;
        aviso.className = "aviso-banner aviso-modo-padre";
        aviso.innerHTML = "<strong>Acceso Estudiantil (Solo Consulta):</strong> Revisa tus deberes y temas a estudiar para las evaluaciones.";

        formulariosDocente.forEach(f => f.style.display = "none");
        colAccion.style.display = "none";
    }
}

// 5. Guardar datos en memoria del navegador
function guardarEnStorage() {
    localStorage.setItem("agenda_tareas", JSON.stringify(tareas));
    localStorage.setItem("agenda_examenes", JSON.stringify(examenes));
    localStorage.setItem("agenda_comunicados", JSON.stringify(comunicados));
}

// 6. Cambiar pestañas
function cambiarPestana(idSeccion, boton) {
    const secciones = document.querySelectorAll(".seccion-bloque");
    secciones.forEach(s => s.classList.remove("activa"));

    const botones = document.querySelectorAll(".tab-btn");
    botones.forEach(b => b.classList.remove("activo"));

    const seccionActiva = document.getElementById("vista-" + idSeccion);
    if (seccionActiva) {
        seccionActiva.classList.add("activa");
    }

    if (boton) {
        boton.classList.add("activo");
    }
}

// --- TAREAS ---
function dibujarTareas() {
    const contenedor = document.getElementById("contenedorListaTareas");
    const filtro = document.getElementById("filtroMateria").value;
    contenedor.innerHTML = "";

    let total = 0;

    tareas.forEach(t => {
        total++;
        if (filtro !== "TODAS" && t.materia !== filtro) {
            return;
        }

        const div = document.createElement("div");
        div.className = "tarjeta-tarea-item";

        div.innerHTML = `
            <div>
                <div>
                    <span class="etiqueta-materia">${t.materia}</span>
                    <span class="fecha-entrega-tag">Entrega: ${t.fecha}</span>
                </div>
                <p class="texto-detalle-tarea">${t.detalle}</p>
                <p class="nombre-docente-tag">Asignado por: <strong>${t.profesor}</strong></p>
            </div>
            ${usuarioSesion.tipo === "profesor" ? `
            <div class="pie-tarjeta-tarea">
                <button class="btn-eliminar-docente" onclick="eliminarTarea(${t.id})">Eliminar Tarea</button>
            </div>` : ""}
        `;

        contenedor.appendChild(div);
    });

    document.getElementById("numeroPendientes").textContent = "Total registradas: " + total;
}

function agregarTarea(e) {
    e.preventDefault();
    const nuevaTarea = {
        id: Date.now(),
        materia: document.getElementById("inputMateriaTarea").value,
        fecha: document.getElementById("inputFechaTarea").value,
        profesor: document.getElementById("inputProfesorTarea").value,
        detalle: document.getElementById("inputDetalleTarea").value
    };

    tareas.unshift(nuevaTarea);
    guardarEnStorage();
    dibujarTareas();
    actualizarVistaPadres();

    document.getElementById("formTarea").reset();
    alert("Tarea registrada y publicada con éxito.");
}

function eliminarTarea(id) {
    if (confirm("¿Está seguro de eliminar esta tarea escolar?")) {
        tareas = tareas.filter(t => t.id !== id);
        guardarEnStorage();
        dibujarTareas();
        actualizarVistaPadres();
    }
}

// --- EXÁMENES ---
function dibujarExamenes() {
    const tbody = document.getElementById("tablaCuerpoExamenes");
    tbody.innerHTML = "";

    examenes.forEach(ex => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${ex.fecha}</strong></td>
            <td>${ex.materia}</td>
            <td>${ex.tipo}</td>
            <td>${ex.temas}</td>
            ${usuarioSesion.tipo === "profesor" ? `<td><button class="btn-eliminar-docente" onclick="eliminarExamen(${ex.id})">Eliminar</button></td>` : ""}
        `;
        tbody.appendChild(tr);
    });
}

function agregarExamen(e) {
    e.preventDefault();
    const nuevo = {
        id: Date.now(),
        materia: document.getElementById("inputMateriaExamen").value,
        fecha: document.getElementById("inputFechaExamen").value,
        tipo: document.getElementById("inputTipoExamen").value,
        temas: document.getElementById("inputTemasExamen").value
    };

    examenes.push(nuevo);
    guardarEnStorage();
    dibujarExamenes();
    actualizarVistaPadres();

    document.getElementById("formExamen").reset();
    alert("Examen registrado en el rol de evaluaciones.");
}

function eliminarExamen(id) {
    if (confirm("¿Desea retirar esta fecha de examen?")) {
        examenes = examenes.filter(ex => ex.id !== id);
        guardarEnStorage();
        dibujarExamenes();
        actualizarVistaPadres();
    }
}

// --- COMUNICADOS ---
function dibujarComunicados() {
    const contenedor = document.getElementById("contenedorComunicados");
    contenedor.innerHTML = "";

    comunicados.forEach(c => {
        const div = document.createElement("div");
        div.className = "tarjeta-comunicado-item";
        div.innerHTML = `
            <h4>${c.titulo}</h4>
            <p class="info-emisor-com">Fecha: ${c.fecha} | Firmado por: <strong>${c.firma}</strong></p>
            <p class="cuerpo-mensaje-com">${c.mensaje}</p>
            ${usuarioSesion.tipo === "profesor" ? `<button class="btn-eliminar-docente" style="margin-top: 8px;" onclick="eliminarComunicado(${c.id})">Eliminar Comunicado</button>` : ""}
        `;
        contenedor.appendChild(div);
    });
}

function agregarComunicado(e) {
    e.preventDefault();
    const nuevo = {
        id: Date.now(),
        titulo: document.getElementById("inputTituloCom").value,
        fecha: document.getElementById("inputFechaCom").value,
        firma: document.getElementById("inputFirmaCom").value,
        mensaje: document.getElementById("inputMensajeCom").value
    };

    comunicados.unshift(nuevo);
    guardarEnStorage();
    dibujarComunicados();
    actualizarVistaPadres();

    document.getElementById("formComunicado").reset();
    alert("Comunicado publicado oficialmente.");
}

function eliminarComunicado(id) {
    if (confirm("¿Desea borrar este comunicado?")) {
        comunicados = comunicados.filter(c => c.id !== id);
        guardarEnStorage();
        dibujarComunicados();
        actualizarVistaPadres();
    }
}

// --- PANEL DE PADRES ---
function actualizarVistaPadres() {
    document.getElementById("resumenTotalTareas").textContent = tareas.length;
    document.getElementById("resumenTotalExamenes").textContent = examenes.length;
    document.getElementById("resumenTotalComunicados").textContent = comunicados.length;

    const caja = document.getElementById("listaTareasPadres");
    caja.innerHTML = "";

    if (tareas.length === 0) {
        caja.innerHTML = "<p style='color: #1b5e20; font-weight: bold;'>No hay tareas registradas actualmente.</p>";
    } else {
        tareas.forEach(t => {
            const div = document.createElement("div");
            div.className = "fila-padre-tarea";
            div.innerHTML = `<strong>${t.materia}</strong>: ${t.detalle} <br><span style="color: #c62828; font-weight: bold;">Fecha de entrega: ${t.fecha}</span> (Docente: ${t.profesor})`;
            caja.appendChild(div);
        });
    }
}
