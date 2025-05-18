
// @file AppointmentView.tsx
// Appointment details page that displays comprehensive appointment information
// with options to edit, change status, or delete the appointment.

import { AppointmentViewDataLoader } from '@/components/appointment/AppointmentViewDataLoader';
import AppointmentViewContent from '@/components/appointment/AppointmentViewContent';
import AppointmentViewHeader from '@/components/appointment/AppointmentViewHeader';
import AppointmentViewLoading from '@/components/appointment/AppointmentViewLoading';
import AppointmentNotFound from '@/components/appointment/AppointmentNotFound';

// @component AppointmentView page component
const AppointmentView = () => {
  return (
    <AppointmentViewDataLoader>
      {({
        appointment,
        loading,
        statusLoading,
        relatedRecords,
        isEditing,
        setIsEditing,
        clients,
        appointmentTypes,
        formData,
        isSubmitting,
        handleInputChange,
        handleSelectChange,
        handleDateChange,
        handleStatusChange,
        handleSubmit,
        handleDeleteAppointment
      }) => (
        <div className="space-y-6">
          {/* Show loading spinner while data is being fetched */}
          {loading ? (
            <AppointmentViewLoading />
          ) : !appointment ? (
            /* Show not found message if appointment doesn't exist */
            <AppointmentNotFound />
          ) : (
            /* Show appointment content when data is available */
            <>
              {/* Navigation and action buttons */}
              <AppointmentViewHeader 
                isEditing={isEditing} 
                onEditClick={() => setIsEditing(true)} 
              />

              {/* Appointment view/edit content */}
              <AppointmentViewContent
                appointment={appointment}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                clients={clients}
                appointmentTypes={appointmentTypes}
                formData={formData}
                isSubmitting={isSubmitting}
                statusLoading={statusLoading}
                relatedRecords={relatedRecords}
                onInputChange={handleInputChange}
                onSelectChange={handleSelectChange}
                onDateChange={handleDateChange}
                onSubmit={handleSubmit}
                onStatusChange={handleStatusChange}
                onDeleteAppointment={handleDeleteAppointment}
              />
            </>
          )}
        </div>
      )}
    </AppointmentViewDataLoader>
  );
};

export default AppointmentView;
