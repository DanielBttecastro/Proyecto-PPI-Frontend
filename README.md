# Sistema gestor del PPI

![Sistema gestor del PPI](https://www.politecnicojic.edu.co/images/logo/logo.png)

## Descripción TDG

Los programas de la Técnica Profesional en Programación de Sistemas de Información y Tecnológica en Sistematización de Datos (TyT) de la Facultad de Ingenierías del Politécnico Colombiano Jaime Isaza, han orientado su proceso de enseñanza-aprendizaje (E-A) hacia el desarrollo de Proyectos Pedagógicos Integradores (PPI). En este contexto, cada equipo de estudiantes recibe asesorías y acompañamiento para alcanzar los objetivos en cada una de las etapas de sus proyectos.

Actualmente, el programa TyT utiliza la aplicación Appointedd (2024) para gestionar el proceso de asesorías. En esta aplicación, la planeación de las asesorías es realizada por los asesores, y la validación de su cumplimiento es llevada a cabo por el coordinador. Sin embargo, estos procesos son manuales y la herramienta no es propiedad de la institución. Esto ha creado la necesidad de desarrollar una herramienta propia que se ajuste a las necesidades específicas de la TyT.

## Objetivo del proyecto

Desarrollar de un sistema web responsivo para la gestión de asesorías de Proyectos Pedagógicos Integradores (PPI) y la generación de banner publicitarios de la TyT y validación de cumplimiento de asesorías mediante la implementación de herramientas tecnológicas ajustadas a los requerimientos del cliente.

## Tabla de contenidos
 
- [Instalación](#instalación)
- [Módulos](#módulos)
- [Tecnologías](#tecnologías) 
- [Responsabilidades](#responsabilidades)
- [Contacto](#contacto)
- [Contacto](#contacto)




## Instalación

```bash
git clone https://github.com/Danielbu82192/Proyecto-PPI-Frontend-DPrueba.git
cd Proyecto-PPI-Frontend-DPrueba
npm install -force
```

## Módulos

El proyecto consta de los siguientes módulos, cada uno con sus respectivas vistas:

### Módulo de Asesoría

Este módulo permite la gestión de las asesorías para el desarrollo del Proyecto Pedagógico Integrador, el cual consta de las siguientes vistas:

- **Visualizar:** Cada rol en el sistema tiene una vista específica para visualizar la información:

    - **Profesor Asesor:** Puede visualizar sus franjas horarias creadas cada semana.
    - **Estudiante:** Puede ver las asesorías  de cada semana.
    - **Coordinador Académico:** Puede ver las citas de asesorías  de todos los asesores.

- **Crear:** Permite a los asesores crear las franjas horarias para las citas de asesorías.
- **Agendar:** Permite a los estudiantes para reservar sus citas de manera sencilla y eficiente.


### Módulo de bitácora

Este módulo permite la gestión de las bitácoras, el cual consta de las siguientes vistas:

- **Visualizar:** Cada rol en el sistema tiene una vista específica para visualizar la información:

    - **Profesor Asesor:** Puede visualizar las bitacoras de los equipos.
    - **Estudiante:** Puede visualizar la bitacora de su equipo.
    - **Modulo sol:** Puede visualizar las bitacoras de los equipos.
    - **Coordinador Académico:** Puede visualizar las bitacoras de los equipos.

- **Visualizar seguimiento:** Permite a los diversos roles visualizar los seguimientos con sus respectivas observaciones y compromisos.

- **Modificar seguimiento:** Permite a los asesores agregar la retroalimentación dada en cada una de las citas.

- **Crear:** Permite a los profesores módulo sol crear o modificar las bitácoras y agregarles sus respectivos encabezados.


### Módulo de banner

Este módulo permite la gestión de las banner, el cual consta de las siguientes vistas:

- **Crear:** Permite al coordinador la creacion de los banners publicitarios. 

- **Modificar:** Permite al coordinador la creacion de los banners publicitarios.

- **Visualizar:** Permite a todos los roles la capacidad de ver los banners publicitarios en la vista principal después de iniciar sesión.

### Módulo de inicio de sesión

Este módulo habilita a todos los usuarios para iniciar sesión mediante la autenticación de Google, lo que les otorga acceso a los permisos de Calendar, Meet y Gmail, garantizando así el correcto funcionamiento de la aplicación.


### Módulo de Gestión Documental

Este módulo contiene todo lo relacionado con la gestión documental, las opciones disponibles varían de acuerdo al rol al que pertenezca el usuario.

#### COORDINADOR

- **Cargar Usuarios:** Permite al coordinador cargar los listados de estudiantes para crear los usuarios.
- **Crear Asesor:** Permite al coordinador crear los asesores disponibles para el semestre en curso.
- **Configurar Entregas:** Permite al coordinador establecer el porcentaje de cada entrega, las fechas de plazo máximo para la carga de archivos y su calificación, y el rol que se encargará de calificar cada entrega.
- **Limpiar sistema:** Permite al coordinador realizar un backup de las entregas realizadas por los estudiantes y hace un reinicio o limpia de toda la información del sistema.

#### ESTUDIANTE

- **Cargar Entregas:** Permite al estudiante subir las entregas correspondientes a las fases del proyecto PPI.

#### DOCENTE

- **Crear Equipos:** Permite al docente crear los equipos de estudiantes para el desarrollo del PPI.
Ver Equipos: Permite al docente ver los equipos creados por él.


### Módulo de Gestión Académica

Este módulo contiene todo lo relacionado con la gestión académica, las opciones disponibles varían de acuerdo al rol al que pertenezca el usuario.

#### COORDINADOR

- **Calificar Entregas:** Permite al coordinador calificar todas las entregas de todos los equipos.
- **Ver Notas:** Permite al coordinador ver todas las notas de todos los equipos.

#### ESTUDIANTE

- **Ver Notas:** Permite al estudiante ver las notas de las entregas que ha realizado.

#### DOCENTE:

- **Calificar Entregas:** Permite al docente calificar las entregas que le corresponden calificar a los equipos de los grupos que tenga.

#### ASESOR:

- **Calificar Entregas:** Permite al asesor calificar las entregas que le corresponden calificar a los equipos de los grupos que tenga.
- **Ver Notas:** Permite al asesor ver todas las notas de todos los equipos.

### Módulo administrar
Además de los módulos anteriores, el coordinador cuenta con un módulo administrar con las siguientes vistas:

- **Horas asesores:** Permite al coordinador visualizar y llevar un control de las horas de asesorías semanales de cada asesor.

- **Semanas:** Permite al coordinador establecer el inicio y el fin del periodo académico en el cual se está evaluando actualmente.

- **Contenido:** Permite al coordinador controlar los banners publicitarios que se mostraran en el inicio del aplicativo

- **Exportar:** Permite al coordinador generar exportaciones de informes de las bitácoras de los estudiantes, las citas de los asesores, equipos con mora de entrega, docentes con mora de calificación, estudiantes sin la nota de Asesoría.

- **Limpiar sistema:** Permite al coordinador limpiar el sistema al finalizar el semestre.

## Responsabilidades

La división de responsabilidades del desarrollo de los módulos anteriores fue dividida en 2 equipos donde los equipos se encuentran conformados por los estudiantes Daniel Bustamante Castro y Jose Alejandro Zapata Giraldo donde los mencionados anteriormente tuvieron la responsabilidad del desarrollo de los módulos de asesorías, bitácoras y login, mientras que el otro equipo es conformado por los estudiantes Keny Alejandro Serrato Ávila y Alejandro Bernal Duque los cuales tuvieron la responsabilidad del desarrollo de los módulos de gestión académica y gestión documental.

## Notas

En la version actual hay que tener en cuenta la siguiente información:

- En la versión actual, los servicios de Google no se encuentran desplegados sino en versión de prueba, lo cual implica que, para acceder a la aplicación, es necesario estar registrado en la API de Google, ya que no se encuentra abierta al público.

- El almacenamiento de las actividades subidas al aplicativo se encuentra alojado en un bucket de Amazon Web Services (AWS). Actualmente, se utiliza la capa gratuita, que ofrece almacenamiento limitado. En futuras versiones, si se sobrepasa este límite, se generarán costos adicionales.


## Tecnologías

En el presente proyecto se realiza el desarrollo del frontend del Sistema Gestor del PPI, utilizando tecnologías modernas y eficientes para garantizar una experiencia de usuario fluida y atractiva.
<p align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/2300px-React-icon.svg.png" alt="ReactJs" width="200" >
  <img src="https://cdn.icon-icons.com/icons2/2389/PNG/512/next_js_logo_icon_145038.png" alt="NextJS" width="200" > 
</p>

El frontend ha sido desarrollado con **Next.js**, un poderoso framework de **React.js** que permite la creación de aplicaciones web optimizadas y de alto rendimiento. A continuación, se detallan las principales tecnologías y dependencias utilizadas en este proyecto:

- **Tailwind CSS**: Framework de CSS para diseñar interfaces de usuario modernas y responsivas de manera eficiente.
- **Date-fns**: Biblioteca para el manejo y manipulación de fechas en JavaScript.
- **XLSX**: Biblioteca para trabajar con archivos Excel, permitiendo la importación y exportación de datos en formato XLSX.
- **Axios**: Cliente HTTP basado en promesas para realizar solicitudes a APIs, simplificando la comunicación con servidores.
- **AWS SDK**: Conjunto de herramientas de Amazon Web Services para interactuar con los servicios de AWS desde tu aplicación.
- **Crypto-js**: Librería de JavaScript para realizar operaciones criptográficas, como cifrado y hash.
- **Luxon**: Biblioteca para el manejo de fechas y horas en JavaScript, diseñada como una alternativa moderna a Moment.js.


## Contacto 

El proyecto fue desarollado por los siguientes estuidantes pertenecientes al politecnico jaime isaza cadavid:

**Daniel Bustamante Castro** Daniel_bustamante82192@elpoli.edu.co

**Jose Alejandro Zapata Giraldo** jose_zapata82192@elpoli.edu.co

**Alejandro Bernal Duque** alejandro_bernal82191@elpoli.edu.co

**Keny Alejandro Serrato Ávila** keny_serrato82181@elpoli.edu.co
