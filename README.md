# Antes de que termine este capítulo 🎓

### Proyecto de regalo virtual de graduación — Promoción 2026 de Mecatrónica

<p align="center">
  <strong>Un recuerdo digital para una generación que siempre tendrá algo que recordar.</strong>
</p>

<p align="center">
  <a href="https://sadcat8708.github.io/gran-final-/">Ver proyecto publicado</a>
  ·
  <a href="https://github.com/sadcat8708/gran-final-">Ver repositorio</a>
</p>

---

## 1. Descripción del proyecto

**Antes de que termine este capítulo** es una experiencia digital desarrollada como regalo de despedida para los integrantes de la Promoción 2026 de Mecatrónica del INEM.

La plataforma permite que cada graduado ingrese de manera personalizada, descubra una carta especial preparada para él y pueda descargarla en formato PDF para conservarla como recuerdo.

El sistema también dispone de un panel administrativo privado que permite gestionar los destinatarios y sus cartas.

El proyecto busca convertir los recuerdos, experiencias y momentos compartidos durante la etapa escolar en un recuerdo digital que pueda conservarse después de la graduación.

## 2. Objetivo

Crear un espacio digital personalizado que permita a los integrantes de la Promoción 2026 de Mecatrónica recibir y conservar un mensaje especial de despedida, como recuerdo de esta etapa de sus vidas.

## 3. Tecnologías utilizadas

| Tecnología | Función |
|---|---|
| HTML5 | Estructura de las páginas web. |
| CSS3 | Diseño visual, estilos, animaciones y adaptación a dispositivos. |
| JavaScript | Lógica e interactividad del sistema. |
| Supabase | Autenticación y almacenamiento de información. |
| GitHub | Control de versiones y alojamiento del repositorio. |
| GitHub Pages | Publicación del sitio web. |
| jsPDF | Generación y descarga de cartas en PDF. |

## 4. Funcionalidades

### Para los graduados

- Acceso personalizado mediante correo electrónico y contraseña.
- Identificación del graduado autenticado.
- Visualización de su carta individual.
- Lectura de mensajes personalizados.
- Selección de diferentes temas visuales para la carta.
- Cambio del tema general de la página.
- Descarga de la carta en formato PDF.
- Cierre de sesión.

### Para el administrador

- Acceso privado al área administrativa.
- Consulta de graduados registrados.
- Búsqueda de destinatarios.
- Gestión de destinatarios.
- Creación y edición de cartas.
- Personalización del contenido y los temas de las cartas.
- Publicación de cartas.
- Consulta de estadísticas.
- Exportación de copias de seguridad.

## 5. Estructura del proyecto

El proyecto está organizado de la siguiente manera:

```text
gran-final-/
│
├── admin/
│   ├── dashboard.html
│   └── index.html
│
├── assets/
│   ├── fonts/
│   ├── icons/
│   │
│   ├── css/
│   │   ├── acceso.css
│   │   ├── admin.css
│   │   ├── carta.css
│   │   ├── dashboard.css
│   │   └── style.css
│   │
│   └── js/
│       ├── acceso.js
│       ├── admin.js
│       ├── carta.js
│       ├── dashboard.js
│       ├── main.js
│       ├── pdf.js
│       └── supabase.js
│
├── database/
│   ├── policies.sql
│   └── schema.sql
│
├── docs/
│   └── estructura.md
│
├── .gitignore
├── acceso.html
├── carta.html
├── index.html
└── README.md
```

### Organización de las carpetas

- **admin/:** contiene las páginas del área administrativa.
- **assets/fonts/:** carpeta destinada a las fuentes tipográficas.
- **assets/icons/:** carpeta destinada a los iconos.
- **assets/css/:** contiene los estilos de las diferentes páginas.
- **assets/js/:** contiene los scripts que controlan las funcionalidades del sistema.
- **database/:** carpeta reservada para documentación o scripts SQL.
- **docs/:** contiene documentación complementaria.

### Archivos principales

| Archivo | Descripción |
|---|---|
| `index.html` | Página principal del proyecto. |
| `acceso.html` | Acceso de los graduados. |
| `carta.html` | Visualización de la carta personalizada. |
| `admin/dashboard.html` | Panel de administración. |
| `admin/index.html` | Página adicional del área administrativa. |
| `assets/js/supabase.js` | Configuración de conexión con Supabase. |
| `assets/js/acceso.js` | Lógica de autenticación de graduados. |
| `assets/js/carta.js` | Carga y gestión de la carta personal. |
| `assets/js/pdf.js` | Generación de documentos PDF. |
| `assets/js/dashboard.js` | Funcionalidades del dashboard. |
| `assets/js/admin.js` | Funcionalidades del área administrativa. |

## 6. Arquitectura de la base de datos

El proyecto utiliza **Supabase** como servicio externo para la autenticación y el almacenamiento de información.

La configuración de la base de datos se administra directamente desde el panel de Supabase.

### Tablas principales

**Tabla `personas`**

Almacena la información de los graduados y su relación con las cuentas de autenticación.

Entre los campos utilizados por el código se encuentran:

- `id`: identificador de la persona.
- `nombre`: nombre del graduado.
- `user_id`: identificador de su cuenta de autenticación.
- `activo`: indica si el usuario está habilitado.

**Tabla `cartas`**

Almacena la información de las cartas personalizadas.

Entre los campos utilizados por el código se encuentran:

- `persona_id`: identifica al destinatario de la carta.
- `titulo`: título de la carta.
- `contenido`: mensaje personalizado.
- `des