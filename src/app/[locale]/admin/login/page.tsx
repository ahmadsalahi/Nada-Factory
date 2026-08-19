'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from './login.module.css';

export default function LoginPage() {
  const params = useParams();
  const locale = params.locale as string;
  
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [trustDevice, setTrustDevice] = useState(false);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await res.json();

      if (res.ok) {
        if (data.requireOtp) {
          setStep(2);
        } else {
          // Trusted device, skipped OTP
          router.push(`/${locale}/admin`);
          router.refresh();
        }
      } else {
        setError(data.error || 'Invalid credentials.');
      }
    } catch (err) {
      setError('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ otp, trustDevice }),
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await res.json();

      if (res.ok) {
        router.push(`/${locale}/admin`);
        router.refresh();
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
        <form onSubmit={handleLogin} className={styles.form}>
          <h2>Nada Control Panel</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', textAlign: 'center' }}>Secure Admin Access</p>
          
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            placeholder="Admin Email" 
            required 
            className={styles.input} 
          />
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            placeholder="Admin Password" 
            required 
            className={styles.input} 
            style={{ marginTop: '1rem' }}
          />
          
          {error && <p className={styles.error}>{error}</p>}
          
          <button type="submit" disabled={loading} className={styles.button} style={{ marginTop: '1rem' }}>
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
          
          <button type="button" onClick={() => router.push(`/${locale}/admin/forgot-password`)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', marginTop: '1rem', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.9rem' }}>
            Forgot Password?
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className={styles.form}>
          <h2>Two-Factor Authentication</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
            A 6-digit code has been sent to your email.
          </p>
          
          <input 
            type="text" 
            value={otp} 
            onChange={e => setOtp(e.target.value)} 
            placeholder="Enter 6-digit OTP" 
            required 
            className={styles.input} 
            maxLength={6}
            style={{ letterSpacing: '5px', textAlign: 'center', fontSize: '1.2rem' }}
          />
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={trustDevice} 
              onChange={e => setTrustDevice(e.target.checked)} 
              style={{ width: '16px', height: '16px', accentColor: 'var(--accent-gold)' }}
            />
            Trust this device for 30 days
          </label>

          {error && <p className={styles.error}>{error}</p>}
          
          <button type="submit" disabled={loading} className={styles.button} style={{ marginTop: '1.5rem' }}>
            {loading ? 'Verifying...' : 'Verify & Enter'}
          </button>
          
          <button type="button" onClick={() => setStep(1)} style={{ background: 'transparent', border: 'none', color: 'var(--accent-gold)', marginTop: '1rem', cursor: 'pointer', textDecoration: 'underline' }}>
            Back to Login
          </button>
        </form>
      )}
    </div>
  );
}
