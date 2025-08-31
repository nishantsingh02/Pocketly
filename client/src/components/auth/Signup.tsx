import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { AuthResponse } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/utils/axios';
import { GoogleLogin } from '@react-oauth/google';
import { Loader2, Shield, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post<AuthResponse>('/auth/register', { name, email, password });

      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      toast.success('Account created successfully!');

      // Automatically log in the user after sucessful signup
      await login(email, password);

      navigate('/dashboard');
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to create account';
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4">
      {/* Back to Landing Page Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="absolute top-6 left-6"
      >
        <Link to="/">
          <Button
            variant="ghost"
            className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="w-full rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md transition-all">
          <CardHeader className="space-y-4 text-center">
            {/* PocketGuard Logo */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex justify-center"
            >
              <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                PocketGuard
              </h1>
              <CardTitle className="text-2xl font-extrabold text-center bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mt-2">
                Create an Account
              </CardTitle>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <CardDescription className="text-center text-slate-600 dark:text-slate-400">
                Join PocketGuard to start your financial journey
              </CardDescription>
            </motion.div>
          </CardHeader>
          
          <CardContent>
            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  disabled={isLoading}
                  className="rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  disabled={isLoading}
                  className="rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  className="rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full rounded-lg font-semibold py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </Button>
            </motion.form>
          </CardContent>
          
          <CardFooter className="flex justify-center mt-2">
            <motion.p 
              className="text-sm text-slate-600 dark:text-slate-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              Already have an account?{' '}
              <Link
                to="/signin"
                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </motion.p>
          </CardFooter>
          
          <motion.div 
            className="flex flex-col items-center pb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                if (credentialResponse.credential) {
                  setIsLoading(true);
                  try {
                    await loginWithGoogle(credentialResponse.credential);
                    toast.success('Signed up with Google');
                    navigate('/dashboard');
                  } catch {
                    toast.error('Google sign-up failed');
                  } finally {
                    setIsLoading(false);
                  }
                }
              }}
              onError={() => toast.error('Google sign-up failed')}
              width="250px"
              size="large"
              shape="pill"
              text='signup_with'
            />
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
};

