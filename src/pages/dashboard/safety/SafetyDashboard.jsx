import { useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { syncSafetyTasks } from '../../../api/safetyApi';
import { toast } from '../../../utils/toast';

const navItems = [
  { path: '/dashboard/safety/inspections', label: 'Inspections' },
  { path: '/dashboard/safety/incidents', label: 'Incidents' },
  { path: '/dashboard/safety/tasks', label: 'My Tasks' },
  { path: '/dashboard/reports/overview', label: 'Analytics' },
];

const SafetyDashboard = () => {
  useEffect(() => {
    const sync = async () => {
      try {
        const res = await syncSafetyTasks();
        if (res.data?.newTasksSynced > 0) {
          toast.info(`Synced ${res.data.newTasksSynced} new safety tasks from Project Manager`);
        }
      } catch (err) {
        console.warn('Task sync failed', err);
      }
    };
    sync();
  }, []);

  return <DashboardLayout navItems={navItems} />;
};

export default SafetyDashboard;
