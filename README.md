# SimposioUMG 2020
Proyecto para administracion e inscripcion al simposio 2020 de la UMG en Quetzaltenango.
Para inscribirse los alumnos deben crear una cuenta e iniciar sesi&oacute;n, luego podr&aacute;n registrar su pago subiendo la foto del recibo de dep&oacute;sito del banco. 
Los administradores ser&aacute;n capaces de aceptar o rechazar los pagos registrados de los estudiantes y cuando un pago es aprobado el estudiante podr&aacute; inscribirse a las conferencias.

## Tecnolog&iacute;as utilizadas
- [Django](https://www.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Angular](https://angular.io/)
- [MySQL](https://www.mysql.com/)
- [Bootstrap](https://getbootstrap.com/)

## Capturas de pantalla

<img alt="Pantalla principal" src="https://raw.githubusercontent.com/juanguerra97/simposioumg2020/master/capturas/Home.png" with="47%"/>
<img alt="Pantalla de login" src="https://raw.githubusercontent.com/juanguerra97/simposioumg2020/master/capturas/Login.png" with="47%"/>
<img alt="Pantalla de registro" src="https://raw.githubusercontent.com/juanguerra97/simposioumg2020/master/capturas/Registro.png" with="47%"/>
<img alt="Pago aceptado" src="https://raw.githubusercontent.com/juanguerra97/simposioumg2020/master/capturas/PagoAceptado.png" with="47%"/>
<img alt="Ticket valido" src="https://raw.githubusercontent.com/juanguerra97/simposioumg2020/master/capturas/TicketValido.png" with="47%"/>
<img alt="Menu de administrador" src="https://raw.githubusercontent.com/juanguerra97/simposioumg2020/master/capturas/MenuAdministrador.png" with="47%"/>
<img alt="Ingreso de nueva carrera" src="https://raw.githubusercontent.com/juanguerra97/simposioumg2020/master/capturas/NuevaCarrera.png" with="47%"/>
<img alt="Envio de reporte en PDF por correo" src="https://raw.githubusercontent.com/juanguerra97/simposioumg2020/master/capturas/EnvioReportePorCorreo.png" with="47%"/>
<img alt="Recepcion de correo" src="https://raw.githubusercontent.com/juanguerra97/simposioumg2020/master/capturas/RecepcionCorreo.png" with="47%"/>  

## Ejecuci&oacute;n del backend

1. Primero debes crear el usuario y base de datos ejecutando el script `/backend/simpsium/dbuser.sql`.
    > Debes tener instalado MySQL y tener una cuenta con permisos para crear usuarios y bases de datos.

1. Instalar las dependencias del backend
    ```
    pip install bcrypt==3.1.7 django==2.2.5 django-allauth==0.41.0 django-cors-headers==3.2.1 djangorestframework==3.11.0 mysqlclient==1.4.6 oauthlib==3.1.0 pillow==7.0.0 qrcode==6.1 requests-oauthlib==1.3.0
    ```

1. Debes ejecutar las migraciones. Para esto, abre una terminal, ve al directorio `/backend/simposium` y ejecuta 
    ```
    python manage.py migrate
    ```
    > La direcci&oacute;n por defecto de la base de datos es **192.168.10.10**.
    > Puedes cambiar la direcci&oacute;n del servidor, usuario y nombre de la base de datos modificando el archivo `/backend/simposium/simposium/settings.py`  

1. **Opcional:** Si quieres utilizar la opci&oacute;n de enviar reporte por correo deber&aacute;s configurar las credenciales del correo del cual se enviar&aacute;n los correos modificando `EMAIL_HOST_USER` y `EMAIL_HOST_PASSWORD` en el archivo `/backend/simposium/simposium/settings.py`
    ![Configuracion de email en settings.py](https://raw.githubusercontent.com/juanguerra97/simposioumg2020/master/capturas/SettingsConfigEmail.png)
    > NOTA: El correo electr&oacute;nico debe ser Gmail y la cuenta de Google debe tener configurada la opcion para de *Permitir el acceso de apps menos seguras* como se muestra a continuacion
    ![Configuracion de email en settings.py](https://raw.githubusercontent.com/juanguerra97/simposioumg2020/master/capturas/ConfigEmail.png)    

1. **Opcional:** Si quieres algunos datos de prueba iniciales ejecuta
    ```
    python manage.py loaddata datos
    ```
    Esto crear&aacute; los siguientes usuarios que se pueden utilizar para iniciar sesi&oacute;n: 
    - solomeo@gmail.com que es superusuario(se puede ingresar al admin de django con &eacute;l) y tiene el rol STAFF y ADMIN.
    - voldemort@gmail.com que tiene el rol STAFF y ADMIN, pero no es superusuario.
    - potter@gmail.com que tiene el rol ASISTENTE, tiene un pago ACEPTADO y un ticket V&Aacute;LIDO.
    - hermione@gmail.com que tiene el rol ASISTENTE y ESTUDIANTE, tiene un pago ACEPTADO y un ticket V&Aacute;LIDO.
    - malfoy@gmail.com que tiene el rol ASISTENTE y ESTUDIANTE, tiene un pago REEMBOLSADO y un ticket INV&Aacute;LIDO.
    
    > La contrase&ntilde;a para todos estos usuarios es *simpoUMG20*
    
    > La ejecuci&oacute;n de este comando borrar&aacute; los datos de las tablas.    
    
    > Puedes ver los datos que se insertan en el archivo `/backend/simposium/administracion/fixtures/datos.json`

    > Si no cargas estos datos podr&aacute;s ejecutar la aplicaci&oacute;n pero no habr&aacute; una cuenta de administrador para crear carreras, validar pagos, etc. Por lo tanto deber&aacute;s crearla desde el admin de django y asignarle el rol STAFF y ADMIN. Los usuarios con el rol ASISTENTE y ESTUDIANTE se pueden crear desde la p&aacute;gina de registro. 
    >> NOTA: Si decides crear usuarios ADMIN desde el admin de django deber&aacute;s crear un usuario:
    ```
    python manage.py createsuperuser 
    ```

1. Ya puedes ejecutar el servicio REST:
    ```
    python manage.py runserver
    ```
    El servicio estar&aacute; disponible en [http://localhost:8000](http://localhost:8000)
 

## Ejecuci&oacute;n del frontend

1. Abre una terminal y ub&iacute;cate en el directorio `frontend` e instala las dependencias:
    ```
    npm i
    ```

1. Si est&aacute;s ejecutando el backend en una direcci&oacute;n diferente a [http://localhost:8000](http://localhost:8000) entonces modifica el valor de la variable `apiUrl` en el archivo `/frontend/src/environments/environment.ts`
1. Ejecuta la aplicaci&oacute;n:
    ```
    npm start
    ```
   La aplicaci&oacute;n est&aacute; disponible en [http://localhost:4200]( http://localhost:4200/)