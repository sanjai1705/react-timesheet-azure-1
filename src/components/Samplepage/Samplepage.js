import React, { useState } from 'react';

function Samplepage() {
  const [weeks, setWeeks] = useState('');
  const [client, setClient] = useState('');
  const [project, setProject] = useState('');
  const [user, setUser] = useState('');

  // Dummy data for the selects and table
  const allWeeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  const clients = ['Client A', 'Client B', 'Client C'];
  const projects = ['Project X', 'Project Y', 'Project Z'];
  const users = ['User 1', 'User 2', 'User 3'];
  const tableData = [
    { id: 1, week: 'Week 1', client: 'Client A', project: 'Project X', user: 'User 1' },
    { id: 2, week: 'Week 2', client: 'Client B', project: 'Project Y', user: 'User 2' },
    { id: 3, week: 'Week 3', client: 'Client C', project: 'Project Z', user: 'User 3' },
    { id: 4, week: 'Week 4', client: 'Client A', project: 'Project X', user: 'User 1' },
    // ... more data
  ];
  

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700">Select week(s)</label>
          <select
            multiple
            className="form-multiselect block w-full p-2 border border-gray-300"
            value={weeks}
            onChange={(e) => setWeeks(Array.from(e.target.selectedOptions, (option) => option.value))}
          >
            {allWeeks.map((week, index) => (
              <option key={index} value={week}>
                {week}
              </option>
            ))}
          </select>
        </div>

        <select
          className="form-select block w-full p-2 border border-gray-300"
          value={client}
          onChange={(e) => setClient(e.target.value)}
        >
          <option value="">Select client</option>
          {clients.map((client, index) => (
            <option key={index} value={client}>
              {client}
            </option>
          ))}
        </select>

        <select
          className="form-select block w-full p-2 border border-gray-300"
          value={project}
          onChange={(e) => setProject(e.target.value)}
        >
          <option value="">Select project</option>
          {projects.map((project, index) => (
            <option key={index} value={project}>
              {project}
            </option>
          ))}
        </select>

        <select
          className="form-select block w-full p-2 border border-gray-300"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        >
          <option value="">Select user</option>
          {users.map((user, index) => (
            <option key={index} value={user}>
              {user}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
  <table className="min-w-full leading-normal">
    <thead>
      <tr>
        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
          ID
        </th>
        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
          Week
        </th>
        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
          Client
        </th>
        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
          Project
        </th>
        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
          User
        </th>
      </tr>
    </thead>
    <tbody>
      {tableData.map((item) => (
        <tr key={item.id}>
          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            {item.id}
          </td>
          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            {item.week}
          </td>
          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            {item.client}
          </td>
          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            {item.project}
          </td>
          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            {item.user}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
    </div>
  );
}

export default Samplepage;