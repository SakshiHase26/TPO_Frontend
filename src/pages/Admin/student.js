import React from 'react';

const StudentTable = () => {
  const students = [
    { id: 1, name: 'Nikita Khatal', email: 'nikita@example.com' },
    { id: 2, name: 'Sakshi Hase', email: 'sakshi@example.com' },
    { id: 3, name: 'Om Kanawade', email: 'omKanawade@gmail.com' },
    { id: 4, name: 'Prashant Lamkhade', email: 'PrashantLamkhade@gmail.com' },
    { id: 5, name: 'Rushikesh Patne', email: 'RJPatne@gmail.com' },
  ];
  
  return (
    <div className="p-6 dark:bg-gray-900">
      <h2 className="text-xl font-bold mb-4 text-white-800 dark:text-white">Student Performance Table</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-xl shadow">
          <thead>
            <tr className="bg-indigo-600 text-white text-left text-sm uppercase tracking-wider">
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
            
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => {
              const isGray = index % 2 === 0;
              return (
                <tr 
                  key={student.id} 
                  className={isGray ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'}
                >
                  <td className="py-2 px-4 text-gray-900 dark:text-gray-200">{student.id}</td>
                  <td className="py-2 px-4 text-gray-900 dark:text-gray-200">{student.name}</td>
                  <td className="py-2 px-4 text-gray-900 dark:text-gray-200">{student.email}</td>
                 
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;