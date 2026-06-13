import { useState } from 'react';
import { useHrms } from '../context/HrmsContext';
import { StatCard } from '../components/Card';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import { Briefcase, UserCheck, Plus, Search, Filter, Mail, Calendar, MapPin, Check, X, ShieldAlert } from 'lucide-react';
import { DEPARTMENTS } from '../data/mockData';

import type { JobPosting, Candidate } from '../types';

const STAGES = ['Applied', 'Initial Screening', 'Technical Round', 'Portfolio Review', 'HR Round', 'Selected', 'Rejected'];

const emptyJobForm = { title: '', department: 'Engineering', location: '', openings: 1, type: 'Full-time' as JobPosting['type'], experience: '', salary: '' };

export default function Recruitment() {
  const { recruitment, candidates, addJobPosting, updateCandidateStage } = useHrms();
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' | 'candidates'
  const [showAddJob, setShowAddJob] = useState(false);
  const [jobForm, setJobForm] = useState(emptyJobForm);
  const [jobError, setJobError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Stats
  const activeJobs = recruitment.filter(r => r.status === 'Active').length;
  const totalApplicants = recruitment.reduce((acc, curr) => acc + curr.applicants, 0);
  const selectedCandidates = candidates.filter(c => c.status === 'Hired').length;

  const handleAddJob = () => {
    if (!jobForm.title || !jobForm.location || !jobForm.openings) {
      setJobError('Please fill in all job details.');
      return;
    }
    addJobPosting({
      title: jobForm.title,
      department: jobForm.department,
      location: jobForm.location,
      openings: Number(jobForm.openings),
      type: jobForm.type,
      experience: jobForm.experience || 'Not specified',
      salary: jobForm.salary || 'Not specified'
    });
    setShowAddJob(false);
    setJobForm(emptyJobForm);
    setJobError('');
  };

  const handleStageChange = (id: string, newStage: string) => {
    let status: Candidate['status'] = 'Active';
    if (newStage === 'Selected') status = 'Hired';
    if (newStage === 'Rejected') status = 'Rejected';
    updateCandidateStage(id, newStage, status);
  };

  return (
    <div className="space-y-6">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1>Recruitment</h1>
          <p>Post jobs, track candidate applications, and schedule interview stages.</p>
        </div>
        {activeTab === 'jobs' && (
          <button onClick={() => { setJobForm(emptyJobForm); setJobError(''); setShowAddJob(true); }} className="btn-primary self-start sm:self-auto">
            <Plus size={16} /> Post New Job
          </button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={<Briefcase size={22} />} label="Active Openings" value={activeJobs} color="violet" />
        <StatCard icon={<UserCheck size={22} />} label="Total Applicants" value={totalApplicants} color="emerald" />
        <StatCard icon={<Plus size={22} />} label="Hired Candidates" value={selectedCandidates} color="blue" />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all ${activeTab === 'jobs' ? 'border-violet-500 text-violet-600 dark:text-violet-400' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Job Openings ({recruitment.length})
        </button>
        <button
          onClick={() => setActiveTab('candidates')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all ${activeTab === 'candidates' ? 'border-violet-500 text-violet-600 dark:text-violet-400' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Candidates ({candidates.length})
        </button>
      </div>

      {/* Search Filter */}
      <div className="glass-card p-4 flex items-center gap-2 max-w-md px-3 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-transparent focus-within:border-violet-400 transition-all">
        <Search size={15} className="text-slate-400" />
        <input
          placeholder={activeTab === 'jobs' ? 'Search job title or location...' : 'Search candidate name or stage...'}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 outline-none"
        />
      </div>

      {/* Content */}
      <div className="glass-card overflow-hidden">
        {activeTab === 'jobs' ? (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Department</th>
                  <th>Location</th>
                  <th>Openings</th>
                  <th>Posted Date</th>
                  <th>Applicants</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recruitment.filter(j => j.title.toLowerCase().includes(searchQuery.toLowerCase()) || j.location.toLowerCase().includes(searchQuery.toLowerCase())).map(job => (
                  <tr key={job.id}>
                    <td className="font-semibold text-slate-800 dark:text-slate-200">
                      <div>
                        <p className="text-sm">{job.title}</p>
                        <p className="text-xs text-slate-400">{job.id} • {job.type}</p>
                      </div>
                    </td>
                    <td><span className="badge badge-purple">{job.department}</span></td>
                    <td className="text-slate-500 text-xs">{job.location}</td>
                    <td className="text-slate-700 dark:text-slate-300 font-semibold">{job.openings}</td>
                    <td className="text-slate-500 text-xs">{job.postedOn}</td>
                    <td className="text-violet-600 dark:text-violet-400 font-bold">{job.applicants}</td>
                    <td>
                      <span className={`badge ${job.status === 'Active' ? 'badge-green' : 'badge-gray'}`}>
                        {job.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Job ID / Application</th>
                  <th>Experience</th>
                  <th>Applied On</th>
                  <th>Workflow Stage</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {candidates.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.stage.toLowerCase().includes(searchQuery.toLowerCase())).map(candidate => {
                  const job = recruitment.find(j => j.id === candidate.jobId);
                  return (
                    <tr key={candidate.id}>
                      <td className="font-semibold text-slate-800 dark:text-slate-200">
                        <div>
                          <p className="text-sm">{candidate.name}</p>
                          <p className="text-xs text-slate-400">{candidate.email}</p>
                        </div>
                      </td>
                      <td className="text-xs">
                        <p className="font-semibold text-slate-700 dark:text-slate-300">{job?.title || candidate.jobId}</p>
                        <p className="text-slate-400">{candidate.jobId}</p>
                      </td>
                      <td className="text-slate-600 dark:text-slate-400 text-sm">{candidate.experience}</td>
                      <td className="text-slate-500 text-xs">{candidate.appliedOn}</td>
                      <td>
                        <select
                          className="input-field py-1 text-xs w-36"
                          value={candidate.stage}
                          onChange={e => handleStageChange(candidate.id, e.target.value)}
                        >
                          {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td>
                        <span className={`badge ${candidate.status === 'Hired' ? 'badge-green' : candidate.status === 'Rejected' ? 'badge-red' : candidate.status === 'Active' ? 'badge-blue' : 'badge-yellow'}`}>
                          {candidate.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Job Modal */}
      <Modal isOpen={showAddJob} onClose={() => setShowAddJob(false)} title="Post New Job Opening" size="md">
        <div className="space-y-4">
          {jobError && <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-sm">{jobError}</div>}

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Job Title *</label>
            <input className="input-field" value={jobForm.title} onChange={e => setJobForm({ ...jobForm, title: e.target.value })} placeholder="e.g. Senior DevOps Engineer" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Department</label>
              <select className="input-field" value={jobForm.department} onChange={e => setJobForm({ ...jobForm, department: e.target.value })}>
                {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Employment Type</label>
              <select className="input-field" value={jobForm.type} onChange={e => setJobForm({ ...jobForm, type: e.target.value as JobPosting['type'] })}>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Location *</label>
              <input className="input-field" value={jobForm.location} onChange={e => setJobForm({ ...jobForm, location: e.target.value })} placeholder="Bangalore (Hybrid)" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Number of Openings *</label>
              <input className="input-field" type="number" min={1} value={jobForm.openings} onChange={e => setJobForm({ ...jobForm, openings: parseInt(e.target.value) || 1 })} />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={handleAddJob} className="btn-primary">Post Opening</button>
            <button onClick={() => setShowAddJob(false)} className="btn-ghost">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
