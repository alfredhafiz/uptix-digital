"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Save,
  Upload,
  Mail,
  CreditCard,
  ImageIcon,
  Settings,
  Globe,
  Loader2,
  X,
  Check,
  Code2,
  Send,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FileUploadProps {
  id: string;
  label: string;
  accept: string;
  value: string;
  onChange: (url: string) => void;
  folder: string;
  preview?: boolean;
}

function FileUpload({
  id,
  label,
  accept,
  value,
  onChange,
  folder,
  preview = true,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      onChange(data.url);
      setUploadSuccess(true);

      // Reset success message after 3 seconds
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-slate-300 flex items-center">
        <ImageIcon className="w-4 h-4 mr-2" />
        {label}
      </Label>

      <div className="flex gap-2">
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter URL or upload file"
          className="glass border-white/10 bg-white/5 text-white flex-1"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="glass-card border-white/10 hover:bg-white/10"
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
        </Button>
        {value && (
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
            className="glass-card border-white/10 hover:bg-red-500/10 hover:text-red-400"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {uploadError && <p className="text-sm text-red-400">{uploadError}</p>}

      {uploadSuccess && (
        <p className="text-sm text-green-400 flex items-center">
          <Check className="w-3 h-3 mr-1" />
          File uploaded successfully!
        </p>
      )}

      {preview && value && (
        <div className="mt-2 p-2 glass-card border-white/10 rounded-lg">
          <p className="text-xs text-slate-400 mb-2">Preview:</p>
          <Image
            src={value}
            alt={label}
            width={200}
            height={80}
            className="max-h-20 max-w-full object-contain"
          />
        </div>
      )}
    </div>
  );
}

export function AdminSettingsForm() {
  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [settings, setSettings] = useState({
    // General Settings
    siteName: "Uptix Digital",
    siteDescription: "Premium Web & App Development Agency",
    logo: "",
    favicon: "",

    // Email Settings
    smtpHost: "",
    smtpPort: "587",
    smtpUser: "",
    smtpPass: "",
    fromEmail: "hello@uptixdigital.com",
    fromName: "Uptix Digital",

    // Payment Settings
    stripePublicKey: "",
    stripeSecretKey: "",
    paypalClientId: "",
    paypalClientSecret: "",
    binanceApiKey: "",
    binanceSecretKey: "",

    // Analytics
    googleAnalyticsId: "",
    enableAnalytics: true,

    // Custom Scripts
    customHeadScripts: "",
    customBodyScripts: "",
  });

  // Fetch current settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/admin/settings");
        if (response.ok) {
          const data = await response.json();
          // Convert null values to empty strings for form inputs
          const sanitizedData = Object.entries(data).reduce(
            (acc, [key, value]) => {
              acc[key as keyof typeof settings] =
                value === null ? "" : (value as any);
              return acc;
            },
            {} as Partial<typeof settings>,
          );

          setSettings((prev) => ({
            ...prev,
            ...sanitizedData,
          }));
        } else {
          const errorData = await response.json();
          console.error("Failed to fetch settings:", errorData);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchSettings();
  }, []);

  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [smtpTesting, setSmtpTesting] = useState(false);
  const [smtpTestResult, setSmtpTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [analyticsValidationError, setAnalyticsValidationError] = useState<
    string | null
  >(null);

  const isValidGoogleAnalyticsId = (value: string) => {
    if (!value.trim()) return true;
    return /^G-[A-Z0-9]{4,}$/i.test(value.trim());
  };

  const handleTestSmtp = async () => {
    setSmtpTesting(true);
    setSmtpTestResult(null);
    try {
      const response = await fetch("/api/admin/settings/test-smtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          smtpHost: settings.smtpHost,
          smtpPort: settings.smtpPort,
          smtpUser: settings.smtpUser,
          smtpPass: settings.smtpPass,
          fromEmail: settings.fromEmail,
          fromName: settings.fromName,
        }),
      });
      const data = await response.json();
      setSmtpTestResult({ success: data.success, message: data.message });
    } catch {
      setSmtpTestResult({
        success: false,
        message: "Network error – could not reach server.",
      });
    } finally {
      setSmtpTesting(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      if (!isValidGoogleAnalyticsId(settings.googleAnalyticsId)) {
        setAnalyticsValidationError(
          "Google Analytics ID must look like G-XXXXXXXXXX",
        );
        setIsLoading(false);
        return;
      }

      setAnalyticsValidationError(null);

      // Filter out empty strings for optional fields to prevent validation issues
      const settingsToSave = {
        siteName: settings.siteName,
        siteDescription: settings.siteDescription,
        logo: settings.logo || null,
        favicon: settings.favicon || null,
        smtpHost: settings.smtpHost || null,
        smtpPort: settings.smtpPort || null,
        smtpUser: settings.smtpUser || null,
        smtpPass: settings.smtpPass || null,
        fromEmail: settings.fromEmail || null,
        fromName: settings.fromName || null,
        googleAnalyticsId: settings.googleAnalyticsId.trim() || null,
        enableAnalytics: settings.enableAnalytics,
        customHeadScripts: settings.customHeadScripts?.trim() || null,
        customBodyScripts: settings.customBodyScripts?.trim() || null,
      };

      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsToSave),
      });

      const data = await response.json();

      if (response.ok) {
        setSaveSuccess(true);
        // Re-fetch settings to confirm they were saved
        const fetchResponse = await fetch("/api/admin/settings");
        if (fetchResponse.ok) {
          const freshData = await fetchResponse.json();
          setSettings((prev) => ({
            ...prev,
            ...freshData,
          }));
        }
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors
            .map((e: any) => `${e.field}: ${e.message}`)
            .join(", ");
          setSaveError(`Validation failed: ${errorMessages}`);
        } else {
          setSaveError(data.message || data.error || "Failed to save settings");
        }
        console.error("Save error:", data);
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      setSaveError("Network error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = (
    key: keyof typeof settings,
    value: string | boolean,
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="glass-card border-white/10">
          <TabsTrigger
            value="general"
            className="data-[state=active]:bg-blue-500/20"
          >
            <Settings className="w-4 h-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger
            value="email"
            className="data-[state=active]:bg-blue-500/20"
          >
            <Mail className="w-4 h-4 mr-2" />
            Email
          </TabsTrigger>
          <TabsTrigger
            value="payment"
            className="data-[state=active]:bg-blue-500/20"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Payment
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="data-[state=active]:bg-blue-500/20"
          >
            <Globe className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger
            value="scripts"
            className="data-[state=active]:bg-blue-500/20"
          >
            <Code2 className="w-4 h-4 mr-2" />
            Scripts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                General Settings
              </CardTitle>
              <CardDescription className="text-slate-400">
                Configure your website name, logo, favicon, and basic settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="siteName" className="text-slate-300">
                  Site Name
                </Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => updateSetting("siteName", e.target.value)}
                  className="glass border-white/10 bg-white/5 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription" className="text-slate-300">
                  Site Description
                </Label>
                <Input
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) =>
                    updateSetting("siteDescription", e.target.value)
                  }
                  className="glass border-white/10 bg-white/5 text-white"
                />
              </div>

              <FileUpload
                id="logo"
                label="Site Logo"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                value={settings.logo}
                onChange={(url) => updateSetting("logo", url)}
                folder="logos"
                preview={true}
              />
              <p className="text-xs text-slate-500 -mt-4">
                Recommended size: 200x50px, PNG or SVG preferred
              </p>

              <FileUpload
                id="favicon"
                label="Favicon"
                accept="image/x-icon,image/vnd.microsoft.icon,image/png,image/svg+xml"
                value={settings.favicon}
                onChange={(url) => updateSetting("favicon", url)}
                folder="favicons"
                preview={true}
              />
              <p className="text-xs text-slate-500 -mt-4">
                Recommended size: 32x32px or 64x64px, ICO or PNG
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Email Configuration (SMTP)
              </CardTitle>
              <CardDescription className="text-slate-400">
                Configure your SMTP settings for sending emails. Note: Passwords
                are stored securely in environment variables.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost" className="text-slate-300">
                    SMTP Host
                  </Label>
                  <Input
                    id="smtpHost"
                    value={settings.smtpHost}
                    onChange={(e) => updateSetting("smtpHost", e.target.value)}
                    placeholder="smtp.gmail.com"
                    className="glass border-white/10 bg-white/5 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpPort" className="text-slate-300">
                    SMTP Port
                  </Label>
                  <Input
                    id="smtpPort"
                    value={settings.smtpPort}
                    onChange={(e) => updateSetting("smtpPort", e.target.value)}
                    placeholder="587"
                    className="glass border-white/10 bg-white/5 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtpUser" className="text-slate-300">
                  SMTP Username
                </Label>
                <Input
                  id="smtpUser"
                  value={settings.smtpUser}
                  onChange={(e) => updateSetting("smtpUser", e.target.value)}
                  placeholder="your-email@gmail.com"
                  className="glass border-white/10 bg-white/5 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtpPass" className="text-slate-300">
                  SMTP Password
                </Label>
                <Input
                  id="smtpPass"
                  type="password"
                  value={settings.smtpPass}
                  onChange={(e) => updateSetting("smtpPass", e.target.value)}
                  placeholder="••••••••"
                  className="glass border-white/10 bg-white/5 text-white"
                />
                <p className="text-xs text-slate-500">
                  Note: This will be saved to environment variables, not the
                  database.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fromEmail" className="text-slate-300">
                    From Email
                  </Label>
                  <Input
                    id="fromEmail"
                    value={settings.fromEmail}
                    onChange={(e) => updateSetting("fromEmail", e.target.value)}
                    className="glass border-white/10 bg-white/5 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fromName" className="text-slate-300">
                    From Name
                  </Label>
                  <Input
                    id="fromName"
                    value={settings.fromName}
                    onChange={(e) => updateSetting("fromName", e.target.value)}
                    className="glass border-white/10 bg-white/5 text-white"
                  />
                </div>
              </div>

              {/* Test SMTP Button */}
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleTestSmtp}
                    disabled={smtpTesting}
                    className="glass-card border-white/10 hover:bg-blue-500/10 hover:border-blue-500/30"
                  >
                    {smtpTesting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Testing...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" /> Test SMTP Connection
                      </>
                    )}
                  </Button>
                  {smtpTestResult && (
                    <div
                      className={`flex items-center text-sm ${smtpTestResult.success ? "text-green-400" : "text-red-400"}`}
                    >
                      {smtpTestResult.success ? (
                        <Check className="w-4 h-4 mr-1" />
                      ) : (
                        <AlertCircle className="w-4 h-4 mr-1" />
                      )}
                      {smtpTestResult.message}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-6">
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Stripe Configuration</CardTitle>
              <CardDescription className="text-slate-400">
                Configure Stripe for credit card payments. Secret keys are
                stored securely in environment variables.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="stripePublicKey" className="text-slate-300">
                  Public Key (pk_live_... or pk_test_...)
                </Label>
                <Input
                  id="stripePublicKey"
                  value={settings.stripePublicKey}
                  onChange={(e) =>
                    updateSetting("stripePublicKey", e.target.value)
                  }
                  placeholder="pk_live_..."
                  className="glass border-white/10 bg-white/5 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stripeSecretKey" className="text-slate-300">
                  Secret Key (sk_live_... or sk_test_...)
                </Label>
                <Input
                  id="stripeSecretKey"
                  type="password"
                  value={settings.stripeSecretKey}
                  onChange={(e) =>
                    updateSetting("stripeSecretKey", e.target.value)
                  }
                  placeholder="sk_live_..."
                  className="glass border-white/10 bg-white/5 text-white"
                />
                <p className="text-xs text-slate-500">
                  Note: This will be saved to environment variables, not the
                  database.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="text-white">PayPal Configuration</CardTitle>
              <CardDescription className="text-slate-400">
                Configure PayPal for payments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="paypalClientId" className="text-slate-300">
                  Client ID
                </Label>
                <Input
                  id="paypalClientId"
                  value={settings.paypalClientId}
                  onChange={(e) =>
                    updateSetting("paypalClientId", e.target.value)
                  }
                  className="glass border-white/10 bg-white/5 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paypalClientSecret" className="text-slate-300">
                  Client Secret
                </Label>
                <Input
                  id="paypalClientSecret"
                  type="password"
                  value={settings.paypalClientSecret}
                  onChange={(e) =>
                    updateSetting("paypalClientSecret", e.target.value)
                  }
                  className="glass border-white/10 bg-white/5 text-white"
                />
                <p className="text-xs text-slate-500">
                  Note: This will be saved to environment variables, not the
                  database.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="text-white">
                Binance Pay Configuration
              </CardTitle>
              <CardDescription className="text-slate-400">
                Configure Binance Pay for crypto payments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="binanceApiKey" className="text-slate-300">
                  API Key
                </Label>
                <Input
                  id="binanceApiKey"
                  value={settings.binanceApiKey}
                  onChange={(e) =>
                    updateSetting("binanceApiKey", e.target.value)
                  }
                  className="glass border-white/10 bg-white/5 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="binanceSecretKey" className="text-slate-300">
                  Secret Key
                </Label>
                <Input
                  id="binanceSecretKey"
                  type="password"
                  value={settings.binanceSecretKey}
                  onChange={(e) =>
                    updateSetting("binanceSecretKey", e.target.value)
                  }
                  className="glass border-white/10 bg-white/5 text-white"
                />
                <p className="text-xs text-slate-500">
                  Note: This will be saved to environment variables, not the
                  database.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Analytics Configuration
              </CardTitle>
              <CardDescription className="text-slate-400">
                Configure tracking and analytics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="googleAnalyticsId" className="text-slate-300">
                  Google Analytics ID (G-XXXXXXXXXX)
                </Label>
                <Input
                  id="googleAnalyticsId"
                  value={settings.googleAnalyticsId}
                  onChange={(e) => {
                    updateSetting("googleAnalyticsId", e.target.value);
                    if (analyticsValidationError) {
                      setAnalyticsValidationError(null);
                    }
                  }}
                  placeholder="G-XXXXXXXXXX"
                  className="glass border-white/10 bg-white/5 text-white"
                />
                {analyticsValidationError && (
                  <p className="text-xs text-red-400">
                    {analyticsValidationError}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="enableAnalytics"
                  checked={settings.enableAnalytics}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateSetting("enableAnalytics", e.target.checked)
                  }
                  className="w-5 h-5 rounded border-white/20 bg-white/5 text-blue-500"
                />
                <Label
                  htmlFor="enableAnalytics"
                  className="text-slate-300 cursor-pointer"
                >
                  Enable Analytics Tracking
                </Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scripts" className="space-y-6">
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Code2 className="w-5 h-5 mr-2" />
                Custom Scripts
              </CardTitle>
              <CardDescription className="text-slate-400">
                Add custom scripts like Google Tag Manager, Facebook Pixel, chat
                widgets, etc. Scripts are injected into every page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="customHeadScripts" className="text-slate-300">
                  Head Scripts (inserted before &lt;/head&gt;)
                </Label>
                <textarea
                  id="customHeadScripts"
                  value={settings.customHeadScripts}
                  onChange={(e) =>
                    updateSetting("customHeadScripts", e.target.value)
                  }
                  placeholder={
                    "<!-- Google Tag Manager -->\n<script>(function(w,d,s,l,i){...})(window,document,'script','dataLayer','GTM-XXXX');</script>"
                  }
                  rows={8}
                  className="w-full glass border-white/10 bg-white/5 text-white font-mono text-sm rounded-md px-3 py-2 placeholder:text-slate-600"
                />
                <p className="text-xs text-slate-500">
                  Paste any &lt;script&gt; or &lt;meta&gt; tags you want in the
                  document head.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customBodyScripts" className="text-slate-300">
                  Body Scripts (inserted before &lt;/body&gt;)
                </Label>
                <textarea
                  id="customBodyScripts"
                  value={settings.customBodyScripts}
                  onChange={(e) =>
                    updateSetting("customBodyScripts", e.target.value)
                  }
                  placeholder={
                    '<!-- Google Tag Manager (noscript) -->\n<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXX"></iframe></noscript>'
                  }
                  rows={8}
                  className="w-full glass border-white/10 bg-white/5 text-white font-mono text-sm rounded-md px-3 py-2 placeholder:text-slate-600"
                />
                <p className="text-xs text-slate-500">
                  Paste any &lt;noscript&gt; or tracking pixel tags you want
                  before the closing body.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {saveError && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{saveError}</p>
          </div>
        )}

        {saveSuccess && (
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-green-400 text-sm flex items-center">
              <Check className="w-4 h-4 mr-2" />
              Settings saved successfully!
            </p>
          </div>
        )}

        <div className="flex gap-4">
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-500 to-purple-500"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Save Settings
              </>
            )}
          </Button>
        </div>
      </Tabs>
    </motion.div>
  );
}
