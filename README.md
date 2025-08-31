# Proyecto Banco FrontEnd

El FrontEnd consume la API de ejemplo y muestra la información en tablas con un soporte para CRUD
## Requisitos
- Node.js **>22 LTS**
- Angular CLI
- npm o yarn
## BackEnd Server
- Habilitar CORS en el Backend en el archivo main.ts (en la linea comentada)
- Si el proyecto se ejecuta con error se debe instalar cors desde npm
## FrontEnd server
- Clonar este proyecto desde la opción "Code"
- Navegar a bp-frontend e instalar paquetes
```bash
   cd bp-frontend
   npm i
```
- Ejecutar el proyecto

```bash
  ng serve
```

La ruta en el navegador es la siguiente: `http://localhost:4200/`.
## Ejecutar Unit Test

para ejecutar los tests con Jest:
```bash
  npm run test
```
## Comentarios Adicionales
- El proyecto maneja señales y su store
- Para las pantallas principales no se a utilizado nada mas que vanilla scss y HTML
- Se utilizo toastr para las alertas, tambien se pudo optar por SweetAlert
## Areas de Mejora
- Se puede mejorar mucho los mensajes en pantalla
- Se debe agregar iconos
- Solo se ha implementado un test con el fin de dar a entender que puedo escribir codigo testeable 
- Se debe arreglar el menu flotante cuando se hace click en el ultimo producto
