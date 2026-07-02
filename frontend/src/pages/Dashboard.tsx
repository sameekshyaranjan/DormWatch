import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  FiFileText,
  FiShield,
  FiAlertTriangle,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiPlus,
  FiArrowRight,
  FiList,
  FiTrendingUp,
  FiActivity
} from 'react-icons/fi';
import UpvoteButton from '../components/UpvoteButton';
import { 
  ScrollReveal, 
  StaggerReveal, 
  FadeIn,
  ScaleIn 
} from '../components/ParallaxEffect';

interface Accommodation {
  _id: string;
  name: string;
  location: string;
  trustScore: number;
  type?: string;
}

interface Report {
  _id: string;
  accommodationName: string;
  issueType: string;
  description: string;
  createdAt: string;
  upvotes: number;
  upvotedBy: string[];
  user: string | { _id: string };
}

export const Dashboard: React.FC = () => {
  const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const { user, token } = useAuth();
  
  const [reports, setReports] = useState<Report[]>([]);
  const [myReports, setMyReports] = useState<Report[]>([]);
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string>('');

  useEffect(() => {
    if (!token) {
      setCurrentUserId('');
      return;
    }
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setCurrentUserId(payload.user?._id || payload.user?.id || payload.id || payload.userId || '');
    } catch {
      setCurrentUserId('');
    }
  }, [token]);

  const fetchMyReports = async () => {
    if (!token) return;
    
    try {
      const res = await fetch(`${API}/api/reports/my-reports?page=1&limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setMyReports(data.reports || []);
      }
    } catch (err) {
      console.error('Error fetching my reports:', err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const reportsRes = await fetch(`${API}/api/reports`);
      const reportsData = await reportsRes.json();
      
      const accommodationsRes = await fetch(`${API}/api/accommodations`);
      const accommodationsData = await accommodationsRes.json();
      
      if (reportsData.success) {
        setReports(reportsData.data || []);
      }
      
      if (accommodationsData.success) {
        setAccommodations(accommodationsData.data || []);
      } else if (Array.isArray(accommodationsData)) {
        setAccommodations(accommodationsData);
      }
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [API]);

  useEffect(() => {
    if (token) {
      fetchMyReports();
    }
  }, [token]);

  const totalAccommodations = accommodations.length;
  
  const highRiskCount = accommodations.filter(acc => {
    const score = acc.trustScore ?? 100;
    return score < 50;
  }).length;
  
  const riskyCount = accommodations.filter(acc => {
    const score = acc.trustScore ?? 100;
    return score >= 50 && score < 80;
  }).length;
  
  const safeCount = accommodations.filter(acc => {
    const score = acc.trustScore ?? 100;
    return score >= 80;
  }).length;
  
  const userImpactCount = myReports.length;

  const safetyAlerts = accommodations
    .filter(acc => {
      const score = acc.trustScore ?? 100;
      return score < 80;
    })
    .sort((a, b) => (a.trustScore ?? 100) - (b.trustScore ?? 100))
    .slice(0, 5);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center animate-fadeInUp">
        <div className="relative mb-4">
          <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping"></div>
          <div className="absolute inset-2 rounded-full bg-blue-500/10 animate-pulse"></div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 relative z-10"></div>
        </div>
        <p className="text-gray-600 font-medium">Loading your safety dashboard...</p>
        <p className="text-gray-400 text-sm mt-1">Fetching latest data</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <ScaleIn scale={0.9}>
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <FiAlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{error}</h2>
          <p className="text-gray-600 mb-6">We couldn't load your dashboard data. Please check your connection and try again.</p>
          <button 
            onClick={() => {
              fetchData();
              if (token) fetchMyReports();
            }}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 active:scale-95 transition-all duration-200 shadow-lg shadow-blue-200 hover:shadow-xl"
          >
            Try Again
          </button>
        </div>
      </ScaleIn>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Header Section */}
      <div className="bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900 via-slate-900 to-slate-900 text-white pt-16 pb-28 border-b border-white/10 relative overflow-hidden">
        {/* Subtle grid in header */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <ScrollReveal delay={0} distance={30}>
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-2xl font-bold shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:scale-105 transition-transform duration-300 ring-2 ring-white/20">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">Welcome back, {user?.name}! 👋</h1>
                  <p className="text-blue-200 font-medium flex items-center gap-2">
                    <FiCheckCircle className="text-emerald-400" />
                    {userImpactCount > 0 
                      ? `You've filed ${userImpactCount} safety report${userImpactCount > 1 ? 's' : ''}`
                      : 'Start contributing to student safety'
                    }
                  </p>
                </div>
              </div>
            </ScrollReveal>
            
            <FadeIn delay={100}>
              <Link
                to="/report"
                className="flex items-center gap-2 px-7 py-3.5 bg-white text-blue-900 font-bold rounded-xl hover:bg-blue-50 active:scale-95 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                <FiPlus className="h-5 w-5" />
                Report an Issue
              </Link>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Stats Cards - Overlapping the header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <StaggerReveal stagger={100} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Accommodations */}
          <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 group hover:border-blue-200 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 ease-out">
            <div className="flex items-center justify-between mb-5">
              <div className="p-3.5 bg-blue-50/80 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <FiShield className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">Total</span>
            </div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Accommodations</p>
            <p className="text-3xl font-extrabold text-slate-900 transition-colors duration-300">{totalAccommodations}</p>
          </div>
          
          {/* High Risk (Unsafe) */}
          <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 group hover:border-red-200 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 ease-out">
            <div className="flex items-center justify-between mb-5">
              <div className="p-3.5 bg-red-50/80 rounded-2xl text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                <FiAlertTriangle className="h-6 w-6" />
              </div>
              {highRiskCount > 0 ? (
                <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse ring-1 ring-red-100">Urgent</span>
              ) : (
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">All Clear</span>
              )}
            </div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">High Risk (&lt;50)</p>
            <p className={`text-3xl font-extrabold transition-colors duration-300 ${highRiskCount > 0 ? 'text-red-600' : 'text-slate-900'}`}>
              {highRiskCount}
            </p>
          </div>

          {/* Caution */}
          <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 group hover:border-yellow-200 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 ease-out">
            <div className="flex items-center justify-between mb-5">
              <div className="p-3.5 bg-yellow-50/80 rounded-2xl text-yellow-600 group-hover:bg-yellow-600 group-hover:text-white transition-all duration-300">
                <FiAlertCircle className="h-6 w-6" />
              </div>
              {riskyCount > 0 ? (
                <span className="text-[10px] font-bold text-yellow-600 bg-yellow-50 px-2.5 py-1 rounded-full uppercase tracking-wider">Caution</span>
              ) : (
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">None</span>
              )}
            </div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Caution (50-79)</p>
            <p className={`text-3xl font-extrabold transition-colors duration-300 ${riskyCount > 0 ? 'text-yellow-600' : 'text-slate-900'}`}>
              {riskyCount}
            </p>
          </div>

          {/* Safe */}
          <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 group hover:border-emerald-200 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 ease-out">
            <div className="flex items-center justify-between mb-5">
              <div className="p-3.5 bg-emerald-50/80 rounded-2xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                <FiCheckCircle className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">Safe</span>
            </div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Safe (80+)</p>
            <p className="text-3xl font-extrabold text-emerald-600 transition-colors duration-300">{safeCount}</p>
          </div>
        </StaggerReveal>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Quick Actions & Activity */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Quick Navigation Card */}
            <ScrollReveal delay={0} distance={20}>
              <Link 
                to="/my-reports" 
                className="flex items-center gap-5 p-6 sm:p-8 bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-blue-200 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 active:scale-[0.99] transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <FiList className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 mb-1">My Safety Contributions</h3>
                  <p className="text-sm font-medium text-slate-500">
                    {userImpactCount > 0 
                      ? `You have ${userImpactCount} report${userImpactCount > 1 ? 's' : ''} - track their status`
                      : 'Track your reported issues and their status'
                    }
                  </p>
                </div>
                <FiArrowRight className="ml-auto text-slate-300 w-6 h-6 group-hover:text-blue-500 group-hover:translate-x-1.5 transition-all duration-300" />
              </Link>
            </ScrollReveal>

            {/* Recent Activity Feed */}
            <ScrollReveal delay={100} distance={30}>
              <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                <div className="p-6 sm:p-8 border-b border-slate-50 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                      <FiActivity className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900">Recent Safety Reports</h2>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider hidden sm:inline-block">
                      {reports.length} total
                    </span>
                  </div>
                  <Link 
                    to="/accommodations" 
                    className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:gap-2 transition-all duration-200"
                  >
                    View All <FiArrowRight className="h-3 w-3" />
                  </Link>
                </div>
                <div className="divide-y divide-gray-50">
                  {reports.length === 0 ? (
                    <ScaleIn delay={0} scale={0.95}>
                      <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FiFileText className="h-8 w-8 text-gray-300 animate-bounce" />
                        </div>
                        <p className="text-gray-500 font-medium">No reports filed yet. Be the first to help!</p>
                        <Link 
                          to="/report" 
                          className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 hover:shadow-lg active:scale-95 transition-all duration-200"
                        >
                          <FiPlus /> Report an Issue
                        </Link>
                      </div>
                    </ScaleIn>
                  ) : (
                    <StaggerReveal stagger={50}>
                      {reports.slice(0, 5).map((report) => (
                        <div 
                          key={report._id} 
                          className="p-6 hover:bg-gray-50 transition-all duration-300 border-l-4 border-l-transparent hover:border-l-blue-500"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-bold text-gray-900 text-lg hover:text-blue-600 transition-colors duration-200">{report.accommodationName}</h3>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-full border border-red-100 hover:bg-red-100 transition-colors duration-200">
                                  {report.issueType}
                                </span>
                                <span className="flex items-center gap-1 text-xs text-gray-400">
                                  <FiClock className="h-3 w-3" />
                                  {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'Today'}
                                </span>
                              </div>
                            </div>
                            {currentUserId && (
                              <UpvoteButton
                                reportId={report._id}
                                initialUpvotes={report.upvotes || 0}
                                initialHasUpvoted={(report.upvotedBy || []).includes(currentUserId)}
                                isOwnReport={
                                  (typeof report.user === 'string' ? report.user : report.user?._id) === currentUserId
                                }
                              />
                            )}
                          </div>
                          <p className="text-gray-600 text-sm line-clamp-2 mt-3">{report.description}</p>
                        </div>
                      ))}
                    </StaggerReveal>
                  )}
                </div>
                {reports.length > 5 && (
                  <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                    <Link 
                      to="/accommodations" 
                      className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline transition-all duration-200"
                    >
                      View All {reports.length} Reports →
                    </Link>
                  </div>
                )}
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Alerts & Tips */}
          <div className="space-y-8">
            {/* Safety Alerts */}
            <ScrollReveal delay={200} distance={30}>
              <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                <div className={`p-6 sm:p-8 text-white flex items-center justify-between transition-colors duration-300 ${
                  safetyAlerts.length > 0 ? 'bg-red-500' : 'bg-emerald-500'
                }`}>
                  <div className="flex items-center gap-3">
                    {safetyAlerts.length > 0 ? (
                      <FiAlertTriangle className="h-6 w-6 animate-pulse" />
                    ) : (
                      <FiCheckCircle className="h-6 w-6" />
                    )}
                    <h2 className="text-xl font-extrabold tracking-tight">
                      {safetyAlerts.length > 0 ? 'Properties Need Attention' : 'All Properties Safe!'}
                    </h2>
                  </div>
                  {safetyAlerts.length > 0 && (
                    <span className="text-[10px] bg-white/20 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider animate-pulse border border-white/20">
                      {safetyAlerts.length}
                    </span>
                  )}
                </div>
                <div className="p-3 divide-y divide-slate-50">
                  {safetyAlerts.length > 0 ? (
                    <StaggerReveal stagger={75}>
                      {safetyAlerts.map((accommodation) => {
                        const score = accommodation.trustScore ?? 100;
                        const isUnsafe = score < 50;
                        
                        return (
                          <Link 
                            to={`/accommodations/${accommodation._id}`} 
                            key={accommodation._id} 
                            className={`flex items-center gap-4 p-4 transition-all duration-300 rounded-xl group hover:-translate-y-0.5 ${
                              isUnsafe ? 'hover:bg-red-50' : 'hover:bg-yellow-50'
                            }`}
                          >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${
                              isUnsafe 
                                ? 'bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white' 
                                : 'bg-yellow-100 text-yellow-600 group-hover:bg-yellow-600 group-hover:text-white'
                            }`}>
                              <FiTrendingUp className="h-6 w-6" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-bold text-gray-900 truncate group-hover:text-gray-700 transition-colors duration-200">{accommodation.name}</h3>
                              <p className="text-xs text-gray-500 truncate">{accommodation.location}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="h-1.5 flex-grow bg-gray-100 rounded-full overflow-hidden max-w-[100px]">
                                  <div 
                                    className={`h-full transition-all duration-500 ${isUnsafe ? 'bg-red-500' : 'bg-yellow-500'}`}
                                    style={{ width: `${score}%` }}
                                  ></div>
                                </div>
                                <span className={`text-[10px] font-bold whitespace-nowrap transition-colors duration-200 ${
                                  isUnsafe ? 'text-red-600' : 'text-yellow-600'
                                }`}>
                                  Score: {score}
                                </span>
                              </div>
                            </div>
                            <FiArrowRight className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all duration-300" />
                          </Link>
                        );
                      })}
                    </StaggerReveal>
                  ) : (
                    <ScaleIn delay={0} scale={0.95}>
                      <div className="p-8 text-center">
                        <FiCheckCircle className="h-10 w-10 text-green-500 mx-auto mb-2" />
                        <p className="text-gray-600 font-medium">All accommodations have good safety ratings!</p>
                        <p className="text-xs text-gray-400 mt-1">Trust scores are 80 or above</p>
                      </div>
                    </ScaleIn>
                  )}
                </div>
              </div>
            </ScrollReveal>

            {/* Safety Tips Card */}
            <ScaleIn delay={300} scale={0.95}>
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
                <FiShield className="h-12 w-12 text-blue-200/40 mb-4" />
                <h3 className="text-xl font-bold mb-2">Safety Pro Tip</h3>
                <p className="text-blue-100 text-sm leading-relaxed mb-6">
                  Always check the water quality and electrical wiring before moving into a new PG. If you spot an issue, report it here to help others.
                </p>
                <Link 
                  to="/report" 
                  className="inline-flex items-center text-sm font-bold text-yellow-400 hover:text-yellow-300 hover:gap-2 transition-all duration-200"
                >
                  File a Report <FiArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </ScaleIn>

            {/* Your Impact Card */}
            <ScrollReveal delay={400} distance={30}>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiActivity className="text-blue-600" /> Your Impact
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <span className="text-sm text-gray-600">Reports Filed</span>
                    <span className="font-bold text-gray-900">{userImpactCount}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <span className="text-sm text-gray-600">Total Platform Reports</span>
                    <span className="font-bold text-blue-600">{reports.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <span className="text-sm text-gray-600">Safe Properties</span>
                    <span className="font-bold text-green-600">{safeCount} / {totalAccommodations}</span>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Your Status</span>
                      <span className={`font-bold px-3 py-1 rounded-full text-xs transition-all duration-300 hover:scale-105 ${
                        userImpactCount >= 5 
                          ? 'bg-yellow-100 text-yellow-700' 
                          : userImpactCount >= 2 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-gray-100 text-gray-700'
                      }`}>
                        {userImpactCount >= 5 ? '🏆 Champion' : userImpactCount >= 2 ? '⭐ Contributor' : '🌱 Getting Started'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </div>
  );
};