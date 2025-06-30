# 🚗 Sistema de Gestión Automotriz – Frontend

Este es el frontend de un sistema de gestión automotriz desarrollado con **React**. El sistema permite la administración eficiente de un taller mecánico, con funcionalidades adaptadas a diferentes tipos de usuarios: **Administrador**, **Mecánico** y **Recepcionista**.

## 👥 Tipos de Usuario

- **Administrador**: Acceso total al sistema. Puede gestionar usuarios, reportes, vehículos y configuraciones.
- **Recepcionista**: Registra ingresos, clientes, genera órdenes de trabajo y hace seguimiento básico.
- **Mecánico**: Visualiza y actualiza el estado de las órdenes asignadas, puede dejar observaciones técnicas.

## 🧩 Funcionalidades Principales

- Autenticación y control de acceso según rol.
- Registro y gestión de clientes y vehículos.
- Generación y seguimiento de órdenes de trabajo.
- Asignación de tareas a mecánicos.
- Control de inventario (opcional).
- Panel administrativo con estadísticas y reportes.

## 🛠️ Tecnologías Utilizadas

- **React** – Librería principal para construir la UI.
- **React Router DOM** – Navegación entre vistas.
- **Context API / useReducer** – Manejo de estado global (usuarios, autenticación).
- **Axios** – Consumo de API REST.
- **TailwindCSS** (según preferencia) – Estilos responsivos y componentes.
- **React Hook Form / Formik** – Manejo de formularios y validaciones.
- **SweetAlert2 / Toastify** – Notificaciones amigables al usuario.

## ▶️ Cómo Ejecutar el Proyecto

1. Clona el repositorio:

   ```bash
   git clone https://github.com/SebaasG/FrontFullStackProject
   cd nombre-repo-frontend

2. Ejecuta:
    npm run dev 

3. Recuerda tener el backend activo para que las apis se puedan consumir correctamente.
