# CAFIVER — Gestión de Equipos

App para el control de cafeteras (equipos en comodato): inventario, órdenes de servicio, rutas y auditorías.

| Archivo | Para quién |
|---|---|
| `index.html` | Consola (gerencia y jefes) |
| `tecnico.html` | App del técnico en campo (funciona sin señal: guarda la orden en el teléfono y la sube después) |
| `orden.html` | Comprobante de servicio que se comparte al cliente (`orden.html?id=<ID de la orden>`) |

Publicado en GitHub Pages: `https://nubecafiver.github.io/cafeteras/`

## Folios

Formato `OS-AAMMDD-XXXXX` (ej. `OS-261006-K7Q2M`). Se genera en el teléfono, por lo que funciona sin señal y no se repite. Las órdenes anteriores conservan su folio.

Las fotos de cada orden se guardan en `ordenes/<id de captura>/` y sus enlaces quedan dentro de la orden (`fotos`), así dos órdenes nunca comparten fotos.

## Reglas de seguridad

`firestore.rules` parte de las reglas **publicadas** en Firebase (proyecto `cafeteras-90e78`): exige perfil activo en `usuarios`, permisos por rol y deja público solo abrir una orden por su ID (comprobante). **Pendiente de publicar:** el bloque `usuarios`, que impide que un coordinador (jefe) nombre Admin a alguien o edite a la dirección. Si se cambian en la consola, actualiza también este archivo.

`storage.rules` es una **propuesta** sin publicar: abrir un archivo por su ruta sigue siendo público (las fotos se muestran con enlace directo), pero listar carpetas y subir archivos requieren sesión. Antes de publicarla, compárala con la de la consola (Storage → Reglas).
