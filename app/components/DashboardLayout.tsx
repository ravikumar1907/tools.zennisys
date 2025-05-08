import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';
import { Home, Zap, CreditCard, FileText, User, LogOut } from 'lucide-react';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [trialDaysLeft, setTrialDaysLeft] = useState<number | null>(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [usageData, setUsageData] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        router.push('/login');
        return;
      }

      const user = session.user;
      setUser(user);

      const { data: profileData } = await supabase
        .from('profiles')
        .select('trial_start, trial_active')
        .eq('id', user.id)
        .single();

      if (profileData?.trial_start) {
        const startDate = new Date(profileData.trial_start);
        const today = new Date();
        const daysPassed = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const daysLeft = Math.max(0, 7 - daysPassed);
        setTrialDaysLeft(daysLeft);
      }

      setProfile(profileData);
    };

    const fetchUsage = async () => {
      const { data, error } = await supabase.rpc('get_usage_summary');
      if (data && Array.isArray(data)) {
        setUsageData(data);
      } else {
        console.error('Usage fetch error:', error);
      }
    };

    fetchUser();
    fetchUsage();
  }, [router]);

  const getInitials = (email: string) => {
    return email?.charAt(0)?.toUpperCase() || '?';
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleUpgrade = () => {
    router.push('/subscribe');
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await supabase.functions.invoke('generate-description', {
        body: {
          title: 'Running Shoes',
          feature: 'Soft Sole'
        }
      });

      const generated = res?.data?.description || 'Failed to generate description.';
      setDescription(generated);
    } catch (error) {
      console.error('Error generating description:', error);
      setDescription('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-emerald-600">CopyNet</h2>
        </div>
        <nav className="px-6 space-y-4 text-sm font-medium">
          <a href="/dashboard" className="flex items-center gap-2 text-gray-700 hover:text-emerald-600">
            <Home className="w-4 h-4" /> Dashboard
          </a>
          <a href="/features/generate" className="flex items-center gap-2 text-gray-700 hover:text-emerald-600">
            <Zap className="w-4 h-4" /> Generate Description
          </a>
          <a href="#subscription" className="flex items-center gap-2 text-gray-700 hover:text-emerald-600">
            <CreditCard className="w-4 h-4" /> Plan & Profile
          </a>
          <button onClick={handleLogout} className="flex items-center gap-2 w-full text-left text-gray-700 hover:text-emerald-600">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </nav>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex justify-end items-center p-6 bg-white shadow">
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">{user?.email}</p>
              {profile?.trial_active && trialDaysLeft !== null && (
                <p className="text-xs text-green-600">Trial Plan: {trialDaysLeft} days left</p>
              )}
            </div>
            <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center">
              {getInitials(user?.email)}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome, {user?.email?.split('@')[0]}</h1>
          {/* Summary stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded shadow p-4">
              <p className="text-sm text-gray-500">Descriptions Generated</p>
              <p className="text-xl font-semibold text-gray-800">
                {usageData.reduce((sum, d) => sum + d.usage_count, 0)}
              </p>
            </div>
            <div className="bg-white rounded shadow p-4">
              <p className="text-sm text-gray-500">Descriptions Available</p>
              <p className="text-xl font-semibold text-gray-800">
                {(profile?.trial_active ? 10 : 100) - usageData.reduce((sum, d) => sum + d.usage_count, 0)}
              </p>
            </div>
            <div className="bg-white rounded shadow p-4">
              <p className="text-sm text-gray-500">Plan</p>
              <p className="text-xl font-semibold text-gray-800">
                {profile?.trial_active ? 'Trial' : 'Premium'}
              </p>
            </div>
          </div>

          {/* Usage Chart with Date Labels */}
          <div className="bg-white rounded shadow p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Usage Overview (Last 5 Days)</h3>
            <div className="w-full h-48">
              <div className="flex h-full items-end space-x-2">
                {Array.isArray(usageData) && usageData.length > 0 ? (
                  usageData.map((entry: any, idx: number) => (
                    <div key={idx} className="flex flex-col items-center flex-1">
                      <div
                        className="bg-emerald-500 w-6 rounded-t"
                        style={{ height: `${entry.usage_count * 10}px` }}
                        title={`${entry.usage_count} generated`}
                      />
                      <span className="text-xs mt-2 text-gray-500">
                        {new Date(entry.usage_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No usage data available</p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
