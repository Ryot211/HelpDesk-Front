# HelpDesk System

Sistema HelpDesk desarrollado como proyecto de práctica y portafolio, orientado a la gestión de tickets de soporte técnico dentro de una organización.

El proyecto está dividido en dos partes principales:

* **Backend:** API HTTP tipo REST desarrollada con Spring Boot y PostgreSQL.
* **Frontend:** Cliente web desarrollado con React + Vite para consumir las APIs del backend.

---

## Descripción del proyecto

HelpDesk System permite gestionar solicitudes de soporte técnico mediante tickets.
Cada ticket puede tener categoría, prioridad, estado, usuario creador, usuario asignado, comentarios, adjuntos e historial de acciones.

El objetivo del proyecto es practicar una arquitectura real de aplicación web, separando responsabilidades entre backend, frontend, base de datos, servicios, DTOs, mappers y consumo de APIs.

---
## Estado actual del proyecto

El sistema HelpDesk cuenta actualmente con un backend API REST desarrollado en Spring Boot y un frontend desarrollado con React + Vite. La aplicación permite gestionar tickets de soporte, catálogos básicos y usuarios.

### Funcionalidades implementadas

#### Backend

* API REST con Spring Boot.
* Persistencia con PostgreSQL.
* Gestión de tickets.
* Gestión de comentarios.
* Gestión de adjuntos.
* Gestión de historial del ticket.
* Gestión de categorías de ticket.
* Gestión de departamentos.
* Gestión básica de usuarios.
* Login básico por email y contraseña.
* Validación de usuario activo.
* Contraseñas almacenadas con hash.
* Uso de DTOs, services, repositories y mappers.

#### Frontend

* Proyecto React creado con Vite.
* Consumo de APIs con Axios.
* Rutas con React Router.
* Layout principal con Sidebar y Navbar.
* Dashboard con datos reales.
* Listado de tickets.
* Búsqueda y filtro por estado.
* Creación de tickets.
* Detalle de ticket.
* Acciones del ticket:

  * Asignar responsable.
  * Cambiar estado.
  * Cerrar con solución.
* Comentarios del ticket.
* Registro de metadata de adjuntos.
* Historial del ticket.
* Catálogo de categorías.
* Catálogo de departamentos.
* Catálogo básico de usuarios.
* Crear, editar e inactivar usuarios.
* Login básico en frontend.
* Rutas protegidas.
* Usuario autenticado guardado en localStorage.
* Reemplazo de IDs fijos por el usuario autenticado.
* Botón de cierre de sesión.
* Modo claro / oscuro.
* Alertas con SweetAlert2.
* Ícono personalizado en la pestaña del navegador.

## Autenticación actual

Actualmente el sistema cuenta con un login básico. El usuario ingresa email y contraseña, el backend valida las credenciales y devuelve la información del usuario autenticado.

El frontend guarda temporalmente el usuario en `localStorage` para mantener la sesión activa y proteger las rutas internas de la aplicación.

Este flujo permite:

* Iniciar sesión.
* Mantener usuario autenticado en frontend.
* Mostrar el usuario real en el Navbar.
* Cerrar sesión.
* Usar el ID del usuario autenticado al crear tickets, comentar, registrar adjuntos y cerrar tickets.

## Próxima mejora: autenticación con JWT

Como siguiente etapa se plantea implementar autenticación con JWT.

Con JWT, el backend generará un token después de validar las credenciales del usuario. Este token será enviado por el frontend en cada petición usando el header:

```txt
Authorization: Bearer <token>
```

Esto permitirá:

* Proteger endpoints desde el backend.
* Validar si el usuario está autenticado en cada request.
* Manejar expiración de sesión.
* Controlar accesos según rol.
* Evitar depender únicamente de la protección visual del frontend.
* Preparar el sistema para una arquitectura más profesional y escalable.

## Pendiente para próximas versiones

* Implementar JWT.
* Proteger endpoints del backend.
* Manejar expiración automática de sesión.
* Controlar permisos por rol:

  * Administrador.
  * Soporte.
  * Usuario final.
* Implementar cambio de contraseña desde frontend.
* Mejorar manejo global de errores.
* Agregar paginación y filtros avanzados.
* Agregar subida real de archivos para adjuntos.
* Documentar endpoints principales.


## Tecnologías utilizadas

### Backend

* Java 17
* Spring Boot 4
* Spring Web MVC
* Spring Data JPA
* PostgreSQL
* Maven
* Lombok
* MapStruct
* Spring Security Crypto
* IntelliJ IDEA
* Postman

### Frontend

* React
* Vite
* JavaScript
* Axios
* React Router DOM
* Tailwind CSS
* Lucide React


## Arquitectura general

```txt
Frontend React + Vite
        ↓
Axios
        ↓
API Backend Spring Boot
        ↓
Spring Data JPA
        ↓
PostgreSQL
```

---

## Estructura general del backend

```txt
src/main/java/com/ryot/helpdesk
│
├── config
│   └── Configuraciones generales como CORS y password encoder
│
├── controller
│   └── Controladores HTTP que exponen los endpoints
│
├── dto
│   └── Objetos para entrada y salida de datos
│
├── entity
│   └── Entidades JPA que representan tablas de la base de datos
│
├── mapper
│   └── Mappers de MapStruct para convertir Entity ↔ DTO
│
├── repository
│   └── Repositorios JPA para acceso a datos
│
├── service
│   └── Lógica de negocio
│
├── utils
│   └── Constantes y utilidades generales
│
└── HelpdeskApplication.java
```

---

## Estructura inicial del frontend

```txt
src/
│
├── api/
│   ├── axiosConfig.js
│   └── ticketApi.js
│
├── components/
│   ├── layout/
│   ├── ui/
│   └── tickets/
│
├── pages/
│   └── TicketsPage.jsx
│
├── routes/
│
├── utils/
│
├── App.jsx
├── main.jsx
└── index.css
```

---

## Autor

Desarrollado por Ryot-Dev
