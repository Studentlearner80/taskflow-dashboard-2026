import { useMemo, useState } from 'react';
import './App.css';

type Task = {
  id: number;
  title: string;
  employee: string;
  store: string;
  date: string;
  status: 'Pending' | 'In Progress' | 'Completed';
};

const initialTasks: Task[] = [
  {
    id: 101,
    title: 'Check store inventory',
    employee: 'Ayesha Khan',
    store: 'Store A',
    date: '2026-10-24',
    status: 'Pending',
  },
  {
    id: 102,
    title: 'Update sales report',
    employee: 'Rahul Shah',
    store: 'Store B',
    date: '2026-10-23',
    status: 'In Progress',
  },
  {
    id: 103,
    title: 'Review staff attendance',
    employee: 'Sara Ali',
    store: 'Store C',
    date: '2026-10-22',
    status: 'Completed',
  },
  {
    id: 104,
    title: 'Verify daily transactions',
    employee: 'Mohammed Khan',
    store: 'Store A',
    date: '2026-10-24',
    status: 'Pending',
  },
  {
    id: 105,
    title: 'Organise product display',
    employee: 'Ayesha Khan',
    store: 'Store B',
    date: '2026-10-20',
    status: 'Completed',
  },
];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [storeFilter, setStoreFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [employee, setEmployee] = useState('');
  const [store, setStore] = useState('Store A');
  const [date, setDate] = useState('2026-10-25');
  const [error, setError] = useState('');

  const today = new Date().toISOString().slice(0, 10);

  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) => {
        const matchesSearch = `${task.title} ${task.employee} ${task.store}`
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesStatus =
          statusFilter === 'All' || task.status === statusFilter;
        const matchesStore =
          storeFilter === 'All' || task.store === storeFilter;
        return matchesSearch && matchesStatus && matchesStore;
      }),
    [tasks, search, statusFilter, storeFilter]
  );

  const completed = tasks.filter((t) => t.status === 'Completed').length;
  const pending = tasks.filter((t) => t.status === 'Pending').length;
  const overdue = tasks.filter(
    (t) => t.status !== 'Completed' && t.date < today
  ).length;

  function openNewTask() {
    setEditingId(null);
    setTitle('');
    setEmployee('');
    setStore('Store A');
    setDate(today);
    setError('');
    setShowForm(true);
  }

  function openEditTask(task: Task) {
    setEditingId(task.id);
    setTitle(task.title);
    setEmployee(task.employee);
    setStore(task.store);
    setDate(task.date);
    setError('');
    setShowForm(true);
  }

  function saveTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !employee.trim() || !date) {
      setError('Please complete all required fields.');
      return;
    }

    if (editingId !== null) {
      setTasks((old) =>
        old.map((task) =>
          task.id === editingId
            ? {
                ...task,
                title: title.trim(),
                employee: employee.trim(),
                store,
                date,
              }
            : task
        )
      );
    } else {
      setTasks((old) => [
        ...old,
        {
          id: Date.now(),
          title: title.trim(),
          employee: employee.trim(),
          store,
          date,
          status: 'Pending',
        },
      ]);
    }

    setShowForm(false);
    setError('');
  }

  function changeStatus(id: number, status: Task['status']) {
    setTasks((old) =>
      old.map((task) => (task.id === id ? { ...task, status } : task))
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">✓</span> TaskFlow
        </div>
        <div className="nav-label">WORKSPACE</div>
        <div className="nav-item active">▦ &nbsp; Dashboard</div>
        <div className="nav-item">☷ &nbsp; All Tasks</div>
        <div className="nav-item">◷ &nbsp; Schedule</div>
        <div className="nav-label">MANAGEMENT</div>
        <div className="nav-item">♙ &nbsp; Employees</div>
        <div className="nav-item">▤ &nbsp; Reports</div>
        <div className="sidebar-bottom">
          <div className="avatar">AD</div>
          <div>
            <strong>Admin User</strong>
            <small>Administrator</small>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace / <strong>Dashboard</strong>
          </div>
          <div className="top-actions">
            <span className="today-label">
              ◷ &nbsp;{' '}
              {new Date().toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
            <div className="avatar">AD</div>
          </div>
        </header>

        <section className="page-content">
          <div className="welcome-row">
            <div>
              <p className="eyebrow">OVERVIEW</p>
              <h1>Task Dashboard</h1>
              <p className="subtitle">
                Manage your team's tasks and track progress.
              </p>
            </div>
            <button className="primary-button" onClick={openNewTask}>
              ＋ Create Task
            </button>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-top">
                <span>Total Tasks</span>
                <span className="stat-icon purple">▤</span>
              </div>
              <div className="stat-number">{tasks.length}</div>
              <div className="stat-note">All assigned tasks</div>
            </div>
            <div className="stat-card">
              <div className="stat-top">
                <span>Pending</span>
                <span className="stat-icon amber">◷</span>
              </div>
              <div className="stat-number">{pending}</div>
              <div className="stat-note">Awaiting action</div>
            </div>
            <div className="stat-card">
              <div className="stat-top">
                <span>Completed</span>
                <span className="stat-icon green">✓</span>
              </div>
              <div className="stat-number">{completed}</div>
              <div className="stat-note">Successfully finished</div>
            </div>
            <div className="stat-card">
              <div className="stat-top">
                <span>Overdue</span>
                <span className="stat-icon red">!</span>
              </div>
              <div className="stat-number">{overdue}</div>
              <div className="stat-note">Past due date</div>
            </div>
          </div>

          <section className="task-panel">
            <div className="panel-heading">
              <div>
                <h2>All Tasks</h2>
                <p>View and manage your team's assignments.</p>
              </div>
              <span className="task-count">{filteredTasks.length} tasks</span>
            </div>
            <div className="filters">
              <div className="search-box">
                <span>⌕</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search tasks, employees..."
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>All</option>
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
              <select
                value={storeFilter}
                onChange={(e) => setStoreFilter(e.target.value)}
              >
                <option>All</option>
                <option>Store A</option>
                <option>Store B</option>
                <option>Store C</option>
              </select>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>TASK</th>
                    <th>ASSIGNED TO</th>
                    <th>STORE</th>
                    <th>DUE DATE</th>
                    <th>STATUS</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task) => (
                    <tr key={task.id}>
                      <td>
                        <strong>{task.title}</strong>
                        <small>Task #{task.id}</small>
                      </td>
                      <td>
                        <div className="employee-cell">
                          <span className="mini-avatar">
                            {task.employee
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)}
                          </span>
                          {task.employee}
                        </div>
                      </td>
                      <td>{task.store}</td>
                      <td>
                        {new Date(task.date + 'T00:00:00').toLocaleDateString(
                          'en-IN',
                          { day: '2-digit', month: 'short', year: 'numeric' }
                        )}
                      </td>
                      <td>
                        <select
                          className={`status-select status-${task.status
                            .toLowerCase()
                            .replace(' ', '-')}`}
                          value={task.status}
                          onChange={(e) =>
                            changeStatus(
                              task.id,
                              e.target.value as Task['status']
                            )
                          }
                        >
                          <option>Pending</option>
                          <option>In Progress</option>
                          <option>Completed</option>
                        </select>
                      </td>
                      <td>
                        <button
                          className="edit-button"
                          onClick={() => openEditTask(task)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredTasks.length === 0 && (
                    <tr>
                      <td colSpan={6} className="empty-state">
                        No tasks found. Try changing your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
          <p className="footer-note">
            TaskFlow Dashboard · Team productivity at a glance
          </p>
        </section>
      </main>

      {showForm && (
        <div className="modal-backdrop" onClick={() => setShowForm(false)}>
          <section className="task-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-heading">
              <div>
                <h2>{editingId !== null ? 'Edit Task' : 'Create New Task'}</h2>
                <p>Enter the task details below.</p>
              </div>
              <button
                className="close-button"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={saveTask}>
              <label>
                Task title *
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Review monthly report"
                />
              </label>
              <label>
                Assign to employee *
                <input
                  value={employee}
                  onChange={(e) => setEmployee(e.target.value)}
                  placeholder="Employee name"
                />
              </label>
              <div className="form-row">
                <label>
                  Store
                  <select
                    value={store}
                    onChange={(e) => setStore(e.target.value)}
                  >
                    <option>Store A</option>
                    <option>Store B</option>
                    <option>Store C</option>
                  </select>
                </label>
                <label>
                  Due date *
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </label>
              </div>
              {error && <p className="form-error">{error}</p>}
              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button className="primary-button" type="submit">
                  {editingId !== null ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
