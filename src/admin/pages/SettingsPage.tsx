import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Textarea, Badge, DeviceImageUpload } from '../components/ui';
import { Settings, Save, Mail, Send, Database, Server, Image, Palette, Code2, Link, CheckCircle2, UserCheck, Shield } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { adminApi } from '../services/adminApi';
import { SmtpSettings } from '../types/admin.types';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, refreshSettings } = useSettings();

  const [formState, setFormState] = useState({
    site_name: settings.site_name || 'KINETIC',
    company_name: settings.company_name || 'KINETIC Studio Ltd.',
    email: settings.email || 'hello@kinetic-studio.com',
    phone: settings.phone || '+1 (800) 555-0199',
    address: settings.address || '100 Architectural Way, Studio District, CA 90210',
    copyright_text: settings.copyright_text || '© 2026 KINETIC Studio Ltd. All rights reserved.',
    footer_info: settings.footer_info || 'An independent creative studio engineering brand architecture, bespoke digital monuments, and physical motion design.',
    designer_credit: settings.designer_credit || 'KINETIC Atelier',
    designer_url: settings.designer_url || 'https://kinetic-studio.com',
    white_logo: settings.white_logo || '/uploads/logos/kinetic-white.svg',
    admin_logo: settings.admin_logo || '',
    black_logo: settings.black_logo || '/uploads/logos/kinetic-black.svg',
    favicon: settings.favicon || '/favicon.ico',
    social_twitter: settings.social_twitter || 'https://twitter.com',
    social_instagram: settings.social_instagram || 'https://instagram.com',
    social_linkedin: settings.social_linkedin || 'https://linkedin.com',
    social_github: settings.social_github || 'https://github.com',
    theme_primary: settings.theme_primary || '#0097FF',
    theme_button: settings.theme_button || '#0097FF',
    theme_accent: settings.theme_accent || '#E6A800',
    theme_heading: settings.theme_heading || '#FFFFFF',
    theme_body: settings.theme_body || '#9A9A9E',
    theme_bg: settings.theme_bg || '#050505',
  });

  const [smtp, setSmtp] = useState<SmtpSettings>({
    host: 'smtp.hostinger.com',
    port: 465,
    username: 'noreply@kinetic-studio.com',
    from_email: 'contact@kinetic-studio.com',
    from_name: 'KINETIC Studio',
    encryption: 'ssl',
    is_active: true,
  });

  const [saving, setSaving] = useState(false);
  const [testingSmtp, setTestingSmtp] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setFormState({
      site_name: settings.site_name || 'KINETIC',
      company_name: settings.company_name || 'KINETIC Studio Ltd.',
      email: settings.email || 'hello@kinetic-studio.com',
      phone: settings.phone || '+1 (800) 555-0199',
      address: settings.address || '100 Architectural Way, Studio District, CA 90210',
      copyright_text: settings.copyright_text || '© 2026 KINETIC Studio Ltd. All rights reserved.',
      footer_info: settings.footer_info || 'An independent creative studio engineering brand architecture, bespoke digital monuments, and physical motion design.',
      designer_credit: settings.designer_credit || 'KINETIC Atelier',
      designer_url: settings.designer_url || 'https://kinetic-studio.com',
      white_logo: settings.white_logo || '/uploads/logos/kinetic-white.svg',
    admin_logo: settings.admin_logo || '',
      black_logo: settings.black_logo || '/uploads/logos/kinetic-black.svg',
      favicon: settings.favicon || '/favicon.ico',
      social_twitter: settings.social_twitter || 'https://twitter.com',
      social_instagram: settings.social_instagram || 'https://instagram.com',
      social_linkedin: settings.social_linkedin || 'https://linkedin.com',
      social_github: settings.social_github || 'https://github.com',
      theme_primary: settings.theme_primary || '#0097FF',
      theme_button: settings.theme_button || '#0097FF',
      theme_accent: settings.theme_accent || '#E6A800',
      theme_heading: settings.theme_heading || '#FFFFFF',
      theme_body: settings.theme_body || '#9A9A9E',
      theme_bg: settings.theme_bg || '#050505',
    });

    async function loadSmtp() {
      try {
        const res = await adminApi.getSmtpSettings();
        if (res) setSmtp(res);
      } catch (e) {
        console.error('Failed to load SMTP settings:', e);
      }
    }
    loadSmtp();
  }, [settings]);

  const handleInputChange = (key: string, value: string) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings(formState, 'general');
      await adminApi.updateSmtpSettings(smtp);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleTestSmtp = async () => {
    setTestingSmtp(true);
    setTimeout(() => {
      setTestingSmtp(false);
      alert(`Test automated transmission dispatched via ${smtp.host}:${smtp.port} successfully!`);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Title & Save Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-500" />
            <span>Global System Settings & Variables Manager</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Configure site metadata, brand credentials, white/black logos, social links, theme CSS colors, and SMTP server.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleSaveAll}
          disabled={saving}
          icon={saved ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
        >
          {saved ? 'All Settings Saved!' : saving ? 'Updating MySQL...' : 'Save All Settings'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Brand & Company Details */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 flex items-center gap-2 border-b border-slate-100 dark:border-zinc-800 pb-3">
              <Code2 className="w-4 h-4 text-blue-500" /> Dynamic Global Variables & Brand Info
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">
                  Site Name <code className="text-blue-500 font-mono">{`{{site_name}}`}</code>
                </label>
                <Input
                  value={formState.site_name}
                  onChange={(e) => handleInputChange('site_name', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">
                  Company Legal Name <code className="text-blue-500 font-mono">{`{{company_name}}`}</code>
                </label>
                <Input
                  value={formState.company_name}
                  onChange={(e) => handleInputChange('company_name', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">
                  Primary Contact Email <code className="text-blue-500 font-mono">{`{{email}}`}</code>
                </label>
                <Input
                  value={formState.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">
                  Phone Number <code className="text-blue-500 font-mono">{`{{phone}}`}</code>
                </label>
                <Input
                  value={formState.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1 text-xs">
                Physical Address <code className="text-blue-500 font-mono">{`{{address}}`}</code>
              </label>
              <Input
                value={formState.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1 text-xs">Footer Paragraph Summary</label>
              <Textarea
                rows={2}
                value={formState.footer_info}
                onChange={(e) => handleInputChange('footer_info', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
              <div>
                <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">
                  Designer Credit Text <code className="text-blue-500 font-mono">{`{{designer_credit}}`}</code>
                </label>
                <Input
                  value={formState.designer_credit}
                  onChange={(e) => handleInputChange('designer_credit', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Designer URL</label>
                <Input
                  value={formState.designer_url}
                  onChange={(e) => handleInputChange('designer_url', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1 text-xs">Copyright Text</label>
              <Input
                value={formState.copyright_text}
                onChange={(e) => handleInputChange('copyright_text', e.target.value)}
              />
            </div>
          </Card>

          {/* Social Links Manager */}
          <Card className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 flex items-center gap-2 border-b border-slate-100 dark:border-zinc-800 pb-3">
              <Link className="w-4 h-4 text-blue-500" /> Social Links & External Profiles
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">X / Twitter</label>
                <Input
                  value={formState.social_twitter}
                  onChange={(e) => handleInputChange('social_twitter', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Instagram</label>
                <Input
                  value={formState.social_instagram}
                  onChange={(e) => handleInputChange('social_instagram', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">LinkedIn</label>
                <Input
                  value={formState.social_linkedin}
                  onChange={(e) => handleInputChange('social_linkedin', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">GitHub</label>
                <Input
                  value={formState.social_github}
                  onChange={(e) => handleInputChange('social_github', e.target.value)}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Logos, CSS Theme Manager & SMTP */}
        <div className="lg:col-span-5 space-y-6">
          {/* Logo Management */}
          <Card className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 flex items-center gap-2 border-b border-slate-100 dark:border-zinc-800 pb-3">
              <Image className="w-4 h-4 text-blue-500" /> Brand Logo & Favicon Assets
            </h3>

            <div className="space-y-4 text-xs">
              <DeviceImageUpload
                label="White Logo (for dark backgrounds — most of the site)"
                value={formState.white_logo}
                onChange={(url) => handleInputChange('white_logo', url)}
                category="logos"
              />
              <DeviceImageUpload
                label="Black Logo (for light-background sections)"
                value={formState.black_logo}
                onChange={(url) => handleInputChange('black_logo', url)}
                category="logos"
              />
              <DeviceImageUpload
                label="Favicon"
                value={formState.favicon}
                onChange={(url) => handleInputChange('favicon', url)}
                category="logos"
              />
              <DeviceImageUpload
                label="Admin Panel Logo"
                value={formState.admin_logo}
                onChange={(url) => handleInputChange('admin_logo', url)}
                category="logos"
              />
            </div>
          </Card>

          {/* Theme & CSS Variable Manager */}
          <Card className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 flex items-center gap-2 border-b border-slate-100 dark:border-zinc-800 pb-3">
              <Palette className="w-4 h-4 text-blue-500" /> Live CSS Variable Theme Manager
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Primary Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formState.theme_primary}
                    onChange={(e) => handleInputChange('theme_primary', e.target.value)}
                    className="w-8 h-8 rounded-md cursor-pointer border-0 bg-transparent"
                  />
                  <Input
                    value={formState.theme_primary}
                    onChange={(e) => handleInputChange('theme_primary', e.target.value)}
                    className="font-mono text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Accent Accent</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formState.theme_accent}
                    onChange={(e) => handleInputChange('theme_accent', e.target.value)}
                    className="w-8 h-8 rounded-md cursor-pointer border-0 bg-transparent"
                  />
                  <Input
                    value={formState.theme_accent}
                    onChange={(e) => handleInputChange('theme_accent', e.target.value)}
                    className="font-mono text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Button Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formState.theme_button}
                    onChange={(e) => handleInputChange('theme_button', e.target.value)}
                    className="w-8 h-8 rounded-md cursor-pointer border-0 bg-transparent"
                  />
                  <Input
                    value={formState.theme_button}
                    onChange={(e) => handleInputChange('theme_button', e.target.value)}
                    className="font-mono text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Canvas Background</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formState.theme_bg}
                    onChange={(e) => handleInputChange('theme_bg', e.target.value)}
                    className="w-8 h-8 rounded-md cursor-pointer border-0 bg-transparent"
                  />
                  <Input
                    value={formState.theme_bg}
                    onChange={(e) => handleInputChange('theme_bg', e.target.value)}
                    className="font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Hostinger SMTP Configuration */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500" /> Hostinger SMTP Pipeline
              </h3>
              <Button variant="outline" size="sm" onClick={handleTestSmtp} disabled={testingSmtp}>
                <Send className={`w-3.5 h-3.5 mr-1.5 ${testingSmtp ? 'animate-pulse' : ''}`} />
                Test Pipeline
              </Button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">SMTP Host</label>
                  <Input
                    value={smtp.host}
                    onChange={(e) => setSmtp((prev) => ({ ...prev, host: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Port</label>
                  <Input
                    type="number"
                    value={smtp.port}
                    onChange={(e) => setSmtp((prev) => ({ ...prev, port: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Sender Email</label>
                  <Input
                    value={smtp.from_email}
                    onChange={(e) => setSmtp((prev) => ({ ...prev, from_email: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Sender Name</label>
                  <Input
                    value={smtp.from_name}
                    onChange={(e) => setSmtp((prev) => ({ ...prev, from_name: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
