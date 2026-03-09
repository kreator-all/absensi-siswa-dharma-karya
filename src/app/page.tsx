'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { 
  CalendarDays, 
  Clock, 
  LogIn, 
  LogOut, 
  User, 
  Users, 
  Settings, 
  FileText, 
  Bell, 
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Camera,
  Fingerprint,
  Upload,
  Plus,
  Trash2,
  Edit,
  Eye,
  Search,
  Filter,
  Download,
  RefreshCw,
  Home,
  GraduationCap,
  ClipboardList,
  Send,
  X,
  Menu,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'

// Types
interface User {
  id: string
  username: string
  name: string
  role: 'admin' | 'student'
  class?: string | null
  nis?: string | null
  hasFaceRegistered?: boolean
  hasFingerprintRegistered?: boolean
}

interface Attendance {
  id: string
  date: string
  timeIn: string | null
  timeOut: string | null
  status: string
  verificationMethod: string | null
}

interface Permission {
  id: string
  type: string
  reason: string
  fileUrl?: string | null
  startDate: string
  endDate: string
  status: string
  submittedAt: string
  reviewNotes?: string | null
  user?: { name: string; class?: string | null }
}

interface Announcement {
  id: string
  title: string
  content: string
  createdAt: string
  author?: { name: string }
}

interface Message {
  id: string
  content: string
  isRead: boolean
  createdAt: string
  sender?: { name: string; role: string }
  receiver?: { name: string; role: string }
}

interface Student {
  id: string
  username: string
  name: string
  class?: string | null
  nis?: string | null
  role: string
  isActive: boolean
  hasFaceRegistered?: boolean
  hasFingerprintRegistered?: boolean
}

// Main App Component
export default function AttendanceApp() {
  const { toast } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')

  // Check auth on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (userData: User) => {
    setUser(userData)
    setActiveTab('dashboard')
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      setActiveTab('dashboard')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  if (loading) {
    return <LoadingScreen />
  }

  if (!user) {
    return <AuthPage onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-lg text-slate-800">Sekolah Dharma Karya</h1>
                <p className="text-xs text-slate-500">Pondok Cabe</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="hidden sm:flex">
              {user.role === 'admin' ? 'Administrator' : 'Siswa'}
            </Badge>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-emerald-600 text-white text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-slate-500">{user.class || '-'}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r shadow-lg lg:shadow-none
          transition-transform duration-200 ease-in-out lg:translate-x-0 pt-16 lg:pt-0`}
        >
          <nav className="p-4 space-y-2">
            {user.role === 'admin' ? (
              // Admin Menu
              <>
                <NavItem 
                  icon={<Home />} 
                  label="Dashboard" 
                  active={activeTab === 'dashboard'}
                  onClick={() => setActiveTab('dashboard')}
                />
                <NavItem 
                  icon={<Users />} 
                  label="Data Siswa" 
                  active={activeTab === 'students'}
                  onClick={() => setActiveTab('students')}
                />
                <NavItem 
                  icon={<ClipboardList />} 
                  label="Kehadiran" 
                  active={activeTab === 'attendance'}
                  onClick={() => setActiveTab('attendance')}
                />
                <NavItem 
                  icon={<FileText />} 
                  label="Perizinan" 
                  active={activeTab === 'permissions'}
                  onClick={() => setActiveTab('permissions')}
                />
                <NavItem 
                  icon={<Bell />} 
                  label="Pengumuman" 
                  active={activeTab === 'announcements'}
                  onClick={() => setActiveTab('announcements')}
                />
              </>
            ) : (
              // Student Menu
              <>
                <NavItem 
                  icon={<Home />} 
                  label="Dashboard" 
                  active={activeTab === 'dashboard'}
                  onClick={() => setActiveTab('dashboard')}
                />
                <NavItem 
                  icon={<Clock />} 
                  label="Absensi" 
                  active={activeTab === 'attendance'}
                  onClick={() => setActiveTab('attendance')}
                />
                <NavItem 
                  icon={<FileText />} 
                  label="Perizinan" 
                  active={activeTab === 'permissions'}
                  onClick={() => setActiveTab('permissions')}
                />
                <NavItem 
                  icon={<Bell />} 
                  label="Pengumuman" 
                  active={activeTab === 'announcements'}
                  onClick={() => setActiveTab('announcements')}
                />
                <NavItem 
                  icon={<MessageSquare />} 
                  label="Pesan" 
                  active={activeTab === 'messages'}
                  onClick={() => setActiveTab('messages')}
                />
                <NavItem 
                  icon={<Settings />} 
                  label="Pengaturan" 
                  active={activeTab === 'settings'}
                  onClick={() => setActiveTab('settings')}
                />
              </>
            )}
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 min-h-[calc(100vh-60px)]">
          {user.role === 'admin' ? (
            <AdminContent activeTab={activeTab} user={user} />
          ) : (
            <StudentContent activeTab={activeTab} user={user} />
          )}
        </main>
      </div>
      <Toaster />
    </div>
  )
}

// Loading Screen
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600">
      <div className="text-center text-white">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
          <GraduationCap className="h-10 w-10" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Sekolah Dharma Karya</h1>
        <p className="text-white/80">Pondok Cabe</p>
        <p className="text-sm text-white/60 mt-4">Memuat...</p>
      </div>
    </div>
  )
}

// Navigation Item
function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors
        ${active 
          ? 'bg-emerald-50 text-emerald-700 font-medium' 
          : 'text-slate-600 hover:bg-slate-50'
        }`}
    >
      <span className="h-5 w-5">{icon}</span>
      {label}
    </button>
  )
}

// Auth Page
function AuthPage({ onLogin }: { onLogin: (user: User) => void }) {
  const { toast } = useToast()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  
  // Login form
  const [loginData, setLoginData] = useState({ username: '', password: '' })
  
  // Register form
  const [registerData, setRegisterData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    nis: '',
    class: ''
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Login gagal')
      }
      
      toast({
        title: 'Berhasil',
        description: `Selamat datang, ${data.user.name}!`
      })
      
      onLogin(data.user)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Password tidak cocok',
        variant: 'destructive'
      })
      return
    }
    
    setLoading(true)
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: registerData.username,
          password: registerData.password,
          name: registerData.name,
          nis: registerData.nis || undefined,
          class: registerData.class || undefined
        })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Registrasi gagal')
      }
      
      toast({
        title: 'Berhasil',
        description: 'Registrasi berhasil! Selamat datang.'
      })
      
      onLogin(data.user)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
            <GraduationCap className="h-8 w-8 text-emerald-600" />
          </div>
          <CardTitle className="text-2xl">Sistem Absensi</CardTitle>
          <CardDescription>Sekolah Dharma Karya Pondok Cabe</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={isLogin ? 'login' : 'register'} onValueChange={(v) => setIsLogin(v === 'login')}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Masuk</TabsTrigger>
              <TabsTrigger value="register">Daftar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username"
                    placeholder="Masukkan username"
                    value={loginData.username}
                    onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password"
                    type="password"
                    placeholder="Masukkan password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                  {loading ? 'Memproses...' : 'Masuk'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-name">Nama Lengkap</Label>
                  <Input 
                    id="reg-name"
                    placeholder="Masukkan nama lengkap"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-username">Username</Label>
                  <Input 
                    id="reg-username"
                    placeholder="Pilih username"
                    value={registerData.username}
                    onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-nis">NIS</Label>
                    <Input 
                      id="reg-nis"
                      placeholder="Nomor Induk"
                      value={registerData.nis}
                      onChange={(e) => setRegisterData({...registerData, nis: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-class">Kelas</Label>
                    <Input 
                      id="reg-class"
                      placeholder="XII IPA 1"
                      value={registerData.class}
                      onChange={(e) => setRegisterData({...registerData, class: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Password</Label>
                  <Input 
                    id="reg-password"
                    type="password"
                    placeholder="Minimal 6 karakter"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-confirm">Konfirmasi Password</Label>
                  <Input 
                    id="reg-confirm"
                    type="password"
                    placeholder="Ulangi password"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                  {loading ? 'Memproses...' : 'Daftar'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

// Student Content
function StudentContent({ activeTab, user }: { activeTab: string; user: User }) {
  return (
    <div>
      {activeTab === 'dashboard' && <StudentDashboard user={user} />}
      {activeTab === 'attendance' && <StudentAttendance user={user} />}
      {activeTab === 'permissions' && <StudentPermissions user={user} />}
      {activeTab === 'announcements' && <StudentAnnouncements />}
      {activeTab === 'messages' && <StudentMessages user={user} />}
      {activeTab === 'settings' && <StudentSettings user={user} />}
    </div>
  )
}

// Student Dashboard
function StudentDashboard({ user }: { user: User }) {
  const { toast } = useToast()
  const [stats, setStats] = useState({
    totalDays: 0,
    present: 0,
    absent: 0,
    late: 0,
    permission: 0
  })
  const [todayAttendance, setTodayAttendance] = useState<Attendance | null>(null)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch attendance stats
      const statsRes = await fetch('/api/attendance/stats')
      if (statsRes.ok) {
        const data = await statsRes.json()
        setStats(data.stats)
        setTodayAttendance(data.todayAttendance)
      }
      
      // Fetch recent announcements
      const announceRes = await fetch('/api/announcements?limit=3')
      if (announceRes.ok) {
        const data = await announceRes.json()
        setAnnouncements(data.announcements || [])
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleQuickCheckIn = async (method: 'face' | 'fingerprint') => {
    try {
      const res = await fetch('/api/attendance/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verificationMethod: method })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Gagal melakukan absensi')
      }
      
      toast({
        title: 'Berhasil',
        description: `Absensi masuk berhasil dicatat pada ${new Date(data.attendance.timeIn).toLocaleTimeString('id-ID')}`
      })
      
      fetchDashboardData()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Memuat...</div>
  }

  const attendanceRate = stats.totalDays > 0 
    ? Math.round((stats.present / stats.totalDays) * 100) 
    : 0

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Selamat Datang, {user.name}!</h2>
              <p className="text-white/80 mt-1">
                {new Date().toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="hidden sm:block">
              <GraduationCap className="h-16 w-16 text-white/30" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {!todayAttendance?.timeIn && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="border-2 border-emerald-200 hover:border-emerald-400 cursor-pointer transition-colors"
            onClick={() => handleQuickCheckIn('face')}>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <Camera className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold">Absen Masuk (Wajah)</h3>
                <p className="text-sm text-slate-500">Gunakan verifikasi wajah</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-blue-200 hover:border-blue-400 cursor-pointer transition-colors"
            onClick={() => handleQuickCheckIn('fingerprint')}>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Fingerprint className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Absen Masuk (Sidik Jari)</h3>
                <p className="text-sm text-slate-500">Gunakan verifikasi sidik jari</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Today Status */}
      {todayAttendance && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Status Kehadiran Hari Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-slate-50">
                <p className="text-sm text-slate-500">Jam Masuk</p>
                <p className="text-xl font-semibold">
                  {todayAttendance.timeIn 
                    ? new Date(todayAttendance.timeIn).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                    : '-'
                  }
                </p>
              </div>
              <div className="p-4 rounded-lg bg-slate-50">
                <p className="text-sm text-slate-500">Jam Keluar</p>
                <p className="text-xl font-semibold">
                  {todayAttendance.timeOut 
                    ? new Date(todayAttendance.timeOut).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                    : '-'
                  }
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Badge variant={todayAttendance.status === 'present' ? 'default' : 
                todayAttendance.status === 'late' ? 'secondary' : 'destructive'}>
                {todayAttendance.status === 'present' ? 'Hadir' : 
                 todayAttendance.status === 'late' ? 'Terlambat' : 'Tidak Hadir'}
              </Badge>
              {todayAttendance.verificationMethod && (
                <Badge variant="outline">
                  {todayAttendance.verificationMethod === 'face' ? 'Verifikasi Wajah' : 'Verifikasi Sidik Jari'}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Hadir" 
          value={stats.present} 
          total={stats.totalDays}
          icon={<CheckCircle className="h-5 w-5" />}
          color="emerald"
        />
        <StatsCard 
          title="Tidak Hadir" 
          value={stats.absent} 
          total={stats.totalDays}
          icon={<XCircle className="h-5 w-5" />}
          color="red"
        />
        <StatsCard 
          title="Terlambat" 
          value={stats.late} 
          total={stats.totalDays}
          icon={<AlertTriangle className="h-5 w-5" />}
          color="yellow"
        />
        <StatsCard 
          title="Izin" 
          value={stats.permission} 
          total={stats.totalDays}
          icon={<FileText className="h-5 w-5" />}
          color="blue"
        />
      </div>

      {/* Attendance Rate */}
      <Card>
        <CardHeader>
          <CardTitle>Tingkat Kehadiran</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Presentase Kehadiran</span>
              <span className="font-semibold">{attendanceRate}%</span>
            </div>
            <Progress value={attendanceRate} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Recent Announcements */}
      {announcements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Pengumuman Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="p-4 rounded-lg bg-slate-50">
                  <h4 className="font-medium">{announcement.title}</h4>
                  <p className="text-sm text-slate-600 mt-1 line-clamp-2">{announcement.content}</p>
                  <p className="text-xs text-slate-400 mt-2">
                    {new Date(announcement.createdAt).toLocaleDateString('id-ID')}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Stats Card Component
function StatsCard({ title, value, total, icon, color }: { 
  title: string; 
  value: number; 
  total: number;
  icon: React.ReactNode; 
  color: 'emerald' | 'red' | 'yellow' | 'blue' 
}) {
  const colorClasses = {
    emerald: 'bg-emerald-100 text-emerald-600',
    red: 'bg-red-100 text-red-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    blue: 'bg-blue-100 text-blue-600'
  }
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClasses[color]}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Student Attendance Page
function StudentAttendance({ user }: { user: User }) {
  const { toast } = useToast()
  const [todayAttendance, setTodayAttendance] = useState<Attendance | null>(null)
  const [history, setHistory] = useState<Attendance[]>([])
  const [loading, setLoading] = useState(true)
  const [checkingIn, setCheckingIn] = useState(false)
  const [showFaceDialog, setShowFaceDialog] = useState(false)
  const [showFingerprintDialog, setShowFingerprintDialog] = useState(false)

  useEffect(() => {
    fetchAttendanceData()
  }, [])

  const fetchAttendanceData = async () => {
    try {
      const res = await fetch('/api/attendance/history')
      if (res.ok) {
        const data = await res.json()
        setTodayAttendance(data.todayAttendance)
        setHistory(data.history || [])
      }
    } catch (error) {
      console.error('Failed to fetch attendance:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckIn = async (method: string) => {
    setCheckingIn(true)
    try {
      const res = await fetch('/api/attendance/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verificationMethod: method })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Gagal melakukan absensi')
      }
      
      toast({
        title: 'Berhasil',
        description: `Absensi masuk berhasil dicatat`
      })
      
      fetchAttendanceData()
      setShowFaceDialog(false)
      setShowFingerprintDialog(false)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
    } finally {
      setCheckingIn(false)
    }
  }

  const handleCheckOut = async (method: string) => {
    setCheckingIn(true)
    try {
      const res = await fetch('/api/attendance/check-out', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verificationMethod: method })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Gagal melakukan absensi')
      }
      
      toast({
        title: 'Berhasil',
        description: `Absensi keluar berhasil dicatat`
      })
      
      fetchAttendanceData()
      setShowFaceDialog(false)
      setShowFingerprintDialog(false)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
    } finally {
      setCheckingIn(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Memuat...</div>
  }

  const now = new Date()
  const currentTime = now.getHours() * 60 + now.getMinutes()
  const canCheckIn = currentTime >= 6 * 60 && currentTime <= 12 * 60
  const canCheckOut = currentTime >= 12 * 60 && currentTime <= 18 * 60

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Absensi</h2>
      
      {/* Check In/Out Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {!todayAttendance?.timeIn ? (
          <Card className="border-2 border-emerald-200">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <LogIn className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="font-semibold mb-2">Absen Masuk</h3>
              <p className="text-sm text-slate-500 mb-4">
                {canCheckIn ? 'Pilih metode verifikasi' : 'Absen masuk tersedia pukul 06:00 - 12:00'}
              </p>
              <div className="flex gap-2 justify-center">
                <Button 
                  onClick={() => setShowFaceDialog(true)}
                  disabled={!canCheckIn}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Wajah
                </Button>
                <Button 
                  onClick={() => setShowFingerprintDialog(true)}
                  disabled={!canCheckIn}
                  variant="outline"
                >
                  <Fingerprint className="h-4 w-4 mr-2" />
                  Sidik Jari
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2 border-slate-200 bg-slate-50">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="font-semibold mb-2">Sudah Absen Masuk</h3>
              <p className="text-2xl font-bold text-emerald-600">
                {new Date(todayAttendance.timeIn).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </CardContent>
          </Card>
        )}

        {todayAttendance?.timeIn && !todayAttendance?.timeOut ? (
          <Card className="border-2 border-blue-200">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <LogOut className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Absen Keluar</h3>
              <p className="text-sm text-slate-500 mb-4">
                {canCheckOut ? 'Pilih metode verifikasi' : 'Absen keluar tersedia pukul 12:00 - 18:00'}
              </p>
              <div className="flex gap-2 justify-center">
                <Button 
                  onClick={() => handleCheckOut('face')}
                  disabled={!canCheckOut}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Wajah
                </Button>
                <Button 
                  onClick={() => handleCheckOut('fingerprint')}
                  disabled={!canCheckOut}
                  variant="outline"
                >
                  <Fingerprint className="h-4 w-4 mr-2" />
                  Sidik Jari
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : todayAttendance?.timeOut ? (
          <Card className="border-2 border-slate-200 bg-slate-50">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Sudah Absen Keluar</h3>
              <p className="text-2xl font-bold text-blue-600">
                {new Date(todayAttendance.timeOut).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </CardContent>
          </Card>
        ) : null}
      </div>

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Kehadiran</CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <p className="text-center text-slate-500 py-8">Belum ada riwayat kehadiran</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Jam Masuk</TableHead>
                    <TableHead>Jam Keluar</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Verifikasi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.slice(0, 10).map((att) => (
                    <TableRow key={att.id}>
                      <TableCell>
                        {new Date(att.date).toLocaleDateString('id-ID')}
                      </TableCell>
                      <TableCell>
                        {att.timeIn 
                          ? new Date(att.timeIn).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                          : '-'
                        }
                      </TableCell>
                      <TableCell>
                        {att.timeOut 
                          ? new Date(att.timeOut).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                          : '-'
                        }
                      </TableCell>
                      <TableCell>
                        <Badge variant={att.status === 'present' ? 'default' : 
                          att.status === 'late' ? 'secondary' : 'destructive'}>
                          {att.status === 'present' ? 'Hadir' : 
                           att.status === 'late' ? 'Terlambat' : 
                           att.status === 'absent' ? 'Tidak Hadir' : 'Izin'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {att.verificationMethod === 'face' ? 'Wajah' : 
                         att.verificationMethod === 'fingerprint' ? 'Sidik Jari' : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Face Dialog */}
      <Dialog open={showFaceDialog} onOpenChange={setShowFaceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verifikasi Wajah</DialogTitle>
            <DialogDescription>
              Posisikan wajah Anda di depan kamera
            </DialogDescription>
          </DialogHeader>
          <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-slate-500">
              <Camera className="h-12 w-12 mx-auto mb-2" />
              <p>Kamera belum tersedia</p>
              <p className="text-xs">Fitur wajah memerlukan pendaftaran terlebih dahulu</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFaceDialog(false)}>
              Batal
            </Button>
            <Button 
              onClick={() => handleCheckIn('face')} 
              disabled={checkingIn}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {checkingIn ? 'Memproses...' : 'Verifikasi'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Fingerprint Dialog */}
      <Dialog open={showFingerprintDialog} onOpenChange={setShowFingerprintDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verifikasi Sidik Jari</DialogTitle>
            <DialogDescription>
              Sentuh sensor sidik jari
            </DialogDescription>
          </DialogHeader>
          <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-slate-500">
              <Fingerprint className="h-12 w-12 mx-auto mb-2" />
              <p>Sidik jari belum terdaftar</p>
              <p className="text-xs">Daftarkan sidik jari di menu Pengaturan</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFingerprintDialog(false)}>
              Batal
            </Button>
            <Button 
              onClick={() => handleCheckIn('fingerprint')} 
              disabled={checkingIn}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {checkingIn ? 'Memproses...' : 'Verifikasi'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Student Permissions Page
function StudentPermissions({ user }: { user: User }) {
  const { toast } = useToast()
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [formData, setFormData] = useState({
    type: 'permission',
    reason: '',
    startDate: '',
    endDate: ''
  })

  useEffect(() => {
    fetchPermissions()
  }, [])

  const fetchPermissions = async () => {
    try {
      const res = await fetch('/api/permission')
      if (res.ok) {
        const data = await res.json()
        setPermissions(data.permissions || [])
      }
    } catch (error) {
      console.error('Failed to fetch permissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const res = await fetch('/api/permission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengajukan izin')
      }
      
      toast({
        title: 'Berhasil',
        description: 'Pengajuan izin berhasil dikirim'
      })
      
      setShowDialog(false)
      fetchPermissions()
      setFormData({ type: 'permission', reason: '', startDate: '', endDate: '' })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Memuat...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Perizinan</h2>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              Ajukan Izin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajukan Izin</DialogTitle>
              <DialogDescription>
                Isi form berikut untuk mengajukan izin
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Tipe Izin</Label>
                <Select value={formData.type} onValueChange={(v) => setFormData({...formData, type: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="permission">Izin</SelectItem>
                    <SelectItem value="sick">Sakit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tanggal Mulai</Label>
                  <Input 
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tanggal Selesai</Label>
                  <Input 
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Alasan</Label>
                <Textarea 
                  placeholder="Jelaskan alasan izin..."
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  required
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                  Batal
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                  Kirim
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {permissions.length === 0 ? (
            <div className="text-center text-slate-500 py-12">
              <FileText className="h-12 w-12 mx-auto mb-2 text-slate-300" />
              <p>Belum ada pengajuan izin</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Alasan</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissions.map((perm) => (
                  <TableRow key={perm.id}>
                    <TableCell>
                      <Badge variant={perm.type === 'sick' ? 'destructive' : 'secondary'}>
                        {perm.type === 'sick' ? 'Sakit' : 'Izin'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(perm.startDate).toLocaleDateString('id-ID')} - {new Date(perm.endDate).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{perm.reason}</TableCell>
                    <TableCell>
                      <Badge variant={
                        perm.status === 'approved' ? 'default' : 
                        perm.status === 'rejected' ? 'destructive' : 'secondary'
                      }>
                        {perm.status === 'approved' ? 'Disetujui' : 
                         perm.status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Student Announcements Page
function StudentAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/announcements')
      if (res.ok) {
        const data = await res.json()
        setAnnouncements(data.announcements || [])
      }
    } catch (error) {
      console.error('Failed to fetch announcements:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Memuat...</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Pengumuman</h2>
      
      {announcements.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12 text-slate-500">
            <Bell className="h-12 w-12 mx-auto mb-2 text-slate-300" />
            <p>Belum ada pengumuman</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <Card key={announcement.id}>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg">{announcement.title}</h3>
                <p className="text-slate-600 mt-2 whitespace-pre-wrap">{announcement.content}</p>
                <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
                  <span>{announcement.author?.name || 'Admin'}</span>
                  <span>•</span>
                  <span>{new Date(announcement.createdAt).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// Student Messages Page
function StudentMessages({ user }: { user: User }) {
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages')
      if (res.ok) {
        const data = await res.json()
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async () => {
    if (!newMessage.trim()) return

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage, receiverId: 'admin' })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengirim pesan')
      }
      
      toast({
        title: 'Berhasil',
        description: 'Pesan berhasil dikirim'
      })
      
      setShowDialog(false)
      setNewMessage('')
      fetchMessages()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Memuat...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Pesan</h2>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              Pesan Baru
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Kirim Pesan ke Admin</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea 
                placeholder="Tulis pesan Anda..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                rows={5}
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDialog(false)}>
                  Batal
                </Button>
                <Button onClick={handleSend} className="bg-emerald-600 hover:bg-emerald-700">
                  <Send className="h-4 w-4 mr-2" />
                  Kirim
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 text-slate-300" />
              <p>Belum ada pesan</p>
            </div>
          ) : (
            <div className="divide-y max-h-96 overflow-y-auto">
              {messages.map((msg) => (
                <div key={msg.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {msg.sender?.name?.charAt(0) || 'A'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{msg.sender?.name || 'Admin'}</span>
                        <span className="text-xs text-slate-400">
                          {new Date(msg.createdAt).toLocaleString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{msg.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Student Settings Page
function StudentSettings({ user }: { user: User }) {
  const { toast } = useToast()
  const [showFaceSetup, setShowFaceSetup] = useState(false)
  const [showFingerprintSetup, setShowFingerprintSetup] = useState(false)

  const handleRegisterFace = async () => {
    try {
      const res = await fetch('/api/face/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descriptor: [] }) // Placeholder
      })
      
      if (!res.ok) {
        throw new Error('Gagal mendaftarkan wajah')
      }
      
      toast({
        title: 'Berhasil',
        description: 'Wajah berhasil didaftarkan'
      })
      
      setShowFaceSetup(false)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Pengaturan</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Profil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-500">Nama</Label>
              <p className="font-medium">{user.name}</p>
            </div>
            <div>
              <Label className="text-slate-500">Username</Label>
              <p className="font-medium">{user.username}</p>
            </div>
            <div>
              <Label className="text-slate-500">NIS</Label>
              <p className="font-medium">{user.nis || '-'}</p>
            </div>
            <div>
              <Label className="text-slate-500">Kelas</Label>
              <p className="font-medium">{user.class || '-'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Metode Verifikasi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <Camera className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-medium">Verifikasi Wajah</p>
                <p className="text-sm text-slate-500">
                  {user.hasFaceRegistered ? 'Sudah terdaftar' : 'Belum terdaftar'}
                </p>
              </div>
            </div>
            <Button 
              variant={user.hasFaceRegistered ? 'outline' : 'default'}
              onClick={() => setShowFaceSetup(true)}
              className={!user.hasFaceRegistered ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
            >
              {user.hasFaceRegistered ? 'Atur Ulang' : 'Daftarkan'}
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Fingerprint className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Verifikasi Sidik Jari</p>
                <p className="text-sm text-slate-500">
                  {user.hasFingerprintRegistered ? 'Sudah terdaftar' : 'Belum terdaftar'}
                </p>
              </div>
            </div>
            <Button 
              variant={user.hasFingerprintRegistered ? 'outline' : 'default'}
              onClick={() => setShowFingerprintSetup(true)}
              className={!user.hasFingerprintRegistered ? 'bg-blue-600 hover:bg-blue-700' : ''}
            >
              {user.hasFingerprintRegistered ? 'Atur Ulang' : 'Daftarkan'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Face Setup Dialog */}
      <Dialog open={showFaceSetup} onOpenChange={setShowFaceSetup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pendaftaran Wajah</DialogTitle>
            <DialogDescription>
              Posisikan wajah Anda di tengah kamera
            </DialogDescription>
          </DialogHeader>
          <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-slate-500">
              <Camera className="h-12 w-12 mx-auto mb-2" />
              <p>Kamera akan aktif</p>
              <p className="text-xs">Pastikan pencahayaan cukup</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFaceSetup(false)}>
              Batal
            </Button>
            <Button onClick={handleRegisterFace} className="bg-emerald-600 hover:bg-emerald-700">
              Daftarkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Fingerprint Setup Dialog */}
      <Dialog open={showFingerprintSetup} onOpenChange={setShowFingerprintSetup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pendaftaran Sidik Jari</DialogTitle>
            <DialogDescription>
              Ikuti petunjuk untuk mendaftarkan sidik jari
            </DialogDescription>
          </DialogHeader>
          <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-slate-500">
              <Fingerprint className="h-12 w-12 mx-auto mb-2" />
              <p>Siapkan sidik jari Anda</p>
              <p className="text-xs">Sentuh sensor sidik jari beberapa kali</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFingerprintSetup(false)}>
              Batal
            </Button>
            <Button onClick={() => setShowFingerprintSetup(false)} className="bg-blue-600 hover:bg-blue-700">
              Daftarkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Admin Content
function AdminContent({ activeTab, user }: { activeTab: string; user: User }) {
  return (
    <div>
      {activeTab === 'dashboard' && <AdminDashboard />}
      {activeTab === 'students' && <AdminStudents />}
      {activeTab === 'attendance' && <AdminAttendance />}
      {activeTab === 'permissions' && <AdminPermissions />}
      {activeTab === 'announcements' && <AdminAnnouncements />}
    </div>
  )
}

// Admin Dashboard
function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    presentToday: 0,
    absentToday: 0,
    lateToday: 0,
    pendingPermissions: 0
  })
  const [recentAttendances, setRecentAttendances] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/admin/dashboard')
      if (res.ok) {
        const data = await res.json()
        setStats(data.stats)
        setRecentAttendances(data.recentAttendances || [])
      }
    } catch (error) {
      console.error('Failed to fetch dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Memuat...</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard Admin</h2>
      
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">Total Siswa</p>
            <p className="text-2xl font-bold">{stats.totalStudents}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">Hadir Hari Ini</p>
            <p className="text-2xl font-bold text-emerald-600">{stats.presentToday}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">Tidak Hadir</p>
            <p className="text-2xl font-bold text-red-600">{stats.absentToday}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">Terlambat</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.lateToday}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">Izin Pending</p>
            <p className="text-2xl font-bold text-blue-600">{stats.pendingPermissions}</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Attendances */}
      <Card>
        <CardHeader>
          <CardTitle>Absensi Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          {recentAttendances.length === 0 ? (
            <p className="text-center text-slate-500 py-8">Belum ada data absensi hari ini</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Kelas</TableHead>
                    <TableHead>Jam Masuk</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentAttendances.map((att) => (
                    <TableRow key={att.id}>
                      <TableCell>{att.user?.name || '-'}</TableCell>
                      <TableCell>{att.user?.class || '-'}</TableCell>
                      <TableCell>
                        {att.timeIn 
                          ? new Date(att.timeIn).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                          : '-'
                        }
                      </TableCell>
                      <TableCell>
                        <Badge variant={att.status === 'present' ? 'default' : 
                          att.status === 'late' ? 'secondary' : 'destructive'}>
                          {att.status === 'present' ? 'Hadir' : 
                           att.status === 'late' ? 'Terlambat' : 'Tidak Hadir'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Admin Students Page
function AdminStudents() {
  const { toast } = useToast()
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    nis: '',
    class: '',
    role: 'student'
  })

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/admin/students')
      if (res.ok) {
        const data = await res.json()
        setStudents(data.students || [])
      }
    } catch (error) {
      console.error('Failed to fetch students:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingStudent 
        ? `/api/admin/students/${editingStudent.id}`
        : '/api/admin/students'
      
      const body = editingStudent 
        ? { ...formData, password: formData.password || undefined }
        : formData
      
      const res = await fetch(url, {
        method: editingStudent ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menyimpan data')
      }
      
      toast({
        title: 'Berhasil',
        description: editingStudent ? 'Data siswa berhasil diupdate' : 'Siswa berhasil ditambahkan'
      })
      
      setShowDialog(false)
      setEditingStudent(null)
      setFormData({ name: '', username: '', password: '', nis: '', class: '', role: 'student' })
      fetchStudents()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/students/${id}`, { method: 'DELETE' })
      
      if (!res.ok) {
        throw new Error('Gagal menghapus siswa')
      }
      
      toast({
        title: 'Berhasil',
        description: 'Siswa berhasil dihapus'
      })
      
      fetchStudents()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  const openEditDialog = (student: Student) => {
    setEditingStudent(student)
    setFormData({
      name: student.name,
      username: student.username,
      password: '',
      nis: student.nis || '',
      class: student.class || '',
      role: student.role
    })
    setShowDialog(true)
  }

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.nis?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return <div className="flex items-center justify-center h-64">Memuat...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Data Siswa</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Cari siswa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full sm:w-64"
            />
          </div>
          <Dialog open={showDialog} onOpenChange={(open) => {
            setShowDialog(open)
            if (!open) {
              setEditingStudent(null)
              setFormData({ name: '', username: '', password: '', nis: '', class: '', role: 'student' })
            }
          }}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-2" />
                Tambah
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingStudent ? 'Edit Siswa' : 'Tambah Siswa Baru'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Nama Lengkap</Label>
                  <Input 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input 
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Password {editingStudent && '(kosongkan jika tidak diubah)'}</Label>
                  <Input 
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required={!editingStudent}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>NIS</Label>
                    <Input 
                      value={formData.nis}
                      onChange={(e) => setFormData({...formData, nis: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Kelas</Label>
                    <Input 
                      value={formData.class}
                      onChange={(e) => setFormData({...formData, class: e.target.value})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                    Batal
                  </Button>
                  <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                    Simpan
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>NIS</TableHead>
                <TableHead>Kelas</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Verifikasi</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-slate-500">@{student.username}</p>
                    </div>
                  </TableCell>
                  <TableCell>{student.nis || '-'}</TableCell>
                  <TableCell>{student.class || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={student.isActive ? 'default' : 'secondary'}>
                      {student.isActive ? 'Aktif' : 'Tidak Aktif'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {student.hasFaceRegistered && (
                        <Badge variant="outline" className="text-xs">Wajah</Badge>
                      )}
                      {student.hasFingerprintRegistered && (
                        <Badge variant="outline" className="text-xs">Sidik Jari</Badge>
                      )}
                      {!student.hasFaceRegistered && !student.hasFingerprintRegistered && '-'}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(student)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Hapus Siswa?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Data siswa akan dihapus permanen.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(student.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

// Admin Attendance Page
function AdminAttendance() {
  const [attendances, setAttendances] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    fetchAttendances()
  }, [dateFilter])

  const fetchAttendances = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/attendance?date=${dateFilter}`)
      if (res.ok) {
        const data = await res.json()
        setAttendances(data.attendances || [])
      }
    } catch (error) {
      console.error('Failed to fetch attendances:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Kehadiran Siswa</h2>
        <div className="flex gap-2">
          <Input 
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-auto"
          />
          <Button variant="outline" onClick={() => fetchAttendances()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-8">Memuat...</div>
          ) : attendances.length === 0 ? (
            <div className="text-center py-8 text-slate-500">Tidak ada data kehadiran</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Jam Masuk</TableHead>
                  <TableHead>Jam Keluar</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendances.map((att) => (
                  <TableRow key={att.id}>
                    <TableCell>{att.user?.name || '-'}</TableCell>
                    <TableCell>{att.user?.class || '-'}</TableCell>
                    <TableCell>
                      {att.timeIn 
                        ? new Date(att.timeIn).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                        : '-'
                      }
                    </TableCell>
                    <TableCell>
                      {att.timeOut 
                        ? new Date(att.timeOut).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                        : '-'
                      }
                    </TableCell>
                    <TableCell>
                      <Badge variant={att.status === 'present' ? 'default' : 
                        att.status === 'late' ? 'secondary' : 'destructive'}>
                        {att.status === 'present' ? 'Hadir' : 
                         att.status === 'late' ? 'Terlambat' : 
                         att.status === 'absent' ? 'Tidak Hadir' : 'Izin'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Admin Permissions Page
function AdminPermissions() {
  const { toast } = useToast()
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchPermissions()
  }, [filter])

  const fetchPermissions = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/permissions?status=${filter}`)
      if (res.ok) {
        const data = await res.json()
        setPermissions(data.permissions || [])
      }
    } catch (error) {
      console.error('Failed to fetch permissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReview = async (id: string, status: 'approved' | 'rejected', notes?: string) => {
    try {
      const res = await fetch(`/api/admin/permissions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, reviewNotes: notes })
      })
      
      if (!res.ok) {
        throw new Error('Gagal memperbarui status')
      }
      
      toast({
        title: 'Berhasil',
        description: `Permohonan izin berhasil ${status === 'approved' ? 'disetujui' : 'ditolak'}`
      })
      
      fetchPermissions()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Perizinan</h2>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value="pending">Menunggu</SelectItem>
            <SelectItem value="approved">Disetujui</SelectItem>
            <SelectItem value="rejected">Ditolak</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">Memuat...</div>
        ) : permissions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12 text-slate-500">
              Tidak ada data perizinan
            </CardContent>
          </Card>
        ) : (
          permissions.map((perm) => (
            <Card key={perm.id}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={perm.type === 'sick' ? 'destructive' : 'secondary'}>
                        {perm.type === 'sick' ? 'Sakit' : 'Izin'}
                      </Badge>
                      <Badge variant={
                        perm.status === 'approved' ? 'default' : 
                        perm.status === 'rejected' ? 'destructive' : 'outline'
                      }>
                        {perm.status === 'approved' ? 'Disetujui' : 
                         perm.status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                      </Badge>
                    </div>
                    <h3 className="font-semibold">{perm.user?.name}</h3>
                    <p className="text-sm text-slate-500">Kelas: {perm.user?.class || '-'}</p>
                    <p className="text-sm text-slate-500 mt-1">
                      {new Date(perm.startDate).toLocaleDateString('id-ID')} - {new Date(perm.endDate).toLocaleDateString('id-ID')}
                    </p>
                    <p className="mt-2">{perm.reason}</p>
                    {perm.reviewNotes && (
                      <p className="mt-2 text-sm text-slate-500">
                        <span className="font-medium">Catatan:</span> {perm.reviewNotes}
                      </p>
                    )}
                  </div>
                  {perm.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleReview(perm.id, 'approved')}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Setujui
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={() => handleReview(perm.id, 'rejected')}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Tolak
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

// Admin Announcements Page
function AdminAnnouncements() {
  const { toast } = useToast()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ title: '', content: '' })

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/admin/announcements')
      if (res.ok) {
        const data = await res.json()
        setAnnouncements(data.announcements || [])
      }
    } catch (error) {
      console.error('Failed to fetch announcements:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingId 
        ? `/api/admin/announcements/${editingId}`
        : '/api/admin/announcements'
      
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (!res.ok) {
        throw new Error('Gagal menyimpan pengumuman')
      }
      
      toast({
        title: 'Berhasil',
        description: editingId ? 'Pengumuman berhasil diupdate' : 'Pengumuman berhasil dibuat'
      })
      
      setShowDialog(false)
      setEditingId(null)
      setFormData({ title: '', content: '' })
      fetchAnnouncements()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/announcements/${id}`, { method: 'DELETE' })
      
      if (!res.ok) {
        throw new Error('Gagal menghapus pengumuman')
      }
      
      toast({
        title: 'Berhasil',
        description: 'Pengumuman berhasil dihapus'
      })
      
      fetchAnnouncements()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  const openEditDialog = (announcement: Announcement) => {
    setEditingId(announcement.id)
    setFormData({ title: announcement.title, content: announcement.content })
    setShowDialog(true)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Memuat...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Pengumuman</h2>
        <Dialog open={showDialog} onOpenChange={(open) => {
          setShowDialog(open)
          if (!open) {
            setEditingId(null)
            setFormData({ title: '', content: '' })
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              Buat Pengumuman
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Pengumuman' : 'Buat Pengumuman Baru'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Judul</Label>
                <Input 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Isi Pengumuman</Label>
                <Textarea 
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  rows={5}
                  required
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                  Batal
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                  Simpan
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {announcements.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12 text-slate-500">
              Belum ada pengumuman
            </CardContent>
          </Card>
        ) : (
          announcements.map((announcement) => (
            <Card key={announcement.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{announcement.title}</h3>
                    <p className="text-slate-600 mt-2 whitespace-pre-wrap">{announcement.content}</p>
                    <p className="text-sm text-slate-400 mt-2">
                      {new Date(announcement.createdAt).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(announcement)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Hapus Pengumuman?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(announcement.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
