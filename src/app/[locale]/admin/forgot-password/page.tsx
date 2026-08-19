'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from '../login/login.module.css';

export default function ForgotPasswordPage() {
  const params = useParams();
  const locale = params.locale as string;
  
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.ok) {
        setStep(2);
      } else {
        setError('Failed to process request.');
      }
    } catch (err) {
      setError('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        body: JSON.stringify({ otp, newPassword }),
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMsg('Password reset successful! Redirecting to login...');
        setTimeout(() => {
          router.push(`/${locale}/admin/login`);
        }, 2000);
      } else {
        setError(data.error || 'Invalid OTP.');
      }
    } catch (err) {
      setError('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {step === 1 ? (
        <form onSubmit={handleRequestOtp} className={styles.form}>
          <h2>Reset Password</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
            Enter your admin email to receive a reset code.
          </p>
          
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            placeholder="Admin Email" 
            required 
            className={styles.input} 
          />
          
          {error && <p className={styles.error}>{error}</p>}
          
          <button type="submit" disabled={loading} className={styles.button} style={{ marginTop: '1rem' }}>
            {loading ? 'Sending Code...' : 'Send Reset Code'}
          </button>
          
          <button type="button" onClick={() => router.push(`/${locale}/admin/login`)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', marginTop: '1rem', cursor: 'pointer', textDecoration: 'underline' }}>
            Back to Login
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className={styles.form}>
          <h2>Create New Password</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
            Enter the 6-digit code sent to your email along with your new password.
          </p>
          
          <input 
            type="text" 
            value={otp} 
            onChange={e => setOtp(e.target.value)} 
            placeholder="6-Digit Code" 
            required 
            className={styles.input} 
            maxLength={6}
            style={{ letterSpacing: '2px', textAlign: 'center' }}
          />
          <input 
            type="password" 
            value={newPassword} 
            onChange={e => setNewPassword(e.target.value)} 
            placeholder="New Password" 
            required 
            className={styles.input} 
            style={{ marginTop: '1rem' }}
          />

          {error && <p className={styles.error}>{error}</p>}
          {successMsg && <p style={{ color: '#2ecc71', fontSize: '0.9rem', textAlign: 'center', marginTop: '1rem' }}>{successMsg}</p>}
          
          <button type="submit" disabled={loading} className={styles.button} style={{ marginTop: '1.5rem' }}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}
    </div>
  );
}
