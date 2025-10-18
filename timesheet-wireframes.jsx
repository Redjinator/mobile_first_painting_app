import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Clock, User, MapPin, Building, Home, Plus, Edit, Trash2, CheckCircle, Circle, Menu, Bell, Search, MoreVertical } from 'lucide-react';

// Main App Component
export default function TimesheetApp() {
  const [currentView, setCurrentView] = useState('admin-dashboard');
  const [userRole, setUserRole] = useState('admin');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Role Switcher for Demo */}
      <div className="bg-blue-600 text-white p-2 text-center text-sm">
        <span className="mr-4">Demo Mode:</span>
        <button
          onClick={() => {
            setUserRole('admin');
            setCurrentView('admin-dashboard');
          }}
          className={`px-3 py-1 rounded mr-2 ${userRole === 'admin' ? 'bg-white text-blue-600' : 'bg-blue-500'}`}
        >
          Admin View
        </button>
        <button
          onClick={() => {
            setUserRole('employee');
            setCurrentView('employee-dashboard');
          }}
          className={`px-3 py-1 rounded ${userRole === 'employee' ? 'bg-white text-blue-600' : 'bg-blue-500'}`}
        >
          Employee View
        </button>
      </div>

      {/* Render Current View */}
      {currentView === 'admin-dashboard' && <AdminDashboard onNavigate={setCurrentView} />}
      {currentView === 'admin-site-detail' && <AdminSiteDetail onNavigate={setCurrentView} />}
      {currentView === 'admin-time-tracking' && <AdminTimeTracking onNavigate={setCurrentView} />}
      {currentView === 'employee-dashboard' && <EmployeeDashboard onNavigate={setCurrentView} />}
      {currentView === 'employee-clock' && <EmployeeClock onNavigate={setCurrentView} />}
      {currentView === 'employee-progress' && <EmployeeProgress onNavigate={setCurrentView} />}
    </div>
  );
}

// Admin Dashboard
function AdminDashboard({ onNavigate }) {
  const [sortBy, setSortBy] = useState('completion');

  const sites = [
    { id: 1, name: 'Riverside Tower', address: '123 Main St', completion: 67, supervisor: 'John Smith', activeWorkers: 8, startDate: '2025-09-15' },
    { id: 2, name: 'Downtown Complex', address: '456 Oak Ave', completion: 42, supervisor: 'Sarah Johnson', activeWorkers: 12, startDate: '2025-10-01' },
    { id: 3, name: 'Sunset Apartments', address: '789 Pine Rd', completion: 89, supervisor: 'Mike Davis', activeWorkers: 5, startDate: '2025-08-20' },
  ];

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <User className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search sites or employees..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-blue-600">3</div>
            <div className="text-xs text-gray-600">Active Sites</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-green-600">25</div>
            <div className="text-xs text-gray-600">Clocked In</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-orange-600">66%</div>
            <div className="text-xs text-gray-600">Avg Progress</div>
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Job Sites</h2>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500"
          >
            <option value="completion">By Completion</option>
            <option value="startDate">By Start Date</option>
            <option value="supervisor">By Supervisor</option>
          </select>
        </div>

        {/* Job Sites List */}
        <div className="space-y-3">
          {sites.map((site) => (
            <div key={site.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{site.name}</h3>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {site.address}
                    </div>
                  </div>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-semibold text-gray-900">{site.completion}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        site.completion < 50 ? 'bg-red-500' :
                        site.completion < 75 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${site.completion}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <User className="w-4 h-4 mr-1" />
                    {site.supervisor}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    {site.activeWorkers} active
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('admin-site-detail')}
                  className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700"
                >
                  Manage Site
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Site Button */}
        <button className="w-full mt-4 bg-white border-2 border-dashed border-gray-300 text-gray-600 py-3 rounded-lg font-medium hover:border-blue-500 hover:text-blue-600 flex items-center justify-center">
          <Plus className="w-5 h-5 mr-2" />
          Add New Job Site
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex items-center justify-around py-2">
          <button className="flex flex-col items-center p-2 text-blue-600">
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">Sites</span>
          </button>
          <button onClick={() => onNavigate('admin-time-tracking')} className="flex flex-col items-center p-2 text-gray-400">
            <Clock className="w-6 h-6" />
            <span className="text-xs mt-1">Time</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-400">
            <User className="w-6 h-6" />
            <span className="text-xs mt-1">Team</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-400">
            <Menu className="w-6 h-6" />
            <span className="text-xs mt-1">More</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Admin Site Detail with Hierarchy
function AdminSiteDetail({ onNavigate }) {
  const [expandedFloors, setExpandedFloors] = useState([1]);
  const [expandedRooms, setExpandedRooms] = useState([]);

  const toggleFloor = (id) => {
    setExpandedFloors(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const toggleRoom = (id) => {
    setExpandedRooms(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3">
          <button onClick={() => onNavigate('admin-dashboard')} className="text-blue-600 mb-2 flex items-center">
            <ChevronRight className="w-5 h-5 rotate-180" />
            Back
          </button>
          <h1 className="text-xl font-bold text-gray-900">Riverside Tower</h1>
          <p className="text-sm text-gray-600">123 Main St</p>
        </div>
      </div>

      <div className="p-4">
        {/* Site Progress Summary */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Overall Progress</h3>
            <span className="text-2xl font-bold text-blue-600">67%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div className="bg-blue-600 h-3 rounded-full" style={{ width: '67%' }} />
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mt-3">
            <div>Start: Sep 15, 2025</div>
            <div>8 Workers Active</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button className="bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center">
            <Plus className="w-4 h-4 mr-1" />
            Add Floor
          </button>
          <button className="bg-white border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 flex items-center justify-center">
            <Edit className="w-4 h-4 mr-1" />
            Edit Site
          </button>
        </div>

        {/* Hierarchical Structure */}
        <div className="space-y-2">
          {/* Floor 1 */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-3 flex items-center justify-between border-b">
              <div className="flex items-center flex-1">
                <button onClick={() => toggleFloor(1)} className="mr-2">
                  {expandedFloors.includes(1) ? 
                    <ChevronDown className="w-5 h-5 text-gray-400" /> :
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  }
                </button>
                <Building className="w-5 h-5 text-gray-600 mr-2" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Floor 1</div>
                  <div className="text-xs text-gray-500">3 Employees Assigned</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">72%</span>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {expandedFloors.includes(1) && (
              <div className="bg-gray-50">
                {/* Progress Bar for Floor */}
                <div className="px-3 pt-2 pb-1">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '72%' }} />
                  </div>
                </div>

                {/* Room 101 */}
                <div className="ml-8 mr-3 my-2 bg-white rounded-lg border border-gray-200">
                  <div className="p-2 flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <button onClick={() => toggleRoom(101)} className="mr-2">
                        {expandedRooms.includes(101) ? 
                          <ChevronDown className="w-4 h-4 text-gray-400" /> :
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        }
                      </button>
                      <Home className="w-4 h-4 text-gray-600 mr-2" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">Room 101</div>
                        <div className="text-xs text-gray-500">1 Employee</div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">85%</span>
                  </div>

                  {expandedRooms.includes(101) && (
                    <div className="px-2 pb-2 pt-1 bg-gray-50 border-t">
                      {/* Tasks */}
                      <div className="space-y-1.5">
                        <TaskItem task="Cut" completed={100} />
                        <TaskItem task="Roll" completed={100} />
                        <TaskItem task="Trim" completed={75} />
                        <TaskItem task="Touch-up" completed={50} />
                      </div>
                      
                      {/* Closet */}
                      <div className="mt-2 ml-4 bg-white border border-gray-200 rounded p-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-xs">
                            <div className="w-2 h-2 bg-gray-400 rounded-full mr-2" />
                            <span className="font-medium text-gray-900">Closet A</span>
                          </div>
                          <span className="text-xs font-medium text-gray-900">90%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Hallway A */}
                <div className="ml-8 mr-3 my-2 bg-white rounded-lg border border-gray-200">
                  <div className="p-2 flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <ChevronRight className="w-4 h-4 text-gray-400 mr-2" />
                      <div className="w-4 h-4 bg-gray-300 rounded mr-2" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">Hallway A</div>
                        <div className="text-xs text-gray-500">Main corridor</div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">60%</span>
                  </div>
                </div>

                {/* Add Area Button */}
                <div className="p-3">
                  <button className="w-full bg-white border border-dashed border-gray-300 text-gray-600 py-2 rounded text-sm font-medium hover:border-blue-500 hover:text-blue-600 flex items-center justify-center">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Room/Hallway
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Floor 2 - Collapsed */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-3 flex items-center justify-between">
              <div className="flex items-center flex-1">
                <button onClick={() => toggleFloor(2)} className="mr-2">
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                <Building className="w-5 h-5 text-gray-600 mr-2" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Floor 2</div>
                  <div className="text-xs text-gray-500">5 Employees Assigned</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">45%</span>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex items-center justify-around py-2">
          <button onClick={() => onNavigate('admin-dashboard')} className="flex flex-col items-center p-2 text-gray-400">
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">Sites</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-400">
            <Clock className="w-6 h-6" />
            <span className="text-xs mt-1">Time</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-400">
            <User className="w-6 h-6" />
            <span className="text-xs mt-1">Team</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-400">
            <Menu className="w-6 h-6" />
            <span className="text-xs mt-1">More</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Task Item Component
function TaskItem({ task, completed }) {
  return (
    <div className="flex items-center justify-between py-1 px-2 bg-white rounded">
      <div className="flex items-center text-xs">
        {completed === 100 ? 
          <CheckCircle className="w-4 h-4 text-green-500 mr-2" /> :
          <Circle className="w-4 h-4 text-gray-300 mr-2" />
        }
        <span className={completed === 100 ? 'text-gray-500 line-through' : 'text-gray-900'}>
          {task}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-16 bg-gray-200 rounded-full h-1.5">
          <div 
            className={`h-1.5 rounded-full ${completed === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
            style={{ width: `${completed}%` }}
          />
        </div>
        <span className="text-xs font-medium text-gray-600 w-8 text-right">{completed}%</span>
      </div>
    </div>
  );
}

// Admin Time Tracking View
function AdminTimeTracking({ onNavigate }) {
  const workers = [
    { id: 1, name: 'Mike Wilson', site: 'Riverside Tower', floor: 'Floor 1', room: 'Room 101', clockedIn: '8:00 AM', hours: 6.5, status: 'active' },
    { id: 2, name: 'Sarah Chen', site: 'Riverside Tower', floor: 'Floor 1', room: 'Hallway A', clockedIn: '7:45 AM', hours: 6.75, status: 'active' },
    { id: 3, name: 'Tom Brown', site: 'Downtown Complex', floor: 'Floor 3', room: 'Room 302', clockedIn: '8:15 AM', hours: 6.25, status: 'active' },
    { id: 4, name: 'Lisa Garcia', site: 'Sunset Apartments', floor: 'Floor 2', room: null, clockedIn: null, hours: 0, status: 'offline' },
  ];

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold text-gray-900 mb-3">Time Tracking</h1>
          
          {/* Date Selector */}
          <div className="flex items-center gap-2 mb-3">
            <input
              type="date"
              defaultValue="2025-10-17"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
              Today
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-green-50 p-2 rounded-lg">
              <div className="text-lg font-bold text-green-600">25</div>
              <div className="text-xs text-gray-600">Active</div>
            </div>
            <div className="bg-gray-50 p-2 rounded-lg">
              <div className="text-lg font-bold text-gray-600">8</div>
              <div className="text-xs text-gray-600">Offline</div>
            </div>
            <div className="bg-blue-50 p-2 rounded-lg">
              <div className="text-lg font-bold text-blue-600">192</div>
              <div className="text-xs text-gray-600">Total Hours</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium whitespace-nowrap">
            All Workers
          </button>
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium whitespace-nowrap">
            Riverside Tower
          </button>
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium whitespace-nowrap">
            Downtown Complex
          </button>
        </div>

        {/* Workers List */}
        <div className="space-y-3">
          {workers.map((worker) => (
            <div key={worker.id} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{worker.name}</h3>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      {worker.status === 'active' ? (
                        <>
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 bg-gray-400 rounded-full mr-1" />
                          <span>Offline</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">{worker.hours}h</div>
                  <div className="text-xs text-gray-500">today</div>
                </div>
              </div>

              {worker.status === 'active' && (
                <>
                  <div className="bg-gray-50 rounded-lg p-2 mb-2 space-y-1">
                    <div className="flex items-center text-xs text-gray-600">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span>{worker.site}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-600">
                      <Building className="w-3 h-3 mr-1" />
                      <span>{worker.floor} - {worker.room}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-600">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>Clocked in: {worker.clockedIn}</span>
                    </div>
                  </div>

                  <button className="w-full bg-blue-50 text-blue-600 py-2 rounded-lg text-sm font-medium hover:bg-blue-100">
                    Reassign Worker
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex items-center justify-around py-2">
          <button onClick={() => onNavigate('admin-dashboard')} className="flex flex-col items-center p-2 text-gray-400">
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">Sites</span>
          </button>
          <button className="flex flex-col items-center p-2 text-blue-600">
            <Clock className="w-6 h-6" />
            <span className="text-xs mt-1">Time</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-400">
            <User className="w-6 h-6" />
            <span className="text-xs mt-1">Team</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-400">
            <Menu className="w-6 h-6" />
            <span className="text-xs mt-1">More</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Employee Dashboard
function EmployeeDashboard({ onNavigate }) {
  const assignedSites = [
    { id: 1, name: 'Riverside Tower', floor: 'Floor 1', room: 'Room 101', progress: 85, tasks: 3 },
    { id: 2, name: 'Downtown Complex', floor: 'Floor 3', room: 'Room 302', progress: 62, tasks: 5 },
  ];

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Welcome, Mike</h1>
              <p className="text-sm text-gray-600">Friday, October 17, 2025</p>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Clock Status Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-4 mb-4 text-white">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm opacity-90">Current Status</div>
              <div className="text-2xl font-bold">Not Clocked In</div>
            </div>
            <Clock className="w-12 h-12 opacity-80" />
          </div>
          <button 
            onClick={() => onNavigate('employee-clock')}
            className="w-full bg-white text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50"
          >
            Clock In
          </button>
        </div>

        {/* Today's Summary */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h3 className="font-semibold text-gray-900 mb-3">Today's Summary</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-green-600">6.5</div>
              <div className="text-xs text-gray-600">Hours Today</div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">8</div>
              <div className="text-xs text-gray-600">Tasks Updated</div>
            </div>
          </div>
        </div>

        {/* Assigned Sites */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">My Assignments</h2>
          <div className="space-y-3">
            {assignedSites.map((site) => (
              <div key={site.id} className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{site.name}</h3>
                    <div className="text-sm text-gray-600 mt-1">
                      {site.floor} • {site.room}
                    </div>
                  </div>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Your Progress</span>
                    <span className="font-semibold text-gray-900">{site.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${site.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => onNavigate('employee-progress')}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                  >
                    Update Progress
                  </button>
                  <button className="px-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                    <MapPin className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex items-center justify-around py-2">
          <button className="flex flex-col items-center p-2 text-blue-600">
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">Home</span>
          </button>
          <button onClick={() => onNavigate('employee-clock')} className="flex flex-col items-center p-2 text-gray-400">
            <Clock className="w-6 h-6" />
            <span className="text-xs mt-1">Clock</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-400">
            <User className="w-6 h-6" />
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Employee Clock In/Out
function EmployeeClock({ onNavigate }) {
  const [selectedSite, setSelectedSite] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('');
  const [isClockedIn, setIsClockedIn] = useState(false);

  const handleClockAction = () => {
    setIsClockedIn(!isClockedIn);
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3">
          <button onClick={() => onNavigate('employee-dashboard')} className="text-blue-600 mb-2 flex items-center">
            <ChevronRight className="w-5 h-5 rotate-180" />
            Back
          </button>
          <h1 className="text-xl font-bold text-gray-900">Time Clock</h1>
        </div>
      </div>

      <div className="p-4">
        {/* Current Time Display */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6 mb-6 text-white text-center">
          <Clock className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <div className="text-5xl font-bold mb-2">2:34 PM</div>
          <div className="text-sm opacity-90">Friday, October 17, 2025</div>
        </div>

        {!isClockedIn ? (
          <>
            {/* Clock In Form */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <h3 className="font-semibold text-gray-900 mb-3">Select Work Location</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Site</label>
                  <select
                    value={selectedSite}
                    onChange={(e) => setSelectedSite(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a site...</option>
                    <option value="riverside">Riverside Tower</option>
                    <option value="downtown">Downtown Complex</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
                  <select
                    value={selectedFloor}
                    onChange={(e) => setSelectedFloor(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    disabled={!selectedSite}
                  >
                    <option value="">Select a floor...</option>
                    <option value="floor1">Floor 1</option>
                    <option value="floor2">Floor 2</option>
                    <option value="floor3">Floor 3</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={handleClockAction}
              disabled={!selectedSite || !selectedFloor}
              className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Clock className="w-6 h-6 mr-2" />
              Clock In
            </button>
          </>
        ) : (
          <>
            {/* Clocked In Status */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse" />
                <span className="font-semibold text-gray-900">Currently Clocked In</span>
              </div>

              <div className="bg-green-50 rounded-lg p-3 mb-3 space-y-2">
                <div className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 text-gray-600 mr-2" />
                  <span className="text-gray-900">Riverside Tower</span>
                </div>
                <div className="flex items-center text-sm">
                  <Building className="w-4 h-4 text-gray-600 mr-2" />
                  <span className="text-gray-900">Floor 1</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="w-4 h-4 text-gray-600 mr-2" />
                  <span className="text-gray-900">Clocked in: 8:00 AM</span>
                </div>
              </div>

              <div className="text-center py-4">
                <div className="text-3xl font-bold text-gray-900 mb-1">6:34</div>
                <div className="text-sm text-gray-600">Hours Today</div>
              </div>
            </div>

            <button
              onClick={handleClockAction}
              className="w-full bg-red-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-red-700 flex items-center justify-center"
            >
              <Clock className="w-6 h-6 mr-2" />
              Clock Out
            </button>
          </>
        )}

        {/* Recent Activity */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <div className="text-sm font-medium text-gray-900">Riverside Tower - Floor 1</div>
                <div className="text-xs text-gray-500">October 16, 2025</div>
              </div>
              <div className="text-sm font-semibold text-gray-900">8.5h</div>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <div className="text-sm font-medium text-gray-900">Downtown Complex - Floor 3</div>
                <div className="text-xs text-gray-500">October 15, 2025</div>
              </div>
              <div className="text-sm font-semibold text-gray-900">7.0h</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex items-center justify-around py-2">
          <button onClick={() => onNavigate('employee-dashboard')} className="flex flex-col items-center p-2 text-gray-400">
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">Home</span>
          </button>
          <button className="flex flex-col items-center p-2 text-blue-600">
            <Clock className="w-6 h-6" />
            <span className="text-xs mt-1">Clock</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-400">
            <User className="w-6 h-6" />
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Employee Progress Update
function EmployeeProgress({ onNavigate }) {
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Cut', progress: 100 },
    { id: 2, name: 'Roll', progress: 100 },
    { id: 3, name: 'Trim', progress: 75 },
    { id: 4, name: 'Touch-up', progress: 50 },
  ]);

  const [note, setNote] = useState('');

  const updateTaskProgress = (id, value) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, progress: parseInt(value) } : task
    ));
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3">
          <button onClick={() => onNavigate('employee-dashboard')} className="text-blue-600 mb-2 flex items-center">
            <ChevronRight className="w-5 h-5 rotate-180" />
            Back
          </button>
          <h1 className="text-xl font-bold text-gray-900">Update Progress</h1>
          <p className="text-sm text-gray-600">Riverside Tower • Floor 1 • Room 101</p>
        </div>
      </div>

      <div className="p-4">
        {/* Overall Progress Card */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">Room Progress</h3>
            <span className="text-2xl font-bold text-blue-600">81%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-blue-600 h-3 rounded-full" style={{ width: '81%' }} />
          </div>
        </div>

        {/* Task Progress Sliders */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h3 className="font-semibold text-gray-900 mb-4">Task Completion</h3>
          <div className="space-y-5">
            {tasks.map((task) => (
              <div key={task.id}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    {task.progress === 100 ? 
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" /> :
                      <Circle className="w-5 h-5 text-gray-300 mr-2" />
                    }
                    <span className="font-medium text-gray-900">{task.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{task.progress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={task.progress}
                  onChange={(e) => updateTaskProgress(task.id, e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #2563eb 0%, #2563eb ${task.progress}%, #e5e7eb ${task.progress}%, #e5e7eb 100%)`
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Notes Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h3 className="font-semibold text-gray-900 mb-2">Add Note (Optional)</h3>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Any updates or issues to report..."
            rows="3"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
            Save Progress
          </button>
          <button 
            onClick={() => onNavigate('employee-dashboard')}
            className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>

        {/* Quick Stats */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-lg font-bold text-green-600">2</div>
            <div className="text-xs text-gray-600">Tasks Complete</div>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg">
            <div className="text-lg font-bold text-yellow-600">2</div>
            <div className="text-xs text-gray-600">In Progress</div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex items-center justify-around py-2">
          <button onClick={() => onNavigate('employee-dashboard')} className="flex flex-col items-center p-2 text-gray-400">
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">Home</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-400">
            <Clock className="w-6 h-6" />
            <span className="text-xs mt-1">Clock</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-400">
            <User className="w-6 h-6" />
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}