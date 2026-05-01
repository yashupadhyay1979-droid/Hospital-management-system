import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Activity, Plus, Search, X } from 'lucide-react';

const fetchLabResults = async () => {
  const { data } = await axios.get('http://localhost:8080/api/lab');
  return data;
};

const createLabResult = async (data) => {
  const res = await axios.post('http://localhost:8080/api/lab', data);
  return res.data;
};

export default function Lab() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    testName: '',
    resultValue: '',
    unit: '',
    referenceRange: '',
  });

  const { data: results, isLoading } = useQuery({
    queryKey: ['labResults'],
    queryFn: fetchLabResults
  });

  const mutation = useMutation({
    mutationFn: createLabResult,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labResults'] });
      setIsModalOpen(false);
      setFormData({ patientName: '', testName: '', resultValue: '', unit: '', referenceRange: '' });
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
          <h2 className="text-3xl font-bold tracking-tight">Laboratory</h2>
          <p className="text-muted-foreground mt-1">Manage test requests and view results.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Plus size={20} />
          New Test Request
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground">Loading lab results...</div>
        ) : !results || results.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <Activity size={48} className="mx-auto mb-4 text-secondary-foreground/20" />
            <p className="text-lg font-medium text-foreground">No lab results found</p>
            <p>Create a new test request to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary/50 text-muted-foreground text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Patient</th>
                  <th className="px-6 py-4 font-medium">Test Name</th>
                  <th className="px-6 py-4 font-medium">Result</th>
                  <th className="px-6 py-4 font-medium">Ref Range</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {results.map((res) => (
                  <tr key={res.id} className="hover:bg-secondary/30 transition-colors text-sm">
                    <td className="px-6 py-4 font-medium">{res.patientName}</td>
                    <td className="px-6 py-4">{res.testName}</td>
                    <td className="px-6 py-4 font-mono font-medium text-primary">
                      {res.resultValue} <span className="text-muted-foreground text-xs">{res.unit}</span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{res.referenceRange}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${res.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                        {res.status}
                      </span>
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
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h3 className="text-xl font-bold">New Test Result</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:bg-secondary p-1 rounded-md transition-colors cursor-pointer">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                <label className="text-sm font-medium">Test Name</label>
                <input 
                  required 
                  type="text" 
                  value={formData.testName}
                  onChange={e => setFormData({...formData, testName: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Result Value</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.resultValue}
                    onChange={e => setFormData({...formData, resultValue: e.target.value})}
                    className="w-full px-3 py-2 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Unit</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.unit}
                    onChange={e => setFormData({...formData, unit: e.target.value})}
                    className="w-full px-3 py-2 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Reference Range</label>
                <input 
                  required 
                  type="text" 
                  value={formData.referenceRange}
                  onChange={e => setFormData({...formData, referenceRange: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div className="pt-4 border-t border-border flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-border rounded-xl font-medium cursor-pointer hover:bg-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={mutation.isPending} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium cursor-pointer hover:bg-primary/90">
                  {mutation.isPending ? 'Saving...' : 'Save Result'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
