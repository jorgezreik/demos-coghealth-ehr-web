import { Card, CardHeader } from '../components/ui';
import { Users, Calendar, AlertTriangle, Activity, TrendingUp, Clock } from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    { label: 'Patients Today', value: '24', icon: Users, change: '+3 from yesterday' },
    { label: 'Appointments', value: '18', icon: Calendar, change: '6 remaining' },
    { label: 'Critical Alerts', value: '2', icon: AlertTriangle, change: 'Requires attention' },
    { label: 'Lab Results', value: '12', icon: Activity, change: '4 pending review' },
  ];

  const recentPatients = [
    { name: 'Smith, John', mrn: 'MRN001234', time: '9:30 AM', type: 'Follow-up' },
    { name: 'Johnson, Sarah', mrn: 'MRN001235', time: '10:00 AM', type: 'New Patient' },
    { name: 'Williams, Michael', mrn: 'MRN001236', time: '10:30 AM', type: 'Lab Review' },
    { name: 'Brown, Emily', mrn: 'MRN001237', time: '11:00 AM', type: 'Telehealth' },
  ];

  const tasks = [
    { task: 'Review lab results for Smith, John', priority: 'high', due: 'Today' },
    { task: 'Sign progress note - Johnson, Sarah', priority: 'medium', due: 'Today' },
    { task: 'Medication refill request - Williams, Michael', priority: 'low', due: 'Tomorrow' },
    { task: 'Complete discharge summary', priority: 'medium', due: 'Today' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Good morning, Dr. Anderson</h1>
        <p className="text-gray-500">Here's your overview for today</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                </div>
                <div className="p-3 bg-primary-100 rounded-lg">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader 
            title="Today's Schedule" 
            subtitle="Upcoming appointments"
            action={
              <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                View all
              </button>
            }
          />
          <div className="space-y-4">
            {recentPatients.map((patient, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{patient.name}</p>
                    <p className="text-sm text-gray-500">{patient.mrn}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{patient.time}</p>
                  <p className="text-xs text-gray-500">{patient.type}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader 
            title="Tasks" 
            subtitle="Items requiring your attention"
            action={
              <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                View all
              </button>
            }
          />
          <div className="space-y-3">
            {tasks.map((task, index) => (
              <div 
                key={index}
                className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                <input 
                  type="checkbox" 
                  className="mt-1 h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{task.task}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      task.priority === 'high' 
                        ? 'bg-red-100 text-red-700'
                        : task.priority === 'medium'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {task.priority}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {task.due}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
