import React, { useState } from 'react';
import { useTenant } from '@/providers';
import { Plus } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  Input,
  Select,
  Modal,
  ModalFooter,
  useToast,
} from '@/shared/components/ui';

export const OrganizationsPage: React.FC = () => {
  const {
    organizations,
    activeOrganization,
    setActiveOrganization,
    setActiveCampus,
  } = useTenant();
  const { success } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCampusName, setNewCampusName] = useState('');
  const [newCampusCity, setNewCampusCity] = useState('');

  const handleAddCampus = () => {
    if (!newCampusName) return;
    setIsModalOpen(false);
    success('Campus Initialized', {
      message: `Physical site "${newCampusName}" added to ${activeOrganization?.name}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Organizations & Multi-Campus Hierarchy
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Legal educational entities, physical campus branches, dynamic ISO
            currencies & compliance flags
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leadingIcon={<Plus className="h-4 w-4" />}
          onClick={() => setIsModalOpen(true)}
        >
          Add New Campus
        </Button>
      </div>

      {/* Organization Cards */}
      <div className="space-y-6">
        {organizations.map(org => {
          const isSelected = org.id === activeOrganization?.id;
          return (
            <Card
              key={org.id}
              className={`border transition-all ${
                isSelected
                  ? 'border-brand-500 ring-1 ring-brand-500 shadow-sm'
                  : ''
              }`}
            >
              <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">{org.name}</CardTitle>
                    <Badge variant={isSelected ? 'brand' : 'neutral'} size="sm">
                      {org.subscriptionTier}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs mt-0.5">
                    {org.legalName} • {org.registrationNumber} • Tax ID:{' '}
                    {org.taxId}
                  </CardDescription>
                </div>

                <div className="flex items-center gap-2">
                  {!isSelected && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveOrganization(org)}
                    >
                      Switch Active Organization
                    </Button>
                  )}
                  {isSelected && (
                    <Badge variant="success" size="sm" dot>
                      Active Scope
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Base Currency
                    </span>
                    <span className="font-bold text-slate-900">
                      {org.baseCurrency} (ISO 4217)
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Default Language
                    </span>
                    <span className="font-semibold text-slate-800 uppercase">
                      {org.defaultLanguage}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Country Jurisdiction
                    </span>
                    <span className="font-semibold text-slate-800">
                      {org.country}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Physical Campuses
                    </span>
                    <span className="font-semibold text-slate-800">
                      {org.campuses.length} Campuses
                    </span>
                  </div>
                </div>

                {/* Campuses Table */}
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Physical Campus Facilities Under Management
                  </h4>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-100/75 text-slate-600 border-b border-slate-200">
                        <tr>
                          <th className="p-3">Campus Name</th>
                          <th className="p-3">Type</th>
                          <th className="p-3">Location</th>
                          <th className="p-3">Grading Scale</th>
                          <th className="p-3">Attendance Mode</th>
                          <th className="p-3 text-right">Switch Scope</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {org.campuses.map(campus => (
                          <tr key={campus.id} className="hover:bg-slate-50">
                            <td className="p-3 font-semibold text-slate-900">
                              {campus.name}
                            </td>
                            <td className="p-3">
                              <Badge variant="neutral" size="sm">
                                {campus.type}
                              </Badge>
                            </td>
                            <td className="p-3 text-slate-600">
                              {campus.city}, {campus.country}
                            </td>
                            <td className="p-3 font-mono text-slate-700 font-semibold">
                              {campus.gradingSystem}
                            </td>
                            <td className="p-3 text-slate-600">
                              {campus.attendanceMode}
                            </td>
                            <td className="p-3 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  if (org.id !== activeOrganization?.id) {
                                    setActiveOrganization(org);
                                  }
                                  setActiveCampus(campus);
                                  success('Scope Switched', {
                                    message: `Active operational scope changed to ${campus.name}.`,
                                  });
                                }}
                              >
                                Select
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Campus Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register Physical Campus"
        description="Creates a new operational educational facility under the active organization"
      >
        <div className="space-y-3">
          <Input
            label="Campus Name"
            placeholder="e.g. Campus Saint-Germain"
            value={newCampusName}
            onChange={e => setNewCampusName(e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="City"
              placeholder="e.g. Paris"
              value={newCampusCity}
              onChange={e => setNewCampusCity(e.target.value)}
              required
            />
            <Select
              label="Education Level"
              options={[
                { value: 'PRIMARY', label: 'Primary (Elementary)' },
                { value: 'SECONDARY', label: 'Secondary (Middle & High)' },
                { value: 'UNIFIED', label: 'Unified (All-Through)' },
              ]}
            />
          </div>
          <ModalFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddCampus}>
              Add Campus
            </Button>
          </ModalFooter>
        </div>
      </Modal>
    </div>
  );
};
