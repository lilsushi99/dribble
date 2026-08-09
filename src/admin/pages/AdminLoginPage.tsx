import React, { useState } from 'react';
import { Card, Button, Input } from '../components/ui';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export interface AdminLoginPageProps {
  onLoginSuccess: (email: string, pass: string) => Promise<void>;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess }) => {
  const { settings } = useSettings();
  const [email, setEmail] = useState('admin@kinetic-studio.com');
  const [password, setPassword] = useState('AdminPassword2026!');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await onLoginSuccess(email, password);
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-zinc-100 flex items-center justify-center p-4 selection:bg-blue-600 selection:text-white">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Branding Logo */}
        <div className="text-center space-y-2">
          {settings?.admin_logo ? (
            <img
              src={settings.admin_logo}
              alt="Admin logo"
              className="inline-flex w-12 h-12 rounded-2xl object-cover mb-2 border border-white/10"
            />
          ) : (
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-900 border border-white/10 text-white font-outfit font-semibold text-lg mb-2">
              {(settings?.site_name || 'CA').trim().charAt(0).toUpperCase()}
            </div>
          )}
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            {settings?.site_name || 'Comic Art Studio'}
          </h1>
          <p className="text-xs font-medium text-zinc-400">Admin Panel</p>
        </div>

        {/* Login Card */}
        <Card className="bg-zinc-900/90 border-zinc-800 p-8 shadow-2xl backdrop-blur-md">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-white tracking-tight">Sign In to Dashboard</h2>
              <p className="text-xs text-zinc-400">
                Enter your administrative credentials to access the CMS core engine.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <Input
              label="Admin Email"
              type="email"
              icon={<Mail className="w-4 h-4 text-zinc-500" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              icon={<Lock className="w-4 h-4 text-zinc-500" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="w-full mt-2"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {loading ? 'Authenticating...' : 'Sign In to Admin Panel'}
            </Button>
          </form>

          {/* Quick Demo Credentials Info */}
          <div className="mt-6 pt-4 border-t border-zinc-800 text-center">
            <p className="text-[11px] text-zinc-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Default Super Admin Credentials Loaded</span>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
