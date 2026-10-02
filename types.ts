export type OrgType = 'hospital' | 'bank' | 'government_office';

export type Language = 'en' | 'mr';

export type TokenStatus = 'waiting' | 'serving' | 'completed' | 'cancelled' | 'no_show';

export interface Service {
  id: string;
  departmentId: string;
  name: string;
  marathiName: string;
  codePrefix: string; // e.g., 'OPD', 'CSH', 'DOC'
  averageServiceTimeMinutes: number; // e.g., 5 mins
  activeCounter: string; // e.g., 'Counter 3'
  counterOfficer?: string;
  description: string;
}

export interface Department {
  id: string;
  branchId: string;
  name: string;
  marathiName: string;
  services: Service[];
}

export interface Branch {
  id: string;
  organizationId: string;
  name: string;
  marathiName: string;
  address: string;
  city: string;
  district: string;
  pincode: string;
  contactNumber: string;
  operatingHours: string;
  departments: Department[];
}

export interface Organization {
  id: string;
  name: string;
  marathiName: string;
  type: OrgType;
  iconName: string;
  description: string;
  marathiDescription: string;
  badge: string;
  branches: Branch[];
}

export interface Token {
  id: string;
  tokenNumber: string; // e.g., 'A022', 'H105', 'B045'
  numericSequence: number;
  userId: string;
  citizenName: string;
  citizenMobile: string;
  citizenEmail?: string;
  isSeniorCitizenOrPriority?: boolean;
  
  organizationId: string;
  organizationName: string;
  branchId: string;
  branchName: string;
  departmentId: string;
  departmentName: string;
  serviceId: string;
  serviceName: string;
  
  counterNumber: string;
  status: TokenStatus;
  
  bookingTime: string; // ISO string
  calledTime?: string;
  completedTime?: string;
  cancelledTime?: string;
  
  currentRunningTokenNumberAtBooking: string;
  peopleAheadAtBooking: number;
  estimatedWaitMinutes: number;
  notes?: string;
}

export interface ServiceQueueState {
  serviceId: string;
  currentRunningTokenNumber: string;
  currentRunningSequence: number;
  lastAssignedSequence: number;
  activeCounter: string;
  isCounterOpen: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string;
  tokenNumber: string;
  title: string;
  message: string;
  type: 'booking' | 'call' | 'near_turn' | 'completed' | 'cancelled' | 'info';
  timestamp: string;
  read: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: 'citizen' | 'admin' | 'counter_operator';
  assignedServiceId?: string; // for operator
  createdAt: string;
}

export interface LiveActivityLog {
  id: string;
  type: 'citizen_booked' | 'counter_called' | 'token_completed' | 'token_cancelled' | 'counter_transferred' | 'broadcast_alert' | 'service_adjusted';
  title: string;
  description: string;
  timestamp: string;
  actor: string;
  serviceName?: string;
  tokenNumber?: string;
}

export interface BroadcastAnnouncement {
  id: string;
  message: string;
  sender: string;
  timestamp: string;
  active: boolean;
  severity: 'info' | 'warning' | 'urgent';
}

export interface AdminAccount {
  id: string;
  name: string;
  username: string;
  designation: string;
  badgeNumber: string;
  department: string;
  loginTime?: string;
}

export interface AdminEmailNotification {
  id: string;
  to: string; // queuewise.admin@gmail.com
  from: string;
  subject: string;
  eventType: 'citizen_booking' | 'citizen_login' | 'citizen_registration' | 'token_cancelled' | 'contact_feedback' | 'counter_advanced' | 'system_alert';
  citizenName: string;
  citizenContact?: string;
  timestamp: string;
  contentHtml: string;
  plainText: string;
  status: 'DELIVERED (250 OK)';
  metadata?: Record<string, any>;
}


export type PortalMode = 'citizen' | 'admin';
