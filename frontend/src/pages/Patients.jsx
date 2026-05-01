import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Search, Plus, UserCircle, X, Edit2 } from 'lucide-react';

const fetchPatients = async () => {
  const { data } = await axios.get('http://localhost:8080/api/patients');
  return data;
};

const createPatient = async (patientData) => {
  const { data } = await axios.post('http://localhost:8080/api/patients', patientData);
  return data;
};

const updatePatient = async ({ id, data }) => {
  const res = await axios.put(`http://localhost:8080/api/patients/${id}`, data);
  return res.data;
};

export default function Patients() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatientId, setEditingPatientId] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'Male',
    patientId: ''
  });

  const { data: patients, isLoading, error } = useQuery({
    queryKey: ['patients'],
    queryFn: fetchPatients
  });

  const createMutation = useMutation({
    mutationFn: createPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      closeModal();
    }
  });

  const updateMutation = useMutation({
    mutationFn: updatePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      closeModal();
    }
  });

  const openEditModal = (patient) => {
    setEditingPatientId(patient.id);
    setFormData({
      firstName: patient.firstName || '',
      lastName: patient.lastName || '',
      dateOfBirth: patient.dateOfBirth || '',
      gender: patient.gender || 'Male',
      patientId: patient.patientId || ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPatientId(null);
    setFormData({ firstName: '', lastName: '', dateOfBirth: '', gender: 'Male', patientId: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPatientId) {
      updateMutation.mutate({ id: editingPatientId, data: formData });
    } else {
      if (!formData.patientId) {
        formData.patientId = 'PID' + Math.floor(Math.random() * 100000);
      }
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Patients</h2>
          <p className="text-muted-foreground mt-1">Manage patient records and demographics.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
        >
          <Plus size={20} />
          Add Patient
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input 
              type="text" 
              placeholder="Search patients by name or ID..." 
              className="w-full pl-10 pr-4 py-2 bg-secondary/50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground">Loading patients...</div>
        ) : error ? (
          <div className="p-12 text-center text-destructive">Failed to load patients. Is the backend running?</div>
        ) : !patients || patients.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-muted-foreground">
            <UserCircle size={48} className="mb-4 text-secondary-foreground/20" />
            <p className="text-lg font-medium text-foreground">No patients found</p>
            <p>Add a new patient or send an HL7 ADT message to populate this list.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary/50 text-muted-foreground text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Patient ID</th>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">DOB</th>
                  <th className="px-6 py-4 font-medium">Gender</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {patients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-secondary/30 transition-colors text-sm group">
                    <td className="px-6 py-4 font-mono text-xs">{patient.patientId || `P-${patient.id.toString().padStart(5, '0')}`}</td>
                    <td className="px-6 py-4 font-medium flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                        {patient.firstName?.[0]}{patient.lastName?.[0]}
                      </div>
                      {patient.firstName} {patient.lastName}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{patient.dateOfBirth || '-'}</td>
                    <td className="px-6 py-4 text-muted-foreground">{patient.gender || '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => openEditModal(patient)}
                        className="p-2 text-muted-foreground hover:bg-white hover:shadow-sm rounded-lg border border-transparent hover:border-border transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Edit Patient"
                      >
                        <Edit2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-border bg-secondary/10">
              <h3 className="text-xl font-bold flex items-center gap-2">
                {editingPatientId ? <Edit2 size={20} className="text-primary" /> : <Plus size={20} className="text-primary" />}
                {editingPatientId ? 'Edit Patient' : 'Register New Patient'}
              </h3>
              <button onClick={closeModal} className="text-muted-foreground hover:bg-secondary p-1 rounded-md transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">First Name</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.firstName}
                    onChange={e => setFormData({...formData, firstName: e.target.value})}
                    className="w-full px-3 py-2 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Last Name</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.lastName}
                    onChange={e => setFormData({...formData, lastName: e.target.value})}
                    className="w-full px-3 py-2 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Date of Birth</label>
                <input 
                  required 
                  type="date" 
                  value={formData.dateOfBirth}
                  onChange={e => setFormData({...formData, dateOfBirth: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Gender</label>
                <select 
                  value={formData.gender}
                  onChange={e => setFormData({...formData, gender: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="pt-4 border-t border-border flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="px-4 py-2 border border-border rounded-xl font-medium hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm"
                >
                  {createMutation.isPending || updateMutation.isPending ? 'Saving...' : (editingPatientId ? 'Update Patient' : 'Save Patient')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
