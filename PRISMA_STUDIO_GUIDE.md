# 📋 Guía de Prisma Studio para Multi-Tenancy

Esta guía te ayudará a usar Prisma Studio de forma segura en un entorno multi-tenant, evitando errores al filtrar por `church_id`.

## 🏛️ Iglesias Disponibles

Para obtener la lista actualizada de iglesias y sus IDs válidos, ejecuta:

```bash
node prisma-studio-helper.js
```

## 🔍 Filtrado Seguro en Prisma Studio

### ✅ Mejores Prácticas

1. **Siempre usa IDs válidos**: Copia y pega exactamente los IDs mostrados por el script helper
2. **Verifica antes de filtrar**: Usa `node prisma-studio-helper.js validate <ID>` para confirmar que un ID es válido
3. **Usa operadores apropiados**: 
   - `equals` para filtros exactos
   - `in` para múltiples iglesias
   - `not` para excluir iglesias específicas

### 📝 Ejemplos de Filtros Correctos

#### Filtrar miembros de una iglesia específica:
```
Campo: church_id
Operador: equals
Valor: cmh0uwf5j0000xricjli8sfeq
```

#### Filtrar miembros de múltiples iglesias:
```
Campo: church_id
Operador: in
Valor: ["cmh0uwf5j0000xricjli8sfeq", "cmh0uwfbh0001xricc3kkoynw"]
```

#### Excluir una iglesia específica:
```
Campo: church_id
Operador: not
Valor: cmh0uwf5j0000xricjli8sfeq
```

### ❌ Errores Comunes a Evitar

1. **IDs inventados**: No uses IDs que no existen en el sistema
2. **Mayúsculas/minúsculas**: Los IDs son sensibles a mayúsculas y minúsculas
3. **Espacios extra**: No agregues espacios al inicio o final del ID
4. **Filtros vacíos**: No dejes el campo `church_id` vacío si es requerido

## 🛡️ Protecciones Implementadas

### Restricciones de Base de Datos
- **Claves foráneas**: Todos los `church_id` deben existir en la tabla `churches`
- **Campos requeridos**: `church_id` es obligatorio en todas las tablas relacionadas
- **Cascada**: Si se elimina una iglesia, se eliminan todos sus datos relacionados

### Validación de Integridad
- Script de verificación automática (`verify-foreign-keys.js`)
- Validación en tiempo real de IDs
- Prevención de datos huérfanos

## 🚀 Scripts Útiles

### Obtener IDs válidos
```bash
node prisma-studio-helper.js
```

### Validar un ID específico
```bash
node prisma-studio-helper.js validate <church_id>
```

### Verificar integridad de datos
```bash
node verify-foreign-keys.js
```

### Verificar multi-tenancy
```bash
node verify-multi-tenant.js
```

## 📊 Estructura de Datos

### Tablas con `church_id`:
- `members` - Miembros de la iglesia
- `ministries` - Ministerios de la iglesia
- `member_ministries` - Asignaciones de miembros a ministerios

### Relaciones:
```
churches (1) ←→ (N) members
churches (1) ←→ (N) ministries
churches (1) ←→ (N) member_ministries
```

## 🔧 Solución de Problemas

### Error: "Invalid church_id"
1. Verifica que el ID existe: `node prisma-studio-helper.js validate <ID>`
2. Copia el ID exactamente como se muestra en el helper
3. Asegúrate de no tener espacios extra

### Error: "Constraint violation"
1. El ID que intentas usar no existe en la tabla `churches`
2. Ejecuta `node prisma-studio-helper.js` para ver IDs válidos
3. Usa solo IDs de la lista proporcionada

### Datos inconsistentes
1. Ejecuta `node verify-foreign-keys.js` para verificar integridad
2. Ejecuta `node verify-multi-tenant.js` para verificar aislamiento
3. Si hay problemas, contacta al administrador del sistema

## 💡 Consejos Adicionales

1. **Mantén esta guía a mano** cuando uses Prisma Studio
2. **Ejecuta el helper regularmente** para obtener IDs actualizados
3. **Verifica antes de hacer cambios masivos** en los datos
4. **Usa filtros específicos** para evitar modificar datos de otras iglesias
5. **Documenta tus cambios** para mantener trazabilidad

## 🆘 Contacto

Si encuentras problemas o necesitas ayuda adicional, consulta con el equipo de desarrollo o revisa los logs de los scripts de verificación.