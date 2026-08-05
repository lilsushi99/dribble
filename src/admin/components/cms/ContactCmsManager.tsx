import React, { useState, useEffect } from 'react';
import { useSettings } from '../../../context/SettingsContext';
import { adminApi } from '../../services/adminApi';
import { FormSubmissionData, SmtpSettings } from '../../types/admin.types';
import { DeviceImageUpload } from '../ui/DeviceImageUpload';
import { Card, Button, Input, Modal, Badge } from '../ui';
import {
  FileEdit,
  Inbox,
  Mail,
  Plus,
  Trash2,
  Save,
  CheckCircle,
  Eye,
  Search,
  Send,
  Globe,
  Lock,
  Server,
  User,
  AlertCircle,
  RefreshCw,
  MoveUp,
  MoveDown,
  Sparkles,
  Layers,
  Check,
} from 'lucide-react';

export interface SocialLinkItem {
  id: string;
  platform: string;
  url: string;
  enabled: boolean;
}

export interface CustomFormField {
  id: string;
  label: string;
  name: string;
  type: 'text' | 'email' | 'textarea' | 'select';
  required: boolean;
  placeholder?: string;
  options?: string[];
}

export const defaultSocialLinks: SocialLinkItem[] = [
  { id: '1', platform: 'Instagram', url: 'https://instagram.com', enabled: true },
  { id: '2', platform: 'Telegram', url: 'https://t.me/comicartstudio', enabled: true },
  { id: '3', platform: 'Beyoncé', url: 'https://beyonce.com', enabled: false },
  { id: '4', platform: 'LinkedIn', url: 'https://linkedin.com', enabled: true },
  { id: '5', platform: 'Twitter/X', url: 'https://twitter.com', enabled: true },
  { id: '6', platform: 'Dribbble', url: 'https://dribbble.com', enabled: true },
];

export const defaultContactFormFields: CustomFormField[] = [
  { id: 'first_name', label: 'First Name', name: 'first_name', type: 'text', required: true, placeholder: 'Elena' },
  { id: 'last_name', label: 'Last Name', name: 'last_name', type: 'text', required: true, placeholder: 'Vance' },
  { id: 'email', label: 'Email Address', name: 'email', type: 'email', required: true, placeholder: 'elena@vanguard.com' },
  { id: 'company', label: 'Company Name', name: 'company', type: 'text', required: false, placeholder: 'Vanguard Lab' },
  { id: 'project_type', label: 'Project Type', name: 'project_type', type: 'select', required: true, options: ['Brand Architecture', 'Spatial & Interaction', 'Digital Monograph', 'Full Retainer'] },
  { id: 'budget', label: 'Budget Range', name: 'budget', type: 'select', required: true, options: ['$30k - $50k', '$50k - $100k', '$100k - $250k', '$250k+'] },
  { id: 'message', label: 'Project Summary', name: 'message', type: 'textarea', required: true, placeholder: 'Outline key objectives, timeline constraints, and desired outcomes...' },
];

export const ContactCmsManager: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [activeTab, setActiveTab] = useState<'editor' | 'entries' | 'smtp'>('editor');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Tab 1 State: Contact Page Editor
  const [artistImage, setArtistImage] = useState<string>('');
  const [overlayTitle, setOverlayTitle] = useState<string>('Studio Atelier No. 4');
  const [overlaySub, setOverlaySub] = useState<string>('Monochrome Ink Drafting & Physical Prototypes');
  const [formHeading, setFormHeading] = useState<string>('Contact Us Today');
  const [formDescription, setFormDescription] = useState<string>('Send us a message and receive a response in less than an hour.');
  const [submitBtnText, setSubmitBtnText] = useState<string>('Start Your Project');
  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>(defaultSocialLinks);
  const [formFields, setFormFields] = useState<CustomFormField[]>(defaultContactFormFields);

  // New Social Link Form
  const [newPlatform, setNewPlatform] = useState('');
  const [newUrl, setNewUrl] = useState('');

  // New Custom Form Field
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState<'text' | 'email' | 'textarea' | 'select'>('text');
  const [newFieldPlaceholder, setNewFieldPlaceholder] = useState('');
  const [newFieldRequired, setNewFieldRequired] = useState(true);
  const [newFieldOptions, setNewFieldOptions] = useState('');

  // Tab 2 State: Form Submissions
  const [submissions, setSubmissions] = useState<FormSubmissionData[]>([]);
  const [selectedSub, setSelectedSub] = useState<FormSubmissionData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingEntries, setLoadingEntries] = useState(false);

  // Tab 3 State: SMTP Settings
  const [smtpForm, setSmtpForm] = useState<SmtpSettings>({
    host: 'smtp.hostinger.com',
    port: 465,
    username: 'contact@kinetic-studio.com',
    from_email: 'contact@kinetic-studio.com',
    from_name: 'Comic Art Studio',
    encryption: 'ssl',
    is_active: true,
  });
  const [smtpPassword, setSmtpPassword] = useState('smtp_secret_pass');
  const [autoReplySubject, setAutoReplySubject] = useState('Thank you for contacting Comic Art Studio');
  const [autoReplyBody, setAutoReplyBody] = useState(
    'Hi {first_name},\n\nThank you for contacting Comic Art Studio.\nSomeone from our team will review your inquiry and get back to you shortly.\n\nBest regards,\nComic Art Studio Team'
  );
  const [notificationEmail, setNotificationEmail] = useState('studio@comicartstudio.com');
  const [testEmailAddress, setTestEmailAddress] = useState('');
  const [testEmailStatus, setTestEmailStatus] = useState<string | null>(null);
  const [isTestingSmtp, setIsTestingSmtp] = useState(false);

  // Load Settings into local state
  useEffect(() => {
    if (settings) {
      if (settings.contact_artist_image !== undefined) setArtistImage(settings.contact_artist_image);
      if (settings.contact_image_title) setOverlayTitle(settings.contact_image_title);
      if (settings.contact_image_subtitle) setOverlaySub(settings.contact_image_subtitle);
      if (settings.contact_form_heading) setFormHeading(settings.contact_form_heading);
      if (settings.contact_form_description) setFormDescription(settings.contact_form_description);
      if (settings.contact_submit_button_text) setSubmitBtnText(settings.contact_submit_button_text);

      if (settings.contact_social_links) {
        try {
          const parsed = JSON.parse(settings.contact_social_links);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSocialLinks(parsed);
          }
        } catch (e) {
          // Keep default
        }
      }

      if (settings.contact_form_fields) {
        try {
          const parsed = JSON.parse(settings.contact_form_fields);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setFormFields(parsed);
          }
        } catch (e) {
          // Keep default
        }
      }
    }
  }, [settings]);

  // Load Submissions & SMTP settings on mount
  useEffect(() => {
    loadSubmissions();
    loadSmtpSettings();
  }, []);

  const loadSubmissions = async () => {
    setLoadingEntries(true);
    try {
      const data = await adminApi.getFormSubmissions(1);
      setSubmissions(data || []);
    } catch (e) {
      console.warn('Could not fetch form submissions:', e);
    } finally {
      setLoadingEntries(false);
    }
  };

  const loadSmtpSettings = async () => {
    try {
      const data = await adminApi.getSmtpSettings();
      if (data) {
        setSmtpForm(data);
        if ((data as any).password) setSmtpPassword((data as any).password);
        if ((data as any).auto_reply_subject) setAutoReplySubject((data as any).auto_reply_subject);
        if ((data as any).auto_reply_body) setAutoReplyBody((data as any).auto_reply_body);
        if ((data as any).notification_email) setNotificationEmail((data as any).notification_email);
      }
    } catch (e) {
      console.warn('Using default SMTP settings');
    }
  };

  // Save Contact Page Editor settings
  const handleSaveContactEditor = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      await updateSettings(
        {
          contact_artist_image: artistImage,
          contact_image_title: overlayTitle,
          contact_image_subtitle: overlaySub,
          contact_form_heading: formHeading,
          contact_form_description: formDescription,
          contact_submit_button_text: submitBtnText,
          contact_social_links: JSON.stringify(socialLinks),
          contact_form_fields: JSON.stringify(formFields),
        },
        'contact'
      );
      setSaveStatus('Contact page configuration saved successfully!');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (e: any) {
      setSaveStatus(`Failed to save: ${e.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Save SMTP Settings
  const handleSaveSmtp = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      await adminApi.updateSmtpSettings({
        ...smtpForm,
        password: smtpPassword,
        auto_reply_subject: autoReplySubject,
        auto_reply_body: autoReplyBody,
        notification_email: notificationEmail,
      } as any);

      setSaveStatus('SMTP configuration & email routing saved successfully!');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (e: any) {
      setSaveStatus(`Error updating SMTP: ${e.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Test SMTP connection
  const handleTestSmtp = async () => {
    setIsTestingSmtp(true);
    setTestEmailStatus(null);
    try {
      await adminApi.testSmtpConnection(testEmailAddress || smtpForm.from_email);
      setTestEmailStatus(`Success! Test email sent to ${testEmailAddress || smtpForm.from_email}`);
    } catch (e: any) {
      setTestEmailStatus(`SMTP Test Warning: ${e.message}`);
    } finally {
      setIsTestingSmtp(false);
    }
  };

  // Social Link Controls
  const toggleSocialLink = (id: string) => {
    setSocialLinks(socialLinks.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
  };

  const updateSocialUrl = (id: string, url: string) => {
    setSocialLinks(socialLinks.map((s) => (s.id === id ? { ...s, url } : s)));
  };

  const removeSocialLink = (id: string) => {
    setSocialLinks(socialLinks.filter((s) => s.id !== id));
  };

  const handleAddSocialLink = () => {
    if (!newPlatform.trim()) return;
    const newLink: SocialLinkItem = {
      id: Date.now().toString(),
      platform: newPlatform.trim(),
      url: newUrl.trim() || '#',
      enabled: true,
    };
    setSocialLinks([...socialLinks, newLink]);
    setNewPlatform('');
    setNewUrl('');
  };

  // Form Fields Controls
  const toggleFieldRequired = (id: string) => {
    setFormFields(formFields.map((f) => (f.id === id ? { ...f, required: !f.required } : f)));
  };

  const updateFieldLabel = (id: string, label: string) => {
    setFormFields(formFields.map((f) => (f.id === id ? { ...f, label } : f)));
  };

  const updateFieldPlaceholder = (id: string, placeholder: string) => {
    setFormFields(formFields.map((f) => (f.id === id ? { ...f, placeholder } : f)));
  };

  const removeFormField = (id: string) => {
    setFormFields(formFields.filter((f) => f.id !== id));
  };

  const handleAddCustomField = () => {
    if (!newFieldLabel.trim()) return;
    const nameKey =
      newFieldName.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_') ||
      newFieldLabel.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');

    const optionsArray =
      newFieldType === 'select' && newFieldOptions.trim()
        ? newFieldOptions.split(',').map((o) => o.trim()).filter(Boolean)
        : undefined;

    const newField: CustomFormField = {
      id: nameKey + '_' + Date.now(),
      label: newFieldLabel.trim(),
      name: nameKey,
      type: newFieldType,
      required: newFieldRequired,
      placeholder: newFieldPlaceholder.trim(),
      options: optionsArray,
    };

    setFormFields([...formFields, newField]);
    setNewFieldLabel('');
    setNewFieldName('');
    setNewFieldPlaceholder('');
    setNewFieldOptions('');
  };

  // Filter Submissions
  const filteredSubmissions = submissions.filter((s) => {
    return (
      s.data_json.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.ip_address && s.ip_address.includes(searchQuery))
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight flex items-center gap-2.5">
            <Mail className="w-6 h-6 text-blue-500" />
            <span>Contact Management System</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Complete management engine for Contact Page content, dynamic Form Fields, Lead Inquiries, and SMTP Email Delivery.
          </p>
        </div>

        {/* Tab Navigation Switches */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-950 p-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 shrink-0">
          <button
            onClick={() => setActiveTab('editor')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'editor'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100'
            }`}
          >
            <FileEdit className="w-4 h-4" />
            <span>Contact Page Editor</span>
          </button>

          <button
            onClick={() => setActiveTab('entries')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'entries'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Form Entries ({submissions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('smtp')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'smtp'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>SMTP Configuration</span>
          </button>
        </div>
      </div>

      {saveStatus && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between border ${
            saveStatus.includes('Error') || saveStatus.includes('Failed')
              ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
              : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{saveStatus}</span>
          </div>
        </div>
      )}

      {/* TAB 1: CONTACT PAGE EDITOR */}
      {activeTab === 'editor' && (
        <div className="space-y-6">
          {/* Action Header */}
          <div className="flex justify-between items-center bg-slate-50 dark:bg-zinc-950 p-4 rounded-xl border border-slate-200 dark:border-zinc-800">
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
              Customize hero image, headings, social channels, form fields, and submit button.
            </span>
            <Button
              variant="primary"
              icon={<Save className="w-4 h-4" />}
              loading={isSaving}
              onClick={handleSaveContactEditor}
            >
              Save Contact Page Settings
            </Button>
          </div>

          {/* Section A: Artist Image Upload & Text Overlay */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Contact Hero & Artist Image Section</span>
              </h3>
              <Badge variant="blue">Direct File Upload</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div>
                <DeviceImageUpload
                  label="Artist / Studio Image (Direct Device Upload)"
                  value={artistImage}
                  onChange={(url) => setArtistImage(url)}
                  category="general"
                />
                <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-2">
                  Uploaded image replaces the main contact section artist sketch image. No URL needed.
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  label="Main Bold Text Overlay"
                  value={overlayTitle}
                  onChange={(e) => setOverlayTitle(e.target.value)}
                  placeholder="Studio Atelier No. 4"
                />

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                    Supporting Text Description
                  </label>
                  <textarea
                    rows={3}
                    value={overlaySub}
                    onChange={(e) => setOverlaySub(e.target.value)}
                    placeholder="Monochrome Ink Drafting & Physical Prototypes"
                    className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-zinc-100 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Section B: Hero Header & Description */}
          <Card className="space-y-4">
            <div className="border-b border-slate-200 dark:border-zinc-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-zinc-100">
                Contact Form Heading & Description
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Form Main Heading"
                value={formHeading}
                onChange={(e) => setFormHeading(e.target.value)}
                placeholder="Contact Us Today"
              />
              <Input
                label="Form Subheading / Description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Send us a message and receive a response in less than an hour."
              />
            </div>
          </Card>

          {/* Section C: Connect & Archive Social Links */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-500" />
                  <span>Connect & Archive Social Links</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                  Manage social platform links visible on the contact page. Toggle visibility ON/OFF.
                </p>
              </div>
            </div>

            {/* List of platforms */}
            <div className="space-y-3">
              {socialLinks.map((social) => (
                <div
                  key={social.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800"
                >
                  <div className="flex items-center gap-3 w-44 shrink-0">
                    <span className="text-xs font-bold text-slate-900 dark:text-zinc-100">
                      {social.platform}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleSocialLink(social.id)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                        social.enabled
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          : 'bg-slate-200 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400'
                      }`}
                    >
                      {social.enabled ? 'VISIBLE ON SITE' : 'HIDDEN'}
                    </button>
                  </div>

                  <div className="flex-1">
                    <input
                      type="text"
                      value={social.url}
                      onChange={(e) => updateSocialUrl(social.id, e.target.value)}
                      placeholder={`https://${social.platform.toLowerCase()}.com`}
                      className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-zinc-100 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeSocialLink(social.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer self-end sm:self-center"
                    title="Remove Link"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Custom Social Link */}
            <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-zinc-800 space-y-3 bg-slate-50/50 dark:bg-zinc-950/40">
              <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                Add New Social Platform Link
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <input
                  type="text"
                  placeholder="Platform Name (e.g., Substack)"
                  value={newPlatform}
                  onChange={(e) => setNewPlatform(e.target.value)}
                  className="sm:col-span-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-zinc-100"
                />
                <input
                  type="text"
                  placeholder="URL (e.g., https://substack.com/@username)"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="sm:col-span-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-zinc-100"
                />
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Plus className="w-4 h-4" />}
                  onClick={handleAddSocialLink}
                  className="sm:col-span-2"
                >
                  Add Link
                </Button>
              </div>
            </div>
          </Card>

          {/* Section D: Form Fields Builder */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-500" />
                  <span>Contact Form Fields Builder</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                  Customize labels, placeholders, required status, remove default fields, or add custom fields.
                </p>
              </div>
            </div>

            {/* Fields List */}
            <div className="space-y-3">
              {formFields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-500 font-bold text-[11px] flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-zinc-100">
                        Field Key: <code className="text-blue-500">{field.name}</code>
                      </span>
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300">
                        {field.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => toggleFieldRequired(field.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                          field.required
                            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                            : 'bg-slate-200 dark:bg-zinc-800 text-slate-500'
                        }`}
                      >
                        {field.required ? 'REQUIRED' : 'OPTIONAL'}
                      </button>

                      <button
                        type="button"
                        onClick={() => removeFormField(field.id)}
                        className="p-1 text-slate-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                        title="Remove Field"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                        Display Label
                      </label>
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => updateFieldLabel(field.id, e.target.value)}
                        className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-zinc-100 focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                        Input Placeholder
                      </label>
                      <input
                        type="text"
                        value={field.placeholder || ''}
                        onChange={(e) => updateFieldPlaceholder(field.id, e.target.value)}
                        className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-zinc-100 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {field.type === 'select' && (
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                        Dropdown Options (comma separated)
                      </label>
                      <input
                        type="text"
                        value={field.options ? field.options.join(', ') : ''}
                        onChange={(e) => {
                          const opts = e.target.value.split(',').map((o) => o.trim());
                          setFormFields(
                            formFields.map((f) => (f.id === field.id ? { ...f, options: opts } : f))
                          );
                        }}
                        className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-zinc-100 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add Custom Field Form */}
            <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-zinc-800 space-y-3 bg-slate-50/50 dark:bg-zinc-950/40">
              <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                Add New Custom Form Field
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <input
                  type="text"
                  placeholder="Field Label (e.g., Preferred Contact Time)"
                  value={newFieldLabel}
                  onChange={(e) => setNewFieldLabel(e.target.value)}
                  className="sm:col-span-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-zinc-100"
                />
                <select
                  value={newFieldType}
                  onChange={(e) => setNewFieldType(e.target.value as any)}
                  className="sm:col-span-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-zinc-100"
                >
                  <option value="text">Text Input</option>
                  <option value="email">Email Input</option>
                  <option value="textarea">Textarea Block</option>
                  <option value="select">Dropdown Select</option>
                </select>

                <input
                  type="text"
                  placeholder="Placeholder (e.g., Morning PST)"
                  value={newFieldPlaceholder}
                  onChange={(e) => setNewFieldPlaceholder(e.target.value)}
                  className="sm:col-span-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-zinc-100"
                />

                <Button
                  variant="outline"
                  size="sm"
                  icon={<Plus className="w-4 h-4" />}
                  onClick={handleAddCustomField}
                  className="sm:col-span-2"
                >
                  Add Field
                </Button>
              </div>

              {newFieldType === 'select' && (
                <input
                  type="text"
                  placeholder="Dropdown Options (comma separated e.g. Morning, Afternoon, Evening)"
                  value={newFieldOptions}
                  onChange={(e) => setNewFieldOptions(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-zinc-100"
                />
              )}
            </div>
          </Card>

          {/* Section E: Submit Button Editing */}
          <Card className="space-y-4">
            <div className="border-b border-slate-200 dark:border-zinc-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-zinc-100">
                Form Submit Button Label
              </h3>
            </div>
            <div className="max-w-md">
              <Input
                label="Button Text"
                value={submitBtnText}
                onChange={(e) => setSubmitBtnText(e.target.value)}
                placeholder="Start Your Project"
              />
            </div>
          </Card>

          {/* Bottom Save Action */}
          <div className="flex justify-end pt-2">
            <Button
              variant="primary"
              size="lg"
              icon={<Save className="w-4 h-4" />}
              loading={isSaving}
              onClick={handleSaveContactEditor}
            >
              Save All Contact Settings
            </Button>
          </div>
        </div>
      )}

      {/* TAB 2: FORM ENTRIES DASHBOARD */}
      {activeTab === 'entries' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                <Inbox className="w-4 h-4 text-blue-500" />
                <span>Customer Submissions & Inquiries</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                All form submissions captured from the public contact page.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Input
                icon={<Search className="w-4 h-4" />}
                placeholder="Filter submissions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64"
              />
              <Button
                variant="outline"
                size="sm"
                icon={<RefreshCw className="w-3.5 h-3.5" />}
                onClick={loadSubmissions}
                loading={loadingEntries}
              >
                Refresh
              </Button>
            </div>
          </div>

          <Card className="overflow-x-auto p-0">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-zinc-800 text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider bg-slate-50/50 dark:bg-zinc-950/40">
                  <th className="py-3.5 px-4">Client Name</th>
                  <th className="py-3.5 px-4">Company & Email</th>
                  <th className="py-3.5 px-4">Project & Budget</th>
                  <th className="py-3.5 px-4">Date Submitted</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80 text-xs">
                {filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      No form submissions found matching filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map((sub) => {
                    let parsed: any = {};
                    try {
                      parsed = JSON.parse(sub.data_json);
                    } catch (e) {
                      parsed = {};
                    }

                    const clientName =
                      `${parsed.first_name || ''} ${parsed.last_name || ''}`.trim() ||
                      parsed.name ||
                      parsed.full_name ||
                      'Anonymous Client';

                    return (
                      <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-zinc-100">
                          {clientName}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-blue-600 dark:text-blue-400">
                              {parsed.email || 'N/A'}
                            </span>
                            <span className="text-[11px] text-slate-400 dark:text-zinc-500">
                              {parsed.company || 'Private Inquiry'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <Badge variant="blue">{parsed.project_type || parsed.projectType || 'General'}</Badge>
                            <Badge variant="emerald">{parsed.budget || 'Custom'}</Badge>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 dark:text-zinc-400">
                          {sub?.created_at ? new Date(sub.created_at).toLocaleString() : 'N/A'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            icon={<Eye className="w-3.5 h-3.5 text-blue-500" />}
                            onClick={() => setSelectedSub(sub)}
                          >
                            Inspect Payload
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </Card>

          {/* Submission Modal */}
          <Modal
            isOpen={!!selectedSub}
            onClose={() => setSelectedSub(null)}
            title="Form Lead Submission Details"
            subtitle="Complete inquiry details"
          >
            {selectedSub && (
              <div className="space-y-4 text-xs">
                {(() => {
                  let parsed: any = {};
                  try {
                    parsed = JSON.parse(selectedSub.data_json);
                  } catch (e) {
                    parsed = {};
                  }
                  return (
                    <>
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-2.5">
                        <div className="flex justify-between font-semibold border-b border-slate-200 dark:border-zinc-800 pb-2">
                          <span className="text-slate-500">First & Last Name:</span>
                          <span className="text-slate-900 dark:text-zinc-100 font-bold">
                            {parsed.first_name} {parsed.last_name || parsed.name}
                          </span>
                        </div>
                        <div className="flex justify-between font-semibold border-b border-slate-200 dark:border-zinc-800 pb-2">
                          <span className="text-slate-500">Client Email:</span>
                          <span className="text-blue-600 dark:text-blue-400 font-bold">{parsed.email}</span>
                        </div>
                        <div className="flex justify-between font-semibold border-b border-slate-200 dark:border-zinc-800 pb-2">
                          <span className="text-slate-500">Company / Organization:</span>
                          <span className="text-slate-900 dark:text-zinc-100">{parsed.company || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between font-semibold border-b border-slate-200 dark:border-zinc-800 pb-2">
                          <span className="text-slate-500">Project Type:</span>
                          <span className="text-blue-500">{parsed.project_type || parsed.projectType}</span>
                        </div>
                        <div className="flex justify-between font-semibold">
                          <span className="text-slate-500">Estimated Budget:</span>
                          <span className="text-emerald-500">{parsed.budget}</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-2">
                        <span className="text-[10px] font-bold uppercase text-slate-400">
                          Project Summary & Message
                        </span>
                        <p className="text-slate-800 dark:text-zinc-200 leading-relaxed font-sans whitespace-pre-wrap pt-1">
                          "{parsed.message || 'No additional summary provided.'}"
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-100 dark:bg-zinc-900 text-[11px] text-slate-500 dark:text-zinc-400 space-y-1">
                        <div>
                          <strong>IP Address:</strong> {selectedSub.ip_address || 'Internal/Client'}
                        </div>
                        <div>
                          <strong>Received At:</strong> {selectedSub?.created_at ? new Date(selectedSub.created_at).toString() : 'N/A'}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </Modal>
        </div>
      )}

      {/* TAB 3: SMTP CONFIGURATION */}
      {activeTab === 'smtp' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-slate-50 dark:bg-zinc-950 p-4 rounded-xl border border-slate-200 dark:border-zinc-800">
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
              Configure SMTP server parameters to send automatic email replies to clients and notifications to your team.
            </span>
            <Button
              variant="primary"
              icon={<Save className="w-4 h-4" />}
              loading={isSaving}
              onClick={handleSaveSmtp}
            >
              Save SMTP Settings
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Server Credentials & Routing */}
            <div className="lg:col-span-7 space-y-6">
              <Card className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                    <Server className="w-4 h-4 text-blue-500" />
                    <span>SMTP Server Configuration</span>
                  </h3>
                  <Badge variant="blue">Environment & Storage Connected</Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="SMTP Host (e.g., smtp.hostinger.com)"
                    value={smtpForm.host}
                    onChange={(e) => setSmtpForm({ ...smtpForm, host: e.target.value })}
                  />
                  <Input
                    label="SMTP Port (587 / 465)"
                    type="number"
                    value={smtpForm?.port ? String(smtpForm.port) : '465'}
                    onChange={(e) => setSmtpForm({ ...smtpForm, port: parseInt(e.target.value, 10) || 465 })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="SMTP Username"
                    value={smtpForm.username || ''}
                    onChange={(e) => setSmtpForm({ ...smtpForm, username: e.target.value })}
                  />
                  <Input
                    label="SMTP Password"
                    type="password"
                    value={smtpPassword}
                    onChange={(e) => setSmtpPassword(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                      Encryption Protocol
                    </label>
                    <select
                      value={smtpForm.encryption}
                      onChange={(e) => setSmtpForm({ ...smtpForm, encryption: e.target.value as any })}
                      className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-zinc-100 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="ssl">SSL (Port 465)</option>
                      <option value="tls">TLS / STARTTLS (Port 587)</option>
                      <option value="none">None (Plain)</option>
                    </select>
                  </div>

                  <Input
                    label="Sender Display Name"
                    value={smtpForm.from_name}
                    onChange={(e) => setSmtpForm({ ...smtpForm, from_name: e.target.value })}
                    placeholder="Comic Art Studio"
                  />
                </div>

                <Input
                  label="Sender Email Address (From Email)"
                  value={smtpForm.from_email}
                  onChange={(e) => setSmtpForm({ ...smtpForm, from_email: e.target.value })}
                  placeholder="contact@kinetic-studio.com"
                />
              </Card>

              {/* Business Notification Email */}
              <Card className="space-y-4">
                <div className="border-b border-slate-200 dark:border-zinc-800 pb-3">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-emerald-500" />
                    <span>Business Notification Settings</span>
                  </h3>
                </div>

                <Input
                  label="Company Inbox Email (Receives All Customer Submissions)"
                  value={notificationEmail}
                  onChange={(e) => setNotificationEmail(e.target.value)}
                  placeholder="studio@comicartstudio.com"
                />
                <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                  Every submitted inquiry will be dispatched immediately to this company address.
                </p>
              </Card>
            </div>

            {/* Right Column: Auto Reply Template & Test Tool */}
            <div className="lg:col-span-5 space-y-6">
              {/* Client Auto Reply */}
              <Card className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                    <Send className="w-4 h-4 text-blue-500" />
                    <span>Client Email Auto Reply</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setSmtpForm({ ...smtpForm, is_active: !smtpForm.is_active })}
                    className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all ${
                      smtpForm.is_active
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                        : 'bg-slate-200 dark:bg-zinc-800 text-slate-500'
                    }`}
                  >
                    {smtpForm.is_active ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>

                <Input
                  label="Auto Reply Email Subject"
                  value={autoReplySubject}
                  onChange={(e) => setAutoReplySubject(e.target.value)}
                  placeholder="Thank you for contacting Comic Art Studio"
                />

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                    Auto Reply Email Body Template
                  </label>
                  <textarea
                    rows={6}
                    value={autoReplyBody}
                    onChange={(e) => setAutoReplyBody(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl p-3 text-xs text-slate-900 dark:text-zinc-100 focus:border-blue-500 focus:outline-none font-mono"
                  />
                  <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1">
                    Use <code className="text-blue-500">{'{first_name}'}</code> to personalize with the client's first name.
                  </p>
                </div>
              </Card>

              {/* SMTP Test Connection Tool */}
              <Card className="space-y-4 bg-slate-50/50 dark:bg-zinc-950/50 border border-slate-200 dark:border-zinc-800">
                <div className="border-b border-slate-200 dark:border-zinc-800 pb-3">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-amber-500" />
                    <span>Send Test Email</span>
                  </h3>
                </div>

                <Input
                  label="Recipient Test Email"
                  placeholder="your.email@example.com"
                  value={testEmailAddress}
                  onChange={(e) => setTestEmailAddress(e.target.value)}
                />

                <Button
                  variant="outline"
                  icon={<Send className="w-4 h-4" />}
                  loading={isTestingSmtp}
                  onClick={handleTestSmtp}
                  className="w-full"
                >
                  Send Test Verification Email
                </Button>

                {testEmailStatus && (
                  <p
                    className={`text-xs p-3 rounded-xl border ${
                      testEmailStatus.includes('Success')
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    }`}
                  >
                    {testEmailStatus}
                  </p>
                )}
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
