# churchContext.ts

Este módulo implementa el aislamiento multi‑iglesia en la capa de acceso a datos usando Prisma. Su objetivo es que cada iglesia (tenant) solo lea y modifique sus propios registros, de forma consistente y segura, sin depender de que cada acción recuerde aplicar el filtro manualmente.

## Objetivos

- Aislar datos por `church_id` de forma automática en consultas y operaciones masivas.
- Asociar registros nuevos a la iglesia actual si el dato no fue provisto explícitamente.
- Mantener compatibilidad con claves únicas y operaciones por `id`.
- Mejorar la legibilidad, reducir duplicación y evitar errores humanos.

## Arquitectura

- Cliente Prisma extendido: `createChurchPrisma(churchId)` crea un cliente con middleware de consultas que inyecta `church_id` donde corresponde (`src/actions/churchContext.ts:13`).
- Resolución de iglesia actual: `getChurchId()` obtiene el `church_id` desde el `slug` autenticado y entrega el cliente listo con `getChurchPrisma()` (`src/actions/churchContext.ts:266-304`).

## Modelos cubiertos

- `Members` (`src/actions/churchContext.ts:17-72`)
- `Ministries` (`src/actions/churchContext.ts:74-130`)
- `Sectors` (`src/actions/churchContext.ts:131-189`)
- `Cells` (`src/actions/churchContext.ts:190-248`)
- `MemberMinistry` (`src/actions/churchContext.ts:249-310`)

## Comportamiento por operación

- Lecturas y operaciones en lote: `findMany`, `findFirst`, `count`, `updateMany`, `deleteMany` agregan `where: { church_id: churchId }` automáticamente.
- Creación: `create` conecta la relación `church` si no viene, y `createMany` rellena `church_id` si falta (ver `Members` en `src/actions/churchContext.ts:34-41`, `Ministries` en `src/actions/churchContext.ts:91-99`, `Sectors` en `src/actions/churchContext.ts:161-169`, `Cells` en `src/actions/churchContext.ts:220-228`, `MemberMinistry` en `src/actions/churchContext.ts:275-286`).
- Operaciones únicas: `findUnique`, `update`, `delete` no inyectan `church_id` para no romper filtros por claves únicas o `id`. Esto permite usar índices/constraints como `@@unique([name, church_id])` y búsquedas por `id` sin interferencia (ver `src/actions/churchContext.ts:26-29, 83-86, 154-157, 206-209, 303-306`).

## Resolución del contexto de iglesia

- `getChurchSlugFromAuth()` actualmente es un stub que devuelve `"demo"` hasta integrar autenticación real (`src/actions/churchContext.ts:213-219`).
- `getChurchSlugFromSources()` orquesta la obtención del `slug` (auth/default) en servidor (`src/actions/churchContext.ts:238-260`).
- `getChurchId()` convierte el `slug` a `id` consultando `churches` (`src/actions/churchContext.ts:276-291`).
- `getChurchPrisma()` crea y retorna el cliente extendido atado a la iglesia (`src/actions/churchContext.ts:301-304`).

## Por qué es necesario

- Seguridad y aislamiento: impide que consultas u operaciones afecten datos de otras iglesias; es defensa en profundidad.
- Integridad referencial: al conectar `church`/rellenar `church_id` en `create`/`createMany`, se evitan registros huérfanos o mal asociados.
- Ergonomía del desarrollador: no hay que recordar el filtro en cada acción; se reduce duplicación y riesgo de errores.
- Consistencia multi‑modelo: `Members`, `Ministries`, `Sectors`, `Cells` y `MemberMinistry` tienen el mismo contrato de aislamiento.
- Compatibilidad con claves únicas: al no modificar `findUnique/update/delete`, se evitan colisiones con constraints y se mantiene el comportamiento esperado por Prisma.

## Uso recomendado

- En server actions, usa:
  - `const prisma = await getChurchPrisma()`
  - Realiza tus consultas y mutaciones normalmente; el filtro por `church_id` se aplicará donde corresponde.
- Para cargas masivas, puedes usar `createMany` sin pasar `church_id`; el middleware lo completará.

## Casos límite y mejoras futuras

- Validaciones cruzadas: si quieres garantizar que `sector_id`, `cell_id`, `leader_id`, `host_id`, `ministryId/memberId` pertenezcan a la misma iglesia, se pueden añadir validaciones previas a `create/update` para mayor robustez.
- Autenticación real: integrar NextAuth/JWT para obtener `churchSlug` desde el usuario autenticado en `getChurchSlugFromAuth()`.
- Políticas de borrado: ajustar `onDelete`/restricciones en el esquema Prisma para endurecer reglas (por ejemplo, impedir borrar sectores con células activas).

## Beneficios

- Menos errores, más seguridad, y código más mantenible.
- Aislamiento multi‑tenant convertido en comportamiento por defecto de la capa de datos.