import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertDialog } from '../components/ui/Modal';
import { PrintDialog } from '../components/ui/PrintDialog';
import { PrescriptionDialog } from '../components/ui/PrescriptionDialog';
import { OrderDialog } from '../components/ui/OrderDialog';
import { 
  Users, 
  Calendar, 
  AlertTriangle, 
  Activity, 
  FileText,
  Pill,
  FlaskConical,
  MessageSquare,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Bell,
  Inbox,
  ClipboardList,
  Stethoscope,
  TrendingUp,
  TrendingDown,
  Phone,
  Send,
  RefreshCw,
  Flag,
  Eye,
  Edit3,
  Printer,
  ExternalLink,
  Zap,
  ShieldAlert,
  Syringe,
  Radio,
  ClipboardCheck,
  Folder,
  FolderOpen
} from 'lucide-react';

type InboxTab = 'all' | 'results' | 'messages' | 'rxRefills' | 'orders' | 'cosign';
type WorklistFilter = 'all' | 'inpatient' | 'outpatient' | 'critical';

interface InboxItem {
  id: number;
  type: 'lab' | 'imaging' | 'message' | 'refill' | 'order' | 'cosign' | 'consult';
  priority: 'critical' | 'high' | 'normal' | 'low';
  patientName: string;
  patientMrn: string;
  title: string;
  detail: string;
  timestamp: string;
  read: boolean;
  flagged: boolean;
}

interface WorklistPatient {
  id: number;
  name: string;
  mrn: string;
  age: number;
  gender: string;
  room?: string;
  location: string;
  chiefComplaint: string;
  admitDate?: string;
  appointmentTime?: string;
  attendingProvider: string;
  status: 'waiting' | 'roomed' | 'in-progress' | 'ready-discharge' | 'critical';
  alerts: string[];
  lastVitals?: {
    bp: string;
    hr: number;
    temp: number;
    spo2: number;
    rr: number;
  };
  flags: ('fall-risk' | 'isolation' | 'npo' | 'allergy' | 'code-status' | 'vip')[];
}

const mockInboxItems: InboxItem[] = [
  { id: 1, type: 'lab', priority: 'critical', patientName: 'Smith, John', patientMrn: 'MRN001234', title: 'CRITICAL: Potassium 6.8 mEq/L', detail: 'BMP resulted - K+ critically high', timestamp: '5 min ago', read: false, flagged: true },
  { id: 2, type: 'lab', priority: 'critical', patientName: 'Martinez, Ana', patientMrn: 'MRN001241', title: 'CRITICAL: Troponin 2.4 ng/mL', detail: 'Troponin I elevated - possible MI', timestamp: '12 min ago', read: false, flagged: true },
  { id: 3, type: 'lab', priority: 'high', patientName: 'Johnson, Sarah', patientMrn: 'MRN001235', title: 'HbA1c 9.2%', detail: 'Glycemic control worsening', timestamp: '1 hr ago', read: false, flagged: false },
  { id: 4, type: 'imaging', priority: 'high', patientName: 'Williams, Michael', patientMrn: 'MRN001236', title: 'CT Chest - Pulmonary nodule', detail: 'New 8mm nodule RLL, recommend follow-up', timestamp: '2 hr ago', read: false, flagged: false },
  { id: 5, type: 'message', priority: 'normal', patientName: 'Brown, Emily', patientMrn: 'MRN001237', title: 'Patient message: Medication question', detail: 'Asking about metformin side effects', timestamp: '2 hr ago', read: false, flagged: false },
  { id: 6, type: 'refill', priority: 'normal', patientName: 'Davis, Robert', patientMrn: 'MRN001238', title: 'Rx Refill Request: Lisinopril 10mg', detail: 'Pharmacy: CVS Main St - 0 refills remaining', timestamp: '3 hr ago', read: false, flagged: false },
  { id: 7, type: 'refill', priority: 'normal', patientName: 'Garcia, Carlos', patientMrn: 'MRN001240', title: 'Rx Refill Request: Metoprolol 25mg', detail: 'Pharmacy: Walgreens Oak Ave', timestamp: '3 hr ago', read: true, flagged: false },
  { id: 8, type: 'order', priority: 'normal', patientName: 'Wilson, Patricia', patientMrn: 'MRN001239', title: 'Order to Sign: CBC, CMP', detail: 'Pre-op labs ordered by NP Thompson', timestamp: '4 hr ago', read: true, flagged: false },
  { id: 9, type: 'cosign', priority: 'normal', patientName: 'Lee, David', patientMrn: 'MRN001242', title: 'Co-sign: Progress Note', detail: 'Note by Resident Dr. Patel requires co-signature', timestamp: '5 hr ago', read: true, flagged: false },
  { id: 10, type: 'consult', priority: 'high', patientName: 'Thompson, Mary', patientMrn: 'MRN001243', title: 'Cardiology Consult Response', detail: 'Dr. Chen recommends stress test', timestamp: '6 hr ago', read: true, flagged: false },
];

const mockWorklistPatients: WorklistPatient[] = [
  {
    id: 1, name: 'Smith, John', mrn: 'MRN001234', age: 58, gender: 'M', room: '412A', location: 'Med-Surg 4W',
    chiefComplaint: 'Hyperkalemia, AKI', admitDate: '01/16/2024', attendingProvider: 'Dr. Anderson',
    status: 'critical', alerts: ['K+ 6.8 - CRITICAL', 'Cr 3.2 (baseline 1.1)'],
    lastVitals: { bp: '158/94', hr: 98, temp: 98.6, spo2: 94, rr: 20 },
    flags: ['fall-risk', 'allergy']
  },
  {
    id: 2, name: 'Martinez, Ana', mrn: 'MRN001241', age: 67, gender: 'F', room: 'CCU-3', location: 'CCU',
    chiefComplaint: 'NSTEMI, chest pain', admitDate: '01/18/2024', attendingProvider: 'Dr. Anderson',
    status: 'critical', alerts: ['Troponin 2.4', 'On heparin drip', 'Cardiology consulted'],
    lastVitals: { bp: '142/88', hr: 88, temp: 98.2, spo2: 96, rr: 18 },
    flags: ['code-status', 'npo']
  },
  {
    id: 3, name: 'Johnson, Sarah', mrn: 'MRN001235', age: 45, gender: 'F', appointmentTime: '10:30 AM', location: 'Clinic 2B',
    chiefComplaint: 'DM follow-up, HbA1c review', attendingProvider: 'Dr. Anderson',
    status: 'waiting', alerts: ['HbA1c 9.2% (was 7.8%)'],
    flags: []
  },
  {
    id: 4, name: 'Williams, Michael', mrn: 'MRN001236', age: 62, gender: 'M', appointmentTime: '11:00 AM', location: 'Clinic 2B',
    chiefComplaint: 'CT results review, lung nodule', attendingProvider: 'Dr. Anderson',
    status: 'roomed', alerts: ['New pulmonary nodule 8mm'],
    lastVitals: { bp: '128/82', hr: 72, temp: 98.4, spo2: 97, rr: 16 },
    flags: []
  },
  {
    id: 5, name: 'Brown, Emily', mrn: 'MRN001237', age: 34, gender: 'F', appointmentTime: '11:30 AM', location: 'Clinic 2B',
    chiefComplaint: 'HTN management, medication adjustment', attendingProvider: 'Dr. Anderson',
    status: 'waiting', alerts: [],
    flags: ['allergy']
  },
  {
    id: 6, name: 'Davis, Robert', mrn: 'MRN001238', age: 71, gender: 'M', room: '318B', location: 'Med-Surg 3E',
    chiefComplaint: 'CHF exacerbation', admitDate: '01/15/2024', attendingProvider: 'Dr. Anderson',
    status: 'ready-discharge', alerts: ['BNP trending down', 'Weight -4kg from admit'],
    lastVitals: { bp: '118/72', hr: 68, temp: 98.0, spo2: 96, rr: 16 },
    flags: ['fall-risk']
  },
  {
    id: 7, name: 'Garcia, Carlos', mrn: 'MRN001240', age: 55, gender: 'M', room: '402A', location: 'Med-Surg 4W',
    chiefComplaint: 'Post-op day 2, cholecystectomy', admitDate: '01/16/2024', attendingProvider: 'Dr. Anderson',
    status: 'in-progress', alerts: ['Pain controlled', 'Tolerating diet'],
    lastVitals: { bp: '124/78', hr: 76, temp: 99.1, spo2: 98, rr: 14 },
    flags: []
  },
  {
    id: 8, name: 'Wilson, Patricia', mrn: 'MRN001239', age: 48, gender: 'F', appointmentTime: '2:00 PM', location: 'Clinic 2B',
    chiefComplaint: 'Pre-op evaluation, knee replacement', attendingProvider: 'Dr. Anderson',
    status: 'waiting', alerts: ['Labs pending'],
    flags: ['vip']
  },
];

const mockUnsignedNotes = [
  { id: 1, patientName: 'Smith, John', type: 'Progress Note', date: '01/18/2024', daysOld: 0 },
  { id: 2, patientName: 'Martinez, Ana', type: 'H&P', date: '01/18/2024', daysOld: 0 },
  { id: 3, patientName: 'Davis, Robert', type: 'Progress Note', date: '01/17/2024', daysOld: 1 },
  { id: 4, patientName: 'Garcia, Carlos', type: 'Operative Note', date: '01/16/2024', daysOld: 2 },
  { id: 5, patientName: 'Lee, David', type: 'Discharge Summary', date: '01/15/2024', daysOld: 3 },
];

const mockPendingOrders = [
  { id: 1, patientName: 'Johnson, Sarah', order: 'Increase Metformin to 1000mg BID', type: 'Medication', status: 'draft' },
  { id: 2, patientName: 'Williams, Michael', order: 'CT Chest w/ contrast 3 months', type: 'Imaging', status: 'draft' },
  { id: 3, patientName: 'Brown, Emily', order: 'Add Amlodipine 5mg daily', type: 'Medication', status: 'pending-approval' },
  { id: 4, patientName: 'Wilson, Patricia', order: 'CBC, CMP, PT/INR, Type & Screen', type: 'Lab', status: 'pending-signature' },
];

const mockCriticalAlerts = [
  { id: 1, type: 'lab', patient: 'Smith, John', alert: 'K+ 6.8 mEq/L', action: 'Kayexalate ordered, repeat in 2hr', time: '5 min ago' },
  { id: 2, type: 'lab', patient: 'Martinez, Ana', alert: 'Troponin 2.4 ng/mL', action: 'Cardiology at bedside', time: '12 min ago' },
  { id: 3, type: 'vital', patient: 'Thompson, Mary', alert: 'BP 188/110', action: 'IV Hydralazine given', time: '25 min ago' },
];

type InboxPriority = 'all' | 'critical' | 'high' | 'normal';
type InboxReadFilter = 'all' | 'unread' | 'read';
type WorklistSort = 'name' | 'location' | 'status' | 'time';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [inboxTab, setInboxTab] = useState<InboxTab>('all');
  const [inboxPriority, setInboxPriority] = useState<InboxPriority>('all');
  const [inboxReadFilter, setInboxReadFilter] = useState<InboxReadFilter>('all');
  const [worklistFilter, setWorklistFilter] = useState<WorklistFilter>('all');
  const [worklistSort, setWorklistSort] = useState<WorklistSort>('status');
  const [worklistSortAsc, setWorklistSortAsc] = useState(true);

  const [expandedPanels, setExpandedPanels] = useState<Record<string, boolean>>({
    inbox: true,
    worklist: true,
    unsigned: true,
    orders: true,
    schedule: true,
    quality: false,
  });
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [showRxDialog, setShowRxDialog] = useState(false);
  const [showLabDialog, setShowLabDialog] = useState(false);
  const [showImagingDialog, setShowImagingDialog] = useState(false);
  const [showAlert, setShowAlert] = useState<{ title: string; message: string; type: 'success' | 'info' } | null>(null);
  const [inboxItems, setInboxItems] = useState(mockInboxItems);

  const togglePanel = (panel: string) => {
    setExpandedPanels(prev => ({ ...prev, [panel]: !prev[panel] }));
  };

  const markAsRead = (itemId: number) => {
    setInboxItems(prev => prev.map(item => item.id === itemId ? { ...item, read: true } : item));
  };

  const toggleFlag = (itemId: number) => {
    setInboxItems(prev => prev.map(item => item.id === itemId ? { ...item, flagged: !item.flagged } : item));
  };

  const markAllAsRead = () => {
    setInboxItems(prev => prev.map(item => ({ ...item, read: true })));
    setShowAlert({ title: 'Inbox Updated', message: 'All items marked as read.', type: 'success' });
  };

  const inboxCounts = useMemo(() => ({
    all: inboxItems.filter(i => !i.read).length,
    results: inboxItems.filter(i => !i.read && (i.type === 'lab' || i.type === 'imaging')).length,
    messages: inboxItems.filter(i => !i.read && i.type === 'message').length,
    rxRefills: inboxItems.filter(i => !i.read && i.type === 'refill').length,
    orders: inboxItems.filter(i => !i.read && i.type === 'order').length,
    cosign: inboxItems.filter(i => !i.read && (i.type === 'cosign' || i.type === 'consult')).length,
  }), [inboxItems]);

  const filteredInbox = useMemo(() => {
    let items = inboxItems;
    if (inboxTab !== 'all') {
      if (inboxTab === 'results') items = items.filter(i => i.type === 'lab' || i.type === 'imaging');
      else if (inboxTab === 'messages') items = items.filter(i => i.type === 'message');
      else if (inboxTab === 'rxRefills') items = items.filter(i => i.type === 'refill');
      else if (inboxTab === 'orders') items = items.filter(i => i.type === 'order');
      else if (inboxTab === 'cosign') items = items.filter(i => i.type === 'cosign' || i.type === 'consult');
    }
    if (inboxPriority !== 'all') {
      items = items.filter(i => i.priority === inboxPriority);
    }
    if (inboxReadFilter === 'unread') {
      items = items.filter(i => !i.read);
    } else if (inboxReadFilter === 'read') {
      items = items.filter(i => i.read);
    }
    return items;
  }, [inboxItems, inboxTab, inboxPriority, inboxReadFilter]);

  const filteredWorklist = useMemo(() => {
    let patients = mockWorklistPatients.filter(patient => {
      if (worklistFilter === 'all') return true;
      if (worklistFilter === 'inpatient') return !!patient.room;
      if (worklistFilter === 'outpatient') return !!patient.appointmentTime;
      if (worklistFilter === 'critical') return patient.status === 'critical';
      return true;
    });
    patients.sort((a, b) => {
      let cmp = 0;
      if (worklistSort === 'name') cmp = a.name.localeCompare(b.name);
      else if (worklistSort === 'location') cmp = (a.room || a.appointmentTime || '').localeCompare(b.room || b.appointmentTime || '');
      else if (worklistSort === 'status') {
        const order = { critical: 0, 'in-progress': 1, roomed: 2, waiting: 3, 'ready-discharge': 4 };
        cmp = (order[a.status] || 5) - (order[b.status] || 5);
      }
      return worklistSortAsc ? cmp : -cmp;
    });
    return patients;
  }, [worklistFilter, worklistSort, worklistSortAsc]);

  const getInboxIcon = (type: string) => {
    switch (type) {
      case 'lab': return <FlaskConical className="w-3 h-3" />;
      case 'imaging': return <Radio className="w-3 h-3" />;
      case 'message': return <MessageSquare className="w-3 h-3" />;
      case 'refill': return <Pill className="w-3 h-3" />;
      case 'order': return <ClipboardList className="w-3 h-3" />;
      case 'cosign': return <Edit3 className="w-3 h-3" />;
      case 'consult': return <Stethoscope className="w-3 h-3" />;
      default: return <FileText className="w-3 h-3" />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-200 text-red-800';
      case 'waiting': return 'bg-amber-200 text-amber-800';
      case 'roomed': return 'bg-blue-200 text-blue-800';
      case 'in-progress': return 'bg-green-200 text-green-800';
      case 'ready-discharge': return 'bg-gray-200 text-gray-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  const getFlagStyle = (flag: string) => {
    switch (flag) {
      case 'fall-risk': return { label: 'FALL', bg: 'bg-yellow-200', color: 'text-yellow-800' };
      case 'isolation': return { label: 'ISO', bg: 'bg-purple-200', color: 'text-purple-800' };
      case 'npo': return { label: 'NPO', bg: 'bg-red-200', color: 'text-red-800' };
      case 'allergy': return { label: 'ALLERGY', bg: 'bg-orange-200', color: 'text-orange-800' };
      case 'code-status': return { label: 'DNR', bg: 'bg-gray-300', color: 'text-gray-800' };
      case 'vip': return { label: 'VIP', bg: 'bg-blue-200', color: 'text-blue-800' };
      default: return { label: flag, bg: 'bg-gray-200', color: 'text-gray-800' };
    }
  };

  return (
    <div className="h-full flex flex-col" style={{ background: '#d4d0c8' }}>
      {/* Toolbar */}
      <div className="ehr-toolbar flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <button className="ehr-toolbar-button flex items-center" onClick={() => setShowAlert({ title: 'Refreshed', message: 'Dashboard data has been refreshed.', type: 'info' })}>
            <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh
          </button>
          <span className="text-gray-400">|</span>
          <button className="ehr-toolbar-button flex items-center" onClick={() => setShowRxDialog(true)}>
            <Pill className="w-3.5 h-3.5 mr-1" /> e-Prescribe
          </button>
          <button className="ehr-toolbar-button flex items-center" onClick={() => setShowLabDialog(true)}>
            <FlaskConical className="w-3.5 h-3.5 mr-1" /> Order Labs
          </button>
          <button className="ehr-toolbar-button flex items-center" onClick={() => setShowImagingDialog(true)}>
            <Radio className="w-3.5 h-3.5 mr-1" /> Order Imaging
          </button>
          <button className="ehr-toolbar-button flex items-center" onClick={() => setShowAlert({ title: 'New Note', message: 'Select a patient first to create a clinical note.', type: 'info' })}>
            <FileText className="w-3.5 h-3.5 mr-1" /> New Note
          </button>
          <button className="ehr-toolbar-button flex items-center" onClick={() => setShowAlert({ title: 'Referral', message: 'Select a patient first to create a referral.', type: 'info' })}>
            <Send className="w-3.5 h-3.5 mr-1" /> Referral
          </button>
          <span className="text-gray-400">|</span>
          <button className="ehr-toolbar-button flex items-center" onClick={() => setShowPrintDialog(true)}>
            <Printer className="w-3.5 h-3.5 mr-1" /> Print
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button className="ehr-toolbar-button relative">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[9px] rounded-full flex items-center justify-center">3</span>
          </button>
        </div>
      </div>

      {/* Critical Alerts Banner */}
      {mockCriticalAlerts.length > 0 && (
        <div className="ehr-alert-critical px-3 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ShieldAlert className="w-4 h-4 mr-2" />
              <span className="font-semibold text-[11px]">CRITICAL ALERTS ({mockCriticalAlerts.length})</span>
            </div>
            <div className="flex items-center space-x-4">
              {mockCriticalAlerts.slice(0, 2).map((alert) => (
                <span key={alert.id} className="text-[11px]">
                  <strong>{alert.patient}:</strong> {alert.alert} - {alert.action}
                </span>
              ))}
              <button className="ehr-button text-[10px] px-2 py-0.5">Review All</button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden p-1 space-x-1">
        {/* Left Column - Inbox & Worklist */}
        <div className="flex-1 flex flex-col space-y-1 overflow-hidden">
          {/* Summary Stats */}
          <div className="flex space-x-1">
            {[
              { label: 'Inbox', value: inboxCounts.all, critical: mockInboxItems.filter(i => i.priority === 'critical').length, icon: Inbox, color: '#336699' },
              { label: 'Results', value: inboxCounts.results, critical: 2, icon: FlaskConical, color: '#663399' },
              { label: 'Unsigned', value: mockUnsignedNotes.length, critical: 1, icon: Edit3, color: '#996633' },
              { label: 'Rx Refills', value: inboxCounts.rxRefills, critical: 0, icon: Pill, color: '#339966' },
              { label: 'My Patients', value: mockWorklistPatients.length, critical: 2, icon: Users, color: '#336699' },
              { label: 'Critical', value: 2, critical: 2, icon: AlertTriangle, color: '#cc0000' },
            ].map((stat) => (
              <div key={stat.label} className="flex-1 ehr-panel p-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-gray-600 uppercase">{stat.label}</div>
                    <div className="text-lg font-bold" style={{ color: stat.color }}>{stat.value}</div>
                  </div>
                  <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                {stat.critical > 0 && stat.label !== 'Critical' && (
                  <div className="text-[9px] text-red-600 mt-0.5">{stat.critical} critical</div>
                )}
              </div>
            ))}
          </div>

          {/* Inbox Panel */}
          <div className="ehr-panel flex-1 flex flex-col overflow-hidden">
            <div 
              className="ehr-header flex items-center justify-between cursor-pointer"
              onClick={() => togglePanel('inbox')}
            >
              <div className="flex items-center">
                {expandedPanels.inbox ? <FolderOpen className="w-4 h-4 mr-2" /> : <Folder className="w-4 h-4 mr-2" />}
                <span>Inbox</span>
                <span className="ml-2 px-1.5 py-0.5 bg-white/20 rounded text-[10px]">{inboxCounts.all} unread</span>
              </div>
              {expandedPanels.inbox ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </div>
            {expandedPanels.inbox && (
              <>
                <div className="ehr-subheader flex items-center space-x-1">
                  {[
                    { key: 'all', label: 'All', count: inboxCounts.all },
                    { key: 'results', label: 'Results', count: inboxCounts.results },
                    { key: 'messages', label: 'Messages', count: inboxCounts.messages },
                    { key: 'rxRefills', label: 'Rx Refills', count: inboxCounts.rxRefills },
                    { key: 'orders', label: 'Orders', count: inboxCounts.orders },
                    { key: 'cosign', label: 'Co-sign', count: inboxCounts.cosign },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setInboxTab(tab.key as InboxTab)}
                      className={`ehr-tab ${inboxTab === tab.key ? 'active' : ''}`}
                    >
                      {tab.label} {tab.count > 0 && <span className="ml-1 text-[9px]">({tab.count})</span>}
                    </button>
                  ))}
                  <span className="text-gray-400 mx-1">|</span>
                  <select 
                    value={inboxPriority} 
                    onChange={(e) => setInboxPriority(e.target.value as InboxPriority)}
                    className="ehr-input text-[10px] py-0"
                  >
                    <option value="all">All Priority</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="normal">Normal</option>
                  </select>
                  <select 
                    value={inboxReadFilter} 
                    onChange={(e) => setInboxReadFilter(e.target.value as InboxReadFilter)}
                    className="ehr-input text-[10px] py-0"
                  >
                    <option value="all">All</option>
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                  </select>
                  <div className="flex-1" />
                  <button className="ehr-toolbar-button p-0.5 text-[10px]" onClick={markAllAsRead}>Mark All Read</button>
                  <button className="ehr-toolbar-button p-0.5"><RefreshCw className="w-3 h-3" /></button>
                </div>
                <div className="flex-1 overflow-auto bg-white">
                  <table className="w-full text-[11px]">
                    <thead className="sticky top-0">
                      <tr>
                        <th className="px-1 py-1 text-left w-6"></th>
                        <th className="px-1 py-1 text-left w-6">Type</th>
                        <th className="px-1 py-1 text-left">Patient</th>
                        <th className="px-1 py-1 text-left">Subject</th>
                        <th className="px-1 py-1 text-left w-20">Time</th>
                        <th className="px-1 py-1 text-center w-16">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInbox.map((item, idx) => (
                        <tr 
                          key={item.id} 
                          className={`cursor-pointer ${item.priority === 'critical' ? 'ehr-alert-critical' : idx % 2 === 1 ? 'bg-gray-50' : ''} ${!item.read ? 'font-semibold' : ''}`}
                        >
                          <td className="px-1 py-0.5">
                            {!item.read && <span className="w-2 h-2 bg-blue-600 rounded-full inline-block" />}
                            {item.flagged && <Flag className="w-3 h-3 text-red-600 inline" />}
                          </td>
                          <td className="px-1 py-0.5">{getInboxIcon(item.type)}</td>
                          <td className="px-1 py-0.5">
                            <span>{item.patientName}</span>
                            <span className="text-gray-500 ml-1 text-[10px]">{item.patientMrn}</span>
                          </td>
                          <td className="px-1 py-0.5">
                            <div className={item.priority === 'critical' ? 'text-red-800' : ''}>{item.title}</div>
                            <div className="text-gray-500 text-[10px] truncate max-w-[300px]">{item.detail}</div>
                          </td>
                          <td className="px-1 py-0.5 text-gray-500">{item.timestamp}</td>
                          <td className="px-1 py-0.5 text-center">
                            <button className="ehr-toolbar-button p-0.5" onClick={() => { markAsRead(item.id); navigate(`/patients/1`); }} title="View"><Eye className="w-3 h-3" /></button>
                            <button className="ehr-toolbar-button p-0.5" onClick={() => markAsRead(item.id)} title="Mark Read"><CheckCircle2 className="w-3 h-3" /></button>
                            <button className="ehr-toolbar-button p-0.5" onClick={() => toggleFlag(item.id)} title="Flag"><Flag className={`w-3 h-3 ${item.flagged ? 'text-red-600' : ''}`} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>

          {/* Worklist Panel */}
          <div className="ehr-panel flex-1 flex flex-col overflow-hidden">
            <div 
              className="ehr-header flex items-center justify-between cursor-pointer"
              onClick={() => togglePanel('worklist')}
            >
              <div className="flex items-center">
                {expandedPanels.worklist ? <FolderOpen className="w-4 h-4 mr-2" /> : <Folder className="w-4 h-4 mr-2" />}
                <span>Patient Worklist</span>
                <span className="ml-2 px-1.5 py-0.5 bg-white/20 rounded text-[10px]">{mockWorklistPatients.length} patients</span>
              </div>
              {expandedPanels.worklist ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </div>
            {expandedPanels.worklist && (
              <>
                <div className="ehr-subheader flex items-center space-x-1">
                  {[
                    { key: 'all', label: 'All' },
                    { key: 'inpatient', label: 'Inpatient' },
                    { key: 'outpatient', label: 'Clinic' },
                    { key: 'critical', label: 'Critical' },
                  ].map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => setWorklistFilter(filter.key as WorklistFilter)}
                      className={`ehr-tab ${worklistFilter === filter.key ? 'active' : ''}`}
                    >
                      {filter.label}
                    </button>
                  ))}
                  <span className="text-gray-400 mx-1">|</span>
                  <span className="text-[10px] text-gray-600">Sort:</span>
                  <select 
                    value={worklistSort} 
                    onChange={(e) => setWorklistSort(e.target.value as WorklistSort)}
                    className="ehr-input text-[10px] py-0"
                  >
                    <option value="status">Status</option>
                    <option value="name">Name</option>
                    <option value="location">Location</option>
                  </select>
                  <button 
                    className="ehr-toolbar-button p-0.5 text-[10px]" 
                    onClick={() => setWorklistSortAsc(!worklistSortAsc)}
                  >
                    {worklistSortAsc ? '↑' : '↓'}
                  </button>
                  <div className="flex-1" />
                  <button className="ehr-button text-[10px] px-2 py-0.5 flex items-center" onClick={() => setShowPrintDialog(true)}>
                    <Printer className="w-3 h-3 mr-1" /> Print List
                  </button>
                </div>
                <div className="flex-1 overflow-auto bg-white">
                  <table className="w-full text-[11px]">
                    <thead className="sticky top-0">
                      <tr>
                        <th className="px-1 py-1 text-left">Patient</th>
                        <th className="px-1 py-1 text-left">Location</th>
                        <th className="px-1 py-1 text-left">Chief Complaint</th>
                        <th className="px-1 py-1 text-left">Vitals</th>
                        <th className="px-1 py-1 text-left">Alerts</th>
                        <th className="px-1 py-1 text-left">Status</th>
                        <th className="px-1 py-1 text-center w-16">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredWorklist.map((patient, idx) => (
                        <tr 
                          key={patient.id} 
                          className={`cursor-pointer hover:bg-blue-50 ${patient.status === 'critical' ? 'ehr-alert-critical' : idx % 2 === 1 ? 'bg-gray-50' : ''}`}
                          onClick={() => navigate(`/patients/${patient.id}`)}
                        >
                          <td className="px-1 py-0.5">
                            <div className="font-semibold">{patient.name}</div>
                            <div className="text-gray-500 text-[10px]">{patient.mrn} • {patient.age}{patient.gender}</div>
                            <div className="flex space-x-0.5 mt-0.5">
                              {patient.flags.map((flag) => {
                                const style = getFlagStyle(flag);
                                return (
                                  <span key={flag} className={`px-1 py-0 rounded text-[9px] ${style.bg} ${style.color}`}>
                                    {style.label}
                                  </span>
                                );
                              })}
                            </div>
                          </td>
                          <td className="px-1 py-0.5">
                            <div>{patient.room || patient.appointmentTime}</div>
                            <div className="text-gray-500 text-[10px]">{patient.location}</div>
                          </td>
                          <td className="px-1 py-0.5">
                            <div>{patient.chiefComplaint}</div>
                            {patient.admitDate && <div className="text-gray-500 text-[10px]">Admit: {patient.admitDate}</div>}
                          </td>
                          <td className="px-1 py-0.5 text-[10px]">
                            {patient.lastVitals ? (
                              <>
                                <div>BP: <span className={parseInt(patient.lastVitals.bp) > 140 ? 'text-red-600 font-semibold' : ''}>{patient.lastVitals.bp}</span></div>
                                <div>HR: {patient.lastVitals.hr} SpO2: {patient.lastVitals.spo2}%</div>
                              </>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-1 py-0.5">
                            {patient.alerts.length > 0 ? (
                              <div className="space-y-0.5">
                                {patient.alerts.slice(0, 2).map((alert, i) => (
                                  <div key={i} className={`text-[10px] ${alert.includes('CRITICAL') || alert.includes('Troponin') ? 'text-red-700 font-semibold' : 'text-amber-700'}`}>
                                    • {alert}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-400 text-[10px]">None</span>
                            )}
                          </td>
                          <td className="px-1 py-0.5">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] ${getStatusStyle(patient.status)}`}>
                              {patient.status.replace('-', ' ')}
                            </span>
                          </td>
                          <td className="px-1 py-0.5 text-center">
                            <button onClick={(e) => { e.stopPropagation(); }} className="ehr-toolbar-button p-0.5" title="Open Chart">
                              <ExternalLink className="w-3 h-3" />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); }} className="ehr-toolbar-button p-0.5" title="Write Note">
                              <Edit3 className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Column - Sidebar Panels */}
        <div className="w-72 flex flex-col space-y-1 overflow-auto">
          {/* Unsigned Notes */}
          <div className="ehr-panel">
            <div 
              className="ehr-header flex items-center justify-between cursor-pointer"
              onClick={() => togglePanel('unsigned')}
            >
              <div className="flex items-center">
                <Edit3 className="w-4 h-4 mr-2" />
                <span>Unsigned Notes</span>
                <span className="ml-2 px-1.5 py-0.5 bg-amber-500 text-white rounded text-[10px]">{mockUnsignedNotes.length}</span>
              </div>
              {expandedPanels.unsigned ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </div>
            {expandedPanels.unsigned && (
              <div className="bg-white">
                {mockUnsignedNotes.map((note, idx) => (
                  <div key={note.id} className={`px-2 py-1.5 border-b border-gray-200 flex items-center justify-between ${idx % 2 === 1 ? 'bg-gray-50' : ''}`}>
                    <div>
                      <div className="font-semibold text-[11px]">{note.patientName}</div>
                      <div className="text-[10px] text-gray-500">{note.type} • {note.date}</div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {note.daysOld >= 2 && <span className="text-[9px] text-red-600 font-semibold">{note.daysOld}d</span>}
                      <button className="ehr-button ehr-button-primary text-[10px] px-2 py-0.5">Sign</button>
                    </div>
                  </div>
                ))}
                <div className="p-1 bg-gray-100 border-t">
                  <button className="ehr-button w-full text-[10px]">Sign All Notes</button>
                </div>
              </div>
            )}
          </div>

          {/* Pending Orders */}
          <div className="ehr-panel">
            <div 
              className="ehr-header flex items-center justify-between cursor-pointer"
              onClick={() => togglePanel('orders')}
            >
              <div className="flex items-center">
                <ClipboardCheck className="w-4 h-4 mr-2" />
                <span>Pending Orders</span>
                <span className="ml-2 px-1.5 py-0.5 bg-blue-500 text-white rounded text-[10px]">{mockPendingOrders.length}</span>
              </div>
              {expandedPanels.orders ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </div>
            {expandedPanels.orders && (
              <div className="bg-white">
                {mockPendingOrders.map((order, idx) => (
                  <div key={order.id} className={`px-2 py-1.5 border-b border-gray-200 ${idx % 2 === 1 ? 'bg-gray-50' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-[11px]">{order.patientName}</div>
                        <div className="text-[10px] text-gray-700">{order.order}</div>
                        <div className="flex space-x-1 mt-0.5">
                          <span className="text-[9px] px-1 py-0 bg-gray-200 text-gray-700 rounded">{order.type}</span>
                          <span className={`text-[9px] px-1 py-0 rounded ${
                            order.status === 'draft' ? 'bg-gray-200 text-gray-700' :
                            order.status === 'pending-approval' ? 'bg-amber-200 text-amber-800' :
                            'bg-blue-200 text-blue-800'
                          }`}>{order.status}</span>
                        </div>
                      </div>
                      <button className="ehr-button text-[10px] px-2 py-0.5">Review</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Today's Schedule */}
          <div className="ehr-panel">
            <div 
              className="ehr-header flex items-center justify-between cursor-pointer"
              onClick={() => togglePanel('schedule')}
            >
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Today's Schedule</span>
              </div>
              {expandedPanels.schedule ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </div>
            {expandedPanels.schedule && (
              <div className="bg-white p-2">
                <div className="flex items-center justify-between mb-2 text-[11px]">
                  <span className="text-gray-500">January 18, 2024</span>
                  <span className="font-semibold">8 appointments</span>
                </div>
                <div className="space-y-1">
                  {[
                    { time: '9:00 AM', patient: 'Completed (3)', status: 'done' },
                    { time: '10:30 AM', patient: 'Johnson, Sarah', status: 'current' },
                    { time: '11:00 AM', patient: 'Williams, Michael', status: 'next' },
                    { time: '11:30 AM', patient: 'Brown, Emily', status: 'upcoming' },
                    { time: '2:00 PM', patient: 'Wilson, Patricia', status: 'upcoming' },
                  ].map((slot, i) => (
                    <div key={i} className={`flex items-center justify-between py-1 px-2 text-[11px] ${
                      slot.status === 'current' ? 'bg-blue-100 border border-blue-300' :
                      slot.status === 'next' ? 'bg-blue-50' :
                      slot.status === 'done' ? 'bg-gray-100 text-gray-400' : ''
                    }`}>
                      <span>{slot.time}</span>
                      <span className={slot.status === 'current' ? 'font-semibold text-blue-800' : ''}>{slot.patient}</span>
                    </div>
                  ))}
                </div>
                <button className="ehr-button w-full mt-2 text-[10px]">View Full Schedule</button>
              </div>
            )}
          </div>

          {/* Quality Measures */}
          <div className="ehr-panel">
            <div 
              className="ehr-header flex items-center justify-between cursor-pointer"
              onClick={() => togglePanel('quality')}
            >
              <div className="flex items-center">
                <Activity className="w-4 h-4 mr-2" />
                <span>Quality Measures</span>
              </div>
              {expandedPanels.quality ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </div>
            {expandedPanels.quality && (
              <div className="bg-white p-2 space-y-2">
                {[
                  { measure: 'DM: HbA1c Control', target: 85, current: 78, trend: 'up' },
                  { measure: 'HTN: BP Control', target: 80, current: 82, trend: 'up' },
                  { measure: 'Colorectal Screening', target: 75, current: 68, trend: 'down' },
                  { measure: 'Breast CA Screening', target: 80, current: 76, trend: 'up' },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between text-[11px]">
                      <span>{item.measure}</span>
                      <div className="flex items-center">
                        <span className={item.current >= item.target ? 'text-green-700' : 'text-amber-700'}>{item.current}%</span>
                        {item.trend === 'up' ? (
                          <TrendingUp className="w-3 h-3 text-green-600 ml-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-red-600 ml-1" />
                        )}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 h-1.5 mt-0.5">
                      <div 
                        className={`h-1.5 ${item.current >= item.target ? 'bg-green-500' : 'bg-amber-500'}`}
                        style={{ width: `${item.current}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="ehr-panel">
            <div className="ehr-header flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              <span>Quick Links</span>
            </div>
            <div className="bg-white p-2 grid grid-cols-2 gap-1">
              {[
                { icon: FlaskConical, label: 'Lab Results' },
                { icon: Radio, label: 'Imaging' },
                { icon: Pill, label: 'e-Prescribe' },
                { icon: Stethoscope, label: 'Consults' },
                { icon: Syringe, label: 'Immunizations' },
                { icon: FileText, label: 'Documents' },
                { icon: Users, label: 'Care Team' },
                { icon: Phone, label: 'On-Call' },
              ].map((link, i) => (
                <button key={i} className="ehr-button flex items-center justify-center py-1.5 text-[10px]">
                  <link.icon className="w-3 h-3 mr-1" />
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="ehr-panel">
            <div className="p-2 text-[10px]" style={{ background: 'linear-gradient(to bottom, #336699 0%, #1a4080 100%)', color: 'white' }}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold">System Status</span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse" />
                  Operational
                </span>
              </div>
              <div className="space-y-0.5 text-white/80">
                <div>Last sync: 2 minutes ago</div>
                <div>HL7 Interface: Connected</div>
                <div>Pharmacy Link: Active</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="ehr-status-bar flex items-center justify-between">
        <span>Dr. Sarah Anderson, MD | Internal Medicine | Logged in 2h 34m</span>
        <span>Last refreshed: {new Date().toLocaleTimeString()}</span>
      </div>

      {/* Dialogs */}
      <PrintDialog
        isOpen={showPrintDialog}
        onClose={() => setShowPrintDialog(false)}
        onPrint={(options) => {
          console.log('Print options:', options);
          setShowPrintDialog(false);
          setShowAlert({ title: 'Print Sent', message: `Document sent to printer (${options.action}).`, type: 'success' });
        }}
        title="Print Dashboard"
        documentName="Dashboard Summary"
      />

      <PrescriptionDialog
        isOpen={showRxDialog}
        onClose={() => setShowRxDialog(false)}
        onSubmit={(rx) => {
          console.log('New Rx:', rx);
          setShowRxDialog(false);
          setShowAlert({ title: 'Prescription Sent', message: `${rx.medication} ${rx.strength} sent to ${rx.pharmacy}.`, type: 'success' });
        }}
      />

      <OrderDialog
        isOpen={showLabDialog}
        onClose={() => setShowLabDialog(false)}
        type="lab"
        onSubmit={(orders) => {
          console.log('Lab order:', orders);
          setShowLabDialog(false);
          setShowAlert({ title: 'Lab Order Placed', message: `${orders.length} test(s) ordered.`, type: 'success' });
        }}
      />

      <OrderDialog
        isOpen={showImagingDialog}
        onClose={() => setShowImagingDialog(false)}
        type="imaging"
        onSubmit={(orders) => {
          console.log('Imaging order:', orders);
          setShowImagingDialog(false);
          setShowAlert({ title: 'Imaging Order Placed', message: `${orders.length} study(ies) ordered.`, type: 'success' });
        }}
      />

      {showAlert && (
        <AlertDialog
          isOpen={true}
          onClose={() => setShowAlert(null)}
          title={showAlert.title}
          message={showAlert.message}
          type={showAlert.type}
        />
      )}
    </div>
  );
}
