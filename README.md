# Antes de que termine este capítulo 🎓

**Proyecto de regalo virtual de graduación — Promoción 2026 de Mecatrónica**

---

## 1. Descripción del proyecto

*Antes de que termine este capítulo* es una experiencia digital creada como regalo de despedida para los integrantes de la Promoción 2026 de Mecatrónica del INEM.

La plataforma permite que cada graduado ingrese de manera personalizada, descubra una carta especial preparada para él y pueda descargarla en formato PDF para conservarla como recuerdo.

Además, cuenta con un panel administrativo privado que permite gestionar los destinatarios, crear y editar cartas, controlar su publicación y consultar información del sistema.

## 2. Objetivo

Crear un espacio digital personalizado que permita a los integrantes de la Promoción 2026 de Mecatrónica recibir y conservar un mensaje especial de despedida, como recuerdo de las experiencias y momentos compartidos durante su etapa escolar.

## 3. Tecnologías utilizadas

| Tecnología | Función |
|---|---|
| HTML5 | Estructura de las páginas web. |
| CSS3 | Diseño visual, estilos, animaciones y adaptación a dispositivos. |
| JavaScript | Lógica e interactividad del sistema. |
| Supabase | Autenticación y almacenamiento de información. |
| GitHub Pages | Alojamiento y publicación del sitio web. |
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

- Acceso privado al panel administrativo.
- Consulta de graduados registrados.
- Búsqueda de destinatarios.
- Gestión de destinatarios.
- Creación y edición de cartas.
- Personalización del contenido y los temas de las cartas.
- Publicación de cartas.
- Consulta de estadísticas.
- Exportación de copias de seguridad.

### Características adicionales

- Diseño visual con temática de graduación.
- Interfaz adaptable a diferentes tamaños de pantalla.
- Personalización de las cartas.
- Almacenamiento de información mediante Supabase.

## 5. Estructura del proyecto

El proyecto está organizado en las siguientes carpetas y archivos:

```text
PROYECTO-PROM-2026/
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
├── acceso.html
├── carta.html
├── index.html
├── README.md
└── .gitinore
```

### Organización de las carpetas

- **admin/:** contiene las páginas relacionadas con el acceso y el panel administrativo.
- **assets/css/:** almacena las hojas de estilos de las diferentes secciones.
- **assets/js/:** contiene los scripts que controlan la lógica y las funcionalidades.
- **assets/fonts/:** carpeta destinada a los recursos tipográficos.
- **assets/icons/:** carpeta destinada a los recursos gráficos e iconos.
- **database/:** contiene el esquema de la base de datos y las políticas de seguridad de Supabase.
- **docs/:** almacena documentación complementaria del proyecto.

### Archivos principales

| Archivo | Descripción |
|---|---|
| `index.html` | Página principal. |
| `acceso.html` | Página de acceso de los graduados. |
| `carta.html` | Página donde se visualiza la carta personal. |
| `admin/dashboard.html` | Panel de administración. |
| `admin/index.html` | Página adicional del área administrativa. |
| `assets/js/supabase.js` | Configuración de conexión con Supabase. |
| `assets/js/pdf.js` | Generación de documentos PDF. |
| `database/schema.sql` | Estructura de la base de datos. |
| `database/policies.sql` | Políticas de seguridad de la base de datos. |

## 6. Requisitos

Para trabajar con el proyecto se necesita:

- Visual Studio Code u otro editor de código.
- Un navegador web actualizado.
- Conexión a internet.
- Un proyecto configurado en Supabase.
- Las credenciales públicas necesarias para establecer la conexión con Supabase.

## 7. Configuración de Supabase

Supabase se utiliza para gestionar la autenticación de los usuarios y almacenar la información de los graduados y sus cartas.

El proyecto incluye dos archivos SQL:

- `database/schema.sql`: contiene la definición del esquema de la base de datos.
- `database/policies.sql`: contiene las políticas de seguridad.

Para configurar el entorno:

1. Crear o utilizar el proyecto correspondiente en Supabase.
2. Revisar y ejecutar los scripts SQL necesarios.
3. Configurar la autenticación de usuarios.
4. Verificar las relaciones y permisos de las tablas.
5. Configurar las credenciales públicas en `assets/js/supabase.js`.

**Importante:** nunca publiques contraseñas administrativas ni claves privadas como `service_role` en el código del navegador. Las operaciones deben estar protegidas mediante políticas de seguridad adecuadas.

## 8. Instalación y ejecución local

1. Clonar o descargar el repositorio.
2. Abrir la carpeta principal del proyecto en Visual Studio Code.
3. Revisar la configuración de Supabase.
4. Abrir el proyecto mediante un servidor local.
5. Ingresar a la página principal.
6. Comprobar que las páginas y las conexiones funcionen correctamente.

## 9. Publicación

El proyecto utiliza GitHub Pages para alojar la plataforma.

Para publicar una actualización:

1. Subir los cambios al repositorio de GitHub.
2. Verificar la configuración de GitHub Pages.
3. Esperar a que termine el proceso de publicación.
4. Ingresar al enlace del proyecto.
5. Comprobar el funcionamiento de las diferentes secciones.

**Enlace del proyecto:** [Agregar enlace definitivo]

**Repositorio:** [Agregar enlace del repositorio]

## 10. Seguridad y privacidad

Debido a que la plataforma maneja cuentas de acceso e información personalizada, se deben tener en cuenta las siguientes recomendaciones:

- Mantener privadas las credenciales administrativas.
- No compartir contraseñas de los usuarios.
- Proteger las tablas mediante políticas RLS.
- Verificar los permisos de lectura y escritura.
- Evitar exponer información privada en el código público.
- Realizar copias de seguridad periódicas.

## 11. Autoría y créditos

**Autores:** Promoción 2026 - Mecatrónica.

**Institución:** INEM.

**Proyecto:** Antes de que termine este capítulo.

Desarrollado como un recuerdo digital de despedida para los integrantes de la Promoción 2026 de Mecatrónica.

---

*Porque algunos capítulos terminan, pero los recuerdos permanecen.* 🎓