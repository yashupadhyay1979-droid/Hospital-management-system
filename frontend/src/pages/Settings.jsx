import { Settings as SettingsIcon, Save, Building2, Bell, Shield, User, Key, UserCircle, Phone, Mail } from 'lucide-react';
import { useState } from 'react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground mt-1">Manage hospital preferences and system configurations.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 space-y-1">
          <button 
            onClick={() => setActiveTab('general')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'general' ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-secondary text-muted-foreground'}`}
          >
            <Building2 size={20} />
            <span className="font-medium">General</span>
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-secondary text-muted-foreground'}`}
          >
            <User size={20} />
            <span className="font-medium">My Profile</span>
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'notifications' ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-secondary text-muted-foreground'}`}
          >
            <Bell size={20} />
            <span className="font-medium">Notifications</span>
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'security' ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-secondary text-muted-foreground'}`}
          >
            <Shield size={20} />
            <span className="font-medium">Security</span>
          </button>
        </div>

        <div className="flex-1 bg-white p-8 rounded-2xl border border-border shadow-sm min-h-[500px]">
          
          {/* GENERAL TAB */}
          {activeTab === 'general' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="text-xl font-bold border-b border-border pb-4">Hospital Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Hospital Name</label>
                  <input type="text" defaultValue="ASPATAL General Hospital" className="w-full px-4 py-2 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Registration Number</label>
                  <input type="text" defaultValue="HOSP-4829-11" className="w-full px-4 py-2 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Address</label>
                  <input type="text" defaultValue="123 Health Avenue, Medical District" className="w-full px-4 py-2 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                </div>
              </div>

              <h3 className="text-xl font-bold border-b border-border pb-4 mt-8">HL7 Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">MLLP Listening Port</label>
                  <input type="text" disabled defaultValue="2575" className="w-full px-4 py-2 bg-secondary/50 border border-border rounded-xl cursor-not-allowed text-muted-foreground outline-none" />
                  <p className="text-xs text-muted-foreground">Configured via backend application.yml</p>
                </div>
              </div>

              <div className="pt-6 flex justify-end">
                <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors cursor-pointer shadow-sm">
                  <Save size={18} />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* MY PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="text-xl font-bold border-b border-border pb-4">Personal Information</h3>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
                <div className="w-24 h-24 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold border-2 border-primary/20">
                  AD
                </div>
                <div className="space-y-2 text-center sm:text-left">
                  <button className="px-4 py-2 border border-border rounded-xl text-sm font-medium hover:bg-secondary transition-colors cursor-pointer">
                    Change Avatar
                  </button>
                  <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max size 2MB.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <div className="relative">
                    <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input type="text" defaultValue="Admin User" className="w-full pl-10 pr-4 py-2 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                  <input type="text" disabled defaultValue="System Administrator" className="w-full px-4 py-2 bg-secondary/50 border border-border rounded-xl cursor-not-allowed text-muted-foreground outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input type="email" defaultValue="admin@aspatal.com" className="w-full pl-10 pr-4 py-2 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full pl-10 pr-4 py-2 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                  </div>
                </div>
              </div>
              <div className="pt-6 flex justify-end">
                <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors cursor-pointer shadow-sm">
                  <Save size={18} />
                  Save Profile
                </button>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="text-xl font-bold border-b border-border pb-4">Notification Preferences</h3>
              
              <div className="space-y-4">
                {[
                  { title: 'New HL7 Message Alerts', desc: 'Receive a desktop notification when a new ADT or ORU message arrives.', defaultChecked: true },
                  { title: 'Lab Result Completion', desc: 'Get notified when a pending lab request is marked as completed.', defaultChecked: true },
                  { title: 'System Errors & Warnings', desc: 'Crucial alerts regarding MLLP port bindings and database connectivity.', defaultChecked: true },
                  { title: 'Weekly Reports', desc: 'Receive an email summary of hospital admissions and patient statistics.', defaultChecked: false },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-border rounded-xl bg-secondary/20 hover:bg-secondary/40 transition-colors gap-4">
                    <div className="flex-1 min-w-0 pr-4">
                      <h4 className="font-medium truncate">{item.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1 break-words">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer mt-1">
                      <input type="checkbox" defaultChecked={item.defaultChecked} className="sr-only peer" />
                      <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                ))}
              </div>

              <div className="pt-6 flex justify-end">
                <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors cursor-pointer shadow-sm">
                  <Save size={18} />
                  Update Preferences
                </button>
              </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="text-xl font-bold border-b border-border pb-4">Security & Authentication</h3>
              
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Current Password</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-2 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">New Password</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input type="password" placeholder="Enter new password" className="w-full pl-10 pr-4 py-2 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Confirm New Password</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input type="password" placeholder="Confirm new password" className="w-full pl-10 pr-4 py-2 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                  </div>
                </div>
                
                <div className="pt-4">
                  <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-xl font-medium flex justify-center items-center gap-2 transition-colors cursor-pointer shadow-sm">
                    <Shield size={18} />
                    Update Password
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-bold border-b border-border pb-4 mt-8 text-destructive">Danger Zone</h3>
              <div className="border border-destructive/20 bg-destructive/5 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1 min-w-0 pr-4">
                  <h4 className="font-bold text-destructive truncate">JWT Session Invalidation</h4>
                  <p className="text-sm text-destructive/80 mt-1 break-words">Force logout all users globally and invalidate all active JSON Web Tokens.</p>
                </div>
                <button className="px-4 py-2 bg-destructive text-destructive-foreground rounded-xl font-medium hover:bg-destructive/90 transition-colors whitespace-nowrap">
                  Invalidate Sessions
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
