import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Card, CardHeader, CardTitle, CardContent, Button, Input } from '../components/ui';
import { Moon, Sun, Trash2, Save, Cloud, Loader2 } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { motion } from 'motion/react';

export default function Settings() {
  const { theme, setTheme, clearAll } = useAppStore();
  const { user, profile, updateProfile } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'data'>('profile');
  
  const [formData, setFormData] = useState({
    fullName: profile?.fullName || '',
    school: profile?.school || '',
    department: profile?.department || '',
    program: profile?.program || '',
    currentLevel: profile?.currentLevel || 100,
    matriculationYear: profile?.matriculationYear || new Date().getFullYear(),
    targetClassification: profile?.targetClassification || 'First Class',
    gpaGoal: profile?.gpaGoal || 3.6
  });

  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState('');

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all your local course data? This cannot be undone.')) {
      clearAll();
      setToast('Local data cleared.');
      setTimeout(() => setToast(''), 3000);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    await updateProfile(formData);
    setIsSaving(false);
    setToast('Profile saved successfully!');
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-light tracking-tight text-foreground mb-2">Account Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your profile, academic preferences, and cloud data.</p>
      </div>

      {toast && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium shadow-lg"
        >
          {toast}
        </motion.div>
      )}

      <div className="flex border-b border-border mb-6">
        <button 
          className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'profile' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile Setup
        </button>
        <button 
          className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'preferences' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          onClick={() => setActiveTab('preferences')}
        >
          App Preferences
        </button>
        <button 
          className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'data' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          onClick={() => setActiveTab('data')}
        >
          Sync & Data
        </button>
      </div>

      {activeTab === 'profile' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Academic Identity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Full Name</label>
                  <Input value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">School / Faculty</label>
                  <Input value={formData.school} onChange={e => setFormData({...formData, school: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Department</label>
                  <Input value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Program (e.g. BSc Admin)</label>
                  <Input value={formData.program} onChange={e => setFormData({...formData, program: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Current Level</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={formData.currentLevel}
                    onChange={e => setFormData({...formData, currentLevel: Number(e.target.value) as 100|200|300|400})}
                  >
                    <option value={100}>100</option>
                    <option value={200}>200</option>
                    <option value={300}>300</option>
                    <option value={400}>400</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Matriculation Year</label>
                  <Input type="number" value={formData.matriculationYear} onChange={e => setFormData({...formData, matriculationYear: Number(e.target.value)})} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Goals & Targets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Target Classification</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={formData.targetClassification}
                    onChange={e => setFormData({...formData, targetClassification: e.target.value})}
                  >
                    <option value="First Class">First Class</option>
                    <option value="Second Class Upper">Second Class Upper</option>
                    <option value="Second Class Lower">Second Class Lower</option>
                    <option value="Third Class">Third Class</option>
                    <option value="Pass">Pass</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Target GPA (Scale 4.0)</label>
                  <Input type="number" step="0.1" max="4.0" min="0" value={formData.gpaGoal} onChange={e => setFormData({...formData, gpaGoal: Number(e.target.value)})} />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={handleSaveProfile} disabled={isSaving} className="gap-2">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {activeTab === 'preferences' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="font-medium">Theme Mode</p>
                <p className="text-xs text-muted-foreground">Choose your preferred visual mode.</p>
              </div>
              <div className="flex gap-2 bg-muted p-1 rounded-lg">
                <Button 
                  variant={theme === 'light' ? 'default' : 'ghost'} 
                  size="sm" 
                  onClick={() => setTheme('light')}
                >
                  <Sun className="w-4 h-4 mr-2" /> Light
                </Button>
                <Button 
                  variant={theme === 'dark' ? 'default' : 'ghost'} 
                  size="sm" 
                  onClick={() => setTheme('dark')}
                >
                  <Moon className="w-4 h-4 mr-2" /> Dark
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <p className="text-sm text-muted-foreground italic flex items-center gap-2">
                More preferences like animation intensity and language are coming soon.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {activeTab === 'data' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cloud Sync</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-medium">Automatic Cloud Backup</p>
                  <p className="text-xs text-muted-foreground">Your course data is synced automatically.</p>
                </div>
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-2 text-xs font-bold">
                  <Cloud className="w-4 h-4" /> Active
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-sm text-foreground">Clear Local Course Data</p>
                  <p className="text-xs text-muted-foreground">This deletes data from your browser. Cloud data remains intact.</p>
                </div>
                <Button variant="danger" onClick={handleClear}>
                  <Trash2 className="w-4 h-4 mr-2" /> Clear Local Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
