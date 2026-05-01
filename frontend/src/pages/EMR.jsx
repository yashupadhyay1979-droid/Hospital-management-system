import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { FileText, Plus, Search, X } from 'lucide-react';

const fetchEMR = async () => {
  const { data } = await axios.get('http://localhost:8080/api/emr');
  return data;
};

const createEMR = async (data) => {
  const res = await axios.post('http://localhost:8080/api/emr', data);
  return res.data;
};

export default function EMR() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    doctorName: '',
    conditionName: '',
    icd10Code: '',
    prescription: '',
    notes: ''
  });

  const { data: records, isLoading } = useQuery({
    queryKey: ['emrRecords'],
    queryFn: fetchEMR
  });

  const mutation = useMutation({
    mutationFn: createEMR,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emrRecords'] });
      setIsModalOpen(false);
      setFormData({ patientName: '', doctorName: '', conditionName: '', icd10Code: '', prescription: '', notes: '' });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Electronic Medical Records</h2>
          <p className="text-muted-foreground mt-1">View patient histories, diagnoses, and prescriptions.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Plus size={20} />
          New Record
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground">Loading EMR...</div>
        ) : !records || records.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <FileText size={48} className="mx-auto mb-4 text-secondary-foreground/20" />
            <p className="text-lg font-medium text-foreground">No records found</p>
            <p>Create a new clinical record to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {records.map((rec) => (
              <div key={rec.id} className="border border-border rounded-xl p-5 hover:shadow-md transition-shadow bg-secondary/10">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg">{rec.patientName}</h3>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-mono font-medium">
                    {rec.icd10Code}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p><strong className="text-foreground">Condition:</strong> {rec.conditionName}</p>
                  <p><strong className="text-foreground">Doctor:</strong> Dr. {rec.doctorName}</p>
                  <p><strong className="text-foreground">Date:</strong> {rec.visitDate}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm font-medium mb-1">Prescription:</p>
                  <p className="text-sm text-muted-foreground bg-secondary p-2 rounded truncate">{rec.prescription}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h3 className="text-xl font-bold">New Clinical Record</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:bg-secondary p-1 rounded-md transition-colors cursor-pointer">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Patient Name</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.patientName}
                    onChange={e => setFormData({...formData, patientName: e.target.value})}
                    className="w-full px-3 py-2 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Doctor Name</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.doctorName}
                    onChange={e => setFormData({...formData, doctorName: e.target.value})}
                    className="w-full px-3 py-2 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Condition</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.conditionName}
                    onChange={e => setFormData({...formData, conditionName: e.target.value})}
                    className="w-full px-3 py-2 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">ICD-10 Code</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.icd10Code}
                    onChange={e => setFormData({...formData, icd10Code: e.target.value})}
                    className="w-full px-3 py-2 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Prescription</label>
                <textarea 
                  required 
                  value={formData.prescription}
                  onChange={e => setFormData({...formData, prescription: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none min-h-[80px]"
                />
              </div>
              <div className="pt-4 border-t border-border flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-border rounded-xl font-medium cursor-pointer hover:bg-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={mutation.isPending} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium cursor-pointer hover:bg-primary/90">
                  {mutation.isPending ? 'Saving...' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
