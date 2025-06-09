G Spot es una aplicación móvil desarrollada con React Native (Expo) que permite a los usuarios descubrir, capturar y compartir lugares fotogénicos. Funciona como una red social geolocalizada: los usuarios toman una foto, se guarda automáticamente la ubicación y se publica como un spot para que otros usuarios puedan encontrar y visitar ese lugar.


Características principales

- Captura de imágenes directamente con la cámara del dispositivo.

- Registro automático de la ubicación al tomar la foto.

- Visualización de spots en un feed ordenado por cercanía y popularidad.

- Sistema de likes y favoritos para spots.

- Pantalla de perfil con spots subidos y guardados.

- Backend propio con API REST en Node.js + Express.

- Base de datos MongoDB para almacenamiento persistente.

- Uso de permisos sensibles como cámara y ubicación.

- Manejo de estado global con Context API (AuthContext y FavoriteContext).


Tecnologías utilizadas

- Frontend: React Native con Expo

- Backend: Node.js + Express

- Base de datos: MongoDB

- Gestión de dependencias: npm

- Construcción APK: Expo Application Services (EAS)

- Control de versiones: Git + GitHub


* Instalación

Clonar el repositorio
git clone https://github.com/EruOC2/Gspot.git
cd Gspot

Instalar dependencias y ejecutar el servidor:

Dentro de la carpeta backend
cd backend
npm install
node server.js

El backend se ejecutará en http://localhost:3000 o en la IP local de tu red si así lo configuras.

Configurar el frontend

1- Instalar dependencias del frontend:

npm install

Ejecutar en modo desarrollo:

- npx expo start

Generar APK

1-Asegúrate de tener EAS CLI instalado:

npm install -g eas-cli

2-Autenticarse con Expo:

eas login

3-Generar APK:

eas build --platform android --profile preview

