import React from 'react';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Layers, 
  ArrowUpRight 
} from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { label: 'Total Tasks', value: 12, icon: Layers, color: 'text-primary-600 bg-primary-100' },
    { label: 'In Progress', value: 5, icon: Clock, color: 'text-accent-600 bg-accent-50' },
    { label: 'In Review', value: 3, icon: AlertCircle, color: 'text-warning-500 bg-warning-50' },
    { label: 'Completed', value: 4, icon: CheckCircle, color: 'text-success-600 bg-success-50' }
  ];

  const recentTasks = [
    { id: 1, title: 'Thiết kế giao diện trang chủ', assignee: 'Nguyen Van A', priority: 'High', status: 'In Progress', dueDate: '31/05/2026' },
    { id: 2, title: 'Viết API xác thực người dùng', assignee: 'Tran Thi B', priority: 'Medium', status: 'In Review', dueDate: '30/05/2026' },
    { id: 3, title: 'Cấu hình Socket.io thông báo', assignee: 'Le Van C', priority: 'Urgent', status: 'In Progress', dueDate: '02/06/2026' },
    { id: 4, title: 'Tối ưu hóa truy vấn MongoDB', assignee: 'Pham Van D', priority: 'Low', status: 'Completed', dueDate: '28/05/2026' }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent': return 'bg-danger-50 text-danger-500 border-danger-500/10';
      case 'High': return 'bg-warning-50 text-warning-500 border-warning-500/10';
      case 'Medium': return 'bg-accent-50 text-accent-500 border-accent-500/10';
      default: return 'bg-primary-100 text-primary-600 border-primary-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'text-success-500';
      case 'In Review': return 'text-warning-500';
      case 'In Progress': return 'text-accent-500';
      default: return 'text-primary-500';
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-md-custom border border-primary-200 shadow-sm-flat flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-primary-500 uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-2xl font-bold text-primary-900 mt-1">{stat.value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-md-custom flex items-center justify-center ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-md-custom border border-primary-200 shadow-sm-flat p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-primary-900">Recent Tasks</h3>
            <button className="text-xs font-semibold text-accent-500 hover:text-accent-600 flex items-center gap-1">
              View all
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-primary-100 text-xs font-semibold text-primary-500 uppercase">
                  <th className="pb-3">Task Title</th>
                  <th className="pb-3">Assignee</th>
                  <th className="pb-3">Priority</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-100 text-sm">
                {recentTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-primary-50/50 transition-colors">
                    <td className="py-3.5 font-medium text-primary-900">{task.title}</td>
                    <td className="py-3.5 text-primary-600">{task.assignee}</td>
                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 text-xs font-semibold border rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className={`py-3.5 font-semibold ${getStatusColor(task.status)}`}>
                      {task.status}
                    </td>
                    <td className="py-3.5 text-primary-500">{task.dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-md-custom border border-primary-200 shadow-sm-flat p-6">
          <h3 className="text-base font-bold text-primary-900 mb-6">Project Activity</h3>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-2.5 h-2.5 rounded-full bg-accent-500 mt-1.5 shrink-0"></div>
              <div>
                <p className="text-sm text-primary-800 font-medium">Nguyen Van A đã thêm bình luận mới</p>
                <span className="text-xs text-primary-400">10 phút trước</span>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-2.5 h-2.5 rounded-full bg-success-500 mt-1.5 shrink-0"></div>
              <div>
                <p className="text-sm text-primary-800 font-medium">Tran Thi B hoàn thành Task #12</p>
                <span className="text-xs text-primary-400">1 giờ trước</span>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-2.5 h-2.5 rounded-full bg-warning-500 mt-1.5 shrink-0"></div>
              <div>
                <p className="text-sm text-primary-800 font-medium">Thay đổi trạng thái dự án sang Active</p>
                <span className="text-xs text-primary-400">4 giờ trước</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
