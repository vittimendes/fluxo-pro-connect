
// @file NovoAgendamento.tsx
// Page for creating new appointments using a structured form interface

import AppointmentFormHeader from '@/components/appointment/AppointmentFormHeader';
import AppointmentForm from '@/components/appointment/AppointmentForm';
import LoadingAppointmentForm from '@/components/appointment/LoadingAppointmentForm';
import { AppointmentDataLoader } from '@/components/appointment/AppointmentDataLoader';
import { AppointmentSubmitHandler } from '@/components/appointment/AppointmentSubmitHandler';

const NovoAgendamento = () => {
  return (
    <div className="space-y-6">
      <AppointmentFormHeader />

      <AppointmentDataLoader>
        {({ 
          clients,
          appointmentTypes,
          loading,
          formData,
          handleInputChange,
          handleSelectChange,
          handleDateChange,
        }) => (
          <>
            {loading ? (
              <LoadingAppointmentForm />
            ) : (
              <AppointmentSubmitHandler formData={formData}>
                {({ isSubmitting, handleSubmit }) => (
                  <AppointmentForm
                    clients={clients}
                    appointmentTypes={appointmentTypes}
                    formData={formData}
                    isSubmitting={isSubmitting}
                    onInputChange={handleInputChange}
                    onSelectChange={handleSelectChange}
                    onDateChange={handleDateChange}
                    onSubmit={handleSubmit}
                  />
                )}
              </AppointmentSubmitHandler>
            )}
          </>
        )}
      </AppointmentDataLoader>
    </div>
  );
};

export default NovoAgendamento;
