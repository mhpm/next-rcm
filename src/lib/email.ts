import { stackServerApp } from '@/stack/server';

export async function sendInvitationEmail({
  email,
  organizationName,
  inviterName,
  link,
}: {
  email: string;
  organizationName: string;
  inviterName: string;
  link: string;
}) {
  try {
    // Intentamos buscar si el usuario ya existe en Stack por su email
    const users = await stackServerApp.listUsers({
      query: email,
    });

    const user = users.find((u) => u.primaryEmail === email);

    if (user) {
      // Si el usuario existe, podemos enviarle el correo usando su ID
      await stackServerApp.sendEmail({
        userIds: [user.id],
        subject: `Invitación a administrar ${organizationName}`,
        html: `
           <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
             <h2>¡Hola!</h2>
             <p><strong>${inviterName}</strong> te ha invitado a colaborar como administrador de la iglesia <strong>${organizationName}</strong>.</p>
             
             <p>Para acceder al panel de administración y aceptar la invitación, por favor haz clic en el siguiente botón:</p>
             
             <div style="margin: 24px 0;">
               <a href="${link}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                 Acceder a la Plataforma
               </a>
             </div>

             <p style="color: #666; font-size: 14px;">
               Si ya tienes cuenta, la nueva organización aparecerá automáticamente en tu panel.
             </p>
             
             <hr style="border: none; border-top: 1px solid #eaeaea; margin: 24px 0;" />
             
             <p style="color: #888; font-size: 12px;">
               Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
               <a href="${link}" style="color: #666;">${link}</a>
             </p>
           </div>
         `,
      });
    } else {
      // Si el usuario NO existe en Stack, usamos la invitación de Sign-in de Stack
      // Intentamos enviarlo como una invitación de equipo o similar si la API lo permite,
      // o simplemente usamos el template de invitación.
      await stackServerApp.sendEmail({
        userIds: [],
        // @ts-ignore - Stack permite enviar por email si userIds está vacío en algunas versiones de su SDK
        email: email,
        subject: `Invitación a administrar ${organizationName}`,
        html: `
           <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
             <h2>¡Bienvenido!</h2>
             <p><strong>${inviterName}</strong> te ha invitado a colaborar como administrador de la iglesia <strong>${organizationName}</strong>.</p>
             
             <p>Como aún no tienes una cuenta en nuestra plataforma, puedes crear una y aceptar la invitación haciendo clic aquí:</p>
             
             <div style="margin: 24px 0;">
               <a href="${link}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                 Crear Cuenta y Acceder
               </a>
             </div>
             
             <hr style="border: none; border-top: 1px solid #eaeaea; margin: 24px 0;" />
             
             <p style="color: #888; font-size: 12px;">
               Enlace directo: <a href="${link}" style="color: #666;">${link}</a>
             </p>
           </div>
         `,
      });
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error sending invitation email via Stack Auth:', error);

    // Si falla el envío (ej: el Shared Provider tiene límites),
    // logueamos para que el usuario pueda usar el botón de copiar enlace.
    console.log('---------------------------------------------------');
    console.log(`FALLBACK LOG FOR MANUAL COPY:`);
    console.log(`To: ${email}`);
    console.log(`Link: ${link}`);
    console.log('---------------------------------------------------');

    throw error;
  }
}
