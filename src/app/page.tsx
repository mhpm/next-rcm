import { redirect } from 'next/navigation';
import { i18n } from '@/i18n/config';

export default function RootRedirect() {
  const locale = i18n.defaultLocale || 'es';
  redirect(`/${locale}`);
}
