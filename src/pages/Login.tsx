import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Shield, User } from 'lucide-react';

const roleConfig: Record<UserRole, { icon: typeof Building2; label: string; description: string }> = {
  client: {
    icon: Building2,
    label: 'Client',
    description: 'Post job offers and find talented professionals',
  },
  admin: {
    icon: Shield,
    label: 'Admin',
    description: 'Manage talent pool and validate job offers',
  },
  talent: {
    icon: User,
    label: 'Talent',
    description: 'Showcase your skills and find opportunities',
  },
};

export default function Login() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('client');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password, selectedRole);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-2xl">K</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">KothonTech</h1>
            <p className="text-sm text-muted-foreground">Talent Platform</p>
          </div>
        </div>

        <Card className="enterprise-card-elevated">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription>Sign in to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Role Selection */}
            <Tabs value={selectedRole} onValueChange={(v) => setSelectedRole(v as UserRole)} className="mb-6">
              <TabsList className="grid grid-cols-3 w-full">
                {(['client', 'admin', 'talent'] as UserRole[]).map((role) => {
                  const config = roleConfig[role];
                  return (
                    <TabsTrigger key={role} value={role} className="flex items-center gap-2">
                      <config.icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{config.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
              {(['client', 'admin', 'talent'] as UserRole[]).map((role) => {
                const config = roleConfig[role];
                return (
                  <TabsContent key={role} value={role} className="mt-4">
                    <p className="text-sm text-center text-muted-foreground">
                      {config.description}
                    </p>
                  </TabsContent>
                );
              })}
            </Tabs>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Demo Note */}
            <div className="mt-6 p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-center text-muted-foreground">
                <strong>Demo Mode:</strong> Enter any email and password to log in as the selected role.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
