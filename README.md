📌 Proyecto Frontend – Angular 18

Este proyecto corresponde al frontend de la aplicación, desarrollado con Angular 18, siguiendo buenas prácticas de estructura, modularización y consumo de servicios backend mediante APIs REST.

El objetivo de este README es permitir que cualquier persona que clone el repositorio pueda ejecutar la aplicación sin inconvenientes, incluso un evaluador técnico.

🛠️ Tecnologías utilizadas

Angular 18

Node.js

npm

TypeScript

HTML / CSS

📋 Requisitos previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

Node.js (versión recomendada: LTS)

npm (incluido con Node.js)

Angular CLI versión 18

Para instalar Angular CLI 18 de forma global:

npm install -g @angular/cli@18

🚀 Ejecución del proyecto
1️⃣ Clonar el repositorio
git clone https://github.com/yeison1ruano2/ciberNacionFront.git
cd ciberFront

2️⃣ Instalar dependencias

Una vez clonado el proyecto, es necesario instalar las dependencias.
Debido a posibles conflictos de dependencias entre librerías, se recomienda ejecutar:

npm install --force

⚠️ Nota:
El uso de --force es intencional y necesario para asegurar la correcta instalación de los node_modules y evitar errores de compatibilidad al ejecutar la aplicación.

3️⃣ Ejecutar la aplicación

Después de instalar las dependencias, inicia el servidor de desarrollo:

ng serve

Por defecto, la aplicación estará disponible en:

http://localhost:4200

