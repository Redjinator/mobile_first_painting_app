'use client';

import { useState, useEffect } from 'react';
import { getAllJobSites } from '@/lib/api-client/job-sites';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
}

interface JobSite {
  id: string;
  name: string;
}

interface Painter {
  id: string;
  firstName: string;
  lastName: string;
}

interface Area {
  id: string;
  name: string;
  areaType: string;
  painters: Painter[];
}

interface Floor {
  id: string;
  name: string;
  floorNumber: number;
  painters: Painter[];
  areas: Area[];
}

interface AssignmentHierarchy {
  site: {
    id: string;
    name: string;
    address: string;
  };
  sitePainters: Painter[];
  floors: Floor[];
}

export function AssignmentManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [sites, setSites] = useState<JobSite[]>([]);
  const [hierarchy, setHierarchy] = useState<AssignmentHierarchy | null>(null);
  const [selectedSite, setSelectedSite] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [assignmentLevel, setAssignmentLevel] = useState<'SITE' | 'FLOOR' | 'AREA'>('SITE');
  const [selectedFloor, setSelectedFloor] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedSite) {
      loadAssignments();
    }
  }, [selectedSite]);

  async function loadInitialData() {
    try {
      const [usersData, sitesData] = await Promise.all([
        fetch('/api/users').then((r) => r.json()),
        getAllJobSites(),
      ]);

      if (usersData.success) {
        // Filter to only employees
        setUsers(usersData.data.filter((u: User) => u.role === 'EMPLOYEE' && u.isActive));
      }
      setSites(sitesData);
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  }

  async function loadAssignments() {
    try {
      setLoading(true);
      const response = await fetch(`/api/job-sites/${selectedSite}/assignments`);
      if (!response.ok) throw new Error('Failed to load assignments');

      const data = await response.json();
      if (data.success) {
        setHierarchy(data.data);
      }
    } catch (err) {
      console.error('Failed to load assignments:', err);
      setHierarchy(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleAssign() {
    if (!selectedSite || !selectedUser) {
      setError('Please select both a job site and a painter');
      return;
    }

    if (assignmentLevel === 'FLOOR' && !selectedFloor) {
      setError('Please select a floor');
      return;
    }

    if (assignmentLevel === 'AREA' && !selectedArea) {
      setError('Please select an area');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let endpoint = '';
      let body = { userId: selectedUser };

      if (assignmentLevel === 'SITE') {
        endpoint = `/api/job-sites/${selectedSite}/assignments`;
        console.log('Creating site assignment:', { siteId: selectedSite, userId: selectedUser });
      } else if (assignmentLevel === 'FLOOR') {
        endpoint = `/api/floors/${selectedFloor}/assignments`;
        console.log('Creating floor assignment:', { floorId: selectedFloor, userId: selectedUser });
      } else if (assignmentLevel === 'AREA') {
        endpoint = `/api/areas/${selectedArea}/assignments`;
        console.log('Creating area assignment:', { areaId: selectedArea, userId: selectedUser });
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      console.log('Assignment response status:', response.status);

      if (!response.ok) {
        const data = await response.json();
        console.error('Assignment error response:', data);
        throw new Error(data.error?.message || data.error || 'Failed to create assignment');
      }

      const result = await response.json();
      console.log('Assignment created successfully:', result);

      setSelectedUser('');
      setSelectedFloor('');
      setSelectedArea('');
      await loadAssignments();
    } catch (err) {
      console.error('Assignment creation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create assignment');
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="space-y-6">
      {/* Assignment Form */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
        <h3 className="font-semibold text-gray-900">Assign Painter</h3>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Assignment Level Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assignment Level *
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setAssignmentLevel('SITE');
                setSelectedFloor('');
                setSelectedArea('');
              }}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                assignmentLevel === 'SITE'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Entire Site
            </button>
            <button
              onClick={() => {
                setAssignmentLevel('FLOOR');
                setSelectedArea('');
              }}
              disabled={!selectedSite || !hierarchy?.floors.length}
              className={`px-4 py-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${
                assignmentLevel === 'FLOOR'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Specific Floor
            </button>
            <button
              onClick={() => setAssignmentLevel('AREA')}
              disabled={!selectedSite || !hierarchy?.floors.some(f => f.areas.length > 0)}
              className={`px-4 py-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${
                assignmentLevel === 'AREA'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Specific Area
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Job Site */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Site *
            </label>
            <select
              value={selectedSite}
              onChange={(e) => {
                setSelectedSite(e.target.value);
                setSelectedFloor('');
                setSelectedArea('');
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a job site...</option>
              {sites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name}
                </option>
              ))}
            </select>
          </div>

          {/* Floor (conditional) */}
          {assignmentLevel !== 'SITE' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Floor *
              </label>
              <select
                value={selectedFloor}
                onChange={(e) => {
                  setSelectedFloor(e.target.value);
                  setSelectedArea('');
                }}
                disabled={!selectedSite || !hierarchy?.floors.length}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="">Select a floor...</option>
                {hierarchy?.floors.map((floor) => (
                  <option key={floor.id} value={floor.id}>
                    {floor.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Area (conditional) */}
          {assignmentLevel === 'AREA' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Area *
              </label>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                disabled={!selectedFloor}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="">Select an area...</option>
                {hierarchy?.floors
                  .find((f) => f.id === selectedFloor)
                  ?.areas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.name} ({area.areaType})
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* Painter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Painter *
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              disabled={!selectedSite}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">Select a painter...</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Assign Button */}
          <div className="flex items-end">
            <button
              onClick={handleAssign}
              disabled={!selectedSite || !selectedUser || loading}
              className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Assigning...' : 'Assign'}
            </button>
          </div>
        </div>
      </div>

      {/* Current Assignments */}
      {selectedSite && (
        <div>
          {loading && !hierarchy ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          ) : !hierarchy ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">No assignment data available</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Site-level Painters */}
              {hierarchy.sitePainters.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Site-Wide Painters ({hierarchy.sitePainters.length})
                  </h3>
                  <div className="space-y-2">
                    {hierarchy.sitePainters.map((painter) => (
                      <div
                        key={painter.id}
                        className="flex items-center justify-between border border-gray-200 rounded-lg p-3 bg-blue-50"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full font-medium">
                            SITE
                          </span>
                          <span className="font-medium text-gray-900">
                            {painter.firstName} {painter.lastName}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Floor-level Assignments */}
              {hierarchy.floors.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Floor Assignments
                  </h3>
                  <div className="space-y-4">
                    {hierarchy.floors.map((floor) => (
                      <div key={floor.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <h4 className="font-medium text-gray-900 mb-3">
                          {floor.name} (Floor {floor.floorNumber})
                        </h4>

                        {/* Floor Painters */}
                        {floor.painters.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs text-gray-600 mb-2">Floor Painters:</p>
                            <div className="flex flex-wrap gap-2">
                              {floor.painters.map((painter) => (
                                <div
                                  key={painter.id}
                                  className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded text-xs"
                                >
                                  <span className="font-medium">FLOOR</span>
                                  <span>•</span>
                                  <span>{painter.firstName} {painter.lastName}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Areas */}
                        {floor.areas.length > 0 && (
                          <div>
                            <p className="text-xs text-gray-600 mb-2">Areas:</p>
                            <div className="space-y-2">
                              {floor.areas.map((area) => (
                                <div
                                  key={area.id}
                                  className="bg-white border border-gray-200 rounded p-2"
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <span className="font-medium text-sm text-gray-900">
                                        {area.name}
                                      </span>
                                      <span className="text-xs text-gray-500 ml-2">
                                        ({area.areaType})
                                      </span>
                                    </div>
                                  </div>
                                  {area.painters.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1">
                                      {area.painters.map((painter) => (
                                        <span
                                          key={painter.id}
                                          className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs"
                                        >
                                          {painter.firstName} {painter.lastName}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {floor.painters.length === 0 && floor.areas.every(a => a.painters.length === 0) && (
                          <p className="text-sm text-gray-500 italic">No painters assigned to this floor</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No assignments at all */}
              {hierarchy.sitePainters.length === 0 && hierarchy.floors.length === 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">No painters assigned to this site yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
