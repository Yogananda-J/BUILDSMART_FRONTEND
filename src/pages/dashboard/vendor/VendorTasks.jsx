import { useState, useEffect } from 'react';
import { getVendorTasks, updateVendorTaskStatus } from '../../../api/vendorApi';
import { toast } from '../../../utils/toast';
import StatusBadge from '../../../components/common/StatusBadge';
import PageHeader, { RefreshButton } from '../../../components/common/PageHeader';
import EmptyState from '../../../components/common/EmptyState';
import { FaTasks, FaCalendarAlt } from 'react-icons/fa';

const VendorTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getVendorTasks();
      const data = res.data?.data || res.data?.content || (Array.isArray(res.data) ? res.data : []);
      setTasks(data);
    } catch (err) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateVendorTaskStatus(taskId, { status: newStatus });
      toast.success('Task status updated');
      fetchData();
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const filteredTasks = tasks.filter(t => filter === 'ALL' || t.status === filter);

  return (
    <div>
      <PageHeader title="Vendor Tasks" subtitle="Tasks and deliverables assigned to your vendor account">
        <RefreshButton onClick={fetchData} loading={loading} />
      </PageHeader>

      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
        <div className="p-4" style={{ borderBottom: '1px solid #f1f5f9', display: 'flex', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f8fafc', padding: '0.4rem', borderRadius: '50rem' }}>
            {['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                style={{
                  padding: '0.4rem 1rem', borderRadius: '50rem', border: 'none',
                  fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.2s',
                  background: filter === status ? '#fff' : 'transparent',
                  color: filter === status ? '#4f46e5' : '#64748b',
                  boxShadow: filter === status ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5"><div className="spinner-border" style={{ color: '#6366f1' }} /></div>
        ) : filteredTasks.length === 0 ? (
          <EmptyState icon={FaTasks} title="No tasks found" message="You don't have any pending tasks or deliverables." />
        ) : (
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Task Name</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Related Ref</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Due Date</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Priority</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map(task => {
                  const taskId = task.taskId || task.assignedTaskId || task.id;
                  const refId = task.projectId || task.referenceId || taskId;
                  let dateVal = task.dueDate || task.deadline || task.endDate || task.plannedEnd || task.plannedStart;
                  
                  if (!dateVal && task.description && task.description.includes('Planned:')) {
                    const match = task.description.match(/\d{4}-\d{2}-\d{2}/);
                    if (match) dateVal = match[0];
                  }

                  const priority = (task.priority || 'MEDIUM').toUpperCase();
                  const priorityColors = {
                    HIGH: { bg: '#fee2e2', text: '#991b1b', label: 'High' },
                    MEDIUM: { bg: '#fef3c7', text: '#92400e', label: 'Medium' },
                    LOW: { bg: '#dbeafe', text: '#1e40af', label: 'Low' }
                  };
                  const pStyle = priorityColors[priority] || priorityColors.MEDIUM;

                  return (
                    <tr key={taskId} style={{ borderBottom: '1px solid #f1f5f9', transition: 'all 0.2s' }} className="task-row-hover">
                      <td style={{ padding: '1.5rem 1rem', width: '45%' }}>
                        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 12, border: '1px solid #edf2f7' }}>
                          <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.05rem', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                            <FaTasks style={{ color: '#6366f1' }} size={16} />
                            {task.taskName || task.title || task.description?.split('.')[0] || 'Task Assignment'}
                          </div>
                          <div style={{ fontSize: '0.9rem', color: '#334155', lineHeight: '1.6', fontWeight: 500 }}>
                            {task.description}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1.5rem 1rem' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 6 }}>Reference</div>
                        <div style={{ fontFamily: 'monospace', background: '#fff', border: '1px solid #e2e8f0', padding: '0.4rem 0.75rem', borderRadius: 8, fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'inline-block', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                          {refId}
                        </div>
                      </td>
                      <td style={{ padding: '1.5rem 1rem' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 6 }}>Due Date</div>
                        <div className="d-flex align-items-center gap-2" style={{ fontSize: '0.95rem', color: '#1e293b', fontWeight: 600 }}>
                          <FaCalendarAlt size={14} style={{ color: '#6366f1' }} />
                          {dateVal ? new Date(dateVal).toLocaleDateString() : 'No date'}
                        </div>
                      </td>
                      <td style={{ padding: '1.5rem 1rem' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 6 }}>Priority</div>
                        <span style={{ 
                          padding: '0.4rem 1rem', borderRadius: '50rem', fontSize: '0.75rem', fontWeight: 800,
                          background: pStyle.bg, color: pStyle.text, textTransform: 'uppercase', boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        }}>
                          {pStyle.label}
                        </span>
                      </td>
                      <td style={{ padding: '1.5rem 1rem' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 6 }}>Update Status</div>
                        <select
                          value={task.status}
                          onChange={(e) => handleStatusChange(taskId, e.target.value)}
                          className="form-select form-select-sm border-0 fw-bold rounded-pill shadow-sm"
                          style={{ 
                            width: 'fit-content', fontSize: '0.8rem', height: 38, paddingLeft: '1rem', paddingRight: '2.5rem',
                            background: (task.status?.toUpperCase() === 'COMPLETED' || task.status?.toUpperCase() === 'DONE') ? '#d1fae5' : (task.status?.toUpperCase() === 'IN_PROGRESS' || task.status?.toUpperCase() === 'DOING') ? '#dbeafe' : '#fff',
                            color: (task.status?.toUpperCase() === 'COMPLETED' || task.status?.toUpperCase() === 'DONE') ? '#065f46' : (task.status?.toUpperCase() === 'IN_PROGRESS' || task.status?.toUpperCase() === 'DOING') ? '#1e40af' : '#475569',
                            border: '1px solid #e2e8f0 !important'
                          }}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="COMPLETED">Completed</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorTasks;
