import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminSidebar from './AdminSidebar';
import styles from '../admin.module.css';

export default async function AdminLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  const isAdmin = cookieStore.get('admin_token')?.value === 'authenticated';
  
  if (!isAdmin) {
    redirect(`/${locale}/admin/login`);
  }

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar locale={locale} />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
