# Sistema de Recompensas Gamificadas

Esta API proporciona un sistema completo de recompensas gamificadas donde los usuarios pueden ganar puntos, logros y premios realizando diferentes acciones en la plataforma.

## Tecnologías utilizadas

- NestJS
- TypeScript
- MongoDB
- Mongoose
- Docker
- Swagger

## Características principales

- Gestión de usuarios con sistema de puntos y niveles
- Creación y canjeo de recompensas
- Otorgamiento automático de logros basados en objetivos
- Registro de historial de canjeos
- Sistema de simulación de acciones de usuario

## Instalación y configuración

### Requisitos previos

- Node.js (v16 o superior)
- MongoDB (o Docker)
- npm o yarn

### Pasos de instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/TU_USUARIO/rewards-platform.git
   cd rewards-platform
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Iniciar MongoDB (con Docker):
   ```bash
   docker-compose up -d mongodb
   ```
   
   O configure su propia instancia de MongoDB y actualice la URL de conexión en `src/config/database.config.ts`.

4. Iniciar la aplicación:
   ```bash
   npm run start:dev
   ```

5. La API estará disponible en: `http://localhost:3000`
   La documentación Swagger estará en: `http://localhost:3000/api/docs`

## Guía de uso con Postman

### Módulo de Usuarios

1. **Crear un usuario**
   - Método: POST
   - URL: `http://localhost:3000/users`
   - Body:
     ```json
     {
       "username": "usuario_test",
       "email": "test@ejemplo.com"
     }
     ```

2. **Obtener datos de un usuario**
   - Método: GET
   - URL: `http://localhost:3000/users/{id}`

### Módulo de Recompensas

1. **Crear una recompensa**
   - Método: POST
   - URL: `http://localhost:3000/rewards`
   - Body:
     ```json
     {
       "title": "Descuento Premium",
       "description": "25% de descuento en suscripción premium",
       "pointsRequired": 200,
       "stock": 10,
       "isActive": true
     }
     ```

2. **Listar todas las recompensas**
   - Método: GET
   - URL: `http://localhost:3000/rewards`

3. **Canjear una recompensa**
   - Método: POST
   - URL: `http://localhost:3000/rewards/redeem`
   - Body:
     ```json
     {
       "userId": "ID_USUARIO",
       "rewardId": "ID_RECOMPENSA"
     }
     ```

### Módulo de Logros

1. **Crear un logro**
   - Método: POST
   - URL: `http://localhost:3000/achievements`
   - Body:
     ```json
     {
       "name": "Primeros Pasos",
       "description": "Completar 5 tareas en la plataforma",
       "requirement": 5,
       "rewardId": "ID_RECOMPENSA"
     }
     ```

2. **Simular una acción (ganar puntos y posiblemente logros)**
   - Método: POST
   - URL: `http://localhost:3000/users/{id}/simulate-action`
   - Body:
     ```json
     {
       "actionType": "completar_tarea",
       "actionValue": 50
     }
     ```

### Módulo de Historial

1. **Ver historial de canjeos de un usuario**
   - Método: GET
   - URL: `http://localhost:3000/users/{id}/history`

## Flujo completo de ejemplo

1. Crear un usuario
2. Crear varias recompensas con diferentes costos en puntos
3. Crear logros con diversos requisitos
4. Simular acciones para que el usuario gane puntos
5. Verificar logros desbloqueados automáticamente
6. Canjear recompensas manualmente
7. Revisar el historial de canjeos

## Estructura del proyecto

```
src/
├── main.ts                    # Punto de entrada de la aplicación
├── app.module.ts              # Módulo principal
├── config/                    # Configuraciones
├── users/                     # Módulo de usuarios
├── rewards/                   # Módulo de recompensas
├── achievements/              # Módulo de logros
└── reward-history/            # Módulo de historial de canjeos
```

## Licencia

[MIT](LICENSE)
