import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ActivitySquare, RefreshCw, CheckCircle2, XCircle, Plus, X, Send } from 'lucide-react';
import { useState } from 'react';

const fetchHL7Messages = async () => {
  const { data } = await axios.get('http://localhost:8080/api/hl7/messages');
  return data;
};

const simulateHL7 = async (hl7String) => {
  const { data } = await axios.post('http://localhost:8080/api/hl7/simulate', { message: hl7String });
  return data;
};

const TEMPLATES = {
  'ADT^A01 (Admit Patient)': "MSH|^~\\&|SENDING_APP|SENDING_FAC|REC_APP|REC_FAC|20231015120000||ADT^A01|MSG00001|P|2.4\rEVN|A01|20231015120000\rPID|1||PID12345||Doe^John||19800101|M|||123 Main St^^City^ST^12345\rPV1|1|I|WARD^ROOM^BED",
  'ADT^A04 (Register Patient)': "MSH|^~\\&|SENDING_APP|SENDING_FAC|REC_APP|REC_FAC|20231015120500||ADT^A04|MSG00002|P|2.4\rEVN|A04|20231015120500\rPID|1||PID98765||Smith^Jane||19920515|F|||456 Oak Rd^^Townsville^ST^67890\rPV1|1|O|CLINIC",
  'ORU^R01 (Lab Result)': "MSH|^~\\&|LAB_APP|LAB_FAC|REC_APP|REC_FAC|20231015130000||ORU^R01|MSG00003|P|2.4\rPID|1||PID12345||Doe^John||19800101|M\rOBR|1|||GLU^Glucose|||20231015123000\rOBX|1|NM|GLU^Glucose||95|mg/dL|70-100|N|||F",
  'Custom': ""
};

export default function HL7Monitor() {
  const queryClient = useQueryClient();
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('ADT^A01 (Admit Patient)');
  const [testPayload, setTestPayload] = useState(TEMPLATES['ADT^A01 (Admit Patient)']);
  const [builderCategory, setBuilderCategory] = useState('ADT');
  
  const { data: messages, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['hl7_messages'],
    queryFn: fetchHL7Messages,
    refetchInterval: 5000 // auto refresh every 5s
  });

  const mutation = useMutation({
    mutationFn: simulateHL7,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hl7_messages'] });
      setIsModalOpen(false);
    },
    onError: (err) => {
      alert("Error simulating message: " + (err.response?.data?.message || err.message));
    }
  });

  const handleTemplateChange = (e) => {
    const tmpl = e.target.value;
    setSelectedTemplate(tmpl);
    setTestPayload(TEMPLATES[tmpl]);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <ActivitySquare className="text-accent" />
            HL7 Engine Monitor
          </h2>
          <p className="text-muted-foreground mt-1">Live feed of incoming MLLP messages and parsing status.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => refetch()}
            className="bg-white border border-border hover:bg-secondary text-foreground px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
          >
            <RefreshCw size={18} className={isRefetching ? "animate-spin" : ""} />
            Refresh Feed
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
          >
            <Plus size={20} />
            Add New Message
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Message List */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-border overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border bg-secondary/30 font-medium">
            Recent Messages
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2 max-h-[700px]">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">Loading feed...</div>
            ) : error ? (
              <div className="p-8 text-center text-destructive">Failed to connect to HL7 Engine.</div>
            ) : !messages || messages.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No messages received yet. Click "Add New Message" to send a test message.
              </div>
            ) : (
              messages.map((msg) => (
                <div 
                  key={msg.id} 
                  onClick={() => setSelectedMessage(msg)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedMessage?.id === msg.id ? 'bg-primary/5 border-primary shadow-sm' : 'border-border hover:bg-secondary hover:border-muted-foreground/30'}`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-mono font-bold text-sm bg-secondary px-2.5 py-1 rounded-md text-secondary-foreground inline-block">
                      {msg.messageType || 'UNKNOWN'}
                    </span>
                    {msg.status === 'SUCCESS' ? (
                      <CheckCircle2 size={18} className="text-emerald-500 shrink-0 ml-2" />
                    ) : (
                      <XCircle size={18} className="text-destructive shrink-0 ml-2" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {new Date(msg.receivedAt).toLocaleString()}
                  </p>
                  <p className="text-xs font-mono truncate text-muted-foreground/70">
                    {msg.rawMessage.substring(0, 50)}...
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Details */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-border overflow-hidden flex flex-col flex-1">
          <div className="p-4 border-b border-border bg-secondary/30 font-medium flex items-center justify-between">
            <span>Message Details</span>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            {selectedMessage ? (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Status</h4>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${selectedMessage.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                    {selectedMessage.status === 'SUCCESS' ? <CheckCircle2 size={16}/> : <XCircle size={16}/>}
                    {selectedMessage.status}
                  </div>
                  {selectedMessage.errorMessage && (
                    <p className="mt-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20 font-mono">
                      {selectedMessage.errorMessage}
                    </p>
                  )}
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Raw Message (ER7)</h4>
                  <pre className="bg-[#1e1e2e] text-[#a6accd] p-4 rounded-xl text-xs font-mono overflow-x-auto shadow-inner leading-relaxed whitespace-pre-wrap break-all">
                    {selectedMessage.rawMessage.replace(/\r/g, '\n')}
                  </pre>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Parsed JSON Data</h4>
                  <pre className="bg-secondary/30 text-foreground p-4 rounded-xl text-xs font-mono overflow-x-auto shadow-inner leading-relaxed">
                    {selectedMessage.parsedJson ? selectedMessage.parsedJson : "Basic parsing successful. View DB for mapped fields."}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <p>Select a message from the feed to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add New Message Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-border bg-secondary/10 shrink-0">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Plus size={20} className="text-primary" />
                Inject New HL7 Message
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:bg-secondary p-1 rounded-md transition-colors cursor-pointer">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Select Mode / Template</label>
                <select 
                  value={selectedTemplate}
                  onChange={handleTemplateChange}
                  className="w-full px-3 py-2 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                >
                  <option value="Custom Builder">🛠️ Custom Visual Builder</option>
                  <option disabled>──────────</option>
                  {Object.keys(TEMPLATES).filter(k => k !== 'Custom').map(key => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                  <option value="Custom">Blank / Raw Paste</option>
                </select>
              </div>

              {selectedTemplate === 'Custom Builder' ? (
                <div className="bg-secondary/20 p-4 rounded-xl border border-border space-y-4">
                  <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Message Parameters</h4>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">Message Category</label>
                    <select 
                      value={builderCategory}
                      onChange={(e) => setBuilderCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white"
                    >
                      <option value="ADT">ADT (Patient Administration)</option>
                      <option value="ORU">ORU (Lab Results / Observation)</option>
                      <option value="MDM">MDM (EMR Clinical Note / Document)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
                    {/* Common Fields */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium">Patient ID (PID-3)</label>
                      <input type="text" id="builder_pid" defaultValue="PID77777" className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium">Patient First Name</label>
                      <input type="text" id="builder_fn" defaultValue="Alex" className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium">Patient Last Name</label>
                      <input type="text" id="builder_ln" defaultValue="Mercer" className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white" />
                    </div>

                    {builderCategory === 'ADT' && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium">Event Type</label>
                        <select className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white" id="builder_type">
                          <option value="ADT^A01">ADT^A01 (Admit)</option>
                          <option value="ADT^A04">ADT^A04 (Register)</option>
                          <option value="ADT^A08">ADT^A08 (Update)</option>
                        </select>
                      </div>
                    )}

                    {builderCategory === 'ORU' && (
                      <>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium">Test Name</label>
                          <input type="text" id="builder_test_name" defaultValue="GLU^Glucose Fasting" className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium">Result Value</label>
                          <input type="text" id="builder_result" defaultValue="95" className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium">Unit</label>
                          <input type="text" id="builder_unit" defaultValue="mg/dL" className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium">Ref Range</label>
                          <input type="text" id="builder_range" defaultValue="70-100" className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white" />
                        </div>
                      </>
                    )}

                    {builderCategory === 'MDM' && (
                      <>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium">Doc First Name</label>
                          <input type="text" id="builder_doc_fn" defaultValue="Gregory" className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium">Doc Last Name</label>
                          <input type="text" id="builder_doc_ln" defaultValue="House" className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium">Condition</label>
                          <input type="text" id="builder_condition" defaultValue="Hypertension" className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium">ICD-10</label>
                          <input type="text" id="builder_icd" defaultValue="I10" className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white" />
                        </div>
                        <div className="space-y-1.5 col-span-2">
                          <label className="text-xs font-medium">Prescription</label>
                          <input type="text" id="builder_rx" defaultValue="Lisinopril 10mg PO Daily" className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white" />
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex justify-end pt-2">
                    <button 
                      type="button"
                      onClick={() => {
                        const pid = document.getElementById('builder_pid').value;
                        const fn = document.getElementById('builder_fn').value;
                        const ln = document.getElementById('builder_ln').value;
                        const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
                        
                        let generated = '';
                        if (builderCategory === 'ADT') {
                          const type = document.getElementById('builder_type').value;
                          generated = `MSH|^~\\&|CUSTOM_APP|CUSTOM_FAC|REC_APP|REC_FAC|${timestamp}||${type}|MSG${Math.floor(Math.random()*1000)}|P|2.4\rEVN|${type.split('^')[1]}|${timestamp}\rPID|1||${pid}||${ln}^${fn}||19900101|U\rPV1|1|O|CUSTOM_CLINIC`;
                        } else if (builderCategory === 'ORU') {
                          const test = document.getElementById('builder_test_name').value;
                          const res = document.getElementById('builder_result').value;
                          const unit = document.getElementById('builder_unit').value;
                          const range = document.getElementById('builder_range').value;
                          generated = `MSH|^~\\&|LAB_APP|LAB_FAC|REC_APP|REC_FAC|${timestamp}||ORU^R01|MSG${Math.floor(Math.random()*1000)}|P|2.4\rPID|1||${pid}||${ln}^${fn}||19900101|U\rOBR|1|||${test}|||${timestamp}\rOBX|1|NM|${test}||${res}|${unit}|${range}|N|||F`;
                        } else if (builderCategory === 'MDM') {
                          const dfn = document.getElementById('builder_doc_fn').value;
                          const dln = document.getElementById('builder_doc_ln').value;
                          const cond = document.getElementById('builder_condition').value;
                          const icd = document.getElementById('builder_icd').value;
                          const rx = document.getElementById('builder_rx').value;
                          generated = `MSH|^~\\&|EMR_APP|EMR_FAC|REC_APP|REC_FAC|${timestamp}||MDM^T02|MSG${Math.floor(Math.random()*1000)}|P|2.4\rPID|1||${pid}||${ln}^${fn}||19900101|U\rTXA|1|CN|TX|${timestamp}|||||||||||${dln}^${dfn}\rOBX|1|CE|${icd}^ICD-10||${cond}||||||F\rOBX|2|TX|RX^Prescription||${rx}||||||F`;
                        }
                        
                        setTestPayload(generated);
                      }}
                      className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:bg-primary/90"
                    >
                      Generate HL7 Payload ↓
                    </button>
                  </div>
                </div>
              ) : null}

              <div className="space-y-1.5">
                <label className="text-sm font-medium flex justify-between">
                  HL7 Message Payload (ER7 Format)
                  {selectedTemplate === 'Custom Builder' && <span className="text-xs text-primary">Generated output ready to send</span>}
                </label>
                <textarea
                  className="w-full h-40 p-3 font-mono text-xs border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none resize-none bg-secondary/10 whitespace-pre leading-relaxed"
                  value={testPayload}
                  onChange={(e) => setTestPayload(e.target.value)}
                  placeholder="Paste your MSH|^~\&|... string here. Ensure carriage returns (\r) separate segments."
                />
              </div>
            </div>
            <div className="p-6 pt-4 border-t border-border flex justify-end gap-3 shrink-0 bg-white">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)} 
                className="px-4 py-2 border border-border rounded-xl font-medium cursor-pointer hover:bg-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={() => mutation.mutate(testPayload)}
                disabled={mutation.isPending || !testPayload?.trim()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors cursor-pointer shadow-sm disabled:opacity-50"
              >
                {mutation.isPending ? <RefreshCw size={18} className="animate-spin" /> : <Send size={18} />}
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
