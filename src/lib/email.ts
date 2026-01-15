import { stackServerApp } from '@/stack/server';

export async function sendInvitationEmail({
  email,
  organizationName,
  link,
}: {
  email: string;
  organizationName: string;
  inviterName: string;
  link: string;
}) {
  try {
    // 1. Buscar si el usuario ya existe
    const users = await stackServerApp.listUsers({
      query: email,
    });

    let user = users.find((u) => u.primaryEmail === email);

    // 2. Si no existe, crearlo
    if (!user) {
      try {
        user = await stackServerApp.createUser({
          primaryEmail: email,
          // No establecemos contraseña, el usuario deberá configurarla o usar magic link/oauth
        });
      } catch (createError) {
        console.error('Error creating user for invitation:', createError);
        // Si falla la creación, intentamos continuar con el flujo de log fallback
        // o lanzamos error si es crítico.
        // En este caso, si no podemos crear el usuario, no podemos enviar el email oficial.
        throw new Error(
          'No se pudo crear el usuario para enviar la invitación.'
        );
      }
    }

    if (user) {
      // 3. Enviar el email usando el ID del usuario (existente o nuevo)

      // Intentar usar template nativo de Stack para invitación a equipo
      try {
        await stackServerApp.sendEmail({
          userIds: [user.id],
          // Built-in template ID for 'sign_in_invitation'
          templateId: '066dd73c-36da-4fd0-b6d6-ebf87683f8bc',
          variables: {
            teamDisplayName: organizationName,
            signInInvitationLink: link,
          },
        });
        return { success: true };
      } catch (templateError) {
        console.error(
          'Failed to send email using built-in template.',
          templateError
        );
        return { success: false, error: templateError };
      }
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

    // Si el error es por falta de SMTP en Stack, no fallamos la request
    const errorMessage = error.message || error.humanReadableMessage || '';
    if (
      errorMessage.includes('requires a custom SMTP server') ||
      error.code === 'REQUIRES_CUSTOM_EMAIL_SERVER' ||
      errorMessage.includes('custom SMTP server')
    ) {
      console.warn('Suppressing SMTP error for dev/fallback flow.');
      return { success: false, error: 'smtp_missing' };
    }

    throw error;
  }
}
