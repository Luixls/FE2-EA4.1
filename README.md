
# UVM Torneos

UVM Torneos es una aplicación de gestión diseñada para administrar y visualizar datos relacionados con deportes, competencias y atletas. Esta aplicación soporta funcionalidades CRUD (Crear, Leer, Actualizar y Eliminar) para gestionar información sobre atletas, deportes y competencias. También incluye autenticación basada en roles, con distinción entre `admin`, `mod` y `usuario`, garantizando un acceso controlado a las diferentes secciones.

Además, la aplicación está optimizada como una **PWA (Progressive Web App)**, lo que permite su instalación en dispositivos y su uso offline.

---

## Funcionalidades Principales

1. **Gestión de Usuarios**:
   - Registro de nuevos usuarios (roles: `usuario`, `mod`, `admin`).
   - Inicio de sesión con email o username.
   - Control de roles: 
     - Los administradores (`admin`) pueden gestionar otros usuarios, deportes, competencias y atletas.
     - Los moderadores (`mod`) pueden editar y gestionar datos excepto usuarios.
     - Los usuarios (`usuario`) tienen acceso limitado a datos de consulta.

2. **Gestión de Deportes**:
   - CRUD para deportes con información como nombre, descripción e imagen.

3. **Gestión de Atletas**:
   - CRUD para atletas, incluyendo detalles como nombre, nacionalidad, fecha de nacimiento y género.
   - Filtros avanzados para buscar atletas por nombre, género, nacionalidad y año de nacimiento.

4. **Gestión de Competencias**:
   - CRUD para competencias con detalles como deporte, categoría, año y tiempos de participantes.
   - Clasificación automática de los primeros lugares según los tiempos registrados.

5. **PWA**:
   - Instalación como aplicación en dispositivos.
   - Soporte offline.

6. **Experiencia de Usuario**:
   - Animaciones suaves entre páginas (usando `framer-motion`)..
   - Diseño Responsive adaptable para varios dispositivos, con enfoque "mobile first".
   - Formularios emergentes para agregar y editar datos.

---

## Lógica de Programación

El proyecto utiliza una arquitectura cliente-servidor con las siguientes tecnologías:

### Frontend:
- **React + Vite**:
  - `react-router-dom` para navegación.
  - `framer-motion` para animaciones.
  - `react-hook-form` y `yup` para validaciones en formularios.
- **TailwindCSS** para un diseño responsivo y rápido.
- Componentes reutilizables como `Header`, `Footer`, `PaginaAnimada`.

### Backend:
- **Node.js + Express**:
  - Rutas protegidas con autenticación JWT.
  - Middlewares personalizados para roles (`verificarAdmin`, `verificarMod`).
- **MongoDB**:
  - Modelos bien definidos para los datos de `Usuario`, `Deporte`, `Competencia` y `Atleta`.
  - Relaciones entre documentos utilizando `ObjectId`.

### Lógica destacada:
1. **Autenticación y roles**:
   - El token JWT almacena el rol del usuario, usado para validar permisos.
2. **Clasificación de competencias**:
   - La lógica para determinar los primeros lugares se basa en convertir los tiempos registrados a segundos y ordenar los resultados.
3. **Protección de funcionalidades**:
   - La aplicación crea una cuenta admin maestra basada en la configuración cuando se inicia por primera vez. De igual manera, intentar crear más cuentas de tipo admin o mod requiere una contraseña del sistema que también debe ser configurada.
4. **CRUD para datos relevantes**:
   - Las funcionalidades CRUD, a través de los endpoints y la API, se encuentra presente para casi todos los datos relevantes, con la única excepción siendo la edición de datos de un usuario (solo se permite borrar completamente a los usuarios en vez de editarlos, por motivos de seguridad).

---


## Instalación y Uso

  

### Prerrequisitos

- Tener instalado [Node.js](https://nodejs.org/) (versión 16 o superior) y [MongoDB](https://www.mongodb.com/try/download/community).

### Clonar el proyecto

1. El código fuente del proyecto está disponible en: [https://github.com/Luixls/FE2-EA4.1](https://github.com/Luixls/FE2-EA4.1)
2. Se puede clonar el proyecto desde la aplicación GitHub desktop, luego abrir la carpeta del directorio con VSCode permitirá continuar con la instalación.
  

### Configurar el frontend

1. Instalar las dependencias desde la raíz del proyecto:

```bash

npm install

```

2. Iniciar el proyecto en modo desarrollo:

```bash

npm run dev

```

  

### Configurar el backend

1. Navega al directorio `backend`:

```bash

cd backend

```

2. Instalar las dependencias del backend:

```bash

npm install

```

3. Se puede configurar el archivo `.env` ubicado en `backend/.env` con las variables deseadas. Por defecto, ya está configurado.

4. Iniciar el backend:

```bash

npm run dev

```

  

### Uso

1. Accede a la aplicación en tu navegador en `http://localhost:5173`.

2. Inicia sesión con las credenciales del administrador configuradas en el `.env` o registra nuevos usuarios.

3. Explora las funcionalidades de gestión para `deportes`, `atletas` y `competencias`.

  

---
