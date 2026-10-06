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

`firestore.rules` y `storage.rules` son las reglas recomendadas. **No se publican solas**: hay que copiarlas en la consola de Firebase (proyecto `cafeteras-90e78`):

- Firestore Database → Reglas → pegar `firestore.rules` → Publicar
- Storage → Reglas → pegar `storage.rules` → Publicar

o con la CLI: `firebase deploy --only firestore:rules,storage`.

Antes de publicar, compáralas con las reglas actuales de la consola. Si hoy existen reglas por rol (técnico / jefe / admin), consérvalas y agrega solo lo de `ordenes` (get público, list con sesión) y el `list` con sesión de Storage.
