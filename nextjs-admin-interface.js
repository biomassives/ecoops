// pages/_app.js
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp

// pages/index.js
import Head from 'next/head'
import AdminInterface from '../components/AdminInterface'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Eco Ops Admin Dashboard</title>
        <meta name="description" content="Admin interface for Eco Ops" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <AdminInterface />
      </main>
    </div>
  )
}

// components/AdminInterface.js
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default function AdminInterface() {
  const [reports, setReports] = useState([]);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reports:', error);
    } else {
      setReports(data);
      if (data.length > 0) {
        setSelectedReportId(data[0].id);
      }
    }
  }

  const selectedReport = reports.find(report => report.id === selectedReportId);

  const handleEditToggle = () => {
    if (!editMode) {
      setEditedContent(selectedReport?.content || '');
    }
    setEditMode(!editMode);
  };

  const handleContentEdit = (e) => {
    setEditedContent(e.target.value);
  };

  const handleSuggestEdit = async () => {
    if (!selectedReport) return;

    const { data, error } = await supabase
      .from('reports')
      .update({ content: editedContent, status: 'Revision Suggested' })
      .eq('id', selectedReport.id);

    if (error) {
      console.error('Error updating report:', error);
    } else {
      console.log('Report updated successfully');
      setEditMode(false);
      fetchReports();
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedReport) return;

    const { data, error } = await supabase
      .from('reports')
      .update({ status: newStatus })
      .eq('id', selectedReport.id);

    if (error) {
      console.error('Error updating report status:', error);
    } else {
      console.log('Report status updated successfully');
      fetchReports();
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Eco Ops Admin Dashboard</h1>
      
      <div className="flex">
        <div className="w-1/3 pr-4">
          <h2 className="text-xl font-semibold mb-2">Reports List</h2>
          <ul className="bg-gray-100 p-2 rounded">
            {reports.map(report => (
              <li 
                key={report.id} 
                className={`p-2 mb-2 rounded cursor-pointer ${
                  report.status === 'Pending' ? 'bg-yellow-200' : 
                  report.status === 'Approved' ? 'bg-green-200' : 
                  report.status === 'Revision Suggested' ? 'bg-orange-200' : 'bg-red-200'
                } ${selectedReportId === report.id ? 'border-2 border-blue-500' : ''}`}
                onClick={() => setSelectedReportId(report.id)}
              >
                {report.title}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="w-2/3 pl-4">
          <h2 className="text-xl font-semibold mb-2">Report Details</h2>
          {selectedReport ? (
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold">{selectedReport.title}</h3>
              <p><strong>Author:</strong> {selectedReport.author}</p>
              <p><strong>Date:</strong> {new Date(selectedReport.created_at).toLocaleDateString()}</p>
              <p><strong>Check-ins:</strong> {selectedReport.check_ins}</p>
              <p><strong>Status:</strong> {selectedReport.status}</p>
              <div className="mt-4">
                <h4 className="font-semibold">Content:</h4>
                {editMode ? (
                  <textarea 
                    className="w-full h-32 p-2 border rounded"
                    value={editedContent}
                    onChange={handleContentEdit}
                  />
                ) : (
                  <p>{selectedReport.content}</p>
                )}
              </div>
              <div className="mt-4 flex justify-between">
                {editMode ? (
                  <>
                    <button onClick={handleSuggestEdit} className="bg-blue-500 text-white px-4 py-2 rounded">Submit Edit Suggestion</button>
                    <button onClick={handleEditToggle} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={handleEditToggle} className="bg-blue-500 text-white px-4 py-2 rounded">Suggest Edit</button>
                    <button onClick={() => handleStatusChange('Approved')} className="bg-green-500 text-white px-4 py-2 rounded">Approve</button>
                    <button onClick={() => handleStatusChange('Revision Requested')} className="bg-yellow-500 text-white px-4 py-2 rounded">Request Revision</button>
                    <button onClick={() => handleStatusChange('Rejected')} className="bg-red-500 text-white px-4 py-2 rounded">Reject</button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <p>Select a report to view details</p>
          )}
        </div>
      </div>
    </div>
  );
}

// styles/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

// next.config.js
module.exports = {
  reactStrictMode: true,
}

// package.json
{
  "name": "eco-ops-admin",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.21.0",
    "next": "12.0.0",
    "react": "17.0.2",
    "react-dom": "17.0.2"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.0",
    "eslint": "8.1.0",
    "eslint-config-next": "12.0.0",
    "postcss": "^8.3.11",
    "tailwindcss": "^2.2.19"
  }
}

// tailwind.config.js
module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false,
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

// .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
