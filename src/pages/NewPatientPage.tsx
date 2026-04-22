import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Save,
  X,
  UserPlus,
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
} from 'lucide-react';
import { patientService } from '../services/patientService';
import { AlertDialog } from '../components/ui/Modal';
import type { Gender, MaritalStatus, IdentifierType } from '../types';

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY','DC',
];

const addressSchema = z.object({
  street1: z.string().optional(),
  street2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
});

const emergencyContactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  relationship: z.string().optional(),
  phoneHome: z.string().optional(),
  phoneMobile: z.string().optional(),
  phoneWork: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  address: addressSchema.optional(),
  priority: z.number().optional(),
  active: z.boolean().optional(),
});

const identifierSchema = z.object({
  identifierType: z.enum([
    'MRN','SSN','DRIVERS_LICENSE','PASSPORT','INSURANCE_MEMBER_ID',
    'INSURANCE_GROUP_ID','MEDICARE_ID','MEDICAID_ID','MILITARY_ID','OTHER',
  ]),
  identifierValue: z.string().min(1, 'Value is required'),
  issuingAuthority: z.string().optional(),
  effectiveDate: z.string().optional(),
  expirationDate: z.string().optional(),
  active: z.boolean().optional(),
});

const patientFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'UNKNOWN']).optional(),
  maritalStatus: z.enum([
    'SINGLE','MARRIED','DIVORCED','WIDOWED','SEPARATED','DOMESTIC_PARTNER','UNKNOWN',
  ]).optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phoneHome: z.string().optional(),
  phoneMobile: z.string().optional(),
  phoneWork: z.string().optional(),
  preferredLanguage: z.string().optional(),
  ethnicity: z.string().optional(),
  race: z.string().optional(),
  religion: z.string().optional(),
  address: addressSchema.optional(),
  mailingAddress: addressSchema.optional(),
  identifiers: z.array(identifierSchema).optional(),
  emergencyContacts: z.array(emergencyContactSchema).optional(),
});

type PatientFormData = z.infer<typeof patientFormSchema>;

interface SectionProps {
  title: string;
  id: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function FormSection({ title, expanded, onToggle, children }: SectionProps) {
  return (
    <div className="mb-2">
      <button
        type="button"
        onClick={onToggle}
        className="ehr-subheader w-full flex items-center text-left"
      >
        {expanded ? <ChevronDown className="w-3 h-3 mr-1" /> : <ChevronRight className="w-3 h-3 mr-1" />}
        {title}
      </button>
      {expanded && (
        <div className="p-2 bg-white border border-t-0 border-gray-400">
          {children}
        </div>
      )}
    </div>
  );
}

function FormField({ label, required, error, children }: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-1.5">
      <label className="ehr-label block mb-0.5">
        {label}{required && <span className="text-red-600 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-[10px] text-red-600 mt-0.5">{error}</p>}
    </div>
  );
}

function AddressFields({ prefix, register, errors }: {
  prefix: string;
  register: ReturnType<typeof useForm<PatientFormData>>['register'];
  errors: Record<string, { message?: string }> | undefined;
}) {
  return (
    <div className="grid grid-cols-6 gap-2">
      <div className="col-span-4">
        <FormField label="Street" error={errors?.street1?.message}>
          <input {...register(`${prefix}.street1` as keyof PatientFormData)} className="ehr-input w-full" />
        </FormField>
      </div>
      <div className="col-span-2">
        <FormField label="Apt/Suite" error={errors?.street2?.message}>
          <input {...register(`${prefix}.street2` as keyof PatientFormData)} className="ehr-input w-full" />
        </FormField>
      </div>
      <div className="col-span-2">
        <FormField label="City" error={errors?.city?.message}>
          <input {...register(`${prefix}.city` as keyof PatientFormData)} className="ehr-input w-full" />
        </FormField>
      </div>
      <div className="col-span-2">
        <FormField label="State" error={errors?.state?.message}>
          <select {...register(`${prefix}.state` as keyof PatientFormData)} className="ehr-input w-full">
            <option value="">Select...</option>
            {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </FormField>
      </div>
      <div className="col-span-1">
        <FormField label="ZIP" error={errors?.zipCode?.message}>
          <input {...register(`${prefix}.zipCode` as keyof PatientFormData)} className="ehr-input w-full" />
        </FormField>
      </div>
      <div className="col-span-1">
        <FormField label="Country" error={errors?.country?.message}>
          <input {...register(`${prefix}.country` as keyof PatientFormData)} className="ehr-input w-full" defaultValue="US" />
        </FormField>
      </div>
    </div>
  );
}

export default function NewPatientPage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{ title: string; message: string; type: 'success' | 'error' } | null>(null);
  const [sections, setSections] = useState<Record<string, boolean>>({
    demographics: true,
    contact: true,
    address: true,
    mailingAddress: false,
    identifiers: false,
    emergencyContacts: false,
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      gender: undefined,
      maritalStatus: undefined,
      preferredLanguage: 'English',
      address: { country: 'US' },
      mailingAddress: { country: 'US' },
      identifiers: [],
      emergencyContacts: [],
    },
  });

  const identifiers = useFieldArray({ control, name: 'identifiers' });
  const emergencyContacts = useFieldArray({ control, name: 'emergencyContacts' });

  const toggleSection = (key: string) => {
    setSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const onSubmit = async (data: PatientFormData) => {
    setSaving(true);
    try {
      const patient = await patientService.create({
        firstName: data.firstName,
        middleName: data.middleName || undefined,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender as Gender | undefined,
        maritalStatus: data.maritalStatus as MaritalStatus | undefined,
        email: data.email || undefined,
        phoneHome: data.phoneHome || undefined,
        phoneMobile: data.phoneMobile || undefined,
        phoneWork: data.phoneWork || undefined,
        preferredLanguage: data.preferredLanguage || undefined,
        ethnicity: data.ethnicity || undefined,
        race: data.race || undefined,
        religion: data.religion || undefined,
        address: data.address,
        mailingAddress: data.mailingAddress,
        identifiers: data.identifiers?.map(id => ({
          ...id,
          identifierType: id.identifierType as IdentifierType,
          active: id.active ?? true,
        })),
        emergencyContacts: data.emergencyContacts?.map((ec, i) => ({
          ...ec,
          priority: ec.priority ?? i + 1,
          active: ec.active ?? true,
        })),
        active: true,
      });
      setAlert({ title: 'Patient Created', message: `Patient ${data.lastName}, ${data.firstName} has been registered successfully.`, type: 'success' });
      setTimeout(() => {
        if (patient.id) {
          navigate(`/patients/${patient.id}`);
        } else {
          navigate('/patients');
        }
      }, 1500);
    } catch {
      setAlert({ title: 'Error', message: 'Failed to create patient. Please check the form and try again.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col" style={{ background: '#d4d0c8' }}>
      {/* Toolbar */}
      <div className="ehr-toolbar flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <div className="flex items-center space-x-1 text-[11px] font-semibold text-gray-700">
            <UserPlus className="w-4 h-4 text-blue-700" />
            <span>New Patient Registration</span>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={saving}
            className="ehr-button ehr-button-primary flex items-center"
          >
            <Save className="w-3.5 h-3.5 mr-1" />
            {saving ? 'Saving...' : 'Save Patient'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/patients')}
            className="ehr-button flex items-center"
          >
            <X className="w-3.5 h-3.5 mr-1" />
            Cancel
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-auto p-2">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Demographics */}
          <FormSection
            title="Demographics"
            id="demographics"
            expanded={sections.demographics}
            onToggle={() => toggleSection('demographics')}
          >
            <div className="grid grid-cols-6 gap-2">
              <div className="col-span-2">
                <FormField label="Last Name" required error={errors.lastName?.message}>
                  <input {...register('lastName')} className="ehr-input w-full" autoFocus />
                </FormField>
              </div>
              <div className="col-span-2">
                <FormField label="First Name" required error={errors.firstName?.message}>
                  <input {...register('firstName')} className="ehr-input w-full" />
                </FormField>
              </div>
              <div className="col-span-2">
                <FormField label="Middle Name">
                  <input {...register('middleName')} className="ehr-input w-full" />
                </FormField>
              </div>
              <div className="col-span-2">
                <FormField label="Date of Birth" required error={errors.dateOfBirth?.message}>
                  <input {...register('dateOfBirth')} type="date" className="ehr-input w-full" />
                </FormField>
              </div>
              <div className="col-span-2">
                <FormField label="Gender">
                  <select {...register('gender')} className="ehr-input w-full">
                    <option value="">Select...</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                    <option value="UNKNOWN">Unknown</option>
                  </select>
                </FormField>
              </div>
              <div className="col-span-2">
                <FormField label="Marital Status">
                  <select {...register('maritalStatus')} className="ehr-input w-full">
                    <option value="">Select...</option>
                    <option value="SINGLE">Single</option>
                    <option value="MARRIED">Married</option>
                    <option value="DIVORCED">Divorced</option>
                    <option value="WIDOWED">Widowed</option>
                    <option value="SEPARATED">Separated</option>
                    <option value="DOMESTIC_PARTNER">Domestic Partner</option>
                    <option value="UNKNOWN">Unknown</option>
                  </select>
                </FormField>
              </div>
              <div className="col-span-2">
                <FormField label="Preferred Language">
                  <input {...register('preferredLanguage')} className="ehr-input w-full" />
                </FormField>
              </div>
              <div className="col-span-2">
                <FormField label="Race">
                  <select {...register('race')} className="ehr-input w-full">
                    <option value="">Select...</option>
                    <option value="American Indian or Alaska Native">American Indian or Alaska Native</option>
                    <option value="Asian">Asian</option>
                    <option value="Black or African American">Black or African American</option>
                    <option value="Native Hawaiian or Other Pacific Islander">Native Hawaiian or Other Pacific Islander</option>
                    <option value="White">White</option>
                    <option value="Two or More Races">Two or More Races</option>
                    <option value="Other">Other</option>
                    <option value="Declined">Declined to Specify</option>
                  </select>
                </FormField>
              </div>
              <div className="col-span-2">
                <FormField label="Ethnicity">
                  <select {...register('ethnicity')} className="ehr-input w-full">
                    <option value="">Select...</option>
                    <option value="Hispanic or Latino">Hispanic or Latino</option>
                    <option value="Not Hispanic or Latino">Not Hispanic or Latino</option>
                    <option value="Declined">Declined to Specify</option>
                  </select>
                </FormField>
              </div>
            </div>
          </FormSection>

          {/* Contact Information */}
          <FormSection
            title="Contact Information"
            id="contact"
            expanded={sections.contact}
            onToggle={() => toggleSection('contact')}
          >
            <div className="grid grid-cols-4 gap-2">
              <FormField label="Home Phone">
                <input {...register('phoneHome')} type="tel" placeholder="(555) 555-5555" className="ehr-input w-full" />
              </FormField>
              <FormField label="Mobile Phone">
                <input {...register('phoneMobile')} type="tel" placeholder="(555) 555-5555" className="ehr-input w-full" />
              </FormField>
              <FormField label="Work Phone">
                <input {...register('phoneWork')} type="tel" placeholder="(555) 555-5555" className="ehr-input w-full" />
              </FormField>
              <FormField label="Email" error={errors.email?.message}>
                <input {...register('email')} type="email" placeholder="patient@email.com" className="ehr-input w-full" />
              </FormField>
            </div>
          </FormSection>

          {/* Home Address */}
          <FormSection
            title="Home Address"
            id="address"
            expanded={sections.address}
            onToggle={() => toggleSection('address')}
          >
            <AddressFields
              prefix="address"
              register={register}
              errors={errors.address as Record<string, { message?: string }> | undefined}
            />
          </FormSection>

          {/* Mailing Address */}
          <FormSection
            title="Mailing Address (if different)"
            id="mailingAddress"
            expanded={sections.mailingAddress}
            onToggle={() => toggleSection('mailingAddress')}
          >
            <AddressFields
              prefix="mailingAddress"
              register={register}
              errors={errors.mailingAddress as Record<string, { message?: string }> | undefined}
            />
          </FormSection>

          {/* Identifiers */}
          <FormSection
            title={`Identifiers (${identifiers.fields.length})`}
            id="identifiers"
            expanded={sections.identifiers}
            onToggle={() => toggleSection('identifiers')}
          >
            {identifiers.fields.map((field, index) => (
              <div key={field.id} className="ehr-panel p-2 mb-1.5 flex items-start gap-2">
                <div className="grid grid-cols-5 gap-2 flex-1">
                  <FormField label="Type" error={errors.identifiers?.[index]?.identifierType?.message}>
                    <select {...register(`identifiers.${index}.identifierType`)} className="ehr-input w-full">
                      <option value="MRN">MRN</option>
                      <option value="SSN">SSN</option>
                      <option value="DRIVERS_LICENSE">Driver&apos;s License</option>
                      <option value="PASSPORT">Passport</option>
                      <option value="INSURANCE_MEMBER_ID">Insurance Member ID</option>
                      <option value="INSURANCE_GROUP_ID">Insurance Group ID</option>
                      <option value="MEDICARE_ID">Medicare ID</option>
                      <option value="MEDICAID_ID">Medicaid ID</option>
                      <option value="MILITARY_ID">Military ID</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </FormField>
                  <FormField label="Value" required error={errors.identifiers?.[index]?.identifierValue?.message}>
                    <input {...register(`identifiers.${index}.identifierValue`)} className="ehr-input w-full" />
                  </FormField>
                  <FormField label="Issuing Authority">
                    <input {...register(`identifiers.${index}.issuingAuthority`)} className="ehr-input w-full" />
                  </FormField>
                  <FormField label="Effective Date">
                    <input {...register(`identifiers.${index}.effectiveDate`)} type="date" className="ehr-input w-full" />
                  </FormField>
                  <FormField label="Expiration Date">
                    <input {...register(`identifiers.${index}.expirationDate`)} type="date" className="ehr-input w-full" />
                  </FormField>
                </div>
                <button
                  type="button"
                  onClick={() => identifiers.remove(index)}
                  className="ehr-button mt-4 flex items-center text-red-700"
                  title="Remove identifier"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => identifiers.append({ identifierType: 'INSURANCE_MEMBER_ID', identifierValue: '', active: true })}
              className="ehr-button flex items-center"
            >
              <Plus className="w-3 h-3 mr-1" /> Add Identifier
            </button>
          </FormSection>

          {/* Emergency Contacts */}
          <FormSection
            title={`Emergency Contacts (${emergencyContacts.fields.length})`}
            id="emergencyContacts"
            expanded={sections.emergencyContacts}
            onToggle={() => toggleSection('emergencyContacts')}
          >
            {emergencyContacts.fields.map((field, index) => (
              <div key={field.id} className="ehr-panel p-2 mb-1.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-semibold text-gray-600">Contact #{index + 1}</span>
                  <button
                    type="button"
                    onClick={() => emergencyContacts.remove(index)}
                    className="ehr-button flex items-center text-red-700 text-[10px]"
                  >
                    <Trash2 className="w-3 h-3 mr-0.5" /> Remove
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <FormField label="First Name" required error={errors.emergencyContacts?.[index]?.firstName?.message}>
                    <input {...register(`emergencyContacts.${index}.firstName`)} className="ehr-input w-full" />
                  </FormField>
                  <FormField label="Last Name" required error={errors.emergencyContacts?.[index]?.lastName?.message}>
                    <input {...register(`emergencyContacts.${index}.lastName`)} className="ehr-input w-full" />
                  </FormField>
                  <FormField label="Relationship">
                    <select {...register(`emergencyContacts.${index}.relationship`)} className="ehr-input w-full">
                      <option value="">Select...</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Parent">Parent</option>
                      <option value="Child">Child</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Friend">Friend</option>
                      <option value="Legal Guardian">Legal Guardian</option>
                      <option value="Power of Attorney">Power of Attorney</option>
                      <option value="Other">Other</option>
                    </select>
                  </FormField>
                  <FormField label="Email" error={errors.emergencyContacts?.[index]?.email?.message}>
                    <input {...register(`emergencyContacts.${index}.email`)} type="email" className="ehr-input w-full" />
                  </FormField>
                  <FormField label="Home Phone">
                    <input {...register(`emergencyContacts.${index}.phoneHome`)} type="tel" className="ehr-input w-full" />
                  </FormField>
                  <FormField label="Mobile Phone">
                    <input {...register(`emergencyContacts.${index}.phoneMobile`)} type="tel" className="ehr-input w-full" />
                  </FormField>
                  <FormField label="Work Phone">
                    <input {...register(`emergencyContacts.${index}.phoneWork`)} type="tel" className="ehr-input w-full" />
                  </FormField>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => emergencyContacts.append({ firstName: '', lastName: '', active: true })}
              className="ehr-button flex items-center"
            >
              <Plus className="w-3 h-3 mr-1" /> Add Emergency Contact
            </button>
          </FormSection>

          {/* Bottom action bar */}
          <div className="flex items-center justify-between mt-2 p-2 bg-[#ece9d8] border border-gray-400">
            <div className="text-[10px] text-gray-500">
              Fields marked with <span className="text-red-600">*</span> are required
            </div>
            <div className="flex items-center space-x-1">
              <button
                type="submit"
                disabled={saving}
                className="ehr-button ehr-button-primary flex items-center"
              >
                <Save className="w-3.5 h-3.5 mr-1" />
                {saving ? 'Saving...' : 'Save Patient'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/patients')}
                className="ehr-button flex items-center"
              >
                <X className="w-3.5 h-3.5 mr-1" />
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>

      {alert && (
        <AlertDialog
          isOpen={true}
          onClose={() => setAlert(null)}
          title={alert.title}
          message={alert.message}
          type={alert.type === 'success' ? 'success' : 'error'}
        />
      )}
    </div>
  );
}
