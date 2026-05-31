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

Actualmente el backend se encuentra en una primera versión funcional.

Se han implementado y probado los siguientes módulos:

* Roles
* Departamentos
* Categorías de ticket
* Usuarios
* Tickets
* Comentarios de ticket
* Adjuntos de ticket
* Historial de ticket

También se inició el frontend con React + Vite y se validó correctamente la conexión con el backend consumiendo datos reales desde PostgreSQL.

---

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
