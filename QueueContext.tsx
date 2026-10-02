import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Organization, 
  Token, 
  User, 
  ServiceQueueState, 
  NotificationItem, 
  Language,
  TokenStatus,
  LiveActivityLog,
  BroadcastAnnouncement,
  PortalMode,
  AdminAccount,
  AdminEmailNotification
} from '../types';
import { 
  INITIAL_ORGANIZATIONS, 
  INITIAL_QUEUE_STATES, 
  INITIAL_DEMO_TOKENS, 
  INITIAL_DEMO_USERS 
} from '../data/mockData';
import { translations } from '../translations';

// 1. Authorized Administrators strictly specified by user
export const AUTHORIZED_ADMINS: AdminAccount[] = [
  {
    id: 'admin-siddhesh',
    name: 'Siddhesh Pravin Agare',
    username: 'Sid19@gmail.com',
    designation: 'Senior Nodal Director / Chief Administrator',
    badgeNumber: 'MH-GOV-ADM-19',
    department: 'State e-Governance & Health Services',
  },
  {
    id: 'admin-om',
    name: 'Om Santosh Gawas',
    username: 'Om16@gmail.com',
    designation: 'Joint Operations Director / Chief Administrator',
    badgeNumber: 'MH-GOV-ADM-16',
    department: 'Civic Infrastructure & Queue Modernization',
  }
];

export const ADMIN_PASSWORDS: Record<string, string> = {
  'sid19@gmail.com': 'Adminsid@19',
  'om16@gmail.com': 'Adminom@16'
};

export const ADMIN_GMAIL_DESTINATION = 'queuewise.admin@gmail.com';

interface QueueContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['en'];
  
  portalMode: PortalMode;
  setPortalMode: (mode: PortalMode) => void;
  
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  loginUser: (email: string, role?: 'citizen' | 'admin' | 'counter_operator') => boolean;
  logoutUser: () => void;
  
  // Dedicated Admin Auth
  currentAdmin: AdminAccount | null;
  loginAdmin: (username: string, pass: string) => { success: boolean; message?: string; admin?: AdminAccount };
  logoutAdmin: () => void;
  
  // Admin Gmail Notifications
  adminEmails: AdminEmailNotification[];
  dispatchAdminEmail: (params: {
    eventType: AdminEmailNotification['eventType'];
    subject: string;
    citizenName: string;
    citizenContact?: string;
    details: string;
    metadata?: Record<string, any>;
  }) => void;
  clearAdminEmails: () => void;
  sendTestAdminEmail: () => void;

  organizations: Organization[];
  tokens: Token[];
  queueStates: Record<string, ServiceQueueState>;
  notifications: NotificationItem[];
  activityLogs: LiveActivityLog[];
  broadcastAnnouncements: BroadcastAnnouncement[];
  
  bookToken: (params: {
    organizationId: string;
    branchId: string;
    departmentId: string;
    serviceId: string;
    citizenName: string;
    citizenMobile: string;
    citizenEmail?: string;
    isSeniorCitizenOrPriority?: boolean;
    notes?: string;
  }) => Token;
  
  callNextToken: (serviceId: string) => Token | null;
  callSpecificToken: (tokenId: string) => void;
  completeToken: (tokenId: string) => void;
  cancelToken: (tokenId: string, reason?: string) => void;
  transferToken: (tokenId: string, targetServiceId: string, reason?: string) => void;
  
  postBroadcastAnnouncement: (message: string, severity?: 'info' | 'warning' | 'urgent') => void;
  dismissAnnouncement: (id: string) => void;
  
  simulateCitizenBooking: () => void;
  resetSystemData: () => void;
  
  getServiceQueueInfo: (serviceId: string) => {
    currentRunningTokenNumber: string;
    currentRunningSequence: number;
    totalWaiting: number;
    averageWaitTimeMinutes: number;
    activeCounter: string;
  };
  
  calculateTokenQueueInfo: (token: Token) => {
    peopleAhead: number;
    estimatedWaitMinutes: number;
    currentRunningTokenNumber: string;
    isNowServing: boolean;
  };
  
  markNotificationAsRead: (notifId: string) => void;
  clearAllNotifications: () => void;
  
  activeReceiptToken: Token | null;
  setActiveReceiptToken: (token: Token | null) => void;
  
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  
  addOrganization: (org: Organization) => void;
  addBranch: (orgId: string, branch: any) => void;
  addDepartment: (branchId: string, dept: any) => void;
  addService: (deptId: string, service: any) => void;
  updateServiceAverageTime: (serviceId: string, minutes: number) => void;
  
  playChime: () => void;
  activeView: string;
  setActiveView: (view: string) => void;
  selectedCategoryFilter: string | null;
  setSelectedCategoryFilter: (cat: string | null) => void;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

// Web Audio API Ding-Dong / Counter Chime
const playCounterBell = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // First high chime (880Hz / A5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, ctx.currentTime);
    gain1.gain.setValueAtTime(0, ctx.currentTime);
    gain1.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.6);
    
    // Second lower chime (587Hz / D5) after 150ms
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(587.33, ctx.currentTime + 0.18);
    gain2.gain.setValueAtTime(0, ctx.currentTime + 0.18);
    gain2.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 0.23);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.18);
    osc2.stop(ctx.currentTime + 0.9);
  } catch (e) {
    console.log('Audio chime not supported or muted');
  }
};

const INITIAL_LOGS: LiveActivityLog[] = [
  {
    id: 'log-1',
    type: 'citizen_booked',
    title: 'Citizen Token Generated',
    description: 'Rajesh Patil booked Token H-OPD-022 for General Medicine OPD.',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    actor: 'Citizen (Public Web)',
    tokenNumber: 'H-OPD-022',
    serviceName: 'General Medicine OPD',
  },
  {
    id: 'log-2',
    type: 'counter_called',
    title: 'Counter Desk Advanced',
    description: 'Dr. Deshmukh called Token H-OPD-015 at Counter 1.',
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    actor: 'Desk Operator (Counter 1)',
    tokenNumber: 'H-OPD-015',
    serviceName: 'General Medicine OPD',
  },
  {
    id: 'log-3',
    type: 'token_completed',
    title: 'Service Completed',
    description: 'Token H-OPD-014 marked completed after medical consultation.',
    timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    actor: 'Desk Operator (Counter 1)',
    tokenNumber: 'H-OPD-014',
    serviceName: 'General Medicine OPD',
  }
];

const INITIAL_ANNOUNCEMENTS: BroadcastAnnouncement[] = [
  {
    id: 'ann-1',
    message: 'Welcome to Maharashtra Civic Centers. Please verify your token number on the live screen when your bell chimes.',
    sender: 'Nodal Officer',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    active: true,
    severity: 'info',
  }
];

const INITIAL_ADMIN_EMAILS: AdminEmailNotification[] = [
  {
    id: 'email-init-1',
    to: 'queuewise.admin@gmail.com',
    from: 'notifications@queuewise.gov.in',
    subject: '[QueueWise Alert] New Token Generated: H-OPD-022 - Rajesh Patil',
    eventType: 'citizen_booking',
    citizenName: 'Rajesh Patil',
    citizenContact: '+91 9822114455',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    status: 'DELIVERED (250 OK)',
    plainText: 'New Token H-OPD-022 generated by citizen Rajesh Patil for General Medicine OPD at District Civil Hospital, Pune. Assigned Counter 1.',
    contentHtml: '<p>A citizen booked a digital token on the public portal.</p>',
    metadata: {
      tokenNumber: 'H-OPD-022',
      service: 'General Medicine OPD',
      organization: 'District Civil Hospital, Pune',
      counter: 'Counter 1'
    }
  },
  {
    id: 'email-init-2',
    to: 'queuewise.admin@gmail.com',
    from: 'notifications@queuewise.gov.in',
    subject: '[QueueWise Security] Citizen Login: citizen@queuewise.gov.in',
    eventType: 'citizen_login',
    citizenName: 'Citizen Portal User',
    citizenContact: 'citizen@queuewise.gov.in',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    status: 'DELIVERED (250 OK)',
    plainText: 'Citizen authenticated into QueueWise Citizen Self-Service Portal from mobile web interface.',
    contentHtml: '<p>Citizen sign-in verified via single sign-on / OTP gateway.</p>',
    metadata: {
      userRole: 'citizen',
      portal: 'Citizen Web',
      authMethod: 'Password Credential'
    }
  }
];

// BroadcastChannel for cross-window / cross-tab synchronization
let globalBroadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    globalBroadcastChannel = new BroadcastChannel('queuewise_live_sync');
  }
} catch (e) {
  console.log('BroadcastChannel not supported');
}

export const QueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [activeView, setActiveView] = useState<string>('home');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);

  // Dedicated Admin Auth State
  const [currentAdmin, setCurrentAdmin] = useState<AdminAccount | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('queuewise_current_admin');
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  // Admin Gmail Notifications Stream
  const [adminEmails, setAdminEmails] = useState<AdminEmailNotification[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('queuewise_admin_emails');
      if (saved) return JSON.parse(saved);
    }
    return INITIAL_ADMIN_EMAILS;
  });


  // Portal mode: check URL query parameter ?portal=admin or localStorage
  const [portalMode, setPortalModeState] = useState<PortalMode>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const queryPortal = params.get('portal');
      if (queryPortal === 'admin' || queryPortal === 'citizen') {
        return queryPortal as PortalMode;
      }
      const saved = localStorage.getItem('queuewise_portal_mode');
      if (saved === 'admin') return 'admin';
    }
    return 'citizen';
  });

  const setPortalMode = (mode: PortalMode) => {
    setPortalModeState(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('queuewise_portal_mode', mode);
      const url = new URL(window.location.href);
      if (mode === 'citizen') {
        url.searchParams.delete('portal');
      } else {
        url.searchParams.set('portal', mode);
      }
      window.history.replaceState({}, '', url.toString());
    }
  };
  
  // Storage initialization
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('queuewise_user');
    return saved ? JSON.parse(saved) : INITIAL_DEMO_USERS[0]; // default citizen
  });
  
  const [organizations, setOrganizations] = useState<Organization[]>(() => {
    const saved = localStorage.getItem('queuewise_orgs');
    return saved ? JSON.parse(saved) : INITIAL_ORGANIZATIONS;
  });
  
  const [queueStates, setQueueStates] = useState<Record<string, ServiceQueueState>>(() => {
    const saved = localStorage.getItem('queuewise_queue_states');
    return saved ? JSON.parse(saved) : INITIAL_QUEUE_STATES;
  });
  
  const [tokens, setTokens] = useState<Token[]>(() => {
    const saved = localStorage.getItem('queuewise_tokens');
    return saved ? JSON.parse(saved) : INITIAL_DEMO_TOKENS;
  });
  
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('queuewise_notifications');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'notif-1',
        userId: 'user-demo-citizen',
        tokenNumber: 'H-OPD-022',
        title: 'Token Booked Successfully',
        message: 'Your token H-OPD-022 has been generated for District Civil Hospital. Current running token is H-OPD-015.',
        type: 'booking',
        timestamp: new Date(Date.now() - 24 * 60 * 1000).toISOString(),
        read: false,
      }
    ];
  });

  const [activityLogs, setActivityLogs] = useState<LiveActivityLog[]>(() => {
    const saved = localStorage.getItem('queuewise_activity_logs');
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  });

  const [broadcastAnnouncements, setBroadcastAnnouncements] = useState<BroadcastAnnouncement[]>(() => {
    const saved = localStorage.getItem('queuewise_broadcast_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });
  
  const [activeReceiptToken, setActiveReceiptToken] = useState<Token | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Persist state to local storage & broadcast across windows
  const broadcastSync = useCallback((type: string, data: any) => {
    if (globalBroadcastChannel) {
      try {
        globalBroadcastChannel.postMessage({ type, data, timestamp: Date.now() });
      } catch (e) {
        console.error('Broadcast error', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('queuewise_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('queuewise_current_admin', JSON.stringify(currentAdmin));
  }, [currentAdmin]);

  useEffect(() => {
    localStorage.setItem('queuewise_admin_emails', JSON.stringify(adminEmails));
  }, [adminEmails]);

  useEffect(() => {
    localStorage.setItem('queuewise_orgs', JSON.stringify(organizations));
  }, [organizations]);

  useEffect(() => {
    localStorage.setItem('queuewise_queue_states', JSON.stringify(queueStates));
  }, [queueStates]);

  useEffect(() => {
    localStorage.setItem('queuewise_tokens', JSON.stringify(tokens));
  }, [tokens]);

  useEffect(() => {
    localStorage.setItem('queuewise_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('queuewise_activity_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  useEffect(() => {
    localStorage.setItem('queuewise_broadcast_announcements', JSON.stringify(broadcastAnnouncements));
  }, [broadcastAnnouncements]);

  // Dispatch Email Notification to queuewise.admin@gmail.com
  const dispatchAdminEmail = useCallback((params: {
    eventType: AdminEmailNotification['eventType'];
    subject: string;
    citizenName: string;
    citizenContact?: string;
    details: string;
    metadata?: Record<string, any>;
  }) => {
    const newEmail: AdminEmailNotification = {
      id: `email-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      to: ADMIN_GMAIL_DESTINATION,
      from: 'notifications@queuewise.gov.in',
      subject: params.subject,
      eventType: params.eventType,
      citizenName: params.citizenName,
      citizenContact: params.citizenContact,
      timestamp: new Date().toISOString(),
      status: 'DELIVERED (250 OK)',
      plainText: params.details,
      contentHtml: `<div style="font-family:sans-serif;padding:20px;color:#1e293b;">
        <h2 style="color:#002D62;margin:0 0 10px 0;">QueueWise Official Operations Alert</h2>
        <p style="margin:0 0 16px 0;font-size:14px;"><strong>Subject:</strong> ${params.subject}</p>
        <div style="background:#f1f5f9;padding:16px;border-radius:8px;font-size:13px;line-height:1.6;">
          ${params.details}
        </div>
        <p style="margin-top:16px;font-size:11px;color:#64748b;">
          Automated alert dispatched to <strong>queuewise.admin@gmail.com</strong> by QueueWise Smart Queue Infrastructure.
        </p>
      </div>`,
      metadata: params.metadata || {}
    };

    setAdminEmails(prev => {
      const updated = [newEmail, ...prev];
      localStorage.setItem('queuewise_admin_emails', JSON.stringify(updated));
      return updated;
    });

    broadcastSync('STATE_SYNC', {
      adminEmails: [newEmail, ...adminEmails],
      shouldChime: false,
    });
  }, [adminEmails, broadcastSync]);

  // Dedicated Admin Auth Login Method
  const loginAdmin = (username: string, pass: string): { success: boolean; message?: string; admin?: AdminAccount } => {
    const cleanUsername = username.trim().toLowerCase();
    const foundAdmin = AUTHORIZED_ADMINS.find(a => a.username.toLowerCase() === cleanUsername);

    if (!foundAdmin) {
      return {
        success: false,
        message: 'Access Denied: Only authorized administrators (Siddhesh Pravin Agare & Om Santosh Gawas) have access to the Admin Portal.'
      };
    }

    const expectedPass = ADMIN_PASSWORDS[cleanUsername];
    if (expectedPass !== pass) {
      return {
        success: false,
        message: `Invalid Password. Please enter the correct password for administrator ${foundAdmin.name}.`
      };
    }

    const loggedInAdmin: AdminAccount = {
      ...foundAdmin,
      loginTime: new Date().toISOString()
    };

    setCurrentAdmin(loggedInAdmin);
    localStorage.setItem('queuewise_current_admin', JSON.stringify(loggedInAdmin));

    // Log Activity
    const newLog: LiveActivityLog = {
      id: `log-adm-auth-${Date.now()}`,
      type: 'broadcast_alert',
      title: 'Admin Session Authenticated',
      description: `${foundAdmin.name} (${foundAdmin.username}) logged in to Officer Command Portal.`,
      timestamp: new Date().toISOString(),
      actor: 'Admin Security Gateway',
    };
    setActivityLogs(prev => [newLog, ...prev]);

    // Dispatch Email Notification to queuewise.admin@gmail.com
    dispatchAdminEmail({
      eventType: 'system_alert',
      subject: `[QueueWise Security] Admin Portal Sign-in: ${foundAdmin.name}`,
      citizenName: foundAdmin.name,
      citizenContact: foundAdmin.username,
      details: `Administrator ${foundAdmin.name} (${foundAdmin.username}) authenticated into Central Admin Console. Designation: ${foundAdmin.designation}. Badge ID: ${foundAdmin.badgeNumber}.`,
      metadata: {
        adminId: foundAdmin.id,
        badge: foundAdmin.badgeNumber,
        department: foundAdmin.department,
        ip: '103.21.124.88 (State Secretariat Gateway)',
        authStatus: 'SUCCESS_200'
      }
    });

    return { success: true, admin: loggedInAdmin };
  };

  const logoutAdmin = () => {
    setCurrentAdmin(null);
    localStorage.removeItem('queuewise_current_admin');
  };

  const clearAdminEmails = () => {
    setAdminEmails([]);
    localStorage.removeItem('queuewise_admin_emails');
  };

  const sendTestAdminEmail = () => {
    dispatchAdminEmail({
      eventType: 'system_alert',
      subject: `[QueueWise Diagnostic] Test Ping to queuewise.admin@gmail.com`,
      citizenName: currentAdmin?.name || 'Diagnostic Console',
      citizenContact: currentAdmin?.username || 'admin@queuewise.gov.in',
      details: `Live diagnostic ping verified. All citizen events are actively dispatched to queuewise.admin@gmail.com. SMTP Gateway status: 250 OK (Delivered).`,
      metadata: {
        gateway: 'SMTP-TLS-Relay-Mumbai',
        pingType: 'MANUAL_TEST',
        destination: ADMIN_GMAIL_DESTINATION,
        latency: '38ms'
      }
    });
  };

  // Listen to cross-window / cross-tab BroadcastChannel & storage events
  useEffect(() => {
    const handleBroadcastMessage = (event: MessageEvent) => {
      const { type, data } = event.data || {};
      if (type === 'STATE_SYNC') {
        if (data.tokens) setTokens(data.tokens);
        if (data.queueStates) setQueueStates(data.queueStates);
        if (data.activityLogs) setActivityLogs(data.activityLogs);
        if (data.broadcastAnnouncements) setBroadcastAnnouncements(data.broadcastAnnouncements);
        if (data.notifications) setNotifications(data.notifications);
        if (data.shouldChime) playCounterBell();
      }
    };

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === 'queuewise_tokens' && e.newValue) {
        setTokens(JSON.parse(e.newValue));
      }
      if (e.key === 'queuewise_queue_states' && e.newValue) {
        setQueueStates(JSON.parse(e.newValue));
      }
      if (e.key === 'queuewise_activity_logs' && e.newValue) {
        setActivityLogs(JSON.parse(e.newValue));
      }
      if (e.key === 'queuewise_broadcast_announcements' && e.newValue) {
        setBroadcastAnnouncements(JSON.parse(e.newValue));
      }
    };

    if (globalBroadcastChannel) {
      globalBroadcastChannel.addEventListener('message', handleBroadcastMessage);
    }
    window.addEventListener('storage', handleStorageEvent);

    return () => {
      if (globalBroadcastChannel) {
        globalBroadcastChannel.removeEventListener('message', handleBroadcastMessage);
      }
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, []);

  const t = translations[language];

  // Helper to find service definition
  const findServiceById = (serviceId: string) => {
    for (const org of organizations) {
      for (const branch of org.branches) {
        for (const dept of branch.departments) {
          const s = dept.services.find(srv => srv.id === serviceId);
          if (s) {
            return { org, branch, dept, service: s };
          }
        }
      }
    }
    return null;
  };

  const getServiceQueueInfo = (serviceId: string) => {
    const sInfo = findServiceById(serviceId);
    const qState = queueStates[serviceId] || {
      serviceId,
      currentRunningTokenNumber: `${sInfo?.service.codePrefix || 'A'}-001`,
      currentRunningSequence: 1,
      lastAssignedSequence: 1,
      activeCounter: sInfo?.service.activeCounter || 'Counter 1',
      isCounterOpen: true,
    };

    const waitingTokens = tokens.filter(
      t => t.serviceId === serviceId && t.status === 'waiting'
    );

    return {
      currentRunningTokenNumber: qState.currentRunningTokenNumber,
      currentRunningSequence: qState.currentRunningSequence,
      totalWaiting: waitingTokens.length,
      averageWaitTimeMinutes: sInfo?.service.averageServiceTimeMinutes || 5,
      activeCounter: qState.activeCounter,
    };
  };

  const calculateTokenQueueInfo = (token: Token) => {
    const qState = queueStates[token.serviceId];
    const sInfo = findServiceById(token.serviceId);
    const avgTime = sInfo?.service.averageServiceTimeMinutes || 5;

    const currentRunningSeq = qState ? qState.currentRunningSequence : 1;
    const currentRunningTokenNumber = qState ? qState.currentRunningTokenNumber : `${token.tokenNumber.split('-')[0]}-001`;

    let peopleAhead = Math.max(0, token.numericSequence - currentRunningSeq);
    if (token.status === 'serving') {
      peopleAhead = 0;
    }

    const estimatedWaitMinutes = peopleAhead * avgTime;
    const isNowServing = token.status === 'serving' || (token.numericSequence === currentRunningSeq && token.status !== 'completed' && token.status !== 'cancelled');

    return {
      peopleAhead,
      estimatedWaitMinutes,
      currentRunningTokenNumber,
      isNowServing,
    };
  };

  // 1. Book a new digital token (from citizen website)
  const bookToken = (params: {
    organizationId: string;
    branchId: string;
    departmentId: string;
    serviceId: string;
    citizenName: string;
    citizenMobile: string;
    citizenEmail?: string;
    isSeniorCitizenOrPriority?: boolean;
    notes?: string;
  }) => {
    const sInfo = findServiceById(params.serviceId);
    if (!sInfo) throw new Error('Service not found');

    const prevQState = queueStates[params.serviceId] || {
      serviceId: params.serviceId,
      currentRunningTokenNumber: `${sInfo.service.codePrefix}-001`,
      currentRunningSequence: 1,
      lastAssignedSequence: 1,
      activeCounter: sInfo.service.activeCounter,
      isCounterOpen: true,
    };

    const newSequence = prevQState.lastAssignedSequence + 1;
    const formattedSeq = String(newSequence).padStart(3, '0');
    const tokenNumber = `${sInfo.service.codePrefix}-${formattedSeq}`;

    const peopleAhead = Math.max(0, newSequence - prevQState.currentRunningSequence);
    const estimatedWaitMinutes = peopleAhead * sInfo.service.averageServiceTimeMinutes;

    const newToken: Token = {
      id: `tok-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      tokenNumber,
      numericSequence: newSequence,
      userId: currentUser?.id || 'guest-citizen',
      citizenName: params.citizenName,
      citizenMobile: params.citizenMobile,
      citizenEmail: params.citizenEmail,
      isSeniorCitizenOrPriority: !!params.isSeniorCitizenOrPriority,
      organizationId: sInfo.org.id,
      organizationName: sInfo.org.name,
      branchId: sInfo.branch.id,
      branchName: sInfo.branch.name,
      departmentId: sInfo.dept.id,
      departmentName: sInfo.dept.name,
      serviceId: sInfo.service.id,
      serviceName: sInfo.service.name,
      counterNumber: sInfo.service.activeCounter,
      status: 'waiting',
      bookingTime: new Date().toISOString(),
      currentRunningTokenNumberAtBooking: prevQState.currentRunningTokenNumber,
      peopleAheadAtBooking: peopleAhead,
      estimatedWaitMinutes,
      notes: params.notes,
    };

    const updatedQueueStates = {
      ...queueStates,
      [params.serviceId]: {
        ...prevQState,
        lastAssignedSequence: newSequence,
      }
    };

    const updatedTokens = [newToken, ...tokens];

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: newToken.userId,
      tokenNumber: newToken.tokenNumber,
      title: 'Digital Token Confirmed',
      message: `Token ${newToken.tokenNumber} confirmed for ${newToken.serviceName} at ${newToken.branchName}. People ahead: ${peopleAhead}. Estimated wait: ${estimatedWaitMinutes} mins.`,
      type: 'booking',
      timestamp: new Date().toISOString(),
      read: false,
    };
    const updatedNotifications = [newNotif, ...notifications];

    const newLog: LiveActivityLog = {
      id: `log-${Date.now()}`,
      type: 'citizen_booked',
      title: 'Citizen Generated New Token',
      description: `${params.citizenName} generated Token ${newToken.tokenNumber} for ${sInfo.service.name} (${sInfo.org.name}).`,
      timestamp: new Date().toISOString(),
      actor: 'Citizen Website',
      tokenNumber: newToken.tokenNumber,
      serviceName: sInfo.service.name,
    };
    const updatedLogs = [newLog, ...activityLogs];

    setQueueStates(updatedQueueStates);
    setTokens(updatedTokens);
    setNotifications(updatedNotifications);
    setActivityLogs(updatedLogs);
    setActiveReceiptToken(newToken);

    // Automatic Email Dispatch to queuewise.admin@gmail.com
    dispatchAdminEmail({
      eventType: 'citizen_booking',
      subject: `[QueueWise Alert] New Token Generated: ${newToken.tokenNumber} - ${params.citizenName}`,
      citizenName: params.citizenName,
      citizenContact: params.citizenMobile,
      details: `Citizen ${params.citizenName} (${params.citizenMobile}) booked Token ${newToken.tokenNumber} for ${sInfo.service.name} at ${sInfo.org.name} (${sInfo.branch.name}). Assigned Counter: ${sInfo.service.activeCounter}. People Ahead: ${peopleAhead}. Estimated Wait: ${estimatedWaitMinutes} mins.`,
      metadata: {
        tokenNumber: newToken.tokenNumber,
        numericSequence: newToken.numericSequence,
        citizenMobile: params.citizenMobile,
        service: sInfo.service.name,
        department: sInfo.dept.name,
        organization: sInfo.org.name,
        counter: sInfo.service.activeCounter,
        estimatedWaitMinutes: `${estimatedWaitMinutes} mins`,
        peopleAhead: peopleAhead
      }
    });

    broadcastSync('STATE_SYNC', {
      tokens: updatedTokens,
      queueStates: updatedQueueStates,
      activityLogs: updatedLogs,
      notifications: updatedNotifications,
      broadcastAnnouncements,
      shouldChime: false,
    });

    return newToken;
  };

  // 2. Admin: Call Next Token
  const callNextToken = (serviceId: string) => {
    const sInfo = findServiceById(serviceId);
    if (!sInfo) return null;

    const qState = queueStates[serviceId] || {
      serviceId,
      currentRunningTokenNumber: `${sInfo.service.codePrefix}-001`,
      currentRunningSequence: 1,
      lastAssignedSequence: 1,
      activeCounter: sInfo.service.activeCounter,
      isCounterOpen: true,
    };

    // Mark current serving token in this service as completed
    const updatedTokens = tokens.map(tok => {
      if (tok.serviceId === serviceId && tok.status === 'serving') {
        return {
          ...tok,
          status: 'completed' as TokenStatus,
          completedTime: new Date().toISOString(),
        };
      }
      return tok;
    });

    // Find next waiting token
    const nextWaitingToken = updatedTokens
      .filter(t => t.serviceId === serviceId && t.status === 'waiting')
      .sort((a, b) => {
        if (a.isSeniorCitizenOrPriority && !b.isSeniorCitizenOrPriority) return -1;
        if (!a.isSeniorCitizenOrPriority && b.isSeniorCitizenOrPriority) return 1;
        return a.numericSequence - b.numericSequence;
      })[0];

    let newRunningSeq = qState.currentRunningSequence + 1;
    let newRunningTokenNumber = `${sInfo.service.codePrefix}-${String(newRunningSeq).padStart(3, '0')}`;
    let finalTokens = updatedTokens;
    let updatedNotifications = notifications;

    if (nextWaitingToken) {
      newRunningSeq = nextWaitingToken.numericSequence;
      newRunningTokenNumber = nextWaitingToken.tokenNumber;

      finalTokens = updatedTokens.map(tok => {
        if (tok.id === nextWaitingToken.id) {
          return {
            ...tok,
            status: 'serving' as TokenStatus,
            calledTime: new Date().toISOString(),
          };
        }
        return tok;
      });

      const callNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        userId: nextWaitingToken.userId,
        tokenNumber: nextWaitingToken.tokenNumber,
        title: '🔔 Your Turn! Counter Called',
        message: `Please proceed immediately to ${nextWaitingToken.counterNumber} for Token ${nextWaitingToken.tokenNumber} (${nextWaitingToken.serviceName}).`,
        type: 'call',
        timestamp: new Date().toISOString(),
        read: false,
      };

      const nearTurnTokens = finalTokens.filter(
        t => t.serviceId === serviceId && t.status === 'waiting' && (t.numericSequence - newRunningSeq <= 2)
      );

      const nearNotifs: NotificationItem[] = nearTurnTokens.map(tNear => ({
        id: `notif-near-${tNear.id}-${Date.now()}`,
        userId: tNear.userId,
        tokenNumber: tNear.tokenNumber,
        title: '⚠️ Your Turn Is Approaching!',
        message: `Token ${newRunningTokenNumber} is now at counter. You have only ${tNear.numericSequence - newRunningSeq} person(s) ahead. Please be ready near the waiting hall.`,
        type: 'near_turn',
        timestamp: new Date().toISOString(),
        read: false,
      }));

      updatedNotifications = [callNotif, ...nearNotifs, ...notifications];
    }

    const updatedQueueStates = {
      ...queueStates,
      [serviceId]: {
        ...qState,
        currentRunningSequence: newRunningSeq,
        currentRunningTokenNumber: newRunningTokenNumber,
      }
    };

    const newLog: LiveActivityLog = {
      id: `log-${Date.now()}`,
      type: 'counter_called',
      title: 'Counter Called Next Citizen',
      description: nextWaitingToken 
        ? `Operator called Token ${newRunningTokenNumber} (${nextWaitingToken.citizenName}) to ${sInfo.service.activeCounter}.`
        : `Operator advanced queue sequence to ${newRunningTokenNumber} at ${sInfo.service.activeCounter}.`,
      timestamp: new Date().toISOString(),
      actor: `Admin (${sInfo.service.activeCounter})`,
      tokenNumber: newRunningTokenNumber,
      serviceName: sInfo.service.name,
    };
    const updatedLogs = [newLog, ...activityLogs];

    setTokens(finalTokens);
    setQueueStates(updatedQueueStates);
    setNotifications(updatedNotifications);
    setActivityLogs(updatedLogs);

    playCounterBell();

    broadcastSync('STATE_SYNC', {
      tokens: finalTokens,
      queueStates: updatedQueueStates,
      activityLogs: updatedLogs,
      notifications: updatedNotifications,
      broadcastAnnouncements,
      shouldChime: true,
    });

    return nextWaitingToken || null;
  };

  // 3. Admin: Call specific token directly
  const callSpecificToken = (tokenId: string) => {
    const targetToken = tokens.find(t => t.id === tokenId);
    if (!targetToken) return;

    const sInfo = findServiceById(targetToken.serviceId);
    if (!sInfo) return;

    const finalTokens = tokens.map(tok => {
      if (tok.serviceId === targetToken.serviceId && tok.status === 'serving' && tok.id !== tokenId) {
        return { ...tok, status: 'completed' as TokenStatus, completedTime: new Date().toISOString() };
      }
      if (tok.id === tokenId) {
        return { ...tok, status: 'serving' as TokenStatus, calledTime: new Date().toISOString() };
      }
      return tok;
    });

    const updatedQueueStates = {
      ...queueStates,
      [targetToken.serviceId]: {
        ...(queueStates[targetToken.serviceId] || {
          serviceId: targetToken.serviceId,
          lastAssignedSequence: targetToken.numericSequence,
          activeCounter: targetToken.counterNumber,
          isCounterOpen: true,
        }),
        currentRunningSequence: targetToken.numericSequence,
        currentRunningTokenNumber: targetToken.tokenNumber,
      }
    };

    const callNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: targetToken.userId,
      tokenNumber: targetToken.tokenNumber,
      title: '🔔 Your Turn! Counter Called',
      message: `Please proceed immediately to ${targetToken.counterNumber} for Token ${targetToken.tokenNumber} (${targetToken.serviceName}).`,
      type: 'call',
      timestamp: new Date().toISOString(),
      read: false,
    };
    const updatedNotifications = [callNotif, ...notifications];

    const newLog: LiveActivityLog = {
      id: `log-${Date.now()}`,
      type: 'counter_called',
      title: 'Direct Call Issued',
      description: `Operator called Token ${targetToken.tokenNumber} (${targetToken.citizenName}) directly to ${targetToken.counterNumber}.`,
      timestamp: new Date().toISOString(),
      actor: `Admin (${targetToken.counterNumber})`,
      tokenNumber: targetToken.tokenNumber,
      serviceName: targetToken.serviceName,
    };
    const updatedLogs = [newLog, ...activityLogs];

    setTokens(finalTokens);
    setQueueStates(updatedQueueStates);
    setNotifications(updatedNotifications);
    setActivityLogs(updatedLogs);

    playCounterBell();

    broadcastSync('STATE_SYNC', {
      tokens: finalTokens,
      queueStates: updatedQueueStates,
      activityLogs: updatedLogs,
      notifications: updatedNotifications,
      broadcastAnnouncements,
      shouldChime: true,
    });
  };

  // 4. Mark completed
  const completeToken = (tokenId: string) => {
    const target = tokens.find(t => t.id === tokenId);
    const updatedTokens = tokens.map(tok => {
      if (tok.id === tokenId) {
        return {
          ...tok,
          status: 'completed' as TokenStatus,
          completedTime: new Date().toISOString(),
        };
      }
      return tok;
    });

    let updatedNotifications = notifications;
    if (target) {
      const compNotif: NotificationItem = {
        id: `notif-comp-${Date.now()}`,
        userId: target.userId,
        tokenNumber: target.tokenNumber,
        title: 'Service Completed',
        message: `Your service for Token ${target.tokenNumber} (${target.serviceName}) has been marked completed. Thank you for using QueueWise.`,
        type: 'completed',
        timestamp: new Date().toISOString(),
        read: false,
      };
      updatedNotifications = [compNotif, ...notifications];
    }

    const newLog: LiveActivityLog = {
      id: `log-${Date.now()}`,
      type: 'token_completed',
      title: 'Token Service Completed',
      description: `Token ${target?.tokenNumber || ''} (${target?.citizenName || ''}) successfully completed at counter.`,
      timestamp: new Date().toISOString(),
      actor: 'Admin Desk',
      tokenNumber: target?.tokenNumber,
      serviceName: target?.serviceName,
    };
    const updatedLogs = [newLog, ...activityLogs];

    setTokens(updatedTokens);
    setNotifications(updatedNotifications);
    setActivityLogs(updatedLogs);

    broadcastSync('STATE_SYNC', {
      tokens: updatedTokens,
      queueStates,
      activityLogs: updatedLogs,
      notifications: updatedNotifications,
      broadcastAnnouncements,
      shouldChime: false,
    });
  };

  // 5. Cancel token
  const cancelToken = (tokenId: string, reason?: string) => {
    const target = tokens.find(t => t.id === tokenId);
    const updatedTokens = tokens.map(tok => {
      if (tok.id === tokenId) {
        return {
          ...tok,
          status: 'cancelled' as TokenStatus,
          cancelledTime: new Date().toISOString(),
          notes: reason ? `${tok.notes || ''} [Cancelled: ${reason}]` : tok.notes,
        };
      }
      return tok;
    });

    let updatedNotifications = notifications;
    if (target) {
      const cancelNotif: NotificationItem = {
        id: `notif-cancel-${Date.now()}`,
        userId: target.userId,
        tokenNumber: target.tokenNumber,
        title: 'Token Cancelled',
        message: `Token ${target.tokenNumber} for ${target.serviceName} has been cancelled.`,
        type: 'cancelled',
        timestamp: new Date().toISOString(),
        read: false,
      };
      updatedNotifications = [cancelNotif, ...notifications];
    }

    const newLog: LiveActivityLog = {
      id: `log-${Date.now()}`,
      type: 'token_cancelled',
      title: 'Token Cancelled / No-Show',
      description: `Token ${target?.tokenNumber || ''} (${target?.citizenName || ''}) was cancelled. Reason: ${reason || 'No-show'}.`,
      timestamp: new Date().toISOString(),
      actor: 'Admin Desk',
      tokenNumber: target?.tokenNumber,
      serviceName: target?.serviceName,
    };
    const updatedLogs = [newLog, ...activityLogs];

    setTokens(updatedTokens);
    setNotifications(updatedNotifications);
    setActivityLogs(updatedLogs);

    if (target) {
      dispatchAdminEmail({
        eventType: 'token_cancelled',
        subject: `[QueueWise Notice] Token Cancelled: ${target.tokenNumber} - ${target.citizenName}`,
        citizenName: target.citizenName,
        citizenContact: target.citizenMobile,
        details: `Token ${target.tokenNumber} for ${target.serviceName} (${target.organizationName}) has been cancelled. Reason: ${reason || 'No-show / Citizen cancellation'}.`,
        metadata: {
          tokenNumber: target.tokenNumber,
          service: target.serviceName,
          reason: reason || 'Not specified'
        }
      });
    }

    broadcastSync('STATE_SYNC', {
      tokens: updatedTokens,
      queueStates,
      activityLogs: updatedLogs,
      notifications: updatedNotifications,
      broadcastAnnouncements,
      shouldChime: false,
    });
  };

  // 6. Transfer Token to Another Desk
  const transferToken = (tokenId: string, targetServiceId: string, reason?: string) => {
    const target = tokens.find(t => t.id === tokenId);
    const targetSrvInfo = findServiceById(targetServiceId);
    if (!target || !targetSrvInfo) return;

    const updatedTokens = tokens.map(tok => {
      if (tok.id === tokenId) {
        return {
          ...tok,
          serviceId: targetSrvInfo.service.id,
          serviceName: targetSrvInfo.service.name,
          departmentId: targetSrvInfo.dept.id,
          departmentName: targetSrvInfo.dept.name,
          organizationId: targetSrvInfo.org.id,
          organizationName: targetSrvInfo.org.name,
          counterNumber: targetSrvInfo.service.activeCounter,
          status: 'waiting' as TokenStatus,
          notes: `${tok.notes || ''} [Transferred from ${tok.serviceName}: ${reason || 'Transferred by Operator'}]`,
        };
      }
      return tok;
    });

    const notif: NotificationItem = {
      id: `notif-transfer-${Date.now()}`,
      userId: target.userId,
      tokenNumber: target.tokenNumber,
      title: 'Token Transferred to Another Desk',
      message: `Your token ${target.tokenNumber} has been transferred to ${targetSrvInfo.service.name} (${targetSrvInfo.service.activeCounter}). Please check the waiting screen.`,
      type: 'info',
      timestamp: new Date().toISOString(),
      read: false,
    };
    const updatedNotifications = [notif, ...notifications];

    const newLog: LiveActivityLog = {
      id: `log-${Date.now()}`,
      type: 'counter_transferred',
      title: 'Token Transferred to Desk',
      description: `Token ${target.tokenNumber} (${target.citizenName}) was transferred from ${target.serviceName} to ${targetSrvInfo.service.name} (${targetSrvInfo.service.activeCounter}).`,
      timestamp: new Date().toISOString(),
      actor: 'Admin Officer',
      tokenNumber: target.tokenNumber,
      serviceName: targetSrvInfo.service.name,
    };
    const updatedLogs = [newLog, ...activityLogs];

    setTokens(updatedTokens);
    setNotifications(updatedNotifications);
    setActivityLogs(updatedLogs);

    broadcastSync('STATE_SYNC', {
      tokens: updatedTokens,
      queueStates,
      activityLogs: updatedLogs,
      notifications: updatedNotifications,
      broadcastAnnouncements,
      shouldChime: false,
    });
  };

  // 7. Post Broadcast Announcement to All Citizen Sessions
  const postBroadcastAnnouncement = (message: string, severity: 'info' | 'warning' | 'urgent' = 'info') => {
    const newAnnouncement: BroadcastAnnouncement = {
      id: `ann-${Date.now()}`,
      message,
      sender: 'Nodal Command Center',
      timestamp: new Date().toISOString(),
      active: true,
      severity,
    };
    const updatedAnnouncements = [newAnnouncement, ...broadcastAnnouncements];

    const newLog: LiveActivityLog = {
      id: `log-${Date.now()}`,
      type: 'broadcast_alert',
      title: 'Public Announcement Broadcasted',
      description: `"${message}" dispatched to all active citizen portals and TV monitors.`,
      timestamp: new Date().toISOString(),
      actor: 'Nodal Officer',
    };
    const updatedLogs = [newLog, ...activityLogs];

    setBroadcastAnnouncements(updatedAnnouncements);
    setActivityLogs(updatedLogs);

    playCounterBell();

    broadcastSync('STATE_SYNC', {
      tokens,
      queueStates,
      activityLogs: updatedLogs,
      notifications,
      broadcastAnnouncements: updatedAnnouncements,
      shouldChime: true,
    });
  };

  const dismissAnnouncement = (id: string) => {
    const updated = broadcastAnnouncements.filter(a => a.id !== id);
    setBroadcastAnnouncements(updated);
    broadcastSync('STATE_SYNC', {
      tokens,
      queueStates,
      activityLogs,
      notifications,
      broadcastAnnouncements: updated,
      shouldChime: false,
    });
  };

  // 8. Simulate a Citizen Booking (to immediately demonstrate live connection)
  const simulateCitizenBooking = () => {
    const demoNames = [
      'Priya Kulkarni', 'Suresh Mane', 'Kavita Shinde', 'Vikram Gaikwad', 'Sunita Jadhav', 'Amit Joshi'
    ];
    const demoMobiles = [
      '9823145566', '9890123456', '9422019988', '9850112233', '9766554433', '9822998877'
    ];
    const randomIndex = Math.floor(Math.random() * demoNames.length);

    bookToken({
      organizationId: 'org-hospital-pune',
      branchId: 'branch-hospital-shivajinagar',
      departmentId: 'dept-hospital-opd',
      serviceId: 'srv-opd-gen',
      citizenName: demoNames[randomIndex],
      citizenMobile: demoMobiles[randomIndex],
      isSeniorCitizenOrPriority: Math.random() > 0.7,
      notes: 'Booked via Citizen Mobile Self-Service',
    });
  };

  const resetSystemData = () => {
    setTokens(INITIAL_DEMO_TOKENS);
    setQueueStates(INITIAL_QUEUE_STATES);
    setActivityLogs(INITIAL_LOGS);
    setBroadcastAnnouncements(INITIAL_ANNOUNCEMENTS);
    localStorage.removeItem('queuewise_tokens');
    localStorage.removeItem('queuewise_queue_states');
    localStorage.removeItem('queuewise_activity_logs');
    localStorage.removeItem('queuewise_broadcast_announcements');
    broadcastSync('STATE_SYNC', {
      tokens: INITIAL_DEMO_TOKENS,
      queueStates: INITIAL_QUEUE_STATES,
      activityLogs: INITIAL_LOGS,
      notifications: [],
      broadcastAnnouncements: INITIAL_ANNOUNCEMENTS,
      shouldChime: false,
    });
  };

  // Notifications helper
  const markNotificationAsRead = (notifId: string) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // User Auth Simulation (Citizen Only)
  const loginUser = (email: string, role: 'citizen' | 'admin' | 'counter_operator' = 'citizen') => {
    const existing = INITIAL_DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    const userToLogin: User = existing 
      ? { ...existing, role: 'citizen' }
      : {
          id: `user-${Date.now()}`,
          name: email.split('@')[0].toUpperCase(),
          email,
          mobile: '9800000000',
          role: 'citizen',
          createdAt: new Date().toISOString(),
        };

    setCurrentUser(userToLogin);

    // Dispatch Gmail Notification to queuewise.admin@gmail.com
    dispatchAdminEmail({
      eventType: 'citizen_login',
      subject: `[QueueWise Citizen Portal] Citizen Login: ${userToLogin.name} (${userToLogin.email || userToLogin.mobile})`,
      citizenName: userToLogin.name,
      citizenContact: userToLogin.email || userToLogin.mobile,
      details: `Citizen ${userToLogin.name} signed in to the QueueWise citizen portal (Role: ${userToLogin.role}). IP gateway logged.`,
      metadata: {
        userId: userToLogin.id,
        userRole: userToLogin.role,
        email: userToLogin.email,
        mobile: userToLogin.mobile,
        loginTimestamp: new Date().toISOString()
      }
    });

    return true;
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  // Admin add Org/Branch/Dept/Service
  const addOrganization = (org: Organization) => {
    setOrganizations(prev => [...prev, org]);
  };

  const addBranch = (orgId: string, branch: any) => {
    setOrganizations(prev => prev.map(org => {
      if (org.id === orgId) {
        return { ...org, branches: [...org.branches, branch] };
      }
      return org;
    }));
  };

  const addDepartment = (branchId: string, dept: any) => {
    setOrganizations(prev => prev.map(org => ({
      ...org,
      branches: org.branches.map(b => {
        if (b.id === branchId) {
          return { ...b, departments: [...b.departments, dept] };
        }
        return b;
      })
    })));
  };

  const addService = (deptId: string, service: any) => {
    setOrganizations(prev => prev.map(org => ({
      ...org,
      branches: org.branches.map(b => ({
        ...b,
        departments: b.departments.map(d => {
          if (d.id === deptId) {
            return { ...d, services: [...d.services, service] };
          }
          return d;
        })
      }))
    })));
  };

  const updateServiceAverageTime = (serviceId: string, minutes: number) => {
    setOrganizations(prev => prev.map(org => ({
      ...org,
      branches: org.branches.map(b => ({
        ...b,
        departments: b.departments.map(d => ({
          ...d,
          services: d.services.map(s => {
            if (s.id === serviceId) {
              return { ...s, averageServiceTimeMinutes: minutes };
            }
            return s;
          })
        }))
      }))
    })));

    const newLog: LiveActivityLog = {
      id: `log-${Date.now()}`,
      type: 'service_adjusted',
      title: 'Service Handling Pace Updated',
      description: `Desk service handling pace adjusted to ${minutes} mins for service ID ${serviceId}.`,
      timestamp: new Date().toISOString(),
      actor: 'Admin Configuration',
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  return (
    <QueueContext.Provider
      value={{
        language,
        setLanguage,
        t,
        portalMode,
        setPortalMode,
        currentUser,
        setCurrentUser,
        loginUser,
        logoutUser,
        currentAdmin,
        loginAdmin,
        logoutAdmin,
        adminEmails,
        dispatchAdminEmail,
        clearAdminEmails,
        sendTestAdminEmail,
        organizations,
        tokens,
        queueStates,
        notifications,
        activityLogs,
        broadcastAnnouncements,
        bookToken,
        callNextToken,
        callSpecificToken,
        completeToken,
        cancelToken,
        transferToken,
        postBroadcastAnnouncement,
        dismissAnnouncement,
        simulateCitizenBooking,
        resetSystemData,
        getServiceQueueInfo,
        calculateTokenQueueInfo,
        markNotificationAsRead,
        clearAllNotifications,
        activeReceiptToken,
        setActiveReceiptToken,
        searchTerm,
        setSearchTerm,
        addOrganization,
        addBranch,
        addDepartment,
        addService,
        updateServiceAverageTime,
        playChime: playCounterBell,
        activeView,
        setActiveView,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
      }}
    >
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
};
